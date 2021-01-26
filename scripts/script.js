// Retrieve previous searches from local storage
$(function getCityStorage() {
  let lastItem = JSON.parse(localStorage.getItem("city"));
    function prependCity(append) {
      $("tbody").prepend("<tr>" + "<td class='append-left'>" + append + "</td>" + "</tr>")
    }
  for (let i = 0; i < lastItem.length; i++) {
    prependCity(lastItem[i])
  }
})

// API key for url
let apiKey = "bd0d5575197bb4b38c8ddc0ae3cb7389";
// Array to store search items
let searchArray = [];

function userSearch() {
  let search = $("input").val().trim().toLowerCase();
  return search
}

// Function to store search item and push it to an array
$("input").keypress(function (e) { 
  let item = userSearch()
    function appendCity(append) {
      $(".city-table").append("<tr>" + "<td class='append-left'>" + append + "</td>" + "</tr>");
    }  
  if (e.which == 13) {
    e.preventDefault();
      if (item != " ") {
        searchArray.unshift(item);  
        localStorage.setItem("city", JSON.stringify(searchArray));
        appendCity(searchArray[0]);
        $("input").val(" ");
        getWeather();
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
        console.log(secondURL)
        let dateArray = [];
        
        // Moment JS used to convert UNIX timestamp to standard date
        $(function getDate() {
          for (let i = 0; i < response.daily.length; i++) {
            let date = response.daily[i].dt;
            let dateString = moment.unix(date).format("DD-MM-YYYY");
            dateArray.push(dateString);
          }
        })

        // Functions to append weather data to HTML divs
        $(function currentDayForecast() {
          $("#date0").append(" " + dateArray[0]);
          $(".city").append(" " + response.timezone);
          $(".temp").append(" " + response.current.temp + "°C");
          $(".humid").append(" " + response.current.humidity + "%");
          $(".wind").append(" " + response.current.wind_speed + " MPH");
          $(".uv").append(" " + response.current.uvi);
        })
        
        $(function oneDayForecast() {
          $("#date1").append(" " + dateArray[1]);
          $("#day-one-temp").append(" " + response.daily[1].temp.day + "°C");
          $("#day-one-humid").append(" " + response.daily[1].humidity + "%");
          $("#day-one-wind").append(" " + response.daily[1].wind_speed + " MPH");
          $("#day-one-uv").append(" " + response.daily[1].uvi);
        })
  
        $(function twoDayForecast() {
          $("#date2").append(" " + dateArray[2]);
          $("#day-two-temp").append(" " + response.daily[2].temp.day + "°C");
          $("#day-two-humid").append(" " + response.daily[2].humidity + "%");
          $("#day-two-wind").append(" " + response.daily[2].wind_speed + " MPH");
          $("#day-two-uv").append(" " + response.daily[2].uvi);
        })
  
        $(function threeDayForecast() {
          $("#date3").append(" " + dateArray[3]);
          $("#day-three-temp").append(" " + response.daily[3].temp.day + "°C");
          $("#day-three-humid").append(" " + response.daily[3].humidity + "%");
          $("#day-three-wind").append(" " + response.daily[3].wind_speed + " MPH");
          $("#day-three-uv").append(" " + response.daily[3].uvi);
        })
  
        $(function fourDayForecast() {
          $("#date4").append(" " + dateArray[4]);
          $("#day-four-temp").append(" " + response.daily[4].temp.day + "°C");
          $("#day-four-humid").append(" " + response.daily[4].humidity + "%");
          $("#day-four-wind").append(" " + response.daily[4].wind_speed + " MPH");
          $("#day-four-uv").append(" " + response.daily[4].uvi);
        })
  
        $(function fiveDayForecast() {
          $("#date5").append(" " + dateArray[5]);
          $("#day-five-temp").append(" " + response.daily[5].temp.day + "°C");
          $("#day-five-humid").append(" " + response.daily[5].humidity + "%");
          $("#day-five-wind").append(" " + response.daily[5].wind_speed + " MPH");
          $("#day-five-uv").append(" " + response.daily[5].uvi);
        })
      })
    })
  })
}



