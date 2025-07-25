import mongoose from "mongoose";

const Schema = mongoose.Schema;

const replySchema = new Schema({
    username: String,
    content: String
})

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

export const Post = mongoose.model('Post', postSchema);