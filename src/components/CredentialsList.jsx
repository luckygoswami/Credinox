import React, { useContext, useState } from 'react';
import UserContext from '../context/UserContext';
import SearchInput from './SearchInput';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const getDateAndTime = (timestamp) => {
  const dateAndTime = new Date(timestamp);
  const fullDate = dateAndTime.toDateString();
  const fullTime = dateAndTime.toLocaleTimeString();
  return `${fullTime} on ${fullDate}`;
};

const filterData = (data, keyword) => {
  const lowerCaseKeyword = keyword.toLowerCase();

  return data.filter((obj) => {
    const service = obj.service ? obj.service.toLowerCase() : '';
    const user =
      obj.user || obj.User ? (obj.user || obj.User).toLowerCase() : '';

    return (
      service.includes(lowerCaseKeyword) || user.includes(lowerCaseKeyword)
    );
  });
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

function CredentialsList({
  credentials,
  reservedKeywords,
  decryptPassword,
  handleDelete,
}) {
  const { currentCredential, setCurrentCredential } = useContext(UserContext);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleExport = () => {
    const credData = credentials.map((cred) => ({
      ...cred,
      password: cred.password ? decryptPassword(cred.password) : cred.password,
      createdAt: getDateAndTime(cred.createdAt),
      updatedAt: getDateAndTime(cred.updatedAt),
    }));

    const dataBlob = new Blob([JSON.stringify(credData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(dataBlob);

    // Create a temporary link and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'credentials.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // Function to toggle open/close of a credential
  const toggleExpand = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="creds-container">
      <div className="flex justify-between items-end">
        <h3 className="text-lg font-semibold text-gray-700 transition duration-300 dark:text-gray-300">
          Your Saved Credentials
        </h3>
        {!credentials.length || (
          <Button
            variant="neutral"
            onClick={handleExport}>
            Export All
          </Button>
        )}
      </div>
      <SearchInput
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />
      <ul className="divide-y divide-gray-200 transition duration-300 dark:divide-gray-600">
        {credentials.length > 0 ? (
          <div>
            {filterData(credentials, searchKeyword).length > 0 ? (
              filterData(credentials, searchKeyword).map(
                (credential, index) => (
                  <div
                    className="credential-container mb-2 cursor-pointer text-black dark:text-white"
                    key={index}>
                    <div
                      id="toggleable"
                      className={`credential-header p-2 flex justify-between bg-gray-100  transition duration-300 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 ${
                        openIndex === index
                          ? 'rounded-tl-md rounded-tr-md'
                          : 'rounded-md'
                      } `}
                      onClick={(e) =>
                        e.target.id === 'toggleable' && toggleExpand(index)
                      }>
                      <span id="toggleable">
                        {credential.service}{' '}
                        {(credential.user && `(${credential.user})`) ||
                          (credential.User && `(${credential.User})`)}
                      </span>
                      <span className="cred-ops flex gap-2">
                        <button
                          onClick={() => {
                            document
                              .querySelector('.form-container')
                              .scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                              });
                            setCurrentCredential(credential);
                          }}
                          id="edit-btn">
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        {!currentCredential && (
                          <AlertDialog>
                            <AlertDialogTrigger id="dlt-btn">
                              <i className="bi bi-trash3-fill"></i>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete{' '}
                                  <strong>{credential.service}</strong>{' '}
                                  credentials and remove it from the database.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    setOpenIndex(null);
                                    handleDelete(credential.id);
                                  }}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        <button>
                          <i
                            className={`bi bi-caret-${
                              openIndex === index ? 'down' : 'right'
                            }-fill`}></i>
                        </button>
                      </span>
                    </div>
                    {openIndex === index && (
                      <div className="flex flex-col p-2 mt-[-1px] bg-white transition dark:bg-gray-800 border-l border-r border-b border-gray-300 duration-300 dark:border-gray-600 rounded-bl-md rounded-br-md">
                        {Object.entries(credential).map(
                          ([key, value]) =>
                            (!reservedKeywords.includes(key) ||
                              key === 'password') && (
                              <div
                                key={key}
                                className="cred-container flex justify-between">
                                <div className="cred-key mr-5 text-black transition duration-300 dark:text-gray-200">
                                  {key}
                                </div>
                                <div className="flex">
                                  <div className="cred-value text-black transition duration-300 dark:text-gray-300">
                                    {key === 'password'
                                      ? decryptPassword(value)
                                      : value}
                                  </div>
                                  <button
                                    className="copy-btn mx-2"
                                    onClick={(e) => {
                                      handleCopy(
                                        e.currentTarget.previousElementSibling
                                      );
                                    }}>
                                    <i className="bi bi-copy"></i>
                                  </button>
                                </div>
                              </div>
                            )
                        )}
                        <div className="meta-info justify-between">
                          <div className="create-info font-light text-sm flex justify-between">
                            created at{' '}
                            <span className="italic ">
                              {getDateAndTime(credential.createdAt)}
                            </span>
                          </div>
                          <div className="update-info font-light text-sm flex justify-between">
                            updated at{' '}
                            <span className="italic ">
                              {getDateAndTime(credential.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )
            ) : (
              <p className="my-1 text-gray-500 transition duration-300 dark:text-gray-400">
                No such credential found!
              </p>
            )}
          </div>
        ) : (
          <p className="my-1 text-gray-500 transition duration-300 dark:text-gray-400">
            No saved credentials yet!
          </p>
        )}
      </ul>
    </div>
  );
}

export default CredentialsList;
