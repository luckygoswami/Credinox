import React, { useState, useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const reservedKeywords = ['id', 'createdAt', 'updatedAt'];

function EditCredentialForm({
  encryptPassword,
  decryptPassword,
  handleUpdate,
}) {
  const { currentCredential, setCurrentCredential } = useContext(UserContext);
  const [editCredObj, setEditCredObj] = useState({ ...currentCredential });
  const [newField, setNewField] = useState(false);
  const [newFieldName, setNewFieldName] = useState(null);
  const [newFieldValue, setNewFieldValue] = useState(null);

  // Setting currentCredential's values to the editCredObj
  useEffect(() => {
    const { id, password, createdAt, updatedAt, ...remainingFields } =
      currentCredential;
    setEditCredObj({
      ...remainingFields,
      ...(currentCredential.password && {
        password: decryptPassword(currentCredential.password),
      }),
    });
  }, [currentCredential]);

  // To add focus to the new field after clicking create new field btn
  useEffect(() => {
    newField && document.getElementById('new-field-name').focus();
  }, [newField]);

  // Handle value changes
  const handleValueChange = (key, newValue) => {
    setEditCredObj((prevState) => ({
      ...prevState,
      [key]: newValue,
    }));
  };

  // Handle delete field
  const handleDeleteField = (key) => {
    if (key == 'service') {
      toast.error('Deleting the Service field is not allowed!');
    } else {
      const { [key]: removed, ...remainingFields } = editCredObj;
      setEditCredObj(remainingFields);
    }
  };

  // Handle saving changes
  const handleSaveChanges = () => {
    if (!editCredObj.service) {
      toast.info('Cannot leave the Service name field empty');
    } else if (newFieldName || newFieldValue) {
      toast.info('Please make sure to add or discard the new field first!');
    } else {
      handleUpdate(currentCredential.id, {
        id: currentCredential.id,
        service: currentCredential.service,
        createdAt: currentCredential.createdAt,
        updatedAt: Date.now(),
        ...editCredObj,
        ...(editCredObj.password && {
          password: encryptPassword(editCredObj.password),
        }), // Conditionally add password field
      });
    }
  };

  const createDiscardToggle = () => {
    setNewField((prev) => !prev);
    setNewFieldName(null);
    setNewFieldValue(null);
  };

  const addField = () => {
    !newFieldName || !newFieldValue
      ? toast.info(
          'Cannot leave the New Field Name or Value empty before saving!'
        )
      : (() => {
          if (
            reservedKeywords.includes(newFieldName) ||
            Object.keys(editCredObj).includes(newFieldName)
          ) {
            toast.info(
              `'${newFieldName}' already exists choose another name for the new field`
            );
          } else {
            editCredObj[newFieldName] = newFieldValue;
            setNewField(false);
            setNewFieldName(null);
            setNewFieldValue(null);
          }
        })();
  };

  return (
    <div className="edit-form mb-3">
      <h3 className="text-lg font-semibold text-gray-700 transition duration-300 dark:text-gray-300 mb-2">
        Update&nbsp;
        <span className="text-2xl text-indigo-600 transition duration-300 dark:text-indigo-400">
          {currentCredential.service}'s
        </span>
        &nbsp;credentials
      </h3>
      <div className="field-operations flex gap-2 flex-col">
        {Object.entries(editCredObj).map(
          ([key, value]) =>
            !reservedKeywords.includes(key) && (
              <div
                key={key}
                className="cred-container flex justify-between">
                <div className="flex flex-col grow gap-1 sm:flex-row">
                  <input
                    type="text"
                    placeholder="Field type or name"
                    value={key}
                    readOnly
                    tabIndex={-1}
                    className="grow p-2 border border-gray-300 transition duration-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
                  />
                  <input
                    type="text"
                    placeholder="Field value"
                    value={value}
                    onChange={(e) => handleValueChange(key, e.target.value)}
                    className="grow p-2 border border-gray-300 transition duration-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
                  />
                  <button
                    onClick={() => handleDeleteField(key)}
                    className="addField-btn grow py-2 px-1 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200">
                    Delete
                  </button>
                </div>
              </div>
            )
        )}
        {newField && (
          <div className="flex flex-col gap-1 sm:flex-row">
            <input
              id="new-field-name"
              type="text"
              placeholder="New field type or name"
              onChange={(e) => setNewFieldName(e.target.value)}
              className="grow p-2 border border-gray-300 transition duration-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
            />
            <input
              id="new-field-value"
              type="text"
              placeholder="New field value"
              onChange={(e) => setNewFieldValue(e.target.value)}
              className="grow p-2 border border-gray-300 transition duration-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
            />
            <button
              onClick={addField}
              className="addField-btn grow px-3 py-2 bg-orange-400 text-white font-semibold rounded hover:bg-orange-500 transition duration-200">
              Add
            </button>
          </div>
        )}
        <div className="cred-edit-ops flex gap-1 justify-between">
          <button
            className="px-2 grow text-white font-semibold py-2 bg-orange-500 hover:bg-orange-600 rounded transition duration-200"
            onClick={() => setCurrentCredential(null)}>
            Discard Editing
          </button>
          <button
            className="px-2 grow text-white font-semibold py-2 bg-blue-500 hover:bg-blue-600 rounded transition duration-200"
            onClick={createDiscardToggle}>
            {newField ? `Discard new field` : `Add new field`}
          </button>
          <button
            className="px-2 grow text-white font-semibold py-2 bg-green-500 hover:bg-green-600 rounded transition duration-200"
            onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditCredentialForm;
