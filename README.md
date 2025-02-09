# Credinox: Your Credentials Manager

**Credinox** is a secure and user-friendly credential management application designed to help users store, manage, and organize their credentials (e.g., passwords, usernames, and other sensitive information). It includes features like authentication, credential editing, password generation, and theme customization, all built with modern tools like **React**, **Tailwind CSS**, and **shadcn-ui**.

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Authentication**:
  - Sign in with Google.
  - Email verification before sign-in.
  - Forgot password option.
  - Demo account login for quick testing.
- **Credential Management**:
  - Add, edit, and delete credentials.
  - Add custom fields to credentials.
  - Copy credentials (username, password, etc.) with a single click.
  - Search credentials by service name or username.
- **Password Generator**:
  - Generate secure passwords with customizable options (uppercase, lowercase, numbers, etc.).
- **User Experience**:
  - Light and dark theme support.
  - Responsive design for all screen sizes.
  - Session timeout for security.
  - Toast notifications for alerts and info.
  - Optimized scrollbar and UI for better usability.
- **Developer-Friendly**:
  - Environment configuration for production and development.
  - Code optimization and memoization.
  - Built-in changelog for version tracking.

## Usage

Visit the live application: [Credinox](https://credinox.web.app)

### Authentication

- Use the **Sign in with Google** option for quick access.
- Forgot your password? Use the **Forgot Password** feature to reset it.
- Test the app without creating an account by using the **Demo Account Login**.

### Credential Management

- Add new credentials with custom fields.
- Edit or delete existing credentials.
- Use the search bar (press `/` to focus) to find credentials by service name or username.

### Password Generator

- Generate secure passwords with customizable options.
- Copy passwords directly to your clipboard.

### Themes

- Switch between light and dark themes for a personalized experience.

## Screenshots

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/luckygoswami/assets/blob/main/Credinox/Credinox-darkmode.png?raw=true">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/luckygoswami/assets/blob/main/Credinox/Credinox-lightmode.png?raw=true">
  <img alt="Dashboard Screenshot">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/luckygoswami/assets/blob/main/Credinox/Credinox-darkmode_login.png?raw=true">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/luckygoswami/assets/blob/main/Credinox/Credinox-lightmode_login.png?raw=true">
  <img alt="Credential Management Screenshot">
</picture>

## Technologies Used

- **Frontend**: React, Tailwind CSS, Shadcn
- **Backend**: Firebase (Firestore, Authentication)
- **State Management**: React Context API
- **Deployment**: Firebase Hosting

## Changelog

For a detailed list of changes, check out the [CHANGELOG.md](CHANGELOG.md) file.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests to enhance the functionality of Credinox.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

If you have any questions or suggestions, feel free to open an issue on GitHub or contact me directly via [GitHub Issues](https://github.com/goswamilucky/credinox/issues).

---

_Made with 🧠 by LuckyGoswami_
