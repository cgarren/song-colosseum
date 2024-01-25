/* eslint-disable prettier/prettier */
// React
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDebounce } from "react-use";
// Third Party
import Mousetrap from "mousetrap";
import Confetti from "react-confetti";
import { backOff } from "exponential-backoff";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
// Components
import Seo from "../../../../../components/SEO";
import Layout from "../../../../../components/Layout";
import BracketWinnerInfo from "../../../../../components/Bracket/BracketWinnerInfo";
import ActionButton from "../../../../../components/Controls/ActionButton";
import SaveIndicator from "../../../../../components/Controls/SaveIndicator";
import TrackNumber from "../../../../../components/BracketCard/TrackNumber";
import FillBracket from "../../../../../components/Bracket/FillBracket";
// import GeneratePlaylistButton from "../../../../components/GeneratePlaylistButton";
import BracketCompleteModal from "../../../../../components/Modals/BracketCompleteModal";
// Hooks
import useBracketGeneration from "../../../../../hooks/useBracketGeneration";
import useHelper from "../../../../../hooks/useHelper";
import useBackend from "../../../../../hooks/useBackend";
import useSpotify from "../../../../../hooks/useSpotify";
import useSongProcessing from "../../../../../hooks/useSongProcessing";
import useAuthentication from "../../../../../hooks/useAuthentication";
// Assets
import ShareIcon from "../../../../../assets/svgs/shareIcon.svg";
import useUserInfo from "../../../../../hooks/useUserInfo";
import LoadingIndicator from "../../../../../components/LoadingIndicator";
// Context

