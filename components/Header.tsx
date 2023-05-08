import React from 'react';
import Github from "../components/GitHub";

const Header = () => {
  return (
<header className="bg-orange-400 text-white">
  <div className="container mx-auto px-4 py-6 flex items-center justify-between">
    <div className="text-xl font-bold">Paul Graham GPT</div>
    <nav>
      <ul className="flex space-x-4 items-center"> 
        <li>
          <a href="http://www.paulgraham.com/" className="hover:text-gray-300">Paul Graham Blog</a>
        </li>
        <li>
          <a
            className="flex items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100"
            href="https://github.com/ardasisbot/embedding-search-pg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <p>Star on GitHub</p>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</header>
  );
};

export default Header;