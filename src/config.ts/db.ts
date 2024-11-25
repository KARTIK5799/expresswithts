import mongoose from 'mongoose'
import { config } from './config'

const connectDb=async()=>{
   try {
    mongoose.connect(config.databaseUrl as string);
    mongoose.connection.on('connected',()=>{
        console.log('Successfully connected to the database');

    });

    mongoose.connection.on('error',(err)=>{
        console.error('Error in database connection:', err);
    })
   } catch (error) {
    console.error('Error during database connection setup:', error);
    process.exit(1);
   }
}
export default connectDb;