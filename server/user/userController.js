var User = require('tandem-db').User;

var methods = {};

//Callback method for specified router param - decorates request object with user
methods.params = (req, res, next, id) => {
  User.forge({ : })
    .fetch()
    .then((user) => {
      if (!user) {
        //user not found
        next(new Error('Failed to load user'));
      } else {
        //decorate request with user object & call next function
        req.user = user;
        next();
      }
    })
    .catch((err) => {
      next(err);
    }
};

//Get the current user
methods.getOne = (req, res, next) => {
  User.forge({ id: req.user.id })
    .fetch()
    .then((user) => {
      if (!user) {
        next(new Error('Failed to load user'));
      } else {
        req.user = user;
        next();
      }
    })
    .catch((err) => {
      next(err);
    }
};

//Add the new user
methods.post = (req, res, next) => {
  User.forge({ req.user}) //best way to do this??
    .save()
    .then((user) => {
      if (!user) {
        next(new Error('Failed to create user'));
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      next(err);
    })
};

//Update user to verified post email verification
methods.put = (req, res, next) => {
  User.forge( {'link_uuid': req.user.uuid })
    .fetch()
    .then((user) => {
      if (!user) {
        next(new Error('Invalid user'))
      } else {
        user.set({ verified: true });
        user.save();
        //return json or redirect??
      }
    })
    .catch((err) => {
      next(err);
    })
};

//Delete a user
methods.delete = (req, res, next) => {
  User.destroy({ id: req.user.id })
    .then((user) => {
      if (!user) {

      }
    })
};

module.exports = methods;




