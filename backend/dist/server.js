"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connectDB_1 = require("./connectDB");
const cors = require('cors');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
(0, connectDB_1.connectDB)();
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
