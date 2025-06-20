import express from "express";
import usersRouter from "./Controllers/users.controller.js";
import postsRouter from "./Controllers/posts.controller.js";
import { initializeUsers } from "./Services/users.service.js";
import dotenv from "dotenv";
import cors from 'cors';
import { initializePosts } from "./Services/post.service.js";
import path from 'node:path';
import morgan from "morgan";

const app = express();

const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
        stream: {
            // Configure Morgan to use our custom logger with the http severity
            write: (message) => console.warn(message.trim()),
        },
    }
);

app.use(morganMiddleware);

// Use CORS middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);

app.use(express.static(path.join(process.cwd(), "webpage")));

app.get(/(.*)/, function (req, res) {
    res.sendFile(path.join(process.cwd(), "webpage", "index.html"));
});

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