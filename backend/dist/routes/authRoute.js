"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const router = express_1.default.Router();
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let errors = [];
    if (!req.body.username || req.body.username === '') {
        errors.push({ field: 'username', message: 'Username is required' });
    }
    if (!req.body.password || req.body.password === '') {
        errors.push({ field: 'password', message: 'Password is required' });
    }
    if (!req.body.firstName || req.body.firstName === '') {
        errors.push({ field: 'firstName', message: 'Firstname is required' });
    }
    if (!req.body.lastName || req.body.lastName === '') {
        errors.push({ field: 'lastName', message: 'Lastname is required' });
    }
    if (errors.length > 0) {
        console.log(errors);
        res.status(400).json({ errors: errors });
        return;
    }
    try {
        const existingUser = yield User_1.User.findOne({ username: req.body.username });
        if (existingUser) {
            res.status(409).json({ message: 'Username already exists' });
            return;
        }
        const user = new User_1.User({
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        });
        yield user.save();
        res.status(201).send('User created successfully');
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
}));
module.exports = router;
