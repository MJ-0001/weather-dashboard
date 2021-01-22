// Get user input from search
let searchArray = [];
$("input").keypress(function (e) { 
  if (e.which == 13) {
    e.preventDefault();
    let search = $("input").val();
    let searchObj = JSON.stringify(search);
    localStorage.setItem("city", searchObj);
    searchArray.unshift(searchObj);  
    storeCity(searchArray[0]);
    $("input").val("");
  }
  
});

function storeCity(text) {
  $("tbody").prepend("<tr>" + "<th scope='row'></th>" + "<td>" + text + "</td>" + "</tr>")
}



function getWeather() {
$.ajax({
  url: "http://api.openweathermap.org/data/2.5/forecast?q=London&units=metric&appid=bd0d5575197bb4b38c8ddc0ae3cb7389",
  method: "GET"
}).then(function(response) {
  var lat = response.city.coord.lat;
  var long = response.city.coord.lon;
  console.log(lat);
  console.log(long);

  var apiKey = "bd0d5575197bb4b38c8ddc0ae3cb7389";
  var urlQuery = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly,alerts&units=metric&appid=" + apiKey;

  console.log(urlQuery);

  $.ajax({
    url: urlQuery,
    method: "GET"
  }).then(function(response) {

    // Add current weather title for the city
    function addCity() {
      $(".city").append(" " + response.timezone);
    }
    addCity();

    // Update the text content of html 
    function addTemp() {
      $(".temp").append(" " + response.current.temp + "°");
    }
    addTemp();

    function addHumid() {
      $(".humid").append(" " + response.current.humidity + "%");
    }
    addHumid();

    function addWind() {
      $(".wind").append(" " + response.current.wind_speed + " MPH");
    }
    addWind();

    function addUvi() {
      $(".uv").append(" " + response.current.uvi);
    }
    addUvi();

    const dateArray = [];

    function getDate() {
      for (let i = 0; i < response.daily.length; i++) {
        let date = response.daily[i].dt;
        var dateString = moment.unix(date).format("DD-MM-YYYY");
        dateArray.push(dateString);
      }
      console.log(dateArray);
    }
    getDate();

    function fiveDayForecast() {
      $("#future").append(" " + response.timezone);
      $("#date1").text(dateArray[1]);
      $("#day-one-temp").text("Temperature: " + response.daily[1].temp.day + "°");
      $("#day-one-humid").text("Humidity: " + response.daily[1].humidity) + "%";
      $("#day-one-wind").text("Wind Speed: " + response.daily[1].wind_speed + " MPH");
      $("#day-one-uv").text("UV Index: " + response.daily[1].uvi);
    }
    fiveDayForecast();


  

  })

});

}


    