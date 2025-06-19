import { Post } from "../Models/post.model.js";
import { Reply } from "../Models/reply.model.js";
import { readFile, writeFile } from "node:fs/promises";
import { getUserById } from "./users.service.js";


let posts = [];

export async function initializePosts() {

    // Define path to the JSON file
    const filePath = new URL(process.env.POSTS_DB_FILE_PATH, import.meta.url);

    // Load data from the file to the array
    try {
        const data = await readFile(filePath, { encoding: 'utf-8' });
        posts = JSON.parse(data); // makes JSON data compatible with the array
    } catch (error) {
        console.log(error);
        posts = [];
    }
}

// Save current users array to the JSON file
function updatePostsJson() {

    // Define path to the JSON file
    const filePath = new URL(process.env.POSTS_DB_FILE_PATH, import.meta.url);

    writeFile(filePath, JSON.stringify(posts, null, "\t"))
        .then(() => {
            console.log("File updated.")
        })
        .catch((error) => {
            console.error(error)
        });
}

export function addPost(owner, date, title, content) {
    const post = new Post(owner, date, title, content, null);
    posts.unshift(post);
    updatePostsJson()
}

export function viewPosts() {
    return posts;
}

export function replyToPost(id, owner, date, content) {
    for (let post of posts) {
        if (post.id.toString() === id) {
            if (post.reply)
                post.reply.unshift(new Reply(owner, date, content));
            else
                post.reply = [new Reply(owner, date, content)];
            updatePostsJson()
            return post;
        }
    }
}

export function getPostsByOwner(owner) {
    return posts.filter(post => post.owner === owner)
}

export function getPostById(id) {
    return posts.find(post => post.id === id);
}

export function removeOwner(owner) {
    for (let post of posts) {
        if (post.owner.toString() === owner) {
            post.owner = "deleted account";
        }
    }
    updatePostsJson();
}

export function removePost(owner, id) {
    const postToRemove = posts.find(post => post.id === id);
    if (postToRemove.owner === owner) {
        const index = posts.findIndex(post => post.id.toString() === id);
        if (index !== -1) {
            posts.splice(index, 1);
            updatePostsJson();
            return { msg: "post removed", posts: getPostsByOwner(owner) }
        }
    } else return { msg: "only the owner can remove this post", posts: getPostsByOwner(owner) }
}

export function changeReplyStatus(id, owner) {
    for (let post of posts) {
        if (post.owner === owner) {
            for (let reply of post.reply) {
                if (reply.id === id) {
                    reply.isHidden = !reply.isHidden;
                    updatePostsJson();
                    return getPostsByOwner(owner)
                }
            }
        }
    }
}

export function removeReply(owner, id, pageName) {
    for (let post of posts) {
        if (Array.isArray(post.reply)) {
            const replyIndex = post.reply.findIndex(reply => reply.id === id);

            if (replyIndex !== -1) {
                const reply = post.reply[replyIndex];

                if (reply.owner === owner) {
                    post.reply.splice(replyIndex, 1);
                    updatePostsJson();
                    if (pageName === "userPage") {
                        return {
                            msg: "Reply removed successfully",
                            posts: getPostsByOwner(owner)
                        };
                    } else if (pageName === "repliesHistory") {
                        return {
                            msg: "Reply removed successfully",
                            posts: getRepliesByOwner(owner)
                        };
                    }
                    else {
                        return {
                            msg: "Reply removed successfully",
                            posts: viewPosts()
                        };
                    }
                } else {
                    if (pageName == "userPage") {
                        return {
                            msg: "Only the owner can remove this reply",
                            posts: getPostsByOwner(owner)
                        };
                    } else {
                        return {
                            msg: "Only the owner can remove this reply",
                            posts: viewPosts()
                        };
                    }
                }
            }
        }
    }
    return {
        msg: "Reply not found",
        posts: getPostsByOwner(owner)
    };
}

export function getRepliesByOwner(owner) {
    let returnPosts = []
    let created = false
    let newPost
    for (let post of posts) {
        for (let reply of post.reply) {
            if (reply.owner === owner) {
                if (!created) {
                    newPost = { ...post };
                    newPost.reply = [];
                    created = true;
                }
                newPost.reply.unshift(reply);
            }
        }
        if (created) {
            returnPosts.unshift(newPost);
            created = false;
        }
    }
    return returnPosts
}

export function getReplyById(id) {
    for (let post of posts) {
        const reply = post.reply.find(reply => reply.id === id);
        if (reply) return reply;
    }
    return null;
}

export function addLikeToPost(id) {
    let post = posts.find(post => post.id === id)
    post.likes++;
    updatePostsJson();
}

export function addLikeToReply(id) {
    for (let post of posts) {
        const reply = post.reply.find(reply => reply.id === id);
        if (reply) {
            reply.likes++;
            updatePostsJson();
            break;
        }
    }
}

export function removeLikeFromPost(id) {
    const post = posts.find(p => p.id === id); //posts[id]
    if (post && post.likes > 0) {
        post.likes--;
        updatePostsJson();
    }
}

export function removeLikeFromReply(id) {
    for (let post of posts) {
        const reply = post.reply.find(r => r.id === id);
        if (reply && reply.likes > 0) {
            reply.likes--;
            updatePostsJson();
            break;
        }
    }
}

export function getAllLikedByUser(userId) {
    const user = getUserById(userId).user
    let likedReplies = []
    let likedRepliesTemp = []
    for (let post of posts) {
        likedRepliesTemp = post.reply.filter(reply => user.liked.includes(reply.id));
        likedReplies = likedReplies.concat(likedRepliesTemp);

    }
    const likedPost = posts.filter(post => user.liked.includes(post.id));
    const allLiked = likedPost.concat(likedReplies.map((reply) => ({ ...reply, title: "Reply" })))
    if (allLiked.length > 0) {
        return allLiked;
    }

    return null;
}
