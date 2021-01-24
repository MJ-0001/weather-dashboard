$(function getWeather() {
  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/forecast?q=London&units=metric&appid=bd0d5575197bb4b38c8ddc0ae3cb7389",
    method: "GET"
  }).then(function(response) {
    let lat = response.city.coord.lat;
    let long = response.city.coord.lon;
    let apiKey = "bd0d5575197bb4b38c8ddc0ae3cb7389";
    let urlQuery = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly,alerts&units=metric&appid=" + apiKey;

    $.ajax({
      url: urlQuery,
      method: "GET"
    }).then(function(response) {

      const dateArray = [];

      $(function getDate() {
        for (let i = 0; i < response.daily.length; i++) {
          let date = response.daily[i].dt;
          let dateString = moment.unix(date).format("DD-MM-YYYY");
          dateArray.push(dateString);
        }
      })
   
      $(function currentDayForecast() {
        $("#date0").text(dateArray[0]);
        $(".city").append(" " + response.timezone);
        $(".temp").append(" " + response.current.temp + "°");
        $(".humid").append(" " + response.current.humidity + "%");
        $(".wind").append(" " + response.current.wind_speed + " MPH");
        $(".uv").append(" " + response.current.uvi);
      })
      
      $(function oneDayForecast() {
        $("#date1").text(dateArray[1]);
        $("#day-one-temp").text("Temperature: " + response.daily[1].temp.day + "°");
        $("#day-one-humid").text("Humidity: " + response.daily[1].humidity + "%");
        $("#day-one-wind").text("Wind Speed: " + response.daily[1].wind_speed + " MPH");
        $("#day-one-uv").text("UV Index: " + response.daily[1].uvi);
      })

      $(function twoDayForecast() {
        $("#date2").text(dateArray[2]);
        $("#day-two-temp").text("Temperature: " + response.daily[2].temp.day + "°");
        $("#day-two-humid").text("Humidity: " + response.daily[2].humidity + "%");
        $("#day-two-wind").text("Wind Speed: " + response.daily[2].wind_speed + " MPH");
        $("#day-two-uv").text("UV Index: " + response.daily[2].uvi);
      })

      $(function threeDayForecast() {
        $("#date3").text(dateArray[3]);
        $("#day-three-temp").text("Temperature: " + response.daily[3].temp.day + "°");
        $("#day-three-humid").text("Humidity: " + response.daily[3].humidity + "%");
        $("#day-three-wind").text("Wind Speed: " + response.daily[3].wind_speed + " MPH");
        $("#day-three-uv").text("UV Index: " + response.daily[3].uvi);
      })

      $(function fourDayForecast() {
        $("#date4").text(dateArray[4]);
        $("#day-four-temp").text("Temperature: " + response.daily[4].temp.day + "°");
        $("#day-four-humid").text("Humidity: " + response.daily[4].humidity + "%");
        $("#day-four-wind").text("Wind Speed: " + response.daily[4].wind_speed + " MPH");
        $("#day-four-uv").text("UV Index: " + response.daily[4].uvi);
      })

      $(function fiveDayForecast() {
        $("#date5").text(dateArray[5]);
        $("#day-five-temp").text("Temperature: " + response.daily[5].temp.day + "°");
        $("#day-five-humid").text("Humidity: " + response.daily[5].humidity + "%");
        $("#day-five-wind").text("Wind Speed: " + response.daily[5].wind_speed + " MPH");
        $("#day-five-uv").text("UV Index: " + response.daily[5].uvi);
      })
    })
  })
})

function prependCity(text) {
  $("tbody").prepend("<tr>" + "<td class='text-left'>" + text + "</td>" + "</tr>")
}

function appendCity(text) {
  $("tbody").append("<tr>" + "<td class='text-left'>" + text + "</td>" + "</tr>")
}

// Get user input from search and add it to local storage
let searchArray = [];
$("input").keypress(function (e) { 
  if (e.which == 13) {
    e.preventDefault();
    let search = $("input").val().trim().toLowerCase();
      if (search != "") {
        searchArray.unshift(search); 
        localStorage.setItem("city", JSON.stringify(searchArray)); 
        appendCity(searchArray[0]);
        $("input").val(" ");
      }
  }
})

// Retrieve previous searches from local storage
$(function getCityStorage() {
  let lastItem = JSON.parse(localStorage.getItem("city"));
  for (let i = 0; i < lastItem.length; i++) {
    prependCity(lastItem[i])
  }
})