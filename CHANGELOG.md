# Changelog

All notable changes to this project will be documented in this file.

## [4.16.0] - 2025-02-17

### Added

- Import data button.
- Share button for individual credential.
- Export data button.
- Toggle button for enabling/disabling Google sign-in.
- Dropdown hamburger menu in the dashboard for more options.
- Add password presets and improve password generation logic.
- Verify email before sign-in.

### Changed

- Optimize share and delete confirmation dialogs for dark mode.
- Change `AlertDialogAction` styling for the delete button.
- Hide export data button when no credentials are saved.
- Change delete confirmation prompt to `shadcn/alert-dialog`.
- Update dark mode classes in the "More Options" hamburger.
- Add hash key in exported data.

### Fixed

- Password input not showing in the password generator after login.

## [4.15.0] - 2025-02-03

### Added

- Sign-in with Google option.
- Forgot password option.

### Changed

- Optimize auth page for dark theme.
- Redesign auth page with `shadcn-ui`.
- Add `shadcn-ui` component library.
- Change sign-in and demo login button colors.

## [4.14.0] - 2025-01-28

### Added

- Add demo account login button.
- Add shortcut to focus search box by pressing `/`.
- Increase session time limit for development environment.

### Changed

- Configure `Changelog.md`.

### Fixed

- Fix session timeout not working.
- Fix div not expanding for long service names or users.
- Fix uncleared edit fields after relogin.
- Fix scroll-to-top bug.

## [4.13.0] - 2024-11-17

### Added

- Scroll to top on clicking the edit button.

### Changed

- Change info toasts to `toast.info`.
- Show current version on hovering over "Credinox" in the footer.

### Fixed

- Errors due to `ToastContainer` conflicts.

## [4.11.0] - 2024-11-16

## Added

- System default option in theme.

## Changed

- Replaced alerts with toast alerts using react-toastify.
- Customize scrollbar.
- Optimize scrollbar for light and dark theme.
- Build in separate chunks for optimization.
- Use `useCallback` for memoization of fetch functions.

## Fixed

- Fix layout of new fields for mobile devices.

## [4.8.0] - 2024-10-24

## Added

- Search credentials by service name or user.

## Changed

- Moved credentials list code to a separate CredentialsList component for better modularity and maintainability.

## [4.7.0] - 2024-10-24

## Added

- Theme mode support.
- 'add field' option in edit credentials.
- Edit credentials functionality.
- Copy button for every credential.
- Delete credential operations.

## Changed

- Change dashboard's inline styles to Tailwind CSS.
- Set focus property for fields.
- Minor code changes for optimization.

## Fixed

- Input validation and meta information added

## [4.0.0] - 2024-10-17

## Added

- Feature: Organise credential with multiple fields.
- Enter key to proceed.
- Copy password feature.
- Edit credentials feature.
- Delete feature.

## Changed

- Manage .env for production and development.

## Fixed

- Remove tab focus from password visibility button.
- Remove selection animation.

## [3.6.3] - 2024-09-19

## Added

- Firebase configs to .env
- Icon for the app.

## Changed

- Change name and database to Credinox.
- Match header with app theme.

## Fixed

- Fix deployment error.

## [3.4.2] - 2024-09-17

### Added

- Alert on errors.

### Fixed

- Password generator UI.

## [3.4.0] - 2024-09-16

### Added

- Responsiveness for small screens.
- Session timeout.
- Uppercase and Lowercase includes in Password generator.
- Clear last user credentials from UI.

### Changed

- Default checks in Password generator.
- Replace password keyword with credential.

## [3.0.0] - 2024-09-15

### Added

- Random Password generator.
- Password visibility toggler.
- Current user details on Dashboard.

### Changed

- Footer.

### Fixed

- Signin/Signup form UI.

## [2.0.1] - 2024-09-12

### Changed

- Application UI.

## [1.2.0] - 2024-09-12

### Added

- Initial release.
