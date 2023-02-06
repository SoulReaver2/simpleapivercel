import Joi from "joi";

export function datavalidation(request, response) {
  let schema, data;
  if (request.method == "POST") {
    schema = Joi.object({
      mail: Joi.string().min(5).required(),
      source: Joi.string().email({ minDomainSegments: 2 }).required(),
      userAgent: Joi.string(),
      timestamp: Joi.number()
    });
    data = request.body;
  }

  if (request.method == "DELETE") {
    schema = Joi.object({
      id: Joi.string().alphanum()
    });
    data = { id: request.query.id };
  }

  const result = schema.validate(data);
  if (result.error) {
    response.status(400).send(result.error.details[0].message);
    return;
  }
}
