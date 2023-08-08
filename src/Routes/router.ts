import express from 'express';
import {userpost, login, getUsers, getSingleUser, deleteUser, updateUser} from '../Controllers/userController';

const router = express.Router();

router.post("/user/register", userpost);
router.post("/user/login", login);

router.get("/user/getAlluser", getUsers);
router.get("/user/singleuser/:id", getSingleUser);
router.delete("/user/deleteuser/:id", deleteUser);
router.put("/user/updateUser/:id", updateUser);

export { router };