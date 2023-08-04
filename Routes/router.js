const express = require("express");
const router = new express.Router();
const controllers = require("../Controllers/userController");

router.post("/user/register",controllers.userpost);
router.post("/user/login",controllers.login);



router.get("/user/getAlluser",controllers.getUsers);
router.get("/user/singleuser/:id",controllers.getSingleuser);
router.delete("/user/deleteuser/:id", controllers.deleteuser);
router.put("/user/updateUser/:id", controllers.updateUser);


module.exports = router;