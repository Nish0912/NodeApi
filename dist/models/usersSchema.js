"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const usersSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: Number,
        required: true,
    },
    Password: {
        type: String,
        minlength: 8,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw Error("Not Valid Email");
            }
        }
    },
    User_name: {
        type: String,
        required: true,
    },
    Gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },
    Mobile_Number: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    Profile: {
        type: String,
        enum: ["public", "private"],
        required: true
    },
    datecreated: Date,
    dateUpdated: Date
});
const users = mongoose_1.default.model("users", usersSchema);
exports.default = users;
