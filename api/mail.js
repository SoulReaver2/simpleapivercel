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

  const security = apisecuritycheck(request, response);
  if (security.status === false) {
    response.status(security.code).json({
      error: security.message
    });
    return;
  }

  const validation = datavalidation(request, response);
  if (validation.status === false) {
    response.status(400).json({
      error: validation.message
    });
    return;
  }

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
    try {
      const objectId = new ObjectId(id);
      let item = { _id: objectId };
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
