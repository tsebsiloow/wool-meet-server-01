import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URL);

export default async function connectMongo() {
  try {
    await client.connect();
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err);
  }
}

export const db = client.db();
