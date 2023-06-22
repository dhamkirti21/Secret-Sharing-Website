# Secret Sharing Website

Welcome to the Secret Sharing Website, a platform where users can anonymously share their secrets securely. This project is built using Node.js and MongoDB.

## Features
- **Anonymous Secret Sharing**: Users can share their secrets without revealing their identity.
- **Secure Storage**: Secrets are securely stored in a MongoDB database.
- **User Authentication**: User registration and login functionality for added privacy and security.
- **Encryption**: Secrets are encrypted before being stored in the database, ensuring confidentiality.

## Tech Stack
- **Node.js**: The backend is built using Node.js to handle server-side logic.
- **Express**: Express is used as the web framework for routing and handling HTTP requests.
- **MongoDB**: MongoDB is used as the database for storing secrets and user information.
- **Mongoose**: Mongoose is used as an Object Data Modeling (ODM) library for MongoDB.
- **Passport.js**: Passport.js is used for user authentication and session management.
- **bcrypt**: bcrypt is used for password hashing to ensure secure user authentication.
- **EJS**: EJS (Embedded JavaScript) is used as the templating engine for generating dynamic HTML pages.
- **Bootstrap**: Bootstrap is used for responsive and sleek user interface design.

## Getting Started
To get started with the Secret Sharing Website, follow these steps:

1. Clone the repository: `git clone <repository_url>`
2. Install the dependencies: `npm install`
3. Set up the MongoDB database and configure the connection in `config.js`.
4. Start the server: `npm start`
5. Access the website at `http://localhost:3000`

Feel free to contribute to this project by creating pull requests. Happy secret sharing!

## License
This project is licensed under the [MIT License](LICENSE).
