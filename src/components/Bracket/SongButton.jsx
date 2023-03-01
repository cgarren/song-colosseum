import React, { useRef } from "react";
import PlayPauseButton from "./PlayPauseButton";

import Vibrant from "node-vibrant";

const SongButton = ({
  styling,
  song,
  opponentId,
  nextId,
  id,
  side,
  previousIds,
  disabled,
  currentlyPlayingId,
  setCurrentlyPlayingId,
  modifyBracket,
  saveCommand,
  getBracket,
  eliminated,
  winner,
  setBracketWinner,
  color,
  playbackEnabled,
  editMode,
}) => {
  const buttonRef = useRef(null);
  const audioRef = useRef(null);
  const colorStyle = getColorStyle(color);

  function getColorStyle(color) {
    if (color) {
      if (color.backgroundColor && color.textColor) {
        return {
          backgroundColor: color.backgroundColor,
          color: color.textColor,
          borderColor: color.backgroundColor,
        };
      } else {
        // provide support for legacy brackets using old color system
        const tempColor = new Vibrant.Swatch(color.rgb, color.population);
        return {
          backgroundColor: tempColor.getHex(),
          color: tempColor.getBodyTextColor(),
          borderColor: tempColor.getHex(),
        };
      }
    } else {
      return {
        backgroundColor: "#fff",
        color: "#000",
        borderColor: "#fff",
      };
    }
  }

  // Recursive function to mark all previous instances of a song in a bracket as eliminated
  function eliminatePrevious(thisId) {
    let songInfo = getBracket(thisId);
    if (songInfo.previousIds.length === 0) {
      return;
    }
    console.log(songInfo);
    for (let prevId of songInfo.previousIds) {
      if (getBracket(prevId).song === getBracket(thisId).song) {
        modifyBracket(prevId, "eliminated", true);
        eliminatePrevious(prevId);
      }
    }
  }

  function songChosen() {
    if (opponentId && getBracket(opponentId).song !== null) {
      makeChoice();
      saveCommand(makeChoice, undoChoice);
    }
  }

  function makeChoice() {
    modifyBracket(id, "disabled", true);
    modifyBracket(opponentId, "disabled", true);
    modifyBracket(opponentId, "eliminated", true);
    //eliminatePrevious(opponentId);
    if (nextId) {
      modifyBracket(nextId, "song", song);
      modifyBracket(nextId, "disabled", false);
      modifyBracket(nextId, "color", color);
      setCurrentlyPlayingId(null);
    } else {
      console.log("Winner is " + song.name);
      modifyBracket(id, "winner", true);
      setBracketWinner(song);
      setCurrentlyPlayingId(id);
    }
  }

  function undoChoice() {
    modifyBracket(id, "disabled", false);
    modifyBracket(opponentId, "disabled", false);
    modifyBracket(opponentId, "eliminated", false);
    setCurrentlyPlayingId(null);
    //undoEliminatePrevious(opponentId);
    if (nextId) {
      modifyBracket(nextId, "song", null);
      modifyBracket(nextId, "disabled", true);
      modifyBracket(nextId, "color", null);
    } else {
      modifyBracket(id, "winner", false);
      setBracketWinner(null);
    }
  }

  // Darg and drop functionality

  function handleDragStart(event) {
    // This method runs when the dragging starts
    console.log("Started", event);
    event.dataTransfer.clearData();
    // Set the drag's format and data.
    // Use the event target's id for the data
    event.dataTransfer.setData("text/plain", id);
    // event.dataTransfer.effectAllowed = "move";
    // event.target.style.cursor = "move";
  }

  function handleDrag(event) {
    // This method runs when the component is being dragged
    //console.log("Dragging...", event);
  }

  function handleDragEnd(event) {
    //console.log(event.dataTransfer.getData("text"));
    // This method runs when the dragging stops
    //console.log("Ended", event);
  }

  function handleDragEnter(event) {
    //console.log("Entered", event);
    //event.target.style.backgroundColor = "orange";
    event.dataTransfer.dropEffect = "move";
    return false;
  }

  function handleDragExit(event) {
    //console.log("Exited", event);
    //event.target.style.backgroundColor = colorStyle.backgroundColor;
    return false;
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    return false;
  }

  function handleDrop(event) {
    event.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const switchId = event.dataTransfer.getData("text/plain");
    console.log("drop", switchId);
    // switch the songs
    let tempSong = getBracket(switchId).song;
    modifyBracket(switchId, "song", song);
    modifyBracket(id, "song", tempSong);
    // switch the colors
    let tempColor = getBracket(switchId).color;
    modifyBracket(switchId, "color", color);
    modifyBracket(id, "color", tempColor);
  }

  return (
    <div
      className={
        "z-0 flex rounded-2xl shadow-md cursor-pointer w-[var(--buttonwidth)] min-w-[var(--buttonwidth)] h-[var(--buttonheight)] min-h-[var(--buttonheight) disabled:cursor-default disabled:shadow-none disabled:w-[var(--buttonwidth)] relative hover:h-auto " +
        (editMode ? " cursor-move " : " ") +
        (song == null
          ? " bg-white text-black shadow-md border-0 border-gray-400 cursor-default"
          : " ") +
        (winner ? " opacity-100 " : " ") +
        (side ? " flex-row-reverse " : "") +
        (eliminated ? " opacity-50 " : " ") +
        styling
      }
      style={song ? colorStyle : {}}
      id={id}
      disabled={disabled}
      data-opponentid={opponentId}
      data-nextid={nextId}
      ref={buttonRef}
      draggable={editMode}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onDrop={song ? handleDrop : null}
      onDragOver={song ? handleDragOver : null}
      onDragEnter={song ? handleDragEnter : null}
      onDragExit={song ? handleDragExit : null}
    >
      <button
        disabled={disabled}
        onClick={editMode ? null : songChosen}
        hidden={false}
        style={song ? colorStyle : {}}
        className={
          "rounded-[inherit] cursor-[inherit] disabled:rounded-[inherit] bg-white text-black border-0 leading-[1.15em] p-0 text-center overflow-hidden break-words disabled:px-[6px] h-full min-h-[var(--buttonheight)] disabled:w-full " +
          (winner
            ? " opacity-100 active:opacity-100 "
            : editMode
            ? " w-full "
            : " w-[70%] ") +
          (song == null ? " w-full bg-transparent text-black " : "") +
          (editMode
            ? " rounded-[inherit]"
            : side
            ? " pr-[6px] rounded-l-[0] "
            : " pl-[6px] rounded-r-[0]") +
          (eliminated ? " " : "")
        }
      >
        {song !== null ? song.name : ""}
      </button>
      <PlayPauseButton
        id={id}
        song={song}
        side={side}
        disabled={disabled}
        currentlyPlayingId={currentlyPlayingId}
        setCurrentlyPlayingId={setCurrentlyPlayingId}
        colorStyle={colorStyle}
        playbackEnabled={playbackEnabled}
        buttonRef={buttonRef}
        audioRef={audioRef}
        editMode={editMode}
      />
      <audio
        src={song !== null && !disabled ? song.preview_url : null}
        volume="1"
        className="hidden"
        ref={audioRef}
      ></audio>
    </div>
  );
};

export default SongButton;