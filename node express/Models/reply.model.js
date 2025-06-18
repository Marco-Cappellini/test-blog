import { v4 as uuidv4 } from "uuid";
export class Reply {
    id;
    owner;
    date;
    content;
    isHidden;
    likes;

    constructor(owner, date, content) {
        this.id = uuidv4();
        this.owner = owner;
        this.date = date;
        this.content = content;
        this.isHidden = false;
        this.likes = 0;
    }
}