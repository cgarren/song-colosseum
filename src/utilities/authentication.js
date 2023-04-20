// place for methods which handdle authenitcation for btoh spotify and backend
import {
	login as spotifyLogin,
	loginCallback as spotifyLoginCallback,
	refreshLogin as spotifyRefreshLogin,
	getUserInfo
} from "./spotify";
import {
	authenticate as backendLogin,
} from "./backend";
import { generateRandomString } from "./helpers";

const refreshTokenKey = "refresh_token";
const accessTokenKey = "access_token";
const expiresAtKey = "expires_at";
const sessionKey = "session_id";
const userIdKey = "user_id";

// getting data from session storage helpers

export function getAccessToken() {
	return sessionStorage.getItem(accessTokenKey);
}

export function getUserId() {
	return sessionStorage.getItem(userIdKey);
}

export function getSessionId() {
	return sessionStorage.getItem(sessionKey);
}

//auth functions

function setLoginTimer(expiresAt) {
	// refresh access token 1 minute before it expires
	const refreshTime = expiresAt - 60000 - Date.now();
	setTimeout(() => {
		login();
	}, refreshTime);
}

export async function login() {
	// case where user has been here before
	try {
		if (localStorage.getItem(refreshTokenKey)) {
			console.log(typeof localStorage.getItem(refreshTokenKey));
			// refresh spotify and set session storage
			let accessToken, refreshToken, expiresAt;
			try {
				({ accessToken, refreshToken, expiresAt } = await spotifyRefreshLogin(localStorage.getItem(refreshTokenKey)));
			} catch (error) {
				console.error(error);
				localStorage.removeItem(refreshTokenKey);
				login();
				return;
			}

			sessionStorage.setItem(accessTokenKey, accessToken);
			sessionStorage.setItem(expiresAtKey, expiresAt);
			if (refreshToken) {
				localStorage.setItem(refreshTokenKey, refreshToken);
			}

			// get info about user from spotify andd set session storage
			const userInfo = await getUserInfo();
			const userId = userInfo.id;
			sessionStorage.setItem(userIdKey, userId);

			// get session id from session storage and set it if it doesn't exist
			let sessionId = sessionStorage.getItem(sessionKey);
			if (!sessionId) {
				sessionId = generateRandomString(128);
			}
			// refresh backend
			await backendLogin(userId, sessionId, expiresAt, accessToken);

			// set timer to refresh access token
			setLoginTimer(expiresAt);
		} else {
			//kick off spotify login process
			await spotifyLogin();
		}
	} catch (error) {
		console.error(error);
	}
}

export async function loginCallback(urlParams) {
	try {
		// get data from spotify login callback and set session storage
		const { refreshToken, accessToken, expiresAt, state } = await spotifyLoginCallback(urlParams);
		localStorage.setItem(refreshTokenKey, refreshToken);
		sessionStorage.setItem(accessTokenKey, accessToken);
		sessionStorage.setItem(expiresAtKey, expiresAt);
		sessionStorage.setItem(sessionKey, state);

		// get info about user from spotify andd set session storage
		const userInfo = await getUserInfo();
		const userId = userInfo.id;
		sessionStorage.setItem(userIdKey, userId);

		// use the state value for the new session id
		const sessionId = state;

		// authenticate with backend
		await backendLogin(userId, sessionId, expiresAt, accessToken);

		// set timer to refresh access token
		setLoginTimer(expiresAt);
	} catch (error) {
		if (error.message !== "Invalid url params") {
			throw error;
		} else {
			return "Invalid url parameters"
		}
	}
}

export async function logout() {
	// clear session storage and refresh token key
	sessionStorage.clear();
	localStorage.removeItem(refreshTokenKey);
}

export function isLoggedIn(timer = undefined) {
	if (typeof window !== 'undefined') {
		let expiresAt = new Date(parseInt(sessionStorage.getItem(expiresAtKey)));
		if (
			sessionStorage.getItem(expiresAtKey) &&
			sessionStorage.getItem(accessTokenKey) &&
			expiresAt.toString() !== "Invalid Date" &&
			Date.now() < expiresAt
		) {
			return true;
		}
	}
	if (timer) {
		clearInterval(timer);
	}
	return false;
}