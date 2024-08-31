import app from "./app";
import config from "./app/config";
import mongoose from "mongoose";

async function main() {
  try {
    await mongoose.connect(config.db_url as string, {
      // connectTimeoutMS: 1000, 
    });
    app.listen(config.port, () => {
        console.log(`Example app listening on port ${config.port}`);
        console.log("Database connection successfull !!!");
    });
  } catch (error) {
    console.log(error);
  }
}

main();
