import React, { useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";

const reservedKeywords = ["id", "service", "password", "createdAt", "updatedAt"];

function EditCredentialForm({ encryptPassword, decryptPassword, handleUpdate }) {
  const { currentCredential, setCurrentCredential } = useContext(UserContext);
  const [editCredObj, setEditCredObj] = useState({ ...currentCredential });

  // Setting currentCredential's values to the editCredObj
  useEffect(() => {
    const { id, service, password, createdAt, updatedAt, ...remainingFields } =
      currentCredential;
    setEditCredObj({
      ...remainingFields,
      password: decryptPassword(currentCredential.password),
    });
  }, [currentCredential]);

  // Handle value changes
  const handleValueChange = (key, newValue) => {
    setEditCredObj((prevState) => ({
      ...prevState,
      [key]: newValue,
    }));
  };

  // Handle delete field
  const handleDeleteField = (key) => {
    const { [key]: removed, ...remainingFields } = editCredObj;
    setEditCredObj(remainingFields);
  };

  // Handle saving changes
  const handleSaveChanges = () => {
    handleUpdate(currentCredential.id, {
      id: currentCredential.id,
      service: currentCredential.service,
      createdAt: currentCredential.createdAt,
      updatedAt: Date.now(),
      ...editCredObj,
      password: encryptPassword(editCredObj.password),
    });
  };

  return (
    <div className="edit-form mb-3">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Update&nbsp;<span className="text-2xl">{currentCredential.service}'s</span>
        &nbsp;credentials
      </h3>
      <div className="field-operations flex gap-2 flex-col">
        {Object.entries(editCredObj).map(
          ([key, value]) =>
            (!reservedKeywords.includes(key) || key == "password") && (
              <div
                key={key}
                className="cred-container flex justify-between"
              >
                <div className="flex flex-col grow gap-1 sm:flex-row">
                  <input
                    type="text"
                    placeholder="Field type or name"
                    value={key}
                    readOnly
                    tabIndex={-1}
                    className="grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Field value"
                    value={value}
                    onChange={(e) => handleValueChange(key, e.target.value)}
                    className="grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleDeleteField(key)}
                    className="addField-btn grow py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
        )}
        <div className="cred-edit-ops flex gap-1 justify-between">
          <button
            className="px-2 grow text-white font-semibold py-2 bg-orange-500 hover:bg-orange-600 rounded transition duration-200"
            onClick={() => setCurrentCredential(null)}
          >
            Discard Editing
          </button>
          <button
            className="px-2 grow text-white font-semibold py-2 bg-gray-400 rounded transition duration-200"
            onClick={() => console.log("Hello world!")}
            disabled
          >
            Add New Field
          </button>
          <button
            className="px-2 grow text-white font-semibold py-2 bg-green-500 hover:bg-green-600 rounded transition duration-200"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditCredentialForm;
