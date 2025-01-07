import React from "react";
import Search from "../components/Search";

const SearchPage = ({ token }) => {
  return (
    <div className="search-container">
      <Search token={token} />
    </div>
  );
};

export default SearchPage;
