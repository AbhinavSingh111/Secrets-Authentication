# User Authentication App Documentation For App.js (encryption,salting,hashing)

This documentation provides details about a user authentication app built with Node.js, Express, and MongoDB. The app includes features for user registration, login, and encrypted password storage.

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Folder Structure](#folder-structure)
6. [Environment Variables](#environment-variables)
7. [License](#license)

## Introduction

The user authentication app is built using Node.js and Express for the server, MongoDB for the database, and various npm packages for additional functionalities such as password hashing, encryption, and session management.

## Prerequisites

Before running the application, ensure that you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following variable:
    ```
    SECRET=your-secret-key
    ```
    Replace `your-secret-key` with your own secret key.

4. Run MongoDB:
    ```bash
    mongod
    ```

5. Start the application:
    ```bash
    npm start
    ```

## Usage

- Access the app at `http://localhost:3000`.

- The app includes routes for user registration, login, and a home page.

- Passwords are securely hashed using bcrypt and stored in MongoDB.

## Folder Structure

- `/public`: Static files (CSS, images, etc.)
- `/views`: EJS templates for rendering HTML pages.
- `/routes`: Express route handlers.
- `/models`: MongoDB schema models.
- `/config`: Passport configuration for local and Google strategies.

## Environment Variables

- `SECRET`: Secret key for encrypting user data.

## License

This project is licensed under the [MIT License](LICENSE).


# User Authentication App Documentation for index.js (oauth using google)

This documentation provides a detailed overview of a user authentication app built with Node.js, Express, and MongoDB. The application incorporates various authentication strategies, including local authentication with a username and password and Google OAuth 2.0.

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Folder Structure](#folder-structure)
6. [Environment Variables](#environment-variables)
7. [Authentication Strategies](#authentication-strategies)
    - [Local Authentication](#local-authentication)
    - [Google OAuth 2.0 Authentication](#google-oauth-20-authentication)
8. [Routes](#routes)
9. [License](#license)

## Introduction

The user authentication app provides a secure authentication system using Node.js, Express, and MongoDB. It supports local authentication for traditional username and password login and integrates Google OAuth 2.0 for a seamless login experience.

## Prerequisites

Before running the application, ensure that you have the following installed on your system:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Installation

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create a `.env` file:**

    Create a file named `.env` in the root directory and add the following variables:

    ```env
    SECRET=your-secret-key
    CLIENT_ID=your-google-client-id
    CLIENT_SECRET=your-google-client-secret
    ```

    Replace `your-secret-key`, `your-google-client-id`, and `your-google-client-secret` with your actual values.

4. **Run MongoDB:**

    Ensure that MongoDB is running on your machine:

    ```bash
    mongod
    ```

5. **Start the application:**

    ```bash
    npm start
    ```

6. **Access the app:**

    Visit [http://localhost:3000](http://localhost:3000) to interact with the application.

## Usage

The application provides several routes for user interaction, including registration, login, accessing secrets, and more.

## Folder Structure

- `/public`: Contains static files (CSS, images, etc.).
- `/views`: Includes EJS templates for rendering HTML pages.
- `/routes`: Holds Express route handlers.
- `/models`: Defines MongoDB schema models.
- `/config`: Manages Passport configuration for local and Google strategies.

## Environment Variables
  setup app/project in google developer console->consent screen-> credentials-> callback url

- **`SECRET`**: Secret key for encrypting user data.
- **`CLIENT_ID`** and **`CLIENT_SECRET`**: Google OAuth 2.0 credentials.

## Authentication Strategies

### Local Authentication

- Utilizes Passport.js and `passport-local-mongoose` for secure local authentication.
- Passwords are hashed and salted to enhance security.

### Google OAuth 2.0 Authentication

- Implements Google OAuth 2.0 authentication using the `passport-google-oauth20` strategy.
- Fetches user profiles from Google and stores them in the MongoDB database.

## Routes

- **`/`**: Home page.
- **`/login`**: Login page.
- **`/register`**: Registration page.
- **`/secrets`**: Page displaying secrets (requires authentication).
- **`/submit`**: Page for submitting secrets (requires authentication).
- **`/auth/google`**: Initiates Google OAuth 2.0 authentication.
- **`/auth/google/secrets`**: Callback route for Google OAuth 2.0 authentication.
- **`/logout`**: Logs out the user.

## License

This project is licensed under the [MIT License](LICENSE).

