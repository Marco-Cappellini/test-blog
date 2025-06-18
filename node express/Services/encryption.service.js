import { pbkdf2Sync } from "node:crypto";

export function hashPassword(password) {
    return pbkdf2Sync(password, process.env.SALT, 100_000, 64, 'sha512').toString('hex');
}