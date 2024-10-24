import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";

const getDateAndTime = (timestamp) => {
  const dateAndTime = new Date(timestamp);
  const fullDate = dateAndTime.toDateString();
  const fullTime = dateAndTime.toLocaleTimeString();
  return `${fullTime} on ${fullDate}`;
};

function CredentialsList({
  decryptPassword,
  reservedKeywords,
  credentials,
  handleDelete,
}) {
  const { currentCredential, setCurrentCredential } = useContext(UserContext);
  const [openIndex, setOpenIndex] = useState(null);

  // Function to toggle open/close of a credential
  const toggleExpand = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCopy = (contentDiv) => {
    // Create a range and select the text
    const range = document.createRange();
    range.selectNodeContents(contentDiv); // Select the contents of the div
    const selection = window.getSelection();
    selection.removeAllRanges(); // Clear existing selections
    selection.addRange(range); // Add the new range

    // Copy the selected text to clipboard
    window.navigator.clipboard.writeText(contentDiv.textContent);

    // Clear the selection after 2s
    setTimeout(() => {
      selection.removeAllRanges();
    }, 2000);
  };

  return (
    <div className="creds-container">
      <h3 className="text-lg font-semibold text-gray-700 transition duration-300 dark:text-gray-300 mb-2">
        Your Saved Credentials
      </h3>
      <ul className="divide-y divide-gray-200 transition duration-300 dark:divide-gray-600">
        {credentials.length > 0 ? (
          <div>
            {credentials.map((credential, index) => (
              <div
                className="credential-container mb-2 cursor-pointer text-black dark:text-white"
                key={index}
              >
                <div
                  className={`credential-header p-2 flex justify-between bg-gray-100  transition duration-300 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 ${
                    openIndex === index
                      ? "rounded-tl-md rounded-tr-md"
                      : "rounded-md"
                  } `}
                  onClick={(e) => e.target.tagName === "DIV" && toggleExpand(index)}
                >
                  <span>
                    {credential.service}{" "}
                    {(credential.user && `(${credential.user})`) ||
                      (credential.User && `(${credential.User})`)}
                  </span>
                  <span className="cred-ops flex gap-2">
                    <button
                      onClick={() => setCurrentCredential(credential)}
                      id="edit-btn"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    {!currentCredential && (
                      <button
                        onClick={() => {
                          setOpenIndex(null);
                          handleDelete(credential.id, credential.service);
                        }}
                        id="dlt-btn"
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    )}
                    <button>
                      <i
                        className={`bi bi-caret-${
                          openIndex === index ? "down" : "right"
                        }-fill`}
                      ></i>
                    </button>
                  </span>
                </div>
                {openIndex === index && (
                  <div className="flex flex-col p-2 mt-[-1px] bg-white transition dark:bg-gray-800 border-l border-r border-b border-gray-300 duration-300 dark:border-gray-600 rounded-bl-md rounded-br-md">
                    {Object.entries(credential).map(
                      ([key, value]) =>
                        (!reservedKeywords.includes(key) || key === "password") && (
                          <div
                            key={key}
                            className="cred-container flex justify-between"
                          >
                            <div className="cred-key text-black transition duration-300 dark:text-gray-200">
                              {key}
                            </div>
                            <div className="flex">
                              <div className="cred-value text-black transition duration-300 dark:text-gray-300">
                                {key === "password" ? decryptPassword(value) : value}
                              </div>
                              <button
                                className="copy-btn mx-2"
                                onClick={(e) => {
                                  handleCopy(e.currentTarget.previousElementSibling);
                                }}
                              >
                                <i className="bi bi-copy"></i>
                              </button>
                            </div>
                          </div>
                        )
                    )}
                    <div className="meta-info justify-between">
                      <div className="create-info font-light text-sm flex justify-between">
                        created at{" "}
                        <span className="italic ">
                          {getDateAndTime(credential.createdAt)}
                        </span>
                      </div>
                      <div className="update-info font-light text-sm flex justify-between">
                        updated at{" "}
                        <span className="italic ">
                          {getDateAndTime(credential.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 transition duration-300 dark:text-gray-400">
            No saved credentials yet.
          </p>
        )}
      </ul>
    </div>
  );
}

export default CredentialsList;
