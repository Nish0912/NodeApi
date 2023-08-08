//@ts-ignore
 
import mongoose, {ConnectOptions} from "mongoose";


const DB:any = process.env.DATABASE


mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  } as ConnectOptions)
  .then((db) => {
    console.log("Database Connected Successfuly.");
  })
  .catch((err) => {
    console.log("Error Connectiong to the Database");
  });