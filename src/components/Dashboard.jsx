import React, { useContext } from 'react';
import EditCredentialForm from './EditCredentialForm';
import UserContext from '../context/UserContext';
import CredentialsList from './CredentialsList';
import NewCredentialForm from './NewCredentialForm';

const reservedKeywords = [
  'id',
  'service',
  'password',
  'createdAt',
  'updatedAt',
];

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
  const { currentCredential } = useContext(UserContext);

  const NewCredentialFormProps = {
    service,
    setService,
    newPassword,
    setNewPassword,
    savePassword,
  };

  const editCredFormProps = {
    handleUpdate,
    encryptPassword,
    decryptPassword,
  };

  const CredentialsListProps = {
    credentials,
    reservedKeywords,
    handleDelete,
    decryptPassword,
  };

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
            className="sm:px-4 sm:py-2 px-2 py-1 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200">
            Logout
          </button>
        </div>

        {/* Credentials operations */}
        <div
          className={`password-fields-container overflow-auto px-4 sm:pl-5 ${
            credentials.length > 0 ? 'sm:pr-1' : 'sm:pr-5'
          }`}>
          {/* Create and Edit credential form */}
          {currentCredential?.id ?
            <EditCredentialForm {...editCredFormProps} />
          : <NewCredentialForm {...NewCredentialFormProps} />}

          {/* Credentials list */}
          <CredentialsList {...CredentialsListProps} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
