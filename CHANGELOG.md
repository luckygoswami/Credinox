# Changelog

All notable changes to this project will be documented in this file.

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
