var MailChimpAPI = require('mailchimp').MailChimpAPI;
var apiKey = process.env.NESTOR_MAILCHIMP_API_KEY;
var listId = process.env.NESTOR_MAILCHIMP_LIST_ID;

var subscribeToList = function(message, done) {
  var api, error, error1;
  var emailAddress = message.match[1];
  message.reply("Attempting to subscribe " + emailAddress + "...").then(function() {
    try {
      api = new MailChimpAPI(apiKey, {
        version: "1.3",
        secure: false
      });
    } catch (error1) {
      error = error1;
      console.log(error.message);
      return;
    }

    api.listSubscribe({
      id: listId,
      email_address: emailAddress,
      double_optin: false
    }, function(error, data) {
      if (error) {
        message.send("Uh oh, something went wrong: " + error.message, done);
      } else {
        message.send("You successfully subscribed " + emailAddress + ".", done);
      }
    });
  });
};

var unsubscribeFromList = function(message, done) {
  var api, error, error1;
  var emailAddress = message.match[1];

  message.reply("Attempting to unsubscribe " + emailAddress + "...").then(function() {
    try {
      api = new MailChimpAPI(apiKey, {
        version: "1.3",
        secure: false
      });
    } catch (error1) {
      error = error1;
      console.log(error.message);
      return;
    }

    api.listUnsubscribe({
      id: listId,
      email_address: emailAddress,
      double_optin: false
    }, function(error, data) {
      if (error) {
        message.send("Uh oh, something went wrong: " + error.message, done);
      } else {
        message.send("You successfully unsubscribed " + emailAddress + ".", done);
      }
    });
  });
};

var latestCampaign = function(message, done) {
  var api, error, error1;
  try {
    api = new MailChimpAPI(apiKey, {
      version: "1.3",
      secure: false
    });
  } catch (error1) {
    error = error1;
    console.log(error.message);
    return;
  }

  api.campaigns({
    start: 0,
    limit: 1
  }, function(error, data) {
    var campaign_name, cid;
    if (error) {
      message.send("Uh oh, something went wrong: " + error.message, done);
    } else {
      cid = data['data'][0]['id'];
      campaign_name = data['data'][0]['title'];

      api.campaignStats({
        cid: cid
      }, function(error, data) {
        if (error) {
          message.send("Uh oh, something went wrong while fetching stats for '"  + campaign_name + "': " + error.message, done);
        } else {
          message.send(new message.newRichResponse({
            title: campaign_name,
            fields: [
              {
                "title": "Sent To",
                "value": data['emails_sent'] + " subscribers",
                "short": true
              },
              {
                "title": "Unique Opens",
                "value": data['unique_opens'],
                "short": true
              },
              {
                "title": "Unique Clicks",
                "value": data['unique_clicks'],
                "short": true
              },
              {
                "title": "Unsubscribes",
                "value": data['unsubscribes'],
                "short": true
              }
            ]
          }), done);
        }
      });
    }
  });
};

module.exports = function(robot) {
  robot.respond(/\bsubscribe (.+@.+)/i, function(message, done) {
    subscribeToList(message, done);
  });

  robot.respond(/\bunsubscribe (.+@.+)/i, function(message, done) {
    unsubscribeFromList(message, done);
  });

  robot.respond(/\bmailchimp latest/i, function(message, done) {
    latestCampaign(message, done);
  });
};

