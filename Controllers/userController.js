const users = require("../models/usersSchema");
const moment = require("moment")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


// create users



exports.userpost = async(req, res)=>{
    const {name, user_id, Password, email, User_name, Gender, Mobile_Number, Profile} = req.body;

    if (!name || !user_id || !Password || !email || !User_name || !Gender || !Mobile_Number || !Profile){
        res.status(400).json({error:"All fields are mandatory"});
    }

    try {
        const preuser = await users.findOne({email:email});
        if(preuser){
            res.status(400).json({error:"This user already exists in our database"});
        }else{
            const dateCreate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss")

            const hashedPassword = await bcrypt.hash(Password, 10);

            const userData = new users({
                name, user_id, Password:hashedPassword, email, User_name, Gender, Mobile_Number, Profile, datecreated:dateCreate
            });

            await userData.save();
            res.status(200).json(userData);
        }
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error")
    }
}



//get all users

exports.getUsers = async(req, res)=>{

    const search = req.query.search || "";
    const Gender = req.query.Gender || "";
    const sort = req.query.sort || "";
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = req.query.items || "3";

    const query = {
        name:{$regex:search,$options:"i"}
    }

    // if(Gender !=="All"){
    //     query.Gender = Gender
    // }

    try { 
        const skip = (page - 1) *ITEM_PER_PAGE
        const count = await users.countDocuments(query);
        const usersData = await users.find(query)
        .sort({datecreated:sort == "new" ? -1 :1})
        .limit(ITEM_PER_PAGE)
        .skip(skip)
        const pageCount = Math.ceil(count/ITEM_PER_PAGE);

        res.status(200).json({
            pagination:{
                count:pageCount
            },
            usersData
        });
    } catch (error) {
        
        res.status(400).json(error);
        console.log("catch block error")
    }
}

//get single user

exports.getSingleuser = async(req,res)=>{
    const {id} = req.params;

    try {
        const singleUserData = await users.findOne({_id:id});
        res.status(200).json(singleUserData);
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error")
    }
}

//delete user

exports.deleteuser = async(req,res)=>{
    const {id} = req.params;

    try {
        const deleteUserData = await users.findByIdAndDelete({_id:id});
        res.status(200).json(deleteUserData);
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error")
    }
}

//upate user

exports.updateUser = async(req,res)=>{
    const {id} = req.params;
    const {name, user_id, Password, email, User_name, Gender, Mobile_Number, Profile} = req.body;

    try {
        const dateUpdate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

        const updateUserData = await users.findByIdAndUpdate({_id:id}, {
            name, user_id, Password, email, User_name, Gender, Mobile_Number, Profile, dateupdated:dateUpdate
        }, {new:true});

        await updateUserData.save()
        res.status(200).json(updateUserData);
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error")
    }
}


//login

exports.login = async (req, res) => {
    const { email, Password } = req.body;
  
    if (!email || !Password) {
      return res.status(400).json({ error: "All fields are mandatory" });
    }
  
    try {
      const user = await users.findOne({ email: email });
  
      if (!user) {
        throw new Error('Invalid username or password');
      }
  
      // Compare the password
      const isPasswordValid = await bcrypt.compare(Password, user.Password);
  
      if (!isPasswordValid) {
        throw new Error('Invalid username or password');
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.jwtSecret, {
        expiresIn: process.env.jwtExpiresIn,
      });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.log("catch block error:", error.message);
    }
  };


//authenticate

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.userId = users.userId;
    next();
  });
};
