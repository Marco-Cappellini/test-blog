import express from "express";
const usersRouter = express.Router();
import { addUser, getAllUsers, findUserById, getUserById, isWrong, updateUser, deleteUser, validateEmail, findUserByUsername, getUserByData, validatePassword, validateName, findUserByUsernameUpdate, confrtontPassword, addLiked, removeLiked, checkIfLiked } from "../Services/users.service.js";

//get with no id
usersRouter.get("/", (req, res) => { res.json(getAllUsers()); }); //get all Users

usersRouter.post("/subscribe", (req, res) => {
    if (isWrong(req.body) || !validateEmail(req.body.email) || !validatePassword(req.body.password) || !validateName(req.body.fullName)) {
        return res.status(400).json({ msg: "Your data was not valid for one of the following reasons:\n1) Missing fields {fullName, email, userName, password}.\n2) Email did not follow the email@gmail.com format.\n3) The fullName did not contain only letters.\n4) The password did not contain at least 12 characters, containing at least an uppercase and lowercase letter and a number" });
    }
    if (findUserByUsername(req.body.userName)) {
        return res.status(400).json({ msg: "This userName has already been taken" });
    }
    const { fullName, email, userName, password, role } = req.body;
    addUser(fullName, email, userName, password, role);
    res.json({ msg: "you are now subscribed", user: getUserByData(userName, password).user });
}); //add User

usersRouter.post("/login", (req, res) => {
    if (findUserByUsername(req.body.userName)) {
        const { userName, password } = req.body;
        let data = getUserByData(userName, password)
        res.status(data.status).json({ msg: data.message, user: data.user });

    } else {
        return res.status(400).json({ msg: "User not found" });
    }
}); //find a User

//put
usersRouter.put("/update", async (req, res) => {
    if (confrtontPassword(req.body.oldUserName, req.body.currentPassword)) {
        if (validateEmail(req.body.email) && validatePassword(req.body.password) && validateName(req.body.fullName)) {
            if (findUserByUsernameUpdate(req.body.userName, req.body.oldUserName)) {
                return res.status(400).json({ msg: "This userName has alredy been taken" });
            }
            const updated = updateUser(req.body, req.body.oldUserName);
            const returnUser = {
                id: updated.user.id,
                fullName: updated.user.fullName,
                email: updated.user.email,
                userName: updated.user.userName,
                oldUserName: updated.user.userName,
                role: updated.user.role
            }
            res.json({ msg: updated.message, user: returnUser });
        } else {
            return res.status(400).json({ msg: "Your data was not valid for one of the following reasons:\n1) Email did not follow the email@gmail.com format.\n2) The fullName did not contain only letters.\n3) The password did not contain at least 12 characters, containing at least an uppercase and lowercase letter and a number" });
        }
    } else {
        return res.status(400).json({ msg: "Wrong password" });
    }
}); //update User

usersRouter.put("/managerUpdate", async (req, res) => {
    if (validateEmail(req.body.email) && validatePassword(req.body.password) && validateName(req.body.fullName)) {
        if (findUserByUsernameUpdate(req.body.userName, req.body.oldUserName)) {
            return res.status(400).json({ msg: "This userName has alredy been taken" });
        }
        const updated = updateUser(req.body, req.body.oldUserName);
        const returnUser = {
            id: updated.user.id,
            fullName: updated.user.fullName,
            email: updated.user.email,
            userName: updated.user.userName,
            oldUserName: updated.user.userName
        }
        res.json({ msg: "User updated", user: returnUser });
    } else {
        return res.status(400).json({ msg: "Your data was not valid for one of the following reasons:\n1) Email did not follow the email@gmail.com format.\n2) The fullName did not contain only letters.\n3) The password did not contain at least 12 characters, containing at least an uppercase and lowercase letter and a number" });
    }
}); //update User

//delete
usersRouter.delete("/:id", (req, res) => {
    if (findUserById(req.params.id)) {
        deleteUser(req.params.id);
        res.json({ msg: "user deleated" });
    } else {
        res.status(400).json({ msg: "User not found" });
    }
}); //delete User

usersRouter.post("/like", (req, res) => {
    addLiked(req.body.userId, req.body.postId);
    res.json({ msg: "post liked" })
})

usersRouter.post("/dislike", (req, res) => {
    removeLiked(req.body.userId, req.body.postId);
    res.json({ msg: "post disliked" })
})

usersRouter.post("/checkIfLiked", (req, res) => {
    const status = checkIfLiked(req.body.userId, req.body.postId)
    res.json({state: status, msg: "Checked"})
})

//post
usersRouter.post("/", (req, res) => {
    if (isWrong(req.body) || !validateEmail(req.body.email) || !validatePassword(req.body.password) || !validateName(req.body.fullName)) {
        return res.status(400).json({ msg: "Your data was not valid for one of the following reasons:\n1) Missing fields {fullName, email, userName, password}.\n2) Email did not follow the email@gmail.com format.\n3) The fullName did not contain only letters.\n4) The password did not contain at least 12 characters, containing at least an uppercase and lowercase letter and a number" });
    }
    const { fullName, email, userName, password } = req.body;
    addUser(fullName, email, userName, password);
    res.json(getAllUsers());
}); //add User

//get with id
usersRouter.get("/:id", (req, res) => {
    if (findUserById(req.params.id)) {
        res.json(getUserById(req.params.id));
    } else {
        res.status(400).json({ msg: "User not found" });
    }
}); //get User with given id 

export default usersRouter;