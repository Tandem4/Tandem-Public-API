// var db = require('tandem-db').User;
// var uuid = require('node-uuid');
// var auth = require('../utils/auth');
// var mail = require('../utils/mail');

// module.exports = function(app) {

//   app.get('/login', (req, res) => {
//     res.render('login');
//   })

//   app.get('/signup', (req, res) => {
//     res.render('signup');
//   })

//   app.post('/signup', (req, res) => {
//     var linkUuid = uuid.v1();
//     // var mailTo = req.query.to;
//     var mailTo = req.body.email;
//     var verifyLink = req.protocol + '://' + req.headers.host + '/verify?id=' + linkUuid;
//     // var messageOptions = mail.createMessage(mailTo, verifyLink);
//     // mail.send(messageOptions, (error, response)=> {
//     //   if (error) {
//     //     console.log('ERROR sending mail: ', error);
//     //   } else {
//         var apiKey = auth.generateApiKey(req.body.password, linkUuid); //bcrypt email, password, salt
//         var apiSecret = uuid.v4().split('-').join(''); //uuid                             
//         db.User.forge({
//           email_address: mailTo,
//           link_uuid: linkUuid,
//           verified: false,
//           api_key: apiKey,
//           api_secret: apiSecret
//         })
//         .save()
//         .then((model) => {
//           res.send('<div>Please verify your email address by clicking the link in the email sent to you & then logging in <a href="/login">here</a></div>');
//         })
//       // }
//     // })
//   });

//   app.get('/verify', (req, res) => {
//     //Select user from db based on uuid per verify link
//     new db.User({ 'link_uuid': req.query.id })
//       .fetch()
//       .then((model) => {
//         //If exists, set verified to true, save & redirect to admin console
//         if (model) {
//           model.set({ verified: 1 });
//           model.save();
//           res.redirect('/admin');
//         } else {
//           //TODO: 403 redirect?
//           res.status(403).send('403 Forbidden - Invalid User');
//         }
//       })
//   });

// }