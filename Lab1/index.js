var file = "/TwitterTweets17.json"
var tweets = [];
var tweetlen; 
var current_tweet = 0;

/* Grab Tweets from JSON file, 
    only using tweets that are valid */
function GrabTweets() {
  $.ajax({
      //gets the json file and checks if that process went ok
        type: "GET",
        url: file,
        dataType: "json",
        success: function(responseData, status){
            //check if tweets are defined
            for ( var t in responseData){
              //if tweets are good, push to tweet array
              if(responseData[t].text !== undefined){
                tweets.push(responseData[t]);
              }
            }
            //get number of tweets
            tweetlen = tweets.length;
            current_tweet = 0;
            //now get the first 5 tweets
            InitialTweets();
        }, error: function(msg) {
            //output for if an error occurred
            alert("There was a problem: " + msg.status + " " + msg.statusText);
        }
      });
}

/* This function checks profile image link and
    replaces link with default image if not valid */
function CheckProfilePic(imageUrl,current_tweet,i) {
  $.ajax({
    url: imageUrl,
    type: "GET",
    method: "GET",
    error: function() {
      //if error getting image, use default user image instead
      $("<img src='https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png' class='rounded-circle'>").prependTo('#img').css({"height":"50px"});
    },
    success: function() {
      //if image is valid, display it
      $("<img src='" + imageUrl + "' class='rounded-circle'>").prependTo("#img").css({"height":"50px"});
    }
  });
}

/* This function gets the first tweets on the screen
  so that we can start cycling through them */
function InitialTweets() {
  for (i=0;i<5;++i) {
    $("<p>" + tweets[current_tweet].text + "</p>").prependTo("#text").css({"height":"45px"});
    $("<p>" + tweets[current_tweet].user.screen_name + "</p>").prependTo("#user").css({"height":"45px"});
    var url = tweets[current_tweet].user.profile_image_url;
    CheckProfilePic(url,current_tweet,i+1);
    current_tweet+=1;
  }
}

// This function cycles through the tweets
function ChangeTweets() {
  //if reached end of tweets, start again
  if ((current_tweet+1) == tweetlen){
    current_tweet = 0;
  }
  //reset CSS from elements moving down the page
  $("#img").css({
    top:'-=50px'})
  $("#user").css({
    top:'-=45px'})
  $("#text").css({
    top:'-=45px'})
  //display next tweet along with username and profile image
  $("<p>" + tweets[current_tweet].text + "</p>").prependTo("#text").css({"height":"45px"});
  $("<p>" + tweets[current_tweet].user.screen_name + "</p>").prependTo("#user").css({"height":"45px"});
  var url = tweets[current_tweet].user.profile_image_url;
  CheckProfilePic(url,current_tweet,i+1);
  //animate the elements so that they move smoothly 
  $("#img").animate({
    top:'+=50px'})
  $("#text").animate({
    top:'+=45px'})
  $("#user").animate({
    top:'+=45px'})
  current_tweet +=1;

}

// get new tweets every 3 seconds
window.setInterval(function(){
  ChangeTweets();
}, 3000);

$(document).ready(function() {
  GrabTweets();
});
