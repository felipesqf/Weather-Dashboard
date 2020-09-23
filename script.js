$(".card-title-1").text(moment().add(1, "days").format("DD/MM/YYYY"));
$(".card-title-2").text(moment().add(2, "days").format("DD/MM/YYYY"));
$(".card-title-3").text(moment().add(3, "days").format("DD/MM/YYYY"));
$(".card-title-4").text(moment().add(4, "days").format("DD/MM/YYYY"));
$(".card-title-5").text(moment().add(5, "days").format("DD/MM/YYYY"));

$("#search").on("click", function (event) {
  event.preventDefault();
  var city = $("#city-input").val();
  emptyScreen();
  // var queryURLweather =
  //   "https://api.openweathermap.org/data/2.5/weather?q=" +
  //   city +
  //   "&appid=a2829c56aae5b3f3c839474c7bf9f86a";
  var queryURLforecast =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=metric&appid=a2829c56aae5b3f3c839474c7bf9f86a";
  // $.ajax({
  //   url: queryURLweather,
  //   method: "GET",
  // }).then(function (response) {
  //   getWeather(response);
  // });

  $.ajax({
    url: queryURLforecast,
    method: "GET",
  }).then(function (response) {
    getWeather(response);
    console.log(response.city.name);
    console.log(response.list[1].main.humidity);
    console.log(response.list[1].main.temp);
    console.log(response.list[1].wind.speed);
    console.log(response);
  });
});

function getWeather(response) {
  var todaysDate = moment().format("DD/MM/YYYY");
  var forecastDate = moment().add(7, "days").format("DD/MM/YYYY");
  console.log(forecastDate);
  console.log(todaysDate);
  var newCity =
    "<button type='button' class='btn btn-secondary btn-lg btn-block' id ='" +
    response.city.name +
    "'>";
  var divID = "#" + response.city.name;
  $("#cities").append(newCity);
  $(divID).append(response.city.name);
  var cityName = $("<h3>").text(response.city.name + " - " + todaysDate);
  var temperature = $("<div>").text(
    "Temperature: " + response.list[0].main.temp + " C"
  );
  var humidity = $("<div>").text(
    "Humidity: " + response.list[0].main.humidity + " %"
  );
  var windSpeed = $("<div>").text(
    "Wind Speed: " + response.list[0].wind.speed + " MPH"
  );
  $("#general-info").append(cityName, temperature, humidity, windSpeed);
  var i2 = 7;
  for (var i = 1; i < 6; i++) {
    var tempForecast = $("<div>").text(
      "Temperature: " + response.list[i2].main.temp + " C"
    );
    var humidForecast = $("<div>").text(
      "Humidity: " + response.list[i2].main.humidity + " %"
    );
    var windForecast = $("<div>").text(
      "Wind Speed: " + response.list[i2].wind.speed + " MPH"
    );
    var classTextIncre = ".card-text-" + i;
    var classImgIncre = ".card-img-top-" + i;
    if (response.list[i2].main.temp <= 2)
      $(classImgIncre).attr("src", "./images/snow.PNG");
    else if (
      response.list[i2].main.temp > 2 &&
      response.list[i2].main.temp < 15
    )
      $(classImgIncre).attr("src", "./images/normal.PNG");
    else if (
      response.list[i2].main.temp > 15 &&
      response.list[i2].main.temp < 25
    )
      $(classImgIncre).attr("src", "./images/sun.PNG");
    else {
      $(classImgIncre).attr("src", "./images/sunny.PNG");
    }

    $(classTextIncre).append(tempForecast, humidForecast, windForecast);
    i2 = i2 + 7;
  }
}

function emptyScreen() {
  $("#general-info").empty();
  $("#city-input").val("");
  for (var i = 0; i < 6; i++) {
    var classTextIncre = ".card-text-" + i;
    $(classTextIncre).empty();
  }
}
