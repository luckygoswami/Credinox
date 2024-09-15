import React, { useState, useCallback, useEffect, useRef } from "react";

function PasswordGenerator() {
  const [length, setLength] = useState(8);
  const [uppercaseAllowed, setUppercaseAllowed] = useState(false);
  const [lowercaseAllowed, setLowercaseAllowed] = useState(true);
  const [numberAllowed, setNumberAllowed] = useState(true);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");

  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "";

    if (uppercaseAllowed) str += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercaseAllowed) str += 'abcdefghijklmnopqrstuvwxyz';
    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += '!@#$%^&*()-_=+[]{}|;:",.<>?/~`';

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }

    setPassword(pass);
  }, [length, numberAllowed, charAllowed, uppercaseAllowed, lowercaseAllowed, setPassword]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    window.navigator.clipboard.writeText(password);
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [length, charAllowed, numberAllowed, uppercaseAllowed, lowercaseAllowed, passwordGenerator]);

  return (
    <div className="w-full sm:w-[30%] p-3">
      <div className="w-full h-full p-6 max-w-md shadow-lg rounded-lg text-orange-500 bg-gray-800">
        {/* Header */}
        <h1 className="text-white text-center mb-5 text-lg font-semibold">🔐 Random Password Generator</h1>

        {/* Password Field */}
        <div className="password-input flex items-center rounded-lg overflow-hidden mb-4 border-2 border-gray-600 bg-gray-900">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-2 px-4 bg-gray-900 text-gray-300"
            placeholder="Generated Password"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className="outline-none bg-blue-700 hover:bg-blue-600 transition text-white px-4 py-2 font-medium shrink-0"
          >
            Copy
          </button>
        </div>

        {/* Password Options */}
        <div className="password-customs flex flex-col text-sm gap-y-4 text-gray-300">
          {/* Length Slider */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-x-2">
              <span>Length:</span>
              <input
                type="range"
                min={6}
                max={32}
                value={length}
                className="cursor-pointer accent-orange-500"
                onChange={(e) => setLength(e.target.value)}
              />
            </label>
            <span className="font-semibold">{length}</span>
          </div>

          {/* Numbers Toggle */}
          <div className="flex items-center gap-x-3">
            <input
              type="checkbox"
              defaultChecked={numberAllowed}
              id="numberInput"
              className="accent-orange-500 cursor-pointer"
              onChange={() => setNumberAllowed((prev) => !prev)}
            />
            <label htmlFor="numberInput" className="cursor-pointer">Include Numbers</label>
          </div>

          {/* Special Characters Toggle */}
          <div className="flex items-center gap-x-3">
            <input
              type="checkbox"
              defaultChecked={charAllowed}
              id="charInput"
              className="accent-orange-500 cursor-pointer"
              onChange={() => setCharAllowed((prev) => !prev)}
            />
            <label htmlFor="charInput" className="cursor-pointer">Include Characters</label>
          </div>

          {/* Uppercase Toggle */}
          <div className="flex items-center gap-x-3">
            <input
              type="checkbox"
              defaultChecked={uppercaseAllowed}
              id="uppercaseInput"
              className="accent-orange-500 cursor-pointer"
              onChange={() => setUppercaseAllowed((prev) => !prev)}
            />
            <label htmlFor="charInput" className="cursor-pointer">Include Uppercase Characters</label>
          </div>

          {/* Lowercase Toggle */}
          <div className="flex items-center gap-x-3">
            <input
              type="checkbox"
              defaultChecked={lowercaseAllowed}
              id="lowercaseInput"
              className="accent-orange-500 cursor-pointer"
              onChange={() => setLowercaseAllowed((prev) => !prev)}
            />
            <label htmlFor="charInput" className="cursor-pointer">Include Lowercase Characters</label>
          </div>

          {/* Generate Password Button */}
          <button
            onClick={passwordGenerator}
            className="mt-6 bg-orange-500 hover:bg-orange-400 transition text-white py-2 px-4 rounded-lg font-semibold"
          >
            Regenerate Password
          </button>
        </div>
      </div>
    </div>

  );
}

export default PasswordGenerator;
