import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';

export interface IUser extends Document {
    name: string;
    user_id: number;
    Password: string;
    email: string;
    User_name: string;
    Gender: 'male' | 'female' | 'other';
    Mobile_Number: string;
    Profile: 'public' | 'private';
    datecreated: Date;
    dateUpdated?: Date;
}

const usersSchema = new mongoose.Schema<IUser>({
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
        validate(value: string) {
            if (!validator.isEmail(value)) {
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

const users: Model<IUser> = mongoose.model<IUser>("users", usersSchema);
export default users;