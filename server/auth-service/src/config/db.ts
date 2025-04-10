// auth-service/src/config/db.ts
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
	try {
		await mongoose.connect(process.env.MONGO_URI as string, {
			dbName: process.env.DB_NAME,
		});
		console.log("Auth Service: MongoDB Connected");
	} catch (error) {
		console.error("Auth Service: MongoDB Connection Failed", error);
		process.exit(1);
	}
};

export default connectDB;
