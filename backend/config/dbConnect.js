// New Updated Code

import mongoose from "mongoose";
mongoose.set("strictQuery", false);

export const connectDatabase = () => {
  // Set the DB_URI based on the environment
  let DB_URI = "";

  // Check environment variables and select the appropriate DB_URI
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    DB_URI = process.env.DB_LOCAL_URI;
  } else if (process.env.NODE_ENV === "PRODUCTION") {
    DB_URI = process.env.DB_URI;
  }

  // Check if DB_URI is correctly set
  if (!DB_URI) {
    console.error("Database URI is not defined. Check environment variables.");
    process.exit(1);
  }

  // Connect to the database
  mongoose
    .connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(
        `MongoDB Database connected with HOST: ${con?.connection?.host}`
      );
    })
    .catch((err) => {
      console.error("Error connecting to the database:", err);
      process.exit(1); // Exit the application on database connection error
    });
};


// Old Code that have some error

/*import mongoose from "mongoose";

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
*/