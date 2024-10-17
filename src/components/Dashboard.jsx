import React, { useState, useContext, useRef, useEffect } from "react";
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
  const passRefs = useRef([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [newField, setNewField] = useState(false);
  const [newFieldName, setNewFieldName] = useState(null);
  const [newFieldValue, setNewFieldValue] = useState(null);
  const [extraFields, setExtraFields] = useState({});

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

  const createDiscardField = () => {
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
                    value={key}
                    className="grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    readOnly
                    value={value}
                    className="grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              {/* New field fields */}
              {newField && (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    placeholder="New field type or name"
                    onChange={(e) => setNewFieldName(e.target.value)}
                    className="grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
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
                  onClick={createDiscardField}
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
                        onClick={() => toggleExpand(index)}
                      >
                        {credential.service}
                        <span>
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
                                className="flex justify-between"
                              >
                                <div>{key}</div>
                                <div>
                                  {key === "password"
                                    ? decryptPassword(value)
                                    : value}
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
