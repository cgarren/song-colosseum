import * as React from "react";

const ArtistSuggestion = ({ artistName, art, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-l flex first:rounded-t-[inherit] last:rounded-b-[inherit] w-auto bg-white hover:bg-gray-100 focus-visible:bg-gray-100 focus:border-blue-500 focus-visible:border-blue-500 focus:bg-gray-100 cursor-pointer py-1 px-2 border border-[rgba(0,0,0,0.125)] items-center"
    >
      <img src={art} alt={artistName} className="h-10 w-10" />
      &nbsp;{artistName}
    </button>
  );
};

export default ArtistSuggestion;
