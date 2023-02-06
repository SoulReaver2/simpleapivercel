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

const secret = process.env.ACCESS_TOKEN_SECRET;

export function apisecuritycheck(request, response) {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return {
      status: false,
      code: 401,
      message: "You should provide your authorization token"
    };
  }

  verify(token, secret, (err, user) => {
    if (err) {
      return {
        status: false,
        code: 403,
        message: "Bad token! You are not authorized!"
      };
    }
  });

  try {
    rateLimit(request.headers["x-real-ip"], 30 * 1000);
  } catch (error) {
    return {
      status: false,
      code: 429,
      message: "You sent too many requests. Please wait a while then try again!"
    };
  }

  return {
    status: true,
    code: "",
    message: ""
  };
}
