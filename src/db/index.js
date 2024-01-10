import mongoose from "mongoose";
import { connect } from 'mongoose';
import 'dotenv/config';

const DB_URL = process.env.DB_URL

export default {

  init: async () => {
    try {
      mongoose.set('strictQuery', false);
      await connect(DB_URL);
      console.log("DB is Connected...\n");
    } catch (err) {
      console.log(err);
      console.error("DB connection error");
      process.exit(1);
    }
  },

  close: async() => mongoose.connection.close()
  
}