$(document).ready(function () {
  for (var i = 1; i < 6; i++) {
    $(".card-title-" + i).text(moment().add(i, "days").format("DD/MM/YYYY"));
  }
  returnStoredCities(); // get the last city searched

  var citiesArray = [];

  $("#cities").on("click", ".btn ", function (event) {
    //display the cities alread seached
    event.preventDefault();
    var buttonCity = $(this).attr("id");
    forecastAPI(buttonCity);
  });

  function addButtons() {
    emptyScreen();
    $("#cities").empty();
    for (var i = 0; i < citiesArray.length; i++) {
      var newCity = $('<button type="button"' + ">");
      newCity.addClass("btn btn-secondary btn-lg btn-block");
      newCity.attr("id", citiesArray[i]);
      newCity.text(citiesArray[i]);
      // var divID = "#" + response.city.name;
      $("#cities").prepend(newCity);
    }
  }

  // $(divID).append(response.city.name);
  $("#search").on("click", function (event) {
    event.preventDefault();
    var city = $("#city-input").val();
    forecastAPI(city); // Calling the api after inserting the city
  });

  function emptyScreen() {
    //function to clean the content of tghe screen
    $("#general-info").empty();
    $("#city-input").val("");
    for (var i = 0; i < 6; i++) {
      var classTextIncre = ".card-text-" + i;
      $(classTextIncre).empty();
    }
  }

  function forecastAPI(city) {
    //calling the forecastapi and appending information on the screen

    //init forecast api
    var queryURLforecast =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&units=metric&appid=a2829c56aae5b3f3c839474c7bf9f86a";
    $.ajax({
      url: queryURLforecast,
      method: "GET",
      statusCode: {
        404: function () {
          $("#general-info").append("City '" + city + "' not found. Try again");
        },
      },
    }).then(function (response) {
      var todaysDate = moment().format("DD/MM/YYYY");
      var existCity = citiesArray.includes(response.city.name);
      if (existCity !== true) {
        citiesArray.push(response.city.name);
      }
      emptyScreen(); //empty the screen after clicking in search
      for (var i = 0; i < citiesArray.length; i++) {
        localStorage.setItem("city", JSON.stringify(citiesArray[i]));
      }

      addButtons(); // add buttons on the nav
      uviAPI(response.city.coord.lat, response.city.coord.lon); //get the uvi based on the lat and long

      var cityName = $("<h3>").text(
        response.city.name + " - (" + todaysDate + ")"
      );
      var temperature = $("<div>").text(
        "Temperature: " + response.list[0].main.temp + " C  - "
      );
      if (response.list[0].main.temp <= 2)
        $(temperature).append("<i class='" + "fas fa-snowflake" + "'></i>");
      else if (
        response.list[0].main.temp > 2 &&
        response.list[0].main.temp < 15
      )
        $(temperature).append("<i class='" + "fas fa-cloud" + "'></i>");
      else if (
        response.list[0].main.temp > 15 &&
        response.list[0].main.temp < 25
      )
        $(temperature).append("<i class='" + "fas fa-cloud-sun" + "'></i>");
      else {
        $(temperature).append("<i class='" + "fas fa-sun" + "'></i>");
      }

      var humidity = $("<div>").text(
        "Humidity: " + response.list[0].main.humidity + " %"
      );
      var windSpeed = $("<div>").text(
        "Wind Speed: " + response.list[0].wind.speed + " MPH"
      );
      $("#general-info").append(cityName, temperature, humidity, windSpeed);

      var i2 = 8; // to loop into the result array
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
    });
  }

  //init uvi api
  function uviAPI(lat, lon) {
    var queryURLUVI =
      "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=a2829c56aae5b3f3c839474c7bf9f86a";

    $.ajax({
      url: queryURLUVI,
      method: "GET",
    }).then(function (response) {
      var uvi = $("<div>").text("UVI: " + response.value);
      if (response.value < 2) {
        $(uvi).css({
          "background-color": "green",
          width: "60px",
          color: "white",
        });
      } else if (response.value > 2 && response.value < 5) {
        $(uvi).css({
          "background-color": "yellow",
          width: "60px",
          color: "black",
        });
      } else if (response.value > 5 && response.value < 7) {
        $(uvi).css({
          "background-color": "orange",
          width: "60px",
          color: "white",
        });
      } else {
        $(uvi).css({
          "background-color": "red",
          width: "60px",
          color: "white",
        });
      }
      $("#general-info").append(uvi);
    });
  }
  function returnStoredCities() {
    //get the last city from the local storage
    var storedcities = JSON.parse(localStorage.getItem("city"));
    if (storedcities !== null) {
      forecastAPI(storedcities);
    }
  }
});
