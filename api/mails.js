import { connectToDatabase } from "../lib/mongodb.js";

export default async function handler(request, response) {
  const { database } = await connectToDatabase();
  const collection = database.collection(process.env.NEXT_ATLAS_COLLECTION);

  const options = {
    sort: { timestamp: -1 }
  };

  const results = await collection.find().sort(options).toArray();

  response.status(200).json(results);
}
