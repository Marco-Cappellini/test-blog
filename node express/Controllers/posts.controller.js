import express from "express";
const postsRouter = express.Router();
import { addPost, changeReplyStatus, getAllLikedByUser, getPostById, getPostsByOwner, getRepliesByOwner, removePost, removeReply, replyToPost, viewPosts } from "../Services/post.service.js";
import { getUserById } from "../Services/users.service.js";

postsRouter.post("/post", (req, res) => {
    const { owner, date, title, content, reply } = req.body;
    addPost(owner, date, title, content, reply);
    res.json({ msg: "You published a new post", post: getPostsByOwner(req.body.owner) });
})

postsRouter.get("/allPosts", (req, res) => {
    res.json(viewPosts());
})

postsRouter.post("/reply/:id", (req, res) => {
    res.json({ msg: "you replied to this post", post: replyToPost(req.params.id, req.body.owner, req.body.date, req.body.content) })
})

postsRouter.post("/getByOwner", (req, res) => {
    res.json({ msg: "Here are all your posts", post: getPostsByOwner(req.body.owner) })
})

postsRouter.get("/postById/:id", (req, res) => {
    res.json({ msg: "Here is the post", post: getPostById(req.params.id) })
})

postsRouter.delete("/deletePost", (req, res) => {
    res.json(removePost(req.body.owner, req.body.id))
})

postsRouter.put("/changeReplyStatus", (req, res) => {
    res.json({ msg: "Reply status changed", posts: changeReplyStatus(req.body.id, req.body.owner) })
})

postsRouter.delete("/deleteReply", (req, res) => {
    res.json(removeReply(req.body.owner, req.body.id, req.body.pageName))
})

postsRouter.get("/getReplyByOwner/:id", (req, res) => {
    const user = getUserById(req.params.id);
    res.json({ msg: "Here are all your replies and their posts", posts: getRepliesByOwner(user.user.userName) })
})

postsRouter.get("/getAllLiked/:id", (req, res)=>{
    res.json({ msg: "Here are all the posts you liked", posts: getAllLikedByUser(req.params.id)})
})

export default postsRouter;