"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../Controllers/userController");
const router = express_1.default.Router();
exports.router = router;
router.post("/user/register", userController_1.userpost);
router.post("/user/login", userController_1.login);
router.get("/user/getAlluser", userController_1.getUsers);
router.get("/user/singleuser/:id", userController_1.getSingleUser);
router.delete("/user/deleteuser/:id", userController_1.deleteUser);
router.put("/user/updateUser/:id", userController_1.updateUser);
