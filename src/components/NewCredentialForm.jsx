import React, { useState, useEffect, useContext } from 'react';
import PasswordWrapper from './PasswordWrapper';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../context/UserContext';

const reservedKeywords = [
  'id',
  'service',
  'password',
  'createdAt',
  'updatedAt',
];

function NewCredentialForm({
  service,
  setService,
  newPassword,
  setNewPassword,
  savePassword,
}) {
  const [passVisibility, setPassVisibility] = useState(false);
  const [newFieldName, setNewFieldName] = useState(null);
  const [newFieldValue, setNewFieldValue] = useState(null);
  const [newField, setNewField] = useState(false);
  const [extraFields, setExtraFields] = useState({});
  const { themeMode } = useContext(UserContext);

  const handleSave = () => {
    if (!service) {
      toast.info('Cannot leave the Service field empty'); // Check if the service field is empty
    } else if (newFieldName || newFieldValue) {
      toast.info('Please make sure to Add or Discard new field first!'); // Check if the new fields are empty
    } else {
      savePassword(extraFields);
      setExtraFields({});
    }
  };

  const handleKeyDown = (e) => {
    e.key === 'Enter' && savePassword(extraFields);
  };

  const addField = () => {
    !newFieldName || !newFieldValue
      ? toast.info(
          'Cannot leave the New Field Name or Value empty before saving!'
        )
      : (() => {
          if (reservedKeywords.includes(newFieldName)) {
            toast.info(
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

  useEffect(() => {
    const inputElement = document.getElementById('new-password');
    inputElement.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      inputElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [service, newPassword]);

  // To add focus to the new field after clicking create new field btn
  useEffect(() => {
    newField && document.getElementById('new-field-name').focus();
  }, [newField]);

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-700 transition duration-300 dark:text-gray-300 mb-2">
        Save a New Credential
      </h3>
      <div className="fields-container flex flex-col gap-2">
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
            className="flex gap-1 flex-col sm:flex-row">
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
              className="addField-btn grow px-4 py-2 bg-orange-400 text-white font-semibold rounded hover:bg-orange-500 transition duration-200">
              Add
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={createDiscardToggle}
            className="create-discard-btn grow px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200">
            {newField ? `Discard new field` : `Add new field`}
          </button>
          <button
            onClick={handleSave}
            className="grow px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-200">
            Save Credential
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewCredentialForm;
