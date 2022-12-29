import { popularitySort, shuffleArray } from "./helpers";
import { loadSpotifyRequest } from "./spotify";

function seedBracket(trackList, seedingMethod) {
	switch (seedingMethod) {
		case "random":
			return shuffleArray(trackList);
		case "popularity":
			trackList.sort(popularitySort);
			//console.table(trackList);
			return arrangeSeeds(trackList);
		default:
			return trackList;
	}
}

function arrangeSeeds(bracketList) {
	let slice = 1;
	let temp;
	while (slice < bracketList.length / 2) {
		temp = bracketList;
		bracketList = [];

		while (temp.length > 0) {
			bracketList = bracketList.concat(temp.splice(0, slice));  // n from the beginning
			bracketList = bracketList.concat(temp.splice(-slice, slice));  // n from the end
		}

		slice = slice * 2;
	}
	return bracketList;
}

async function selectTrackVersion(numTracks, tracks) {
	let highestPop = 0;
	let selectedTrack = null;
	for (let i = 0; i < numTracks; i++) {
		const track = tracks.shift();
		if (track.popularity >= highestPop) {
			selectedTrack = track;
			highestPop = track.popularity;
		}
	}
	return selectedTrack;
}

async function makeTrackObject(track) {
	return {
		name: track.name,
		art: track.album.images[2].url,
		id: track.id,
		popularity: track.popularity,
		preview_url: track.preview_url
	}
}

async function loadTrackData(idList, trackOptionsAmounts) {
	let templist = [];
	if (idList.length !== 0) {
		const url = "https://api.spotify.com/v1/tracks?ids=" + idList.join();
		const response = await loadSpotifyRequest(url);
		if (response !== 1) {
			if (response.tracks.length > 0) {
				for (let numTracks of trackOptionsAmounts) {
					const selectedTrack = await selectTrackVersion(numTracks, response.tracks)
					templist.push(await makeTrackObject(selectedTrack));
				}
			}
		} else {
			return 1;
		}
	}
	return templist;
}

async function processTracks(songs) {
	let templist = [];
	let runningList = [];
	let trackOptionsAmounts = [];
	for (const idList of Object.values(songs)) {
		if (runningList.length + idList.length > 50) {
			const temp = await loadTrackData(runningList, trackOptionsAmounts);
			if (temp !== 1) {
				templist = templist.concat(temp);
				runningList = [];
				trackOptionsAmounts = [];
			} else {
				return 1;
			}
		}
		runningList.push(...idList);
		trackOptionsAmounts.push(idList.length);
	}
	const temp = await loadTrackData(runningList, trackOptionsAmounts);
	if (temp !== 1) {
		templist.push(temp);
	} else {
		return 1;
	}
	return templist;
}

async function loadTracks(url, songs) {
	let response = await loadSpotifyRequest(url);
	if (response !== 1) {
		if (response.albums.length > 0) {
			response.albums.forEach((album) => {
				if (album.images.length > 0) {
					// Iterate through the tracks
					album.tracks.items.forEach((track) => {
						// Check if the track already exists
						if (track.name in songs) {
							songs[track.name].push(track.id);
						} else {
							songs[track.name] = [track.id];
						}
					})
				}
			});
		}
	} else {
		return 1;
	}
}

async function loadAlbums(url, songs = {}) {
	let response = await loadSpotifyRequest(url);
	//console.log(response);
	if (response !== 1) {
		if (response.items.length > 0) {
			let albumIds = [];
			response.items.forEach((item) => {
				albumIds.push(item.id);
			});
			let tracksurl =
				"https://api.spotify.com/v1/albums?ids=" + albumIds.join();
			if (await loadTracks(tracksurl, songs) === 1) {
				return 1;
			}
		}
		if (response.next) {
			if (await loadAlbums(response.next, songs) === 1) {
				return 1;
			}
		}
		return songs;
	} else {
		return 1;
	}
}

export { seedBracket, loadAlbums, processTracks }