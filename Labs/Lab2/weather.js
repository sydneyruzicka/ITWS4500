var weather;
var d = new Date();
var day = d.getDay();
var week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var allDays = [];

//HTML5 geolocation function
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeather);
    } else {
        alert("Geolocation is not supported by this browser");
    }
}

/*this function uses the Forecast.io API and uses lat/long 
coordinates to grab weather condition information*/
function getWeather(position) {
    //get weather information in JSON format
    $.getJSON('https://api.darksky.net/forecast/c11490c17241dd710b9c08155f0a265f/'+position.coords.latitude+','+position.coords.longitude, function(forecast) {
    	//get city information using coordinates
        getAddress(position.coords.latitude, position.coords.longitude);
    	weather = forecast;
        //push all current weather info to HTML
    	document.getElementById("current").innerHTML = Math.round(weather.currently.apparentTemperature) + '&#8457';
    	document.getElementById("summary").innerHTML = weather.currently.summary;
    	document.getElementById("humidity").innerHTML = weather.currently.humidity * 100 + '%';
    	document.getElementById("wind").innerHTML = Math.round(weather.currently.windSpeed) + ' mph';
    	document.getElementById("uv").innerHTML = weather.currently.uvIndex;
    	document.getElementById("visibility").innerHTML = Math.round(weather.currently.visibility) + ' miles';
    	//this part adds Skycon icon and starts the animation
        var skycons = new Skycons({"color": "pink", "resizeClear": true});
    	skycons.add(document.getElementById("icon"), weather.currently.icon);
    	skycons.play();

		//now, get info for scrolling forecast
    	for(i=0;i<7;i++){
            var item = [];
            //get day of week
    		var x = week[day];
            if (day==6){
                day=0;
            }
            else {
                day+=1;
            }
            //push all weather for this day to the scrolling forecast array
    		item.push(x);
            item.push(weather.daily.data[i].summary);
            item.push(Math.round(weather.daily.data[i].temperatureHigh));
            item.push(Math.round(weather.daily.data[i].temperatureLow));
            allDays.push(item);
    	}
        //now set up forecast array
        getForecast();
    });
}

//this function pushes the weekly forecast to HTML in list format
//(list format will help us scroll through)
function getForecast() {
    var wScroll = "<ul id='wScroll' style='list-style: none;'>"
    for (i = 0;i<allDays.length;++i){
        w = "<li><b>" + allDays[i][0] + "</b><br><span style='font-size:12px;'>" + allDays[i][1] +"</span><br><span style='font-size:12px;'><b>High </b>" + allDays[i][2] +"</span><br><span style='font-size:12px;'><b>Low </b>" + allDays[i][3] + "</span><br><br></li>"
        wScroll += w;
    }
    wScroll+= "</ul>"
    document.getElementById("scrollingf").innerHTML = wScroll;
}

//this function scrolls the forecast
function startScroll() {
        $('#wScroll li:first').slideUp(function() {
            $(this).appendTo($('#wScroll')).slideDown();
        });
}

//this funciton gets the address using the lat/long coordinates we got earlier
function getAddress (latitude, longitude) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();

        var method = 'GET';
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true';
        var async = true;

        request.open(method, url, async);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    var data = JSON.parse(request.responseText);
                    var address = data.results[0];
                    var city ="";
                    city += address.address_components[2].long_name + ', ';
                    city += address.address_components[4].short_name;
                    //we only need the city name 
                    document.getElementById("city").innerHTML = city;
                    resolve(address);
                }
                else {
                    reject(request.status);
                }
            }
        };
        request.send();
    });
}



$(document).ready(function() {	
  getLocation();
  //start scrolling weather info every 3 seconds
  setInterval(function(){ startScroll(); }, 3000);
});

