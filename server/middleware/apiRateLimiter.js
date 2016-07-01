var redis = require('redis');

//use default host & port for now
var client = redis.createClient();
const REQUEST_LIMIT_PER_SEC = 1;
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
    'X-Rate-Limit-Remaining': remaining,  //The number of remaining requests in the current period
    'X-Rate-Limit-Reset': rest            //The number of seconds left in the current period
  };
};

//Rate Limiting middleware function for api
var rateLimiter = () => {

  return (req, res, next) => {
    const nameSpace = 'apireq:';
    var limit;
    var remaining;
    var rest;
    //Limit API calls per user (vs per user per endpoint) - use user id if authenticated, else best guess ip address (anonymous user)
    var userKey = nameSpace + (req.user.id || req.ip || req.ips);
    client.llen(userKey, (error, replies) => {
      //Handle errors
      if (error) {
        console.log(error);
        next(err);        
      //No previous requests; generate List & process API request
      } else if (!replies) {
        //Batch execute atomic commands
        client.multi()
          .rpush(userKey, new Date.now())
          .expire(userKey, 60) //Set TTL to 60 seconds
          .exec();
        //Set Rate Limit custom headers
        res.set(setRateLimitHeaders(limit, remaining, rest));
        next();
      //Limit exceeded
      } else if (replies[0] > REQUEST_LIMIT_PER_MIN) {
        //Set Rate Limit custom headers
        res.set(setRateLimitHeaders(limit, remaining, rest));
        //Set HTTP status code
        res.status(429).send("Too Many Requests");
      } else {
        client.rpushx(userKey, (error, replies) => {
          //Set Rate Limit custom headers
          res.set(setRateLimitHeaders(limit, remaining, rest));
          next();
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
