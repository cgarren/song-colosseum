import React from "react";
import spotifyLogo from "../assets/images/Spotify_Logo_RGB_White.png";
import FAQ from "./FAQ/FAQ";

const Footer = ({ heightClass, loggedIn }) => {
  return (
    <footer className={heightClass}>
      <div className="bg-zinc-800 p-4">
        <FAQ loggedIn={loggedIn} />
        <div className="relative text-center">
          <span className="inline-flex items-center text-white">
            © Cooper Garren 2023 | Content from&nbsp;
            <a href="https://spotify.com">
              <img
                src={spotifyLogo}
                alt="Spotify"
                className="h-[22px] text-white"
              />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;