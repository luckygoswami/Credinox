import React, { useContext } from 'react';
import EditCredentialForm from './EditCredentialForm';
import UserContext from '../context/UserContext';
import CredentialsList from './CredentialsList';
import NewCredentialForm from './NewCredentialForm';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'react-toastify';
import { Switch } from '@/components/ui/switch';
import CryptoJS from 'crypto-js';

const HMAC_key = import.meta.env.VITE_HMAC_KEY;

const reservedKeywords = [
  'id',
  'service',
  'password',
  'createdAt',
  'updatedAt',
];

const generateHMAC = (data) => {
  return CryptoJS.HmacSHA256(JSON.stringify(data), HMAC_key).toString();
};

const getDateAndTime = (timestamp) => {
  const dateAndTime = new Date(timestamp);
  const fullDate = dateAndTime.toDateString();
  const fullTime = dateAndTime.toLocaleTimeString();
  return `${fullTime} on ${fullDate}`;
};

const parseDateAndTime = (dateTimeString) => {
  const [time, date] = dateTimeString.split(' on ');

  const fullDateTimeString = `${date} ${time}`;
  const timestamp = new Date(fullDateTimeString).getTime();

  return isNaN(timestamp) ? null : timestamp;
};

function Dashboard({
  user,
  handleLogout,
  service,
  setService,
  newPassword,
  setNewPassword,
  savePassword,
  handleImport,
  credentials,
  encryptPassword,
  decryptPassword,
  handleDelete,
  handleUpdate,
  theme,
  setTheme,
  googleSignIn,
  setGoogleSignIn,
}) {
  const { currentCredential } = useContext(UserContext);

  const handleExport = () => {
    const credData = credentials.map((cred) => ({
      ...cred,
      password: cred.password ? decryptPassword(cred.password) : cred.password,
      createdAt: getDateAndTime(cred.createdAt),
      updatedAt: getDateAndTime(cred.updatedAt),
    }));

    const exportData = {
      note: '⚠️ WARNING: Do NOT modify this file! Any change (even a single letter) will make it NON-IMPORTABLE.',
      data: credData,
      hash: generateHMAC(credData),
    };

    const dataBlob = new Blob([JSON.stringify(exportData, null, 2)], {
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

  const handleFile = (file) => {
    if (file.type !== 'application/json') {
      toast.error('❌ Only JSON files (.json) are allowed!');
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      try {
        const parsedData = JSON.parse(reader.result);

        parsedData.hash == generateHMAC(parsedData.data)
          ? encryptData(parsedData.data)
          : toast.error(
              '⚠️ Data integrity check failed! The file appears to be tampered with.'
            );
      } catch (error) {
        toast.error('❌ Invalid JSON file. Please check the file format.');
      }
    };

    reader.onerror = () => {
      toast.error('❌ Failed to read the file. Please try again.');
    };
  };

  const encryptData = (data) => {
    data.forEach((cred) => {
      if (cred.password) {
        cred.password = encryptPassword(cred.password);
      }
      cred.createdAt = parseDateAndTime(cred.createdAt);
      cred.updatedAt = parseDateAndTime(cred.updatedAt);
    });

    handleImport(data);
  };

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
    getDateAndTime,
    decryptPassword,
    handleDelete,
  };

  return (
    <div className="sm:w-[60%] h-[100%] max-w-3xl p-4">
      <div className="flex flex-col bg-white transition duration-300 dark:bg-gray-800 rounded-lg overflow-hidden h-[100%] shadow-lg">
        {/* Dashboard header */}
        <div className="user-info flex justify-between items-center p-3">
          <h2 className="text-2xl font-bold text-gray-800 transition duration-300 dark:text-gray-200">
            {user.email}
          </h2>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="neutral">
                <svg
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16">
                  <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="grid grid-cols-[70%_30%] items-center">
                    <Label htmlFor="toggleGoogleSignin">
                      {googleSignIn ? 'Disable' : 'Enable'} Sign In with Google{' '}
                    </Label>
                    <Switch
                      id="toggleGoogleSignin"
                      checked={googleSignIn}
                      onCheckedChange={setGoogleSignIn}
                    />
                  </div>
                  {!credentials.length || (
                    <div className="grid grid-cols-[70%_30%] items-center">
                      <Label>Export credentials to JSON</Label>
                      <Button
                        variant="neutral"
                        onClick={handleExport}>
                        Export
                      </Button>
                    </div>
                  )}
                  <div className="grid grid-cols-[70%_30%] items-center">
                    <Label>Import credentials from JSON</Label>
                    <>
                      <label
                        role="button"
                        tabIndex={0}
                        htmlFor="cred-input"
                        className="flex items-center justify-center rounded-md font-medium text-sm h-9 px-4 py-2 cursor-pointer border border-zinc-200 bg-white shadow-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-50 dark:hover:bg-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 transition duration-300 whitespace-nowrap">
                        Import
                      </label>
                      <input
                        accept="application/json"
                        id="cred-input"
                        className="hidden"
                        type="file"
                        onChange={(e) => {
                          handleFile(e.target.files[0]);
                          e.target.value = '';
                        }}
                      />
                    </>
                  </div>
                  <div className="grid grid-cols-[70%_30%] items-center">
                    <Label htmlFor="theme">Change Theme mode</Label>
                    <DropdownMenu id="theme">
                      <DropdownMenuTrigger asChild>
                        <Button variant="neutral">
                          {theme.charAt(0).toUpperCase() + theme.substring(1)}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg text-gray-800 dark:text-gray-200 transition duration-300">
                        <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                        <DropdownMenuRadioGroup
                          value={theme}
                          onValueChange={setTheme}>
                          <DropdownMenuRadioItem
                            className="dark:focus:bg-gray-700"
                            value="light">
                            Light
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem
                            className="dark:focus:bg-gray-700"
                            value="dark">
                            Dark
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem
                            className="dark:focus:bg-gray-700"
                            value="system">
                            System Default
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="grid grid-cols-[70%_30%] items-center">
                    <Label>Log out from this device</Label>
                    <button
                      id="logout-btn"
                      onClick={handleLogout}
                      className="py-1 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200">
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Credentials operations */}
        <div
          className={`password-fields-container overflow-auto px-4 sm:pl-5 ${
            credentials.length > 0 ? 'sm:pr-1' : 'sm:pr-5'
          }`}>
          {/* Create and Edit credential form */}
          <div className="form-container">
            {currentCredential?.id ? (
              <EditCredentialForm {...editCredFormProps} />
            ) : (
              <NewCredentialForm {...NewCredentialFormProps} />
            )}
          </div>
          {/* Credentials list */}
          <CredentialsList {...CredentialsListProps} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
