export default function (request) {
  let mail, source, userAgent, timestamp;
  mail = request.body.mail;
  source = request.body.source;
  if (!request.body.userAgent) {
    userAgent = request.headers["user-agent"];
  } else {
    userAgent = request.body.userAgent;
  }
  if (!request.body.timestamp) {
    let dateObject = new Date();
    timestamp = dateObject.getTime();
  } else {
    timestamp = request.body.timestamp;
  }

  return {
    email: mail,
    source: source,
    userAgent: userAgent,
    timestamp: timestamp
  };
}
