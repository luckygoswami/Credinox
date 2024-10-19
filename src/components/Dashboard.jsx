import React, { useState, useContext, useEffect } from "react";
import PasswordWrapper from "./PasswordWrapper";
import EditCredentialForm from "./EditCredentialForm";
import UserContext from "../context/UserContext";

const reservedKeywords = ["id", "service", "password", "createdAt", "updatedAt"];
const getDateAndTime = (timestamp) => {
  const dateAndTime = new Date(timestamp);
  const fullDate = dateAndTime.toDateString();
  const fullTime = dateAndTime.toLocaleTimeString();
  return `${fullTime} on ${fullDate}`;
};

function Dashboard({
  user,
  handleLogout,
  service,
  setService,
  newPassword,
  setNewPassword,
  savePassword,
  credentials,
  decryptPassword,
  handleDelete,
  handleUpdate,
}) {
  const [passVisibility, setPassVisibility] = useState(false);
  const { currentCredential, setCurrentCredential } = useContext(UserContext);
  const [openIndex, setOpenIndex] = useState(null);
  const [newField, setNewField] = useState(false);
  const [newFieldName, setNewFieldName] = useState(null);
  const [newFieldValue, setNewFieldValue] = useState(null);
  const [extraFields, setExtraFields] = useState({});

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

  const addField = () => {
    !newFieldName || !newFieldValue
      ? alert("Cannot leave New Field Name or Value empty before saving!")
      : (() => {
        if (reservedKeywords.includes(newFieldName)) {
          alert(
            `${newFieldName} is a reserved keyword, choose another name for the new field`
          );
        } else {
          extraFields[newFieldName] = newFieldValue;
          setNewField(false);
          setNewFieldName(null);
          setNewFieldValue(null);
        }
      })();
  };

  const createDiscardToggle = () => {
    setNewField((prev) => !prev);
    setNewFieldName(null);
    setNewFieldValue(null);
  };

  // Function to toggle open/close of a credential
  const toggleExpand = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const editCredFormProps = {
    handleUpdate,
    decryptPassword,
  };

  // Event handler for keydown
  const handleKeyDown = (e) => {
    e.key === "Enter" && savePassword(extraFields);
  };

  useEffect(() => {
    const inputElement = document.getElementById("new-password");
    inputElement.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      inputElement.removeEventListener("keydown", handleKeyDown);
    };
  }, [service, newPassword]);

  // To add focus to the new field after clicking create new field btn
  useEffect(() => {
    newField ? document.getElementById('new-field-name').focus() : null;
  }, [newField])

  return (
    <div className="sm:w-[60%] h-[100%] max-w-3xl p-4">
      <div className="flex flex-col bg-white rounded-lg overflow-hidden h-[100%] shadow-lg">
        {/* Dashboard header */}
        <div className="user-info flex justify-between items-center p-3">
          <h2 className="text-2xl font-bold text-gray-800">{user.email}</h2>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="sm:px-4 sm:py-2 px-2 py-1 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Credentials operations */}
        <div
          className={`password-fields-container overflow-auto px-4 sm:pl-5 ${credentials.length > 0 ? "sm:pr-1" : "sm:pr-5"
            }`}
        >
          {/* New credential */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Save a New Credential
            </h3>
            <div className="fields-container flex flex-col gap-4">
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

              {/* Dynamically add new created fields */}
              {Object.entries(extraFields).map(([key, value]) => (
                <div
                  key={key}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    readOnly
                    tabIndex={-1}
                    value={key}
                    className="grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    readOnly
                    tabIndex={-1}
                    value={value}
                    className="grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              {/* New field fields */}
              {newField && (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id="new-field-name"
                    type="text"
                    placeholder="New field type or name"
                    onChange={(e) => setNewFieldName(e.target.value)}
                    className="grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    id="new-field-value"
                    type="text"
                    placeholder="New field value"
                    onChange={(e) => setNewFieldValue(e.target.value)}
                    className="grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addField}
                    className="addField-btn grow px-4 py-2 bg-orange-400 text-white font-semibold rounded hover:bg-orange-500 transition duration-200"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={createDiscardToggle}
                  className="create-discard-btn grow px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
                >
                  {newField ? `Discard new field` : `Create new field`}
                </button>
                <button
                  onClick={() => {
                    if (newFieldName || newFieldValue) {
                      alert("Please make sure to Add or Discard new field first!");
                    } else {
                      savePassword(extraFields);
                      setExtraFields({});
                    }
                  }}
                  className="grow px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-200"
                >
                  Save Credential
                </button>
              </div>
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
              {credentials.length > 0 ? (
                <div>
                  {credentials.map((credential, index) => (
                    <div
                      className="credential-container mb-2 cursor-pointer"
                      key={index}
                    >
                      <div
                        className={`credential-header p-2 flex justify-between bg-gray-100 border border-gray-300 ${openIndex === index
                          ? "rounded-tl-md rounded-tr-md"
                          : "rounded-md"
                          } `}
                        onClick={(e) =>
                          e.target.tagName === "DIV" ? toggleExpand(index) : null
                        }
                      >
                        {credential.service}
                        <span className="cred-ops">
                          <button
                            onClick={() => {
                              setOpenIndex(null);
                              handleDelete(credential.id, credential.service);
                            }}
                            id="dlt-btn"
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                          <i
                            className={`bi bi-caret-${openIndex === index ? "down" : "right"
                              }-fill`}
                          ></i>
                        </span>
                      </div>
                      {openIndex === index && (
                        <div className="flex flex-col p-2 mt-[-1px] bg-white border-l border-r border-b border-gray-300 rounded-bl-md rounded-br-md">
                          {Object.entries(credential).map(([key, value]) =>
                            !reservedKeywords.includes(key) || key === "password" ? (
                              <div
                                key={key}
                                className="cred-container flex justify-between"
                              >
                                <div className="cred-key">{key}</div>
                                <div className="flex">
                                  <div className="cred-value">
                                    {key === "password"
                                      ? decryptPassword(value)
                                      : value}
                                  </div>
                                  <button
                                    className="copy-btn mx-2"
                                    onClick={(e) => {
                                      handleCopy(
                                        e.currentTarget.previousElementSibling
                                      );
                                    }}
                                  >
                                    <i className="bi bi-copy"></i>
                                  </button>
                                </div>
                              </div>
                            ) : null
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
