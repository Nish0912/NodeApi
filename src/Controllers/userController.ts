import { Request, Response, NextFunction } from 'express';
// import * as moment from 'moment'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from '../models/usersSchema';

export const userpost = async (req:any, res:any) => {
    const { name, user_id, Password, email, User_name, Gender, Mobile_Number, Profile } = req.body;

    if (!name || !user_id || !Password || !email || !User_name || !Gender || !Mobile_Number || !Profile) {
        res.status(400).json({ error: "All fields are mandatory" });
        return;
    }

    try {
        const preuser = await users.findOne({ email: email });
        if (preuser) {
            res.status(400).json({ error: "This user already exists in our database" });
        } else {
            //const dateCreate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
            const dateCreate = new Date

            const hashedPassword = await bcrypt.hash(Password, 10);

            const userData = new users({
                name, user_id, Password: hashedPassword, email, User_name, Gender, Mobile_Number, Profile, datecreated: dateCreate
            });

            await userData.save();
            res.status(200).json(userData);
        }
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error");
    }
};



//get all users

export const getUsers = async (req: any, res: any) => {
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
        const count = await users.countDocuments(query);
        const usersData = await users.find(query)
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
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error");
    }
};

//get single user

export const getSingleUser = async (req: any, res: any) => {
    const { id } = req.params;

    try {
        const singleUserData = await users.findOne({ _id: id });
        res.status(200).json(singleUserData);
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error");
    }
};

//delete user

export const deleteUser = async (req: any, res: any) => {
    const { id } = req.params;

    try {
        const deleteUserData = await users.findByIdAndDelete({ _id: id });
        res.status(200).json(deleteUserData);
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error");
    }
};

//update user

export const updateUser = async (req: any, res: any) => {
    const { id } = req.params;
    const { name, user_id, Password, email, User_name, Gender, Mobile_Number, Profile } = req.body;

    try {
        //const dateUpdate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
        const dateUpdate = new Date();
        const updateUserData = await users.findByIdAndUpdate({ _id: id }, {
            name, user_id, Password, email, User_name, Gender, Mobile_Number, Profile, dateupdated: dateUpdate
        }, { new: true });

        await updateUserData?.save();
        res.status(200).json(updateUserData);
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error");
    }
};


//login

export const login = async (req: any, res: any) => {
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

        const token = jwt.sign({ userId: user._id }, process.env.jwtSecret as string, {
            expiresIn: process.env.jwtExpiresIn,
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred:", error.message);
        } else {
            console.error("An unknown error occurred:", error);
        }
    }
};


//authenticate

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    const jwtSecret = process.env.jwtSecret;

    jwt.verify(token, jwtSecret!, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.userId = (user as { userId: string }).userId;
        next();
    });
};
