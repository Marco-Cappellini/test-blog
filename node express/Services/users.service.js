import { User } from "../Models/users.model.js";
let users = [];

import { hashPassword } from "./encryption.service.js";

import { readFile, writeFile } from "node:fs/promises";
import { addLikeToPost, addLikeToReply, getPostById, getReplyById, removeLikeFromPost, removeLikeFromReply, removeOwner } from "./post.service.js";

export async function initializeUsers() {

    // Define path to the JSON file
    const filePath = new URL(process.env.USERS_DB_FILE_PATH, import.meta.url);

    // Load data from the file to the array
    try {
        const data = await readFile(filePath, { encoding: 'utf-8' });
        users = JSON.parse(data); // makes JSON data compatible with the array
    } catch (error) {
        console.log(error);
        users = [];
    }
}

// Save current users array to the JSON file
function updateJson() {

    // Define path to the JSON file
    const filePath = new URL(process.env.USERS_DB_FILE_PATH, import.meta.url);

    writeFile(filePath, JSON.stringify(users, null, "\t"))
        .then(() => {
            console.log("File updated.")
        })
        .catch((error) => {
            console.error(error)
        });
}

// Return all users
export function getAllUsers() {
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
}

// Return the matching the given ID
export function getUserById(id) {
    const user = users.find(user => user.id.toString() === id)
    const dynamicKey = "password";
    let { [dynamicKey]: _, ...userWithoutPassword } = user;
    return { status: 200, user: userWithoutPassword, message: "User data accessed" };;
}

// Add a new user and update the file
export async function addUser(fullName, email, userName, password, role) {

    const hashedPassword = hashPassword(password);

    users.push(new User(fullName, email, userName, hashedPassword, role));
    updateJson();
}

//ESEMPIO IN CommonJS di addUser
// module.exports.addUser = (fullName, email) => {
//     users.push(new User(fullName, email));
// }

// Update a user and save changes to file
export function updateUser(updateUser, userName) {
    for (let user of users) {
        if (user.userName.toString() === userName) {
            user.fullName = updateUser.fullName ?? user.fullName;
            user.email = updateUser.email ?? user.email;
            user.userName = updateUser.userName ?? user.userName;
            user.password = updateUser.password ? hashPassword(updateUser.password, process.env.SALT) : user.password;
            updateJson();
            const { password: _password, ...userWithoutPassword } = user;
            return { user: userWithoutPassword, message: "User updated" };
        }
    }
    return null;
}

// Delete a user by ID and update the file
export function deleteUser(id) {
    const userToRemove = users.find(user => user.id.toString() === id);
    removeOwner(userToRemove.userName);
    const index = users.findIndex(user => user.id.toString() === id);
    if (index !== -1) {
        users.splice(index, 1);
    }
    updateJson();
}

export function getUserByData(userName, password) {
    const user = users.find(user => user.userName === userName && hashPassword(password) === user.password);
    if (!user) {
        return { status: 400, user: user, message: "Failed login" }
    } else {
        const dynamicKey = "password";
        let { [dynamicKey]: _, ...userWithoutPassword } = user;
        return { status: 200, user: userWithoutPassword, message: "Successfull login" };
    }
}

// Check if the request body is missing required fields
export function isWrong(body) {
    return (!body.fullName || !body.email || !body.password || !body.userName);
}

// Check if a user with the given ID exists
export function findUserById(id) {
    return users.some(user => user.id.toString() === id);
}

export function findUserByUsernameUpdate(userName, oldUserName) {
    if (oldUserName === userName) {
        return false;
    }
    let saveId
    for (let user of users) {
        if (user.userName.toString() === oldUserName) {
            saveId = user.id;
            user.userName = userName;
        }
    }
    let howMany = users.filter(user => user.userName == userName).length;
    for (let user of users) {
        if (user.id.toString() === saveId) {
            user.userName = oldUserName;
        }
    }
    if (howMany > 1) {
        return true;
    } else {
        return false;
    }
}

export function addLiked(userId, postId) {
    let user = getUserById(userId).user;
    const post = getPostById(postId);
    if (post) {
        user.liked.unshift(post.id);
        addLikeToPost(postId);
    }

    const reply = getReplyById(postId);
    if (reply) {
        user.liked.unshift(reply.id);
        addLikeToReply(postId);
    }
    updateJson();
}

export function removeLiked(userId, postId) {
    let user = getUserById(userId).user;

    const index = user.liked.findIndex(item => item === postId);
    if (index !== -1) {
        const item = user.liked[index];

        const post = getPostById(postId);
        if (post) {
            removeLikeFromPost(postId);
        }
        const reply = getReplyById(postId);
        if (reply) {
            removeLikeFromReply(postId);
        }

        user.liked.splice(index, 1);
        updateJson();
    }
}
export function checkIfLiked(userId, postId) {
    const user = getUserById(userId).user;
    if (!user || !user.liked) return false;
    return user.liked.some(liked => liked === postId);
}

export function findUserByUsername(userName) {
    return users.some(user => user.userName.toString() === userName);
}

export function findUserByData(userName, password) {
    return users.some(user => user.userName === userName && hashPassword(password) === user.password);
}

export function validateName(fullName) {
    const nameRegex = /^[A-Za-z\s]+$/i;
    return nameRegex.test(fullName);
}

export function confrtontPassword(userName, currentPassword) {
    let user = users.find(user => user.userName == userName);
    if (user.password == hashPassword(currentPassword))
        return true;
    else
        return false;
}

export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export function validatePassword(password) {
    const passwordRegex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;
    return passwordRegex.test(password);
}