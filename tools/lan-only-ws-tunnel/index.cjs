async function startAsync() {
  throw new Error('The WebContainer tunnel is unavailable in Hijrah. Start Expo Go with --lan on a shared network.');
}

async function stopAsync() {}

module.exports = { startAsync, stopAsync };
