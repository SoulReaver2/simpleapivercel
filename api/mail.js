import { connectToDatabase } from "../lib/mongodb.js";
import { Joi } from "joi";
import { apisecuritycheck } from "../lib/apisecuritycheck.js";
import { extractmail } from "../lib/extractbody.js";

export default async function hello(request, response) {
  if (request.method != "POST" && request.method != "DELETE") {
    response.status(400).json({
      error: "Bad request. Not authorized!"
    });
  }

  await apisecuritycheck(request, response);

  const schema = Joi.object({
    mail: Joi.string().min(5).required(),
    source: Joi.string().email({ minDomainSegments: 2 }).required(),
    userAgent: Joi.string(),
    timestamp: Joi.number()
  });
  const result = schema.validate(request.body);
  if (result.error) {
    response.status(400).send(result.error.details[0].message);
    return;
  }

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
  }
}
