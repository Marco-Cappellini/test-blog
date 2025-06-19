# test-blog
Simple blog platform with React, Node.js, and Material-UI. Manage posts, replies, likes, and dark mode. Built during a PCTO work experience.

# Features 
* Creation of accounts saved on the server's json file
* Role-based access control: managers can edit any account
* Creation of posts and replies all saved in the server's json
* A like system, keeping track of likes on posts making you able to access your liked history
* Pages to view all personal posts and reply history
* Dark mode toggle

# Prerequisites

Before running the project, make sure you have:

- [Node.js](https://nodejs.org/) version 18 or higher installed.
- npm (comes with Node.js).
- Git for cloning the repository.

## Setup

1. Clone this repo:
   ```bash
   git clone https://github.com/Marco-Cappellini/test-blog.git
   cd test-blog
2. Move to the node section:
    ```bash
    cd node express
3. Run this code to install the dependencies:
   ```bash
   npm install
4. Setup environment variables:
   Copy the example environment file to create your own `.env` file:

    ```bash
    cp .env.example .env
    ````

    On Windows Command Prompt, use:

    ```cmd
    copy .env.example .env
5. Start the server:
   ```bash
   node index.js
6. Move back to the project and open the react section
   ```bash
   cd ../users-frontend
   cd users-frontend
7. Run the same code as before to install the dependencies:
   ```bash
   npm install
8. Start the React frontend with Vite:   
    ```bash
    npm run dev
# Demo
### This is how the program should look like after you started it and clicked on the login button (bottom of the first page)
<div>
<img src="images_for_github/blog-introduction.gif" alt="Blog demo gif" width="1000" style="display: block; margin-left: 0;"/>


**Login credentials for demo account:**

* *Username:* TestManager1
* *Password:* Password123123

⚠ If you sign up as an employee, you won’t have access to the "Edit All Accounts" page. ⚠

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
