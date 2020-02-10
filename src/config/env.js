const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI === undefined) {
  console.log('[Gateway API][Error] No Mongo URI specified in the env variables');
  process.exit(1);
}

module.exports = {
  MONGO_URI,
};
