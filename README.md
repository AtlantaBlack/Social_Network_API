# Social Network API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

Social Network API is a RESTful API built using Express.js, MongoDB, and Mongoose, which allows CRUD operations on users, thoughts, and reactions (comments) for a social media application.

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Demo](#demo)
5. [Screenshots](#screenshots)
6. [License](#license)
7. [Resources](#resources)
8. [Contact](#contact)

## Technologies Used

This application uses the following technologies:

- JavaScript
- [Node.js](https://nodejs.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/docs/manual/?_ga=2.42458085.1730790684.1656485442-1134542769.1653952537)
- [Mongoose](https://mongoosejs.com/docs/)
- [nodemon](https://www.npmjs.com/package/nodemon)

## Installation

Social Network API is a Back End application that will require users to have first installed [MongoDB](https://www.mongodb.com/docs/manual/?_ga=2.42458085.1730790684.1656485442-1134542769.1653952537) and [Node.js](https://nodejs.dev/), plus a REST API client such as [Insomnia](https://insomnia.rest/), on their local machine.

After cloning or downloading Social Network API, open the folder using Terminal (or CLI of your choice) and install the necessary packages by running this command in the root directory:

```
npm i
```

## Usage

To start the server, run the following command in the root directory of the application folder:

```
npm start
```

Open your REST API client of choice, such as Insomnia or Postman, to continue using the application. On a free port, you will be able to find, create, update, and delete users, thoughts, and/or reactions.

## Demo

**[Video walkthrough of Social Network API using Insomnia](https://drive.google.com/file/d/1kgHdAt6LKGK6whfe6tl07bP4oFDSdfty/view)**

[Link to video showing package installation and server start of Social Network API](https://drive.google.com/file/d/1ZbuSBDjUfBXL9-2Zrwe2Tz3rPvivCPgN/view)

GIF below: Package installation and starting the Social Network API server using VS Code's Integrated Terminal:

![Screenshot of Social Network API: Starting the server in VS Code](assets/images/demo-start-snapi.gif?raw=true "Screenshot of Social Network API: Starting the server in VS Code")

## Screenshots

Social Network API: View all users:

![Screenshot of Social Network API: View all users](assets/images/screenshot-view-all-users.jpg?raw=true "Screenshot of Social Network API: View all users")

---

Social Network API: Create a user:

![Screenshot of Social Network API: Create new user](assets/images/screenshot-create-user.jpg?raw=true "Screenshot of Social Network API: Create new user")

---

Social Network API: Add a friend:

![Screenshot of Social Network API: Add a friend](assets/images/screenshot-add-friend.jpg?raw=true "Screenshot of Social Network API: Add a friend")

---

Social Network API: View all thoughts:

![Screenshot of Social Network API: View all thoughts](assets/images/screenshot-view-all-thoughts.jpg?raw=true "Screenshot of Social Network API: View all thoughts")

---

Social Network API: Add a reaction:

![Screenshot of Social Network API: Add a reaction](assets/images/screenshot-add-reaction.jpg?raw=true "Screenshot of Social Network API: Add a reaction")

---

## License

© 2022 Sushan Yue

This project is licensed under the [MIT License](./LICENSE.txt).

## Resources

- [Mongoose $in operator](https://kb.objectrocket.com/mongo-db/the-mongoose-in-operator-1015)
- [Mongoose async validation](https://stackoverflow.com/questions/47730759/mongoose-async-validation)
- [Mongoose static vs instance methods](https://stackoverflow.com/questions/29664499/mongoose-static-methods-vs-instance-methods#:~:text=Static%20methods%20apply%20to%20the,instance%20method%20returns%20the%20document.)
- [MongoDB: add new fields to existing documents](https://stackoverflow.com/questions/44685716/how-to-add-new-fields-to-existing-document)

## Contact

[Sushan Yue @ GitHub](https://github.com/AtlantaBlack)

[Email me!](mailto:syue.dev@gmail.com)
