require('dotenv').config();
const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");
const ejs= require("ejs");

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.render("signup");

});

app.post("/", function(req, res) {
  const firstName = req.body.First;
  const lastName = req.body.Last;
  const email = req.body.Email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  const jsonData = JSON.stringify(data);
  const url = "https://us1.api.mailchimp.com/3.0/lists/"+process.env.LIST_ID;

  const options = {
    method: "POST",
    auth: process.env.API_KEY
  }

  const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
          res.render("success");
        } else {
          res.render("failure");
        }

      response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
});
request.write(jsonData);
 request.end();


});

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(3000, function() {
  console.log("Server is up and running");
})
