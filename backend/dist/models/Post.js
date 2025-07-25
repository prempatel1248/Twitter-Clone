"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const replySchema = new Schema({
    username: String,
    content: String
});
const postSchema = new Schema({
    id: String,
    username: String,
    firstname: String,
    lastname: String,
    content: String,
    repost: String,
    reply: [replySchema],
    likes: [String],
    date: String,
    editedAt: String
});
exports.Post = mongoose_1.default.model('Post', postSchema);
