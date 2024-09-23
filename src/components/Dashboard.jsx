import React, { useState, useContext, useRef } from "react";
import PasswordWrapper from "./PasswordWrapper";
import EditCredentialForm from "./EditCredentialForm";
import UserContext from "../context/UserContext";

function Dashboard({
  user,
  handleLogout,
  service,
  setService,
  newPassword,
  setNewPassword,
  savePassword,
  passwords,
  decryptPassword,
  handleDelete,
  handleUpdate,
}) {
  const [passVisibility, setPassVisibility] = useState(false);
  const { currentCredential, setCurrentCredential } = useContext(UserContext);
  const passRefs = useRef([]);

  const handleCopy = (index) => {
    const passwordElement = passRefs.current[index]; // Get the corresponding password element using the index.
    const range = document.createRange(); // Create a range to select the text content.
    range.selectNodeContents(passwordElement); // Select the contents of the password element.

    // Clear any existing selections
    const selection = window.getSelection();
    selection.removeAllRanges();

    // Select the text inside the range (password text)
    selection.addRange(range);

    // Copy the selected text to the clipboard
    window.navigator.clipboard.writeText(passwordElement.textContent);
  };

  const editCredFormProps = {
    handleUpdate,
    decryptPassword,
  };

  return (
    <div className="sm:w-[60%] h-[100%] max-w-3xl p-4">
      <div className="flex flex-col bg-white rounded-lg overflow-hidden h-[100%] shadow-lg">
        {/* Dashboard header */}
        <div className="user-info flex justify-between items-center p-3">
          <h2 className="text-2xl font-bold text-gray-800">{user.email}</h2>
          <button
            onClick={handleLogout}
            className="sm:px-4 sm:py-2 px-2 py-1 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Credentials operations */}
        <div
          className={`password-fields-container overflow-auto px-4 sm:pl-5 ${
            passwords.length > 0 ? "sm:pr-1" : "sm:pr-5"
          }`}
        >
          {/* New credential */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Save a New Credential
            </h3>
            <div className="flex flex-col gap-4">
              <input
                id="new-service"
                type="text"
                placeholder="Service Name"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <PasswordWrapper
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                passVisibility={passVisibility}
                setPassVisibility={setPassVisibility}
              />
              <button
                onClick={savePassword}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
              >
                Save Credential
              </button>
            </div>
          </div>

          {/* Edit credential form */}
          {currentCredential?.id && <EditCredentialForm {...editCredFormProps} />}

          {/* Saved credentials */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Your Saved Credentials
            </h3>
            <ul className="divide-y divide-gray-200">
              {passwords.length > 0 ? (
                passwords.map((password, index) => (
                  <li
                    key={password.id}
                    className={`py-4 flex justify-between max-w-[100%] gap-2 overflow-hidden p-4`}
                  >
                    <span className="font-medium text-gray-800 max-w-[50%]">
                      {password.service}
                    </span>
                    <span className="cred-data flex justify-end overflow-hidden">
                      <span
                        className="password-container text-gray-600 break-words whitespace-normal inline-block w-full text-end"
                        ref={(el) => (passRefs.current[index] = el)}
                      >
                        {decryptPassword(password.password)}
                      </span>
                      <span className="flex justify-evenly gap-3 mx-2 cred-ops">
                        <button
                          className="copy-btn"
                          onClick={() => handleCopy(index)}
                        >
                          <i className="bi bi-copy"></i>
                        </button>
                        <button
                          onClick={() => setCurrentCredential(password)}
                          className="edit-btn"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        {!currentCredential?.id && (
                          <button
                            onClick={() => handleDelete(password.id)}
                            className="dlt-btn"
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        )}
                      </span>
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No saved credentials yet.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
