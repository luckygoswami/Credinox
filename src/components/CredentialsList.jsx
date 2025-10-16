import React, { useContext, useRef, useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Copy } from 'lucide-react';
import SearchInput from './SearchInput';
import UserContext from '../context/UserContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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

const handleCopy = (contentEle) => {
  // Create a range and select the text
  const range = document.createRange();
  range.selectNodeContents(contentEle);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  // Copy the selected text to clipboard
  window.navigator.clipboard.writeText(contentEle.textContent);

  // Clear the selection after 2s
  setTimeout(() => {
    selection.removeAllRanges();
  }, 2000);
};

function CredentialsList({
  credentials,
  reservedKeywords,
  getDateAndTime,
  decryptPassword,
  handleDelete,
}) {
  const { currentCredential, setCurrentCredential } = useContext(UserContext);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [shareData, setShareData] = useState('');
  const [textareaRows, setTextareaRows] = useState(0);
  const textareaRef = useRef(null);

  const toggleExpand = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleShare = (cred) => {
    let rows = 0;

    const dataStr = Object.entries(cred).reduce((acc, [key, value]) => {
      if (!reservedKeywords.includes(key)) {
        rows++;
        return acc + `${key}: ${value} \n`;
      }

      if (key === 'password') {
        rows++;
        return acc + `${key}: ${decryptPassword(value)} \n`;
      }

      return acc;
    }, '');

    setShareData(dataStr);
    setTextareaRows(rows);
  };

  return (
    <div className="creds-container">
      <div className="flex justify-between items-end flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-gray-700 transition duration-300 dark:text-gray-300">
          Your Saved Credentials
        </h3>
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
                      <span
                        id="toggleable"
                        className="truncate">
                        {credential.service}{' '}
                        {(credential.user && `(${credential.user})`) ||
                          (credential.User && `(${credential.User})`)}
                      </span>
                      <span className="cred-ops flex gap-2 items-center">
                        {/* Edit button */}
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-pencil-square"
                            viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path
                              fillRule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                            />
                          </svg>
                        </button>

                        {/* share button */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <button onClick={() => handleShare(credential)}>
                              <svg
                                width="16"
                                height="16"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 550 500">
                                <path d="M400 255.4l0-15.4 0-32c0-8.8-7.2-16-16-16l-32 0-16 0-46.5 0c-50.9 0-93.9 33.5-108.3 79.6c-3.3-9.4-5.2-19.8-5.2-31.6c0-61.9 50.1-112 112-112l48 0 16 0 32 0c8.8 0 16-7.2 16-16l0-32 0-15.4L506 160 400 255.4zM336 240l16 0 0 48c0 17.7 14.3 32 32 32l3.7 0c7.9 0 15.5-2.9 21.4-8.2l139-125.1c7.6-6.8 11.9-16.5 11.9-26.7s-4.3-19.9-11.9-26.7L409.9 8.9C403.5 3.2 395.3 0 386.7 0C367.5 0 352 15.5 352 34.7L352 80l-16 0-32 0-16 0c-88.4 0-160 71.6-160 160c0 60.4 34.6 99.1 63.9 120.9c5.9 4.4 11.5 8.1 16.7 11.2c4.4 2.7 8.5 4.9 11.9 6.6c3.4 1.7 6.2 3 8.2 3.9c2.2 1 4.6 1.4 7.1 1.4l2.5 0c9.8 0 17.8-8 17.8-17.8c0-7.8-5.3-14.7-11.6-19.5c0 0 0 0 0 0c-.4-.3-.7-.5-1.1-.8c-1.7-1.1-3.4-2.5-5-4.1c-.8-.8-1.7-1.6-2.5-2.6s-1.6-1.9-2.4-2.9c-1.8-2.5-3.5-5.3-5-8.5c-2.6-6-4.3-13.3-4.3-22.4c0-36.1 29.3-65.5 65.5-65.5l14.5 0 32 0zM72 32C32.2 32 0 64.2 0 104L0 440c0 39.8 32.2 72 72 72l336 0c39.8 0 72-32.2 72-72l0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64c0 13.3-10.7 24-24 24L72 464c-13.3 0-24-10.7-24-24l0-336c0-13.3 10.7-24 24-24l64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L72 32z" />
                              </svg>
                            </button>
                          </DialogTrigger>
                          <DialogContent
                            className="sm:max-w-md"
                            aria-describedby={undefined}>
                            <DialogHeader>
                              <DialogTitle>
                                Copy {credential.service} credentials
                              </DialogTitle>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                              <div className="grid flex-1 gap-2">
                                <Textarea
                                  readOnly
                                  rows={textareaRows}
                                  ref={textareaRef}
                                  value={shareData}
                                  placeholder="Credentials..."
                                  className="resize-none overflow-hidden min-h-[40px] max-h-[300px]"
                                />
                              </div>
                              <Button
                                variant="blue"
                                onClick={() => handleCopy(textareaRef.current)}
                                size="sm"
                                className="px-3">
                                <span className="sr-only">Copy</span>
                                <Copy />
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Delete button */}
                        {!currentCredential && (
                          <AlertDialog>
                            <AlertDialogTrigger id="dlt-btn">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-trash3"
                                viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                              </svg>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="dark:text-white">
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
                                  variant="destructive"
                                  onClick={() => {
                                    setOpenIndex(null);
                                    handleDelete(credential.id);
                                  }}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        {/* Expand button */}
                        <button>
                          <i
                            className={`flex bi bi-caret-${
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
