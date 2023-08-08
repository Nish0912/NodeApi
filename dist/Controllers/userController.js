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
exports.authenticateToken = exports.login = exports.updateUser = exports.deleteUser = exports.getSingleUser = exports.getUsers = exports.userpost = void 0;
// import * as moment from 'moment'
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usersSchema_1 = __importDefault(require("../models/usersSchema"));
const userpost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, user_id, Password, email, User_name, Gender, Mobile_Number, Profile } = req.body;
    if (!name || !user_id || !Password || !email || !User_name || !Gender || !Mobile_Number || !Profile) {
        res.status(400).json({ error: "All fields are mandatory" });
        return;
    }
    try {
        const preuser = yield usersSchema_1.default.findOne({ email: email });
        if (preuser) {
            res.status(400).json({ error: "This user already exists in our database" });
        }
        else {
            //const dateCreate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
            const dateCreate = new Date();
            const hashedPassword = yield bcrypt_1.default.hash(Password, 10);
            const userData = new usersSchema_1.default({
                name, user_id, Password: hashedPassword, email, User_name, Gender, Mobile_Number, Profile, datecreated: dateCreate
            });
            yield userData.save();
            res.status(200).json(userData);
        }
    }
    catch (error) {
        res.status(400).json(error);
        console.log("catch block error");
    }
});
exports.userpost = userpost;
//get all users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query.search || "";
    const Gender = req.query.Gender || "";
    const sort = req.query.sort || "";
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = req.query.items || "3";
    const query = {
        name: { $regex: search, $options: "i" }
    };
    try {
        const skip = (parseInt(page.toString()) - 1) * parseInt(ITEM_PER_PAGE.toString());
        const count = yield usersSchema_1.default.countDocuments(query);
        const usersData = yield usersSchema_1.default.find(query)
            .sort({ datecreated: sort == "new" ? -1 : 1 })
            .limit(parseInt(ITEM_PER_PAGE.toString()))
            .skip(skip);
        const pageCount = Math.ceil(count / parseInt(ITEM_PER_PAGE.toString()));
        res.status(200).json({
            pagination: {
                count: pageCount
            },
            usersData
        });
    }
    catch (error) {
        res.status(400).json(error);
        console.log("catch block error");
    }
});
exports.getUsers = getUsers;
//get single user
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const singleUserData = yield usersSchema_1.default.findOne({ _id: id });
        res.status(200).json(singleUserData);
    }
    catch (error) {
        res.status(400).json(error);
        console.log("catch block error");
    }
});
exports.getSingleUser = getSingleUser;
//delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleteUserData = yield usersSchema_1.default.findByIdAndDelete({ _id: id });
        res.status(200).json(deleteUserData);
    }
    catch (error) {
        res.status(400).json(error);
        console.log("catch block error");
    }
});
exports.deleteUser = deleteUser;
//update user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, user_id, Password, email, User_name, Gender, Mobile_Number, Profile } = req.body;
    try {
        //const dateUpdate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
        const dateUpdate = new Date();
        const updateUserData = yield usersSchema_1.default.findByIdAndUpdate({ _id: id }, {
            name, user_id, Password, email, User_name, Gender, Mobile_Number, Profile, dateupdated: dateUpdate
        }, { new: true });
        yield (updateUserData === null || updateUserData === void 0 ? void 0 : updateUserData.save());
        res.status(200).json(updateUserData);
    }
    catch (error) {
        res.status(400).json(error);
        console.log("catch block error");
    }
});
exports.updateUser = updateUser;
//login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, Password } = req.body;
    if (!email || !Password) {
        return res.status(400).json({ error: "All fields are mandatory" });
    }
    try {
        const user = yield usersSchema_1.default.findOne({ email: email });
        if (!user) {
            throw new Error('Invalid username or password');
        }
        // Compare the password
        const isPasswordValid = yield bcrypt_1.default.compare(Password, user.Password);
        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.jwtSecret, {
            expiresIn: process.env.jwtExpiresIn,
        });
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred:", error.message);
        }
        else {
            console.error("An unknown error occurred:", error);
        }
    }
});
exports.login = login;
//authenticate
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }
    const jwtSecret = process.env.jwtSecret;
    jsonwebtoken_1.default.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.userId = user.userId;
        next();
    });
};
exports.authenticateToken = authenticateToken;
