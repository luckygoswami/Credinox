import React, { useRef, useEffect } from 'react';

function SearchInput({ searchKeyword, setSearchKeyword }) {
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '/') {
        const activeElement = document.activeElement;
        if (!activeElement || activeElement.tagName !== 'INPUT') {
          event.preventDefault();
          searchInputRef.current?.focus();
        }
      } else if (event.key === 'Escape') {
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <div className="search-wrapper relative">
      <input
        ref={searchInputRef}
        type="text"
        value={searchKeyword}
        onChange={handleSearch}
        placeholder="Search by service name or user"
        className="search-input p-2 pr-10 my-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 w-full transition duration-300"
      />
      <i
        tabIndex="-1"
        className="bi bi-search absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-400 transition duration-300"></i>
    </div>
  );
}

export default SearchInput;
