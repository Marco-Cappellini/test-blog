import express from "express";
import usersRouter from "./Controllers/users.controller.js";
import postsRouter from "./Controllers/posts.controller.js";
import { initializeUsers } from "./Services/users.service.js";
import dotenv from "dotenv";
import cors from 'cors';
import { initializePosts } from "./Services/post.service.js";

const app = express();

// Use CORS middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);

dotenv.config();
app.listen(process.env.PORT, () => console.log("Server started"));

initializeUsers()
    .then(() => {
        console.log("Users initialized!");
    })
    .catch((error) => {
        console.error(error);
    });

    initializePosts()
    .then(() => {
        console.log("Posts initialized!");
    })
    .catch((error) => {
        console.error(error);
    });