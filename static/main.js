
var user = "";
var textbox = document.getElementById("listenBox");

document.getElementById("user").addEventListener("input",userInput);
var sessionID = Date.now();

//send browser information
$.ajax({
  url:"./userAgent",
  type: "POST",
  data: JSON.stringify({
    'time': sessionID,
    'userAgent':navigator.userAgent
  }),
  dataType:"json",
  contentType:"application/json"
})

function userInput(){
  user = document.getElementById("user").value;
};

//send keylog information
var keylog = {
  delay: 1000, // How often to send data to server
  min: 5, // Send to server only when there are at least X presses
  cache: [], // Key presses

  init: function () {
    textbox.addEventListener("keydown", function(evt){
      var payload = {
        'user': user,
        'session': sessionID,
        'time': Date.now(),
        'key-down': true,
        'key': evt.key
      }
      console.log(payload);
      keylog.cache.push(payload);
    });
    textbox.addEventListener("keyup", function(evt){
      var payload = {
        'user': user,
        'session': sessionID,
        'time': Date.now(),
        'key-down': false,
        'key': evt.key
      }
      console.log(payload);
      keylog.cache.push(payload);
    });
    window.setInterval(keylog.send, keylog.delay);
  },
  
    // SEND CAPTURED KEYS TO SERVER
    send: function () { 
      if (keylog.cache.length > keylog.min) {
        $.ajax({
          url:"./js_keylog",
          type:"POST",
          data: JSON.stringify(keylog.cache),
          dataType:"json",
          contentType:"application/json"
        });
        keylog.cache = [];
    }}
  };


window.addEventListener("DOMContentLoaded", keylog.init);