export default function App({ params, location }) {
  const defaultValues = useMemo(
    () => ({
      commands: [],
      currentlyPlayingId: null,
      waitingToSave: false,
      lastSaved: { time: 0, commandsLength: 0 },
    }),
    [],
  );

  const [commands, setCommands] = useState(defaultValues.commands);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(defaultValues.currentlyPlayingId);
  const [waitingToSave, setWaitingToSave] = useState(defaultValues.waitingToSave);
  const [lastSaved, setLastSaved] = useState(defaultValues.lastSaved);

  const { getUserInfo, getArtist, getPlaylist, openBracket } = useSpotify();
  const { bracketSorter, bracketUnchanged } = useHelper();
  const { isCurrentUser } = useAuthentication();
  const { getBracket, updateBracket, getTemplate, createBracket } = useBackend();
  const { updatePreviewUrls } = useSongProcessing();
  const { getNumberOfColumns, fillBracket } = useBracketGeneration();
  const queryClient = useQueryClient();

  const localSaveKey = "savedBracket";

  const { data: ownerInfo } = useUserInfo(params.userId);

  const owner = useMemo(
    () => ({ name: ownerInfo?.display_name, id: params.userId }),
    [ownerInfo?.display_name, params?.userId],
  );

  const {
    data: loadedBracket,
    isPending: fetchPending,
    isError: fetchFailure,
  } = useQuery({
    queryKey: ["bracket", { bracketId: params.id, userId: owner.id }],
    queryFn: async () => getBracket(params.id, owner.id),
    enabled: params.id && isCurrentUser(owner.id),
    refetchOnWindowFocus: false,
    staleTime: 3600000,
    meta: {
      errorMessage: "Error loading bracket",
    },
  });

  const { isPending: savePending, mutate: saveBracketMutation } = useMutation({
    mutationFn: async (data) => {
      await updateBracket(params.id, data);
    },
    onError: () => {
      if (lastSaved.saveData) {
        queryClient.setQueryData(["bracket", { bracketId: params.id, userId: owner.id }], lastSaved.saveData);
      }
      if (lastSaved.commands) {
        setCommands(lastSaved.commands);
      }
    },
    meta: {
      errorMessage: "Error saving bracket",
      // successMessage: "Bracket saved successfully",
    },
    onSettled: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["brackets", { userId: owner.id }] });

      setLastSaved({ commands: commands, time: Date.now(), saveData: data });
    },
  });

  const { isPending: creationPending, mutate: createBracketMutation } = useMutation({
    mutationFn: async (creationObject) => {
      await createBracket(creationObject);
    },
    meta: {
      errorMessage: "Error creating bracket",
      successMessage: "Bracket created successfully",
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: ["brackets", { userId: owner.id }] });
      queryClient.invalidateQueries({ queryKey: ["bracket", { bracketId: params.id, userId: owner.id }] });
    },
  });

  const songSource = useMemo(() => {
    if (loadedBracket?.template?.songSource?.type === "artist") {
      return {
        type: "artist",
        artist: {
          name: loadedBracket.template.songSource.artist.name,
          id: loadedBracket.template.songSource.artist.id,
        },
      };
    }
    if (loadedBracket?.template?.songSource?.type === "playlist") {
      return {
        type: "playlist",
        playlist: {
          name: loadedBracket.template.songSource.playlist.name,
          id: loadedBracket.template.songSource.playlist.id,
        },
      };
    }
    return null;
  }, [loadedBracket?.template?.songSource]);

  const bracket = useMemo(() => {
    // console.log(loadedBracket?.bracketData);
    if (loadedBracket?.bracketData) {
      let mymap = new Map(Object.entries(loadedBracket.bracketData));
      mymap = new Map([...mymap].sort(bracketSorter));
      return mymap;
    }
    return null;
  }, [loadedBracket?.bracketData, bracketSorter]);

  const template = useMemo(() => {
    if (loadedBracket?.template) {
      return {
        id: loadedBracket.template.id,
        ownerId: loadedBracket.template.ownerId,
        displayName: loadedBracket.template.displayName,
        ownerUsername: loadedBracket.template.ownerUsername,
      };
    }
    return { id: null, ownerId: null, displayName: null };
  }, [loadedBracket?.template]);

  const fills = useMemo(() => {
    if (loadedBracket?.fills) {
      return loadedBracket.fills;
    }
    return null;
  }, [loadedBracket?.fills]);

  const bracketTracks = useMemo(() => {
    const tracks = [];
    if (bracket) {
      bracket.forEach((item) => {
        if (item.song && item.col === 0) {
          tracks.push(item.song);
        }
      });
    }
    return tracks;
  }, [bracket]);

  const bracketWinner = useMemo(() => {
    if (bracket) {
      const cols = getNumberOfColumns(bracketTracks.length) - 1;
      const left = bracket.get(`l${cols}0`);
      const right = bracket.get(`r${cols}0`);
      if (left && left.winner && left.song) {
        return left.song;
      }
      if (right && right.winner && right.song) {
        return right.song;
      }
    }
    return null;
  }, [bracket, bracketTracks, getNumberOfColumns]);

  const showBracketCompleteModal = useMemo(() => {
    if (bracketWinner && commands.length > 0) {
      return true;
    }
    return false;
  }, [bracketWinner, commands]);

  // SAVE

  // async function saveBracket(data) {
  //   // Called on these occasions: on initial bracket load, user clicks save button, user completes bracket
  //   if (saving !== true && bracket.size > 0) {
  //     try {
  //       setSaving(true);
  //       // write to database and stuff
  //       console.debug("Saving bracket...");
  //       await backOff(() => updateBracket(params.id, data), {
  //         jitter: "full",
  //         maxDelay: 25000,
  //         timeMultiple: 5,
  //         retry: (e) => {
  //           console.debug(e);
  //           if (e.cause && e.cause.code === 429) {
  //             console.debug("429 error! Retrying with delay...", e);
  //             return true;
  //           }
  //           return false;
  //         },
  //       });
  //       console.debug("Bracket Saved");
  //       // show notification Saved", "success");
  //       setSaving(false);
  //       setWaitingToSave(false);
  //       setLastSaved({ commandsLength: commands.length, time: Date.now() });
  //     } catch (error) {
  //       if (error.cause && error.cause.code === 429) {
  //         toast.error("Error saving bracket! Wait a minute or two and then try making another choice");
  //       } else {
  //         toast.error("Error saving bracket! Please try again later");
  //       }
  //       setSaving("error");
  //       setWaitingToSave(false);
  //     }
  //   }
  // }

  const changeBracket = useCallback(
    async (bracketData) => {
      if (bracketData) {
        const bracketObject = Object.fromEntries(bracketData);
        queryClient.cancelQueries(["bracket", { bracketId: params.id, userId: owner.id }]);
        const newData = { bracketData: bracketObject };
        if (bracketWinner) {
          newData.winner = bracketWinner;
        }
        // console.log(newData);
        await queryClient.setQueryData(["bracket", { bracketId: params.id, userId: owner.id }], (oldData) =>
          produce(oldData, (draft) => Object.assign(draft, newData)),
        );
        // console.log(await queryClient.getQueryData(["bracket", { bracketId: params.id, userId: owner.id }]));
      }
    },
    [bracketWinner, owner.id, params.id, saveBracketMutation, queryClient],
  );

  const [isReady] = useDebounce(
    () => {
      const saveData = queryClient.getQueryData(["bracket", { bracketId: params.id, userId: owner.id }])?.bracketData;
      if (saveData) {
        saveBracketMutation({ bracketData: saveData });
      }
    },
    4000,
    [bracket, params.id, owner.id, saveBracketMutation, queryClient],
  );

  const isSaved = !(savePending || !isReady());

  // useEffect(() => {
  //   async function updateSongSource() {
  //     if (songSource?.type === "artist" && songSource?.artist) {
  //       const artist = await getArtist(songSource.artist.id);
  //       // setSongSource({ type: "artist", artist: { name: artist.name, id: artist.id } });
  //       saveBracketMutation({ songSource: { type: "artist", artist: { name: artist.name, id: artist.id } } });
  //     } else if (songSource?.type === "playlist" && songSource?.playlist) {
  //       const playlist = await getPlaylist(songSource.playlist.id);
  //       saveBracketMutation({ songSource: { type: "playlist", playlist: { name: playlist.name, id: playlist.id } } });
  //       // setSongSource({ type: "playlist", playlist: { name: playlist.name, id: playlist.id } });
  //     }
  //   }
  //   updateSongSource();
  // }, [getArtist, getPlaylist, songSource, saveBracketMutation]);

  const initializeBracketFromTemplate = useCallback(
    async (templateData, newBracketId, ownerUsername) => {
      console.debug("Creating new bracket from template...", templateData);
      // load template from backend
      let loadedTemplate;
      try {
        loadedTemplate = await getTemplate(templateData.id, templateData.ownerId);
      } catch (e) {
        toast.error("Error loading template bracket!");
        console.error(e);
        return;
      }
      // log template details
      console.debug("Loaded template:", loadedTemplate);

      // update preview urls
      loadedTemplate.tracks = await updatePreviewUrls(loadedTemplate.tracks);

      // fill bracket with template tracks
      const filledBracket = await fillBracket(loadedTemplate.tracks, getNumberOfColumns(loadedTemplate.tracks.length));

      // create bracket and set it up for the user to fill
      // Make this a mutation eventually
      createBracketMutation({
        bracketId: newBracketId,
        ownerUsername: ownerUsername,
        templateId: loadedTemplate.id,
        templateOwnerId: loadedTemplate.ownerId,
        bracketData: Object.fromEntries(filledBracket),
      });
    },
    [getTemplate, createBracketMutation, fillBracket, getNumberOfColumns, updatePreviewUrls],
  );

  useEffect(() => {
    if (location?.state?.template && owner?.name && owner.id && params?.id && fetchFailure) {
      initializeBracketFromTemplate(location.state.template, params.id, owner.name);
    }
  }, [initializeBracketFromTemplate, location?.state, params?.id, owner?.name, fetchFailure]);

  // const kickOff = useCallback(async () => {
  //   if (params.id && isCurrentUser(owner.id)) {
  //     try {
  //       const loadedBracket = await getBracket(params.id, owner.id);
  //       try {
  //         await initializeLoadedBracket(loadedBracket);
  //       } catch (e) {
  //         toast.error("Error loading bracket!");
  //         console.error(e);
  //       }
  //     } catch (error) {
  //       if (error.cause && error.cause.code === 404) {
  //         if (location?.state?.template) {
  //           await initializeBracketFromTemplate(location.state.template, params.id);
  //         } else {
  //           // Bracket doesn't exist and no artist was passed in
  //           setBracket(null);
  //         }
  //       } else if (error.cause && error.cause.code === 429) {
  //         toast.error("Error loading bracket! Wait a minute or two and then try again");
  //       } else {
  //         toast.error("Error loading bracket!");
  //         console.error(error);
  //       }
  //     }
  //   }
  // }, [
  //   initializeBracketFromTemplate,
  //   initializeLoadedBracket,
  //   owner.id,
  //   setBracket,
  //   getBracket,
  //   location.state,
  //   params.id,
  // ]);

  const deleteBracketSavedLocally = useCallback(() => {
    console.log("deleting bracket locally");
    sessionStorage.removeItem(localSaveKey);
    console.log("bracket deleted");
  }, []);

  const saveBracketLocally = useCallback(() => {
    if (!isSaved && !bracketWinner) {
      console.log("saving bracket locally");
      sessionStorage.setItem(
        localSaveKey,
        JSON.stringify({
          owner: owner,
          fills: fills,
          commands: commands,
          bracket: bracket,
          template: template,
          songSource: songSource,
          currentlyPlayingId: currentlyPlayingId,
          waitingToSave: waitingToSave,
          lastSaved: lastSaved,
        }),
      );
    }
  }, [
    owner,
    fills,
    commands,
    bracket,
    template,
    songSource,
    currentlyPlayingId,
    waitingToSave,
    lastSaved,
    bracketWinner,
    isSaved,
  ]);

  const loadBracketLocally = useCallback(() => {
    const savedState = JSON.parse(sessionStorage.getItem(localSaveKey));
    if (savedState) {
      setLastSaved(savedState.lastSaved);
      deleteBracketSavedLocally();
    }
  }, [setLastSaved, deleteBracketSavedLocally]);

  const isBracketSavedLocally = useCallback(() => {
    const savedState = JSON.parse(sessionStorage.getItem(localSaveKey));
    if (savedState) {
      return true;
    }
    return false;
  }, []);

  // SHARE

  const share = useCallback(() => {
    navigator.clipboard.writeText(location.href);
    console.debug("copied link");
    toast.success("Link copied to clipboard!");
  }, [location.href]);

  // UNDO

  const clearCommands = useCallback(() => {
    setCommands([]);
  }, []);

  const saveCommand = useCallback(
    (action, inverse) => {
      const temp = [
        ...commands,
        {
          action: action,
          inverse: inverse,
        },
      ];
      setCommands(temp);
    },
    [commands],
  );

  const noChanges = useCallback(
    (navigateAway) => {
      if (
        (navigateAway && !isSaved && commands.length > 0) ||
        (!navigateAway && commands.length !== 0 && bracketUnchanged(bracket))
      ) {
        if (window.confirm("You have bracket changes that will be lost! Proceed anyways?")) {
          return true;
        }
        return false;
      }
      return true;
    },
    [isSaved, commands, bracket, bracketUnchanged],
  );

  function undo() {
    const lastCommand = commands[commands.length - 1];
    if (lastCommand) {
      // remove the last element
      setCommands(commands.splice(0, commands.length - 1));
      // run the function that was just popped
      lastCommand.inverse();
    }
    return false;
  }

  if (Mousetrap.bind) {
    Mousetrap.bind("mod+z", undo);
  }

  if (!isCurrentUser(params.userId) || (!showBracketCompleteModal && bracketWinner)) {
    // navigate(`/user/${params.userId}/bracket/${params.id}`, { state: location.state });
    openBracket(params.id, params.userId, "", location.state);
    // return <Redirect to={`/user/${params.userId}/bracket/${params.id}/fill`} />;
  }

  if (fetchPending || creationPending) {
    return (
      <Layout
        noChanges={noChanges}
        path={location.pathname}
        saveBracketLocally={saveBracketLocally}
        isBracketSavedLocally={isBracketSavedLocally}
        deleteBracketSavedLocally={deleteBracketSavedLocally}
      >
        {fetchPending && <LoadingIndicator loadingText="Loading bracket..." />}
        {creationPending && <LoadingIndicator loadingText="Creating bracket..." />}
      </Layout>
    );
  }

  return (
    <Layout
      noChanges={noChanges}
      path={location.pathname}
      saveBracketLocally={saveBracketLocally}
      isBracketSavedLocally={isBracketSavedLocally}
      deleteBracketSavedLocally={deleteBracketSavedLocally}
    >
      {bracketWinner && commands.length !== 0 && (
        <Confetti
          width={window.document.body.offsetWidth}
          height={window.document.body.offsetHeight}
          recycle={false}
          className="!z-[100]"
        />
      )}
      <BracketCompleteModal
        showModal={showBracketCompleteModal}
        setShowModal={(showModal) => (showModal ? saveCommand(null, null) : clearCommands())}
        bracketWinner={bracketWinner}
        bracketTracks={bracketTracks}
        songSource={songSource}
        isSaved={isSaved}
        saving={savePending}
        viewLink={`/user/${owner.id}/bracket/${params.id}`}
      />
      <div className="text-center">
        <h1>
          {owner.name && songSource && bracket && bracketTracks ? (
            <div className="mx-auto mb-2 flex flex-col gap-0 items-center justify-center max-w-[90%]">
              <div className="flex flex-row text-xl items-center justify-center gap-1 max-w-full">
                <span className="truncate w-auto font-bold">
                  {Boolean(songSource.type === "artist") ? songSource.artist.name : null}
                  {Boolean(songSource.type === "playlist") ? songSource.playlist.name : null}
                </span>
                {Boolean(bracketTracks && bracketTracks.length) && <TrackNumber numTracks={bracketTracks.length} />}
              </div>
              <span className="text-md">by {owner.name}</span>
              {template.ownerId !== owner.id && template.ownerUsername && (
                <span className="text-sm">{`Created from a template by ${template.ownerUsername}`}</span>
              )}
              {/* {fills && fills > 0 && bracketWinner ? <span className="text-md">Filled out {fills} {fills === 1 ? "time" : "times"}!</span> : null} */}
            </div>
          ) : bracket?.size > 0 ? (
            <div>Error fetching bracket details!</div>
          ) : (
            <div className="font-bold mb-2">{bracket ? "Getting bracket..." : "Bracket not found"}</div>
          )}
        </h1>
        {bracketWinner && (
          <BracketWinnerInfo bracketWinner={bracketWinner} showSongInfo={songSource?.type === "playlist"} />
        )}
      </div>
      <hr />
      {bracket && songSource && (
        <>
          <div className="text-xs -space-x-px rounded-md sticky mx-auto top-0 w-fit z-30 text-center p-1 border border-black">
            <div className="flex items-center gap-2">
              {/* <GeneratePlaylistButton tracks={tracks} artist={artist} /> */}
              <SaveIndicator
                saving={savePending}
                isSaved={isSaved}
                lastSaved={lastSaved}
                waitingToSave={waitingToSave}
              />
              <ActionButton onClick={share} icon={<ShareIcon />} text="Share" />
            </div>
          </div>
          <FillBracket
            bracketTracks={bracketTracks}
            songSource={songSource}
            bracket={bracket}
            changeBracket={changeBracket}
            currentlyPlayingId={currentlyPlayingId}
            setCurrentlyPlayingId={setCurrentlyPlayingId}
            saveCommand={saveCommand}
          />
        </>
      )}
    </Layout>
  );
}

export function Head({ params }) {
  // const [name, setName] = useState(null);
  // const [userName, setUserName] = useState(null);

  // useEffect(() => {
  //   async function updateTitle() {
  //     if (params && params.id && params.userId) {
  //       try {
  //         const loadedBracket = await getBracket(params.id, params.userId);
  //         if (loadedBracket && loadedBracket.userName) {
  //           setUserName(loadedBracket.userName);
  //           if (loadedBracket.songSource && loadedBracket.songSource.type === "artist") {
  //             setName(loadedBracket.songSource.artist.name);
  //           } else if (loadedBracket.songSource && loadedBracket.songSource.type === "playlist") {
  //             setName(loadedBracket.songSource.playlist.name);
  //           }
  //         }
  //       } catch (error) {

  //       }
  //     }
  //   }
  //   updateTitle();
  // }, [params]);

  return (
    // name && userName ? `${name} bracket by ${userName}` : "View/edit bracket"
    <Seo title="View/edit bracket" />
  );
}
