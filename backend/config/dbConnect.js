import mongoose from "mongoose";

export const connectDatabase = () => {

    let DB_URI = "";

    if(process.env.NODE_DEV === 'DEVELOPMENT') DB_URI = process.env.DB_LOCAL_URI;
    if(process.env.NODE_DEV === 'PRODUCTION') DB_URI = process.env.DB_URI;

    mongoose.connect(DB_URI).then((con) => {
        console.log(
            `MongoDB Database connected with HOST: ${con?.connection?.host}`
        );
    }).catch((err) => {
        console.error('Error connecting to the database:', err);
    });
};