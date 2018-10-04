var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var app = express();

// TrusTee controler settings
const ID = '001';
const T = 8.47; // waiting for the Temperature Sensor
const TMax = 10;
const freq = 10000;
const StartMess = "Trustee controler #"+ID+" - beginning of the story at "+Date.now()+"\r\n";

// History buffer 
var history = [StartMess];

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send("TrusTee Process running, yes ! Last Temperature checked : "+T+"°C on TTController number "+ID+".");
})

// This responds a GET request for the /tee_history page.
app.get('/tee_history', function (req, res) {
    console.log("Got a GET request for /tee_history");
    res.send(history.join("<br>"));
 })

 // This responds a GET request for the /tee page. 
 // for testing only for the moment : avoid concurrent loop measure and measure on request because :
 // 1. some T sensor dont allow for repetitive measure (within 5 sec)
 // 2. need to clarify the COULD test feature VS the MUST loop feature
/*app.get('/tee', function (req, res) {
    console.log("Got a GET request for /tee");
    res.send(measureCurrentTee().toString);
 })
*/

// This responds a POST request for the homepage
/*app.post('/', function (req, res) {
   console.log("Got a POST request for the homepage");
   res.send('Hello POST');
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function(req, res) {   
   console.log("Got a GET request for /ab*cd");
   res.send('Page Pattern Match');
})*/

var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})


// measure T and update history log
function measureCurrentTee() {
    measure = "TrusTee measure at "+ Date.now() + " - T ="+ T +" ";
    history.push(measure);
    console.log(measure);
    return T;
  }


// send Alert using SMS Text message through clickaTell SMS Gateway
function sendAlert() {
    console.log("Sending SMS Alert message");
    var xhr = new XMLHttpRequest();
    var alertMessage = "TrusTee Warn ! Temperature "+T+"°C reached on TTController number "+ID+". Please check it now !";
    xhr.open("GET", "https://platform.clickatell.com/messages/http/send?apiKey=1g_OYHPZQp2haOQSpVGgaA==&to=33651044499&content="+alertMessage, true);
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log('success');
        }
    };
    xhr.send();
    console.log("SMS Alert message sent");
}

/**** check T - the actual core method for T check and alert management
 * 
 */
function checkTee()  {
    Tee = measureCurrentTee();
    console.log("Tee checked : "+Tee+ " at " + Date.now());
    if (Tee > TMax) sendAlert(); 
}


 /**** The LOOP for permanent temperature control
  */
setInterval(checkTee, freq);
