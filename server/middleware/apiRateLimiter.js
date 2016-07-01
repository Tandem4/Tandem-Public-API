var redis = require('redis');

//use default host & port for now
var client = redis.createClient();
const REQUEST_LIMIT_PER_MIN = 20;

//Handle errors
client.on('error', (err) => {
  console.log('Error: ', err, '\n', err.stack);
});

client.on('ready', () => {
  console.log('Connected to Redis client...');
})

//Helper function for creating Rate Limit custom headers object
var setRateLimitHeaders = (limit, remaining, rest) => {
  return {
    'X-Rate-Limit-Limit': limit,          //The number of allowed requests in the current period
    'X-Rate-Limit-Remaining': remaining  //The number of remaining requests in the current period
    // 'X-Rate-Limit-Reset': rest            //The number of seconds left in the current period
  };
};

//Rate Limiting middleware function for api
var rateLimiter = () => {
  console.log("throttle called");
  return (req, res, next) => {
    const nameSpace = 'apireq:';
    var limit;
    var remaining;
    var rest;
    //Limit API calls per user (vs per user per endpoint) - use user id if authenticated, else best guess ip address (anonymous user)
    var id = (req.user && req.user.id) ? req.user.id : req.ip || req.ips;
    var userKey = nameSpace + id;
    console.log("REDIS userKey", userKey);
    client.llen(userKey, (error, replies) => {
      console.log("REDIS LLEN error, replies:", error, replies);
      //Handle errors
      if (error) {
        console.log(error);
        next(err);        
      //No previous requests; generate List & process API request
      } else if (!replies) {
        //Batch execute atomic commands
        client.multi()
          .rpush(userKey, 1)
          .expire(userKey, 60) //Set TTL to 60 seconds
          .exec((error, replies) => {
            console.log("REDIS MULTI error, replies:", error, replies);
            //Set Rate Limit custom headers
            res.set(setRateLimitHeaders(REQUEST_LIMIT_PER_MIN, REQUEST_LIMIT_PER_MIN - replies[0]));
            next();
          });
      } else {
        //append to the list if it exists
        client.rpushx([userKey, 1], (error, replies) => {
          console.log("REDIS RPUSHX error, replies:", error, replies);
          //Limit exceeded
          if (replies > REQUEST_LIMIT_PER_MIN) {
            //Set Rate Limit custom headers
            res.set(setRateLimitHeaders(REQUEST_LIMIT_PER_MIN, 0));
            //Set HTTP status code
            res.status(429).send("Too Many Requests");
          //Within limit, process the request
          } else {
            //Set Rate Limit custom headers
            res.set(setRateLimitHeaders(REQUEST_LIMIT_PER_MIN, REQUEST_LIMIT_PER_MIN - replies));
            next();
          }
        })
      }
    });

    // X-Rate-Limit-Limit - The number of allowed requests in the current period
    // X-Rate-Limit-Remaining - The number of remaining requests in the current period
    // X-Rate-Limit-Reset - The number of seconds left in the current period

        // FUNCTION LIMIT_API_CALL(ip)
        // current = LLEN(ip)
        // IF current > 10 THEN
        //     ERROR "too many requests per second"
        // ELSE
        //     IF EXISTS(ip) == FALSE
        //         MULTI
        //             RPUSH(ip,ip)
        //             EXPIRE(ip,1)
        //         EXEC
        //     ELSE
        //         RPUSHX(ip,ip)
        //     END
        //     PERFORM_API_CALL()
        // END

      // });      
  }
};

module.exports = rateLimiter;
