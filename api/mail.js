import { connectToDatabase } from "../lib/mongodb.js";
import { apisecuritycheck } from "../lib/apisecuritycheck.js";
import { datavalidation } from "../lib/datavalidation.js";
import { extractmail } from "../lib/extractmail.js";
import { ObjectId } from "mongodb";

export default async function hello(request, response) {
  if (request.method != "POST" && request.method != "DELETE") {
    response.status(400).json({
      error: "Bad request. Not authorized!"
    });
    return;
  }

  await apisecuritycheck(request, response);
  datavalidation(request, response);

  if (request.method == "POST") {
    let newMail = extractmail(request);
    try {
      const { database } = await connectToDatabase();
      const collection = database.collection(process.env.NEXT_ATLAS_COLLECTION);
      const out = await collection.insertOne(newMail);
      response.status(200).json({ id: out.insertedId });
    } catch (error) {
      response.status(400).json({
        error: "Unable to process the request! Internal server error!"
      });
      return;
    }
  }

  if (request.method == "DELETE") {
    const id = request.query.id;
    const objectId = new ObjectId(id);
    let item = { _id: objectId };
    try {
      const { database } = await connectToDatabase();
      const collection = database.collection(process.env.NEXT_ATLAS_COLLECTION);
      const out = await collection.deleteOne(item);
      response.status(200).json({ total: out.deletedCount });
    } catch (error) {
      response.status(400).json({
        error: "Unable to process the request! Internal server error!"
      });
      return;
    }
  }
}
