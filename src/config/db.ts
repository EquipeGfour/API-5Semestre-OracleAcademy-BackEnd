import mongoose from "mongoose";
import * as dotenv from "dotenv";


dotenv.config()

const URI = process.env.URI || '';

const startDb = async () => {
  try {
    if (URI != "") {
      await mongoose.connect(URI);
      console.log("Conectado ao banco...");
    } else {
      console.log("URI de conexão necessaria...");
    }
  } catch (error) {
    console.log(error);
  }
};

export default startDb;