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
import { Switch } from '@/components/ui/switch';

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
  theme,
  setTheme,
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

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-list"
                  viewBox="0 0 16 16">
                  <path
                    fill-rule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="grid grid-cols-[70%_30%] items-center">
                    <Label htmlFor="logout-btn">Log out from this device</Label>
                    <button
                      id="logout-btn"
                      onClick={handleLogout}
                      className="bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200">
                      Log out
                    </button>
                  </div>
                  <div className="grid grid-cols-[70%_30%] items-center">
                    <Label htmlFor="theme">Change Theme mode</Label>
                    <DropdownMenu id="theme">
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          {theme.charAt(0).toUpperCase() + theme.substring(1)}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                          value={theme}
                          onValueChange={setTheme}>
                          <DropdownMenuRadioItem value="light">
                            Light
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="dark">
                            Dark
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="system">
                            System Default
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
