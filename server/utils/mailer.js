var nodemailer = require('nodemailer');
var app = require('./server');

//Configure SMTP Server details
//-------------------------------------------------------
var smtpTransport = nodemailer.createTransport("SMTP", {
  service: 'Gmail',
  auth: {
    user: 'tandem4news@gmail.com',
    pass: 'AsifBrettKaniNicole!'
  }
});

// var rand;
// var mailOptions;
// var host;
// var link;
//-------------------------------------------------------





app.get('/login', (req, res) => {

});

app.get('/signup', (req, res) => {

});

app.get('/send', (req, res) => {
  let rand = Math.floor((Math.random()*100000) + 71);
  let host = req.get('host');
  let link = req.protocol + '://' + req.get('host') + '/verify?id=' + rand;
  let mailOptions = {
    to: req.query.to,
    subject: 'Plese verify your Email address',
    html: 'Hello, <br> Please click on the link to verify your email.<br><a href=' + link + '>Click here to verify</a>'
  };
  //TODO: remove
  console.log(mailOptions);

  smtpTransport.sendMail(mailOption, (error, response) => {
    if (err) {
      console.log(error);
      res.end('Error: ' + error);
    } else {
      console.log('Message sent: ' + response.message);
      res.end('Sent');
    }
  })
});

app.get('/verify', (req, res) => {
  //TODO: remove
  console.log(req.protocol + '://' + req.get('host'));
  if (req.protocol + '://' + req.get('host'));

});

