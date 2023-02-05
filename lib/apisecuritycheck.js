import { rateLimiter } from "lambda-rate-limiter";
import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
import * as dotenv from "dotenv";
dotenv.config();

const maxRequest = 10; //maximum amount of requests allowed during the defined interval
const rateLimit = rateLimiter({
  interval: 60 * 1000 // Our rate-limit interval, one minute
}).check;

const secret = process.env.ACCESS_TOKEN_SECRET;

export default async function (request, response) {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return response.sendStatus(401);

  verify(token, secret, (err, user) => {
    if (err) return response.sendStatus(403);
    return user;
  });

  try {
    await rateLimit(maxRequest, request.headers["x-real-ip"]);
  } catch (error) {
    response.status(429).json({
      error: "You sent too many requests. Please wait a while then try again"
    });
  }
}
