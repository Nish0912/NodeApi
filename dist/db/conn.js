"use strict";
//@ts-ignore
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DB = process.env.DATABASE;
mongoose_1.default
    .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
})
    .then((db) => {
    console.log("Database Connected Successfuly.");
})
    .catch((err) => {
    console.log("Error Connectiong to the Database");
});
