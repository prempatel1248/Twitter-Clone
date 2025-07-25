"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const notificationSchema = new Schema({
    username: String,
    interaction: String,
    postId: String
});
const chatSchema = new Schema({
    chatId: String,
    who: String,
    message: String,
    date: String,
    EditedAt: String,
});
const allChatSchema = new Schema({
    username: String,
    chat: [chatSchema]
});
const userSchema = new Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    following: {
        type: [String],
        default: []
    },
    followers: {
        type: [String],
        default: []
    },
    likes: {
        type: [String],
        default: []
    },
    lightTheme: {
        type: Boolean,
        default: false
    },
    public: {
        type: Boolean,
        default: true
    },
    followRequestIn: {
        type: [String],
        default: []
    },
    followRequestOut: {
        type: [String],
        default: []
    },
    notification: {
        type: [String],
        default: []
    },
    dmFromAnyone: {
        type: Boolean,
        default: true
    },
    chats: {
        type: [allChatSchema],
        default: []
    },
});
exports.User = mongoose_1.default.model('User', userSchema);
