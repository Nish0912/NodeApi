const mongoose = require("mongoose");
const validator = require("validator");

const usersSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },

    user_id:{
        type:Number,
        autoIncrement:true,
        required:true,
    },

    Password:{
        type:String,
        minlenth:8,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw Error("Not Valid Email")
            }
        }
    },

    User_name:{
        type:String,
        required:true,
    },

    Gender:{
        type:String,
        enum: ["male", "female", "other"],
        required:true
    },

    Mobile_Number:{
        type:String,
        required:true,
        unique:true,
        minlenth:10,
        maxlength:10
    },

    Profile:{
        required: ["profilePrivacy"],
        enum: ["public", "private"]
    },

    datecreated:Date,
    dateUpdated:Date
})

const users = new mongoose.model("users", usersSchema);
module.exports = users;