var redis = require('redis');

//use default host & port for now
var client = redis.createClient();
const mapSeconds = {
  seconds: 1,
  minutes: 60,
  hours: 60 * 60,
  days: 60 * 60 * 24
};

//Handle errors
client.on('error', (err) => {
  console.log('Error: ', err, '\n', err.stack);
});

client.on('ready', () => {
  console.log('Connected to Redis client...');
})

//Rate Limiting middleware function for api
var rateLimiter = (rateLimits) => {
  //rateLimits is an array containing either:
  //- tuples of the form [requests, seconds]
  //- objects of the form {requests: x, timeLimit: y} where timelimit is one of: seconds, minutes, hours, days

    //Deal with the case where rateLimits is a single constraint but has not been nested in a tuple
    if (rateLimits.length === 2 && typeof rateLimits[0] === 'number') {
      rateLimits = [rateLimits];
    };

    //Return array of all limits converted to tuple form [requests, seconds]
    var tupledLimits = rateLimits.map((limit) => {
      //If is an array, already in tuple form
      if (Array.isArray(limit)) {
        return limit;
      } else if (limit && typeof limit === 'object') {
        //If limit is in object form, get the key representing the time dimension
        Object.keys(limit).forEach((key) => {
          if (!key === 'requests') {
            //Restate contraint in tuple form, calculted in seconds equivalent
            var tupledLimit = [limit.requests, mapSeconds[key] * limit[key]];
          }
        });
        //Return the new tuple
        return tupledLimit;
      }
    });

    //Sort the limits in ascending order by number of seconds
    var sortedLimits = tupledLimits.sort((a, b) => {
      return (a[1] > b[1] ? 1 : 0);
    })

  //Return the throttling middleware function, retaining access via closure to the sorted rate limits
  //Leaky bucket implementation
  return (req, res, next) => {
    const nameSpace = 'apireq:';
    //Limit API calls per user (vs per user per endpoint) - use user id if authenticated, else best guess ip address (anonymous user)
    var userKey = nameSpace + (req.user.id || req.ip || req.ips);

    //No rate limits in place
    if (!sortedLimits.length) {
      next();
    } else {
      var timeStamp = Date.now();
      //Thottle
      // sortedLimits.forEach((limit) => {
        client.multi()
          .zadd(userKey, timeStamp, JSON.stringify(timeStamp));
          .

        //For each request added to Redis List (linked list), set TTL = maximum time constraint, value = current time stamp
        //[front of list = oldest, back of list = newest]
        //No of elements = total no of requests for the specified TTL interval
        //


      // });      
      

    }
    console.log('hello');

  }
}


rateLimiter([1,10]);




//PSEUDOCODE - EXPRESS MIDDLEWARE THROTTLE FUNCTION:
//for each user
  //for each new api request
    //check the elapsed since most recent request
    //iterate over the established rate constraints per smallest unit of time to largest
      //if still inside current time constraint, block the request & respond with 429 status, updating headers
      //else check time elapsed since next most recent request
        //if still inside next largest time constraint, block the request & respond with 429 status, updating headers
        //else
          //set the TTL time to live equal to the time period for the current constraint
          //increment Redis timestamped request count by one accordingly
          //process the api request
//
//
//Redis Data Structure:
//A list of requests per each user
//key for each user:
  //loggedInUser? -> namespace + user_id per decoded token + route
  //anonymousUser? -> namespace + ip + route
//value = timestamp
//list (array) length - dictated by rate constraint for largest user of time, expressed in seconds


// //Redis example
// var client = redis.createClient(), set_size = 20;
 
// client.sadd("bigset", "a member");
// client.sadd("bigset", "another member");
 
// while (set_size > 0) {
//     client.sadd("bigset", "member " + set_size);
//     set_size -= 1;
// }
 
// // multi chain with an individual callback 
// client.multi()
//     .scard("bigset")
//     .smembers("bigset")
//     .keys("*", function (err, replies) {
//         // NOTE: code in this callback is NOT atomic 
//         // this only happens after the the .exec call finishes. 
//         client.mget(replies, redis.print);
//     })
//     .dbsize()
//     .exec(function (err, replies) {
//       console.log(replies);
//         console.log("MULTI got " + replies.length + " replies");
//         replies.forEach(function (reply, index) {
//             console.log("Reply " + index + ": " + reply.toString());
//         });
//     });