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
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find();
        res.json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
}));
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.User.deleteMany(); // wipe existing
        yield User_1.User.insertMany(req.body); // insert new users
        res.status(200).send('Users updated');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
module.exports = router;
