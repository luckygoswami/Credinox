import React, { useState, useContext, useEffect } from "react";
import PasswordWrapper from "./PasswordWrapper";
import UserContext from "../context/UserContext";

function EditCredentialForm({ decryptPassword, handleUpdate }) {
  const [updatedService, setUpdatedService] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [passVisibility, setPassVisibility] = useState(true);
  const { currentCredential, setCurrentCredential } = useContext(UserContext);

  useEffect(() => {
    setUpdatedService(currentCredential.service);
    setUpdatedPassword(decryptPassword(currentCredential.password));
  }, [currentCredential]);

  return (
    <div className="p-4 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Edit Credential</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Service</label>
        <input
          type="text"
          value={updatedService}
          onChange={(e) => {
            setUpdatedService(e.target.value);
          }}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <PasswordWrapper
          value={updatedPassword}
          onChange={(e) => setUpdatedPassword(e.target.value)}
          passVisibility={passVisibility}
          setPassVisibility={setPassVisibility}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setCurrentCredential(null)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={() =>
            handleUpdate(currentCredential.id, updatedService, updatedPassword)
          }
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditCredentialForm;
