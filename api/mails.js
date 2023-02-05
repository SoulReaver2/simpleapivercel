import { connectToDatabase } from "../lib/mongodb";

export default async function handler(request, response) {
  const { database } = await connectToDatabase();
  const collection = database.collection(process.env.NEXT_ATLAS_COLLECTION);

  const options = {
    sort: { timestamp: -1 }
  };

  const results = await collection.find(options).toArray();

  response.status(200).json(results);
}
