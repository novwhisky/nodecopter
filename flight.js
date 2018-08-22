var arDrone = require('ar-drone');
var client  = arDrone.createClient();

client.config('control:altitude_max', 3000);
// flipAhead
// phiM30Deg


client.takeoff();
client
  .after(5000, function() {
    this.clockwise(0.5);
  })
  .after(3000, function() {
    this.stop();
    this.land();
  });
