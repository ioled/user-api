const {userApi} = require('./index');

const PORT = process.env.PORT;

if (PORT === undefined) {
  console.log('[User API][Error] No port specified in the env variables');
  process.exit(1);
}

// Start the app in the given port.
userApi.listen(PORT, () => {
  console.log('[User API] Listening on port', PORT);
});
