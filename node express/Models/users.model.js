import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../Services/encryption.service.js";

export class User {

    id;
    fullName;
    email;
    userName;
    password;
    role;
    liked;

    constructor(fullName, email, userName, password, role) {
        this.id = uuidv4();
        this.fullName = fullName;
        this.email = email;
        this.userName = userName;
        this.password = password;
        this.role = role;
        this.liked = [];
    }

    checkPassword(password) {
        return this.password === hashPassword(password, process.env.SALT);
    }

}