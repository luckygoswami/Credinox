import React, { useState, useCallback, useEffect, useRef } from "react";

function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercaseAllowed, setUppercaseAllowed] = useState(false);
  const [lowercaseAllowed, setLowercaseAllowed] = useState(true);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(true);
  const [password, setPassword] = useState("");

  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "";

    if (uppercaseAllowed) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercaseAllowed) str += "abcdefghijklmnopqrstuvwxyz";
    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%&*_";

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }

    setPassword(pass);
  }, [
    length,
    numberAllowed,
    charAllowed,
    uppercaseAllowed,
    lowercaseAllowed,
    setPassword,
  ]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    window.navigator.clipboard.writeText(password);
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [
    length,
    charAllowed,
    numberAllowed,
    uppercaseAllowed,
    lowercaseAllowed,
    passwordGenerator,
  ]);

  return (
    <div className="w-full sm:w-[30%] p-3 min-h-[400px] sm:h-auto flex justify-center">
      <div className="w-full h-full pt-5 pb-3 px-5 flex flex-col justify-between max-w-md shadow-lg rounded-lg text-orange-500 bg-white transition duration-300 dark:bg-gray-800 dark:text-orange-500 overflow-auto">
        {/* Header */}
        <h1 className="text-center text-lg font-semibold text-gray-700 transition duration-300 dark:text-white">
          🔐 Random Password Generator
        </h1>

        {/* Password Display Section */}
        <div className="password-input flex items-center rounded-lg overflow-hidden border-2 border-gray-300 transition duration-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-2 px-4 bg-gray-100 transition duration-300 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
            placeholder="Generated Password"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className="bg-blue-500 hover:bg-blue-400 transition duration-300 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 font-medium shrink-0"
          >
            Copy
          </button>
        </div>

        {/* Password Options */}
        <div className="password-options flex flex-col text-sm gap-y-4 text-gray-700 transition duration-300 dark:text-gray-300">
          {/* Password Length */}
          <div className="flex items-center justify-between gap-x-2">
            <label className="flex items-center gap-x-2 w-full">
              <span>Length:</span>
              <input
                type="range"
                min={6}
                max={32}
                value={length}
                className="cursor-pointer accent-orange-500 w-full"
                onChange={(e) => setLength(e.target.value)}
              />
            </label>
            <span className="font-semibold">{length}</span>
          </div>

          {/* Toggle for including numbers */}
          <div className="flex items-center gap-x-3">
            <input
              type="checkbox"
              checked={numberAllowed}
              id="numberInput"
              className="accent-orange-500 cursor-pointer"
              onChange={() => setNumberAllowed(!numberAllowed)}
            />
            <label
              htmlFor="numberInput"
              className="cursor-pointer"
            >
              Include Numbers (0-9)
            </label>
          </div>

          {/* Toggle for including special characters */}
          <div className="flex items-center gap-x-3">
            <input
              type="checkbox"
              checked={charAllowed}
              id="charInput"
              className="accent-orange-500 cursor-pointer"
              onChange={() => setCharAllowed(!charAllowed)}
            />
            <label
              htmlFor="charInput"
              className="cursor-pointer"
            >
              Include Special Characters (!@#$%&*_)
            </label>
          </div>

          {/* Toggle for including uppercase letters */}
          <div className="flex items-center gap-x-3">
            <input
              type="checkbox"
              checked={uppercaseAllowed}
              id="uppercaseInput"
              className="accent-orange-500 cursor-pointer"
              onChange={() => setUppercaseAllowed(!uppercaseAllowed)}
            />
            <label
              htmlFor="uppercaseInput"
              className="cursor-pointer"
            >
              Include Uppercase Letters (A-Z)
            </label>
          </div>

          {/* Toggle for including lowercase letters */}
          <div className="flex items-center gap-x-3">
            <input
              type="checkbox"
              checked={lowercaseAllowed}
              id="lowercaseInput"
              className="accent-orange-500 cursor-pointer"
              onChange={() => setLowercaseAllowed(!lowercaseAllowed)}
            />
            <label
              htmlFor="lowercaseInput"
              className="cursor-pointer"
            >
              Include Lowercase Letters (a-z)
            </label>
          </div>
        </div>

        {/* Generate Password Button */}
        <button
          onClick={passwordGenerator}
          className="bg-orange-500 hover:bg-orange-400 transition text-white py-2 px-4 rounded-lg font-semibold"
        >
          Regenerate Password
        </button>
      </div>
    </div>
  );
}

export default PasswordGenerator;
