import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
import * as dotenv from "dotenv";
dotenv.config();

const history = {};

const rateLimit = (ip, timeout = 60 * 1000) => {
  if (history[ip] > Date.now() - timeout) {
    throw new Error("Rate Limit Exceeded");
  }
  history[ip] = Date.now();
};
//import { lambdaratelimiter } from "./lambdaratelimiter.js";

//const maxRequest = 10; //maximum amount of requests allowed during the defined interval
/*
const rateLimit = lambdaratelimiter({
  interval: 60 * 1000 // Our rate-limit interval, one minute
}).check;
*/

const secret = process.env.ACCESS_TOKEN_SECRET;

export async function apisecuritycheck(request, response) {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return response.sendStatus(401);

  verify(token, secret, (err, user) => {
    if (err) return response.sendStatus(403);
    return user;
  });

  try {
    rateLimit(request.headers["x-real-ip"], 30 * 1000);
    //await rateLimit(maxRequest, request.headers["x-real-ip"]);
  } catch (error) {
    response.status(429).json({
      error: "You sent too many requests. Please wait a while then try again"
    });
  }
}
