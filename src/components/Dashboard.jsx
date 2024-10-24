import React, { useState, useContext, useEffect } from "react";
import PasswordWrapper from "./PasswordWrapper";
import EditCredentialForm from "./EditCredentialForm";
import UserContext from "../context/UserContext";
import CredentialsList from "./CredentialsList";

const reservedKeywords = ["id", "service", "password", "createdAt", "updatedAt"];

function Dashboard({
  user,
  handleLogout,
  service,
  setService,
  newPassword,
  setNewPassword,
  savePassword,
  credentials,
  encryptPassword,
  decryptPassword,
  handleDelete,
  handleUpdate,
}) {
  const [passVisibility, setPassVisibility] = useState(false);
  const { currentCredential } = useContext(UserContext);
  const [newField, setNewField] = useState(false);
  const [newFieldName, setNewFieldName] = useState(null);
  const [newFieldValue, setNewFieldValue] = useState(null);
  const [extraFields, setExtraFields] = useState({});

  const handleSave = () => {
    if (!service) {
      alert("Cannot leave the Service field empty"); // Check if the service field is empty
    } else if (newFieldName || newFieldValue) {
      alert("Please make sure to Add or Discard new field first!"); // Check if the new fields are empty
    } else {
      savePassword(extraFields);
      setExtraFields({});
    }
  };

  const addField = () => {
    !newFieldName || !newFieldValue
      ? alert("Cannot leave the New Field Name or Value empty before saving!")
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

  const editCredFormProps = {
    handleUpdate,
    encryptPassword,
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
    newField && document.getElementById("new-field-name").focus();
  }, [newField]);

  const CredentialsListProps = {
    credentials,
    reservedKeywords,
    handleDelete,
    decryptPassword,
  }

  return (
    <div className="sm:w-[60%] h-[100%] max-w-3xl p-4">
      <div className="flex flex-col bg-white transition duration-300 dark:bg-gray-800 rounded-lg overflow-hidden h-[100%] shadow-lg">
        {/* Dashboard header */}
        <div className="user-info flex justify-between items-center p-3">
          <h2 className="text-2xl font-bold text-gray-800 transition duration-300 dark:text-gray-200">
            {user.email}
          </h2>
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
          {/* Create and Edit credential form */}
          {currentCredential?.id ? (
            <EditCredentialForm {...editCredFormProps} />
          ) : (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 transition duration-300 dark:text-gray-300 mb-2">
                Save a New Credential
              </h3>
              <div className="fields-container flex flex-col gap-4">
                <input
                  id="new-service"
                  type="text"
                  placeholder="Service Name"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="p-3 border border-gray-300 transition duration-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
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
                      className="grow p-3 border border-gray-300 transition duration-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    />
                    <input
                      type="text"
                      readOnly
                      tabIndex={-1}
                      value={value}
                      className="grow p-3 border border-gray-300 transition duration-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
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
                      className="grow p-3 border border-gray-300 transition duration-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    />
                    <input
                      id="new-field-value"
                      type="text"
                      placeholder="New field value"
                      onChange={(e) => setNewFieldValue(e.target.value)}
                      className="grow p-3 border border-gray-300 transition duration-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
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
                    {newField ? `Discard new field` : `Add new field`}
                  </button>
                  <button
                    onClick={handleSave}
                    className="grow px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-200"
                  >
                    Save Credential
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Credentials list */}
          <CredentialsList {...CredentialsListProps} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
