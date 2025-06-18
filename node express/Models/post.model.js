import { v4 as uuidv4 } from "uuid";
export class Post {
    id;
    owner;
    date;
    title;
    content;
    reply;
    likes;
    
    constructor(owner, date, title, content, reply) {
        this.id = uuidv4();
        this.owner = owner;
        this.date = date;
        this.title = title;
        this.content = content;
        this.reply = Array.isArray(reply) ? reply : [];
        this.likes = 0;
    }

}