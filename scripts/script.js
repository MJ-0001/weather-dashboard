// Retrieve previous searches from local storage
$(function getStorage() {
  if (localStorage.getItem("city") != null) {
    let city = JSON.parse(localStorage.getItem("city"));
    for (let i = 0; i < city.length; i++) {
      $("tbody").append("<tr>" + "<td class='append-left'>" + city[i] + "</td>" + "</tr>");
    }
  }
})

// API key for url
let apiKey = "bd0d5575197bb4b38c8ddc0ae3cb7389";
// Array to store search items
let searchArray = [];

// Capitalise the first letter of each city
function toCapitals(string) {
  string = string.split(" ");
    for (var i = 0; i < string.length; i++) {
      string[i] = string[i][0].toUpperCase() + string[i].substr(1);
    }
  return string.join(" ");
}

// Retrieve user's search
function userSearch() {
  let city = $("input").val().trim().toLowerCase();
  let search = toCapitals(city);
  return search
}

// Clear past searches and local storage
$("#clear").click(function (e) { 
  e.preventDefault();
  $("#main").empty();
  $("#weather").removeClass("dashboard");
  $(".city-table").empty();
  localStorage.clear();
});

// Append last search to previous searches table
function appendCity(item) {
  $(".city-table").append("<tr>" + "<td class='append-left'>" + item + "</td>" + "</tr>");
} 

// Set local storage with latest search
function setStorage() {
  let newSearch = $("input").val();
    if (localStorage.getItem("city") == null) {
      localStorage.setItem("city", "[]");
    }
  let oldSearch = JSON.parse(localStorage.getItem("city"));
  oldSearch.push(newSearch);
  localStorage.setItem("city", JSON.stringify(oldSearch));
}

// Function to store search item and push it to an array
$("input").keypress(function (e) { 
  let item = userSearch()
  if (e.which == 13) {
    e.preventDefault();
    $(".data").text("");
    if (item !== searchArray[0]) {
      searchArray.unshift(item);  
      setStorage();
      appendCity(item);
      // appendCity(searchArray[0]);
      $("input").val("");
      getWeather();
    }
    else if (item === searchArray[0]) {
      alert("Weather data for this city is already populated");
      $("input").val("");
    }
  }  
})

// Function to create API url
function buildURL() {
  let city = searchArray[0];
  let url = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + apiKey;
  return url;
}

// Main function makes two API calls using AJAX to retrieve data
function getWeather() {
  let newURL = buildURL();
  console.log(newURL)

  // First API call used to grab location coordinates
  $(function callAPI() {
    let oneCallAPI = [];
    $.ajax({
      url: newURL,
      method: "GET"
    }).then(function(response) {
      let lat = response.city.coord.lat;
      let lon = response.city.coord.lon;
      let oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + 
      "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=metric&appid=" + apiKey;
      oneCallAPI.push(oneCallURL);

      let secondURL = oneCallAPI[0];

      // Second API call adds in the location to the onecall API and pulls down the weathe data
      $.ajax({
        url: secondURL,
        method: "GET"
      }).then(function(response) {
        let dateArray = [];
                        
        // Moment JS used to convert UNIX timestamp to standard date
        function getDate() {
          for (var i = 0; i < response.daily.length; i++) {
            let date = response.daily[i].dt;
            let dateString = moment.unix(date).format("DD-MM-YYYY");
            dateArray.push(dateString);
          }
        }
        getDate();

        // variables for current weather
        let date = dateArray[0];
        let timezone = response.timezone;
        let temp = response.current.temp + "°C";
        let humid = response.current.humidity + "%";
        let wind = response.current.wind_speed + "MPH";
        let uv = response.current.uvi;

        // append dynamic html and data to container
        $("#main").html("");
        $("#weather").addClass("dashboard");
        $("#main").append('<div class="current">' + '<h3>Current Weather: ' + 
        timezone + '</h3>' + '<h5>Date: ' + date + '</h5>' + 
        '<p>Temperature: ' + temp + '</p>' +  '<p>Humidity: ' + 
        humid + '</p>' + '<p>Wind Speed: ' + wind + '</p>' + 
        '<p>UV Index: ' + uv + '</p>' + '</div>');

        var dayArray = [];

        class Weather {
          constructor(date, temp, humidity, wind, uv) {
            this.date = date;
            this.temp = temp;
            this.humidity = humidity;
            this.wind = wind;
            this.uv = uv;
          }
        }

        function fiveDay() {
          for (var i = 0; i < response.daily.length; i++) {
            var day = new Weather(
              dateArray[i], 
              response.daily[i].temp.day,
              response.daily[i].humidity,
              response.daily[i].wind_speed,
              response.daily[i].uvi
              );
              dayArray.push(day);
          }
        }
        fiveDay();

        for (var i = 1; i < 6; i++) {
          $("#main").append('<div class="box">' + '<h5>Date: ' + dayArray[i].date + '</h5>' + 
          '<p>Temperature: ' + dayArray[i].temp + '</p>' +  '<p>Humidity: ' + 
          dayArray[i].humidity + '</p>' + '<p>Wind Speed: ' + dayArray[i].wind + '</p>' + 
          '<p>UV Index: ' + dayArray[i].uv + '</p>' + '</div>');
        }
      })
    })
  })
}


