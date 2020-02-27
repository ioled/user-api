const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI === undefined) {
  console.log('[User API][Error] No Mongo URI specified in the env variables');
  process.exit(1);
}

const PROJECT_ID = process.env.PROJECT_ID;
if (PROJECT_ID === undefined) {
  console.log('[User API][Error] No Google Cloud Project Identifier specified in the env variables');
}

module.exports = {
  MONGO_URI,
  PROJECT_ID,
};
