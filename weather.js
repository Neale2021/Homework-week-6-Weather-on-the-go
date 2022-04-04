//variable definitions
var apiKey = '&appid=adef4f7ebf084604839aecf5ccae85a5&&units=metric'
var city = ''
var cityId = $('#searchbox')
var cityName= $('#city-name');
var cityTemp= $('#city-temp');
var humidityDiv= $('#humidity');
var windSpeedDiv= $('#wind-speed');
var uv = $('#uv');
var cityInput = cityId.val()
var storeCity = $('#newcity');
var newCity = "";
var cityArray= [];
var d = new Date()
var day = d.getDate()
var dayOneDate = $('#date')
var dayOneTemp = $('#temp')
var dayOneHum = $('#hum')
var month= d.getMonth()+1
var cityImg = $('#city-img')

weather.icon




//search button listener

    $('input').on('search',(function(event) {
        event.preventDefault();
        value = $(this).val();
        //console.log(value);
        storeCity.prepend('<p>' + value)
        city=value
        cityArray.push(city)
        localStorage.setItem("cityname", JSON.stringify(cityArray))
        currentWeather(city)
        forecast(city)
    }))  


//Ajax call for current weather in inputted city
  function currentWeather (city) {
    var queryUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + apiKey
    $.ajax({
        url:queryUrl,
        method:"GET",

    }).then(function(response){
        var cityNameOut = (response.city.name)
        var cityTempOut= response.list[0].main.temp
        var cityHumidityOut = response.list[0].main.humidity
        var cityWindOut = response.list[0].wind.speed
        var icon = response.list[0].weather[0].icon;
        var iconadd= "https://openweathermap.org/img/wn/"+ icon + "@2x.png"


        cityName.html("City: " + cityNameOut)
        cityTemp.html("Current Temperature: " + cityTempOut)
        humidityDiv.html("Humidity: " + cityHumidityOut + "%")
        windSpeedDiv.html("Wind Speed: " + cityWindOut)
        cityImg.html('<img src='+iconadd+'>')
        uvIndex(response.city.coord.lon, response.city.coord.lat)
        
        
    //sets up local storage
       forecast(city)
        if(response.cod==200){
            cityArray=JSON.parse(localStorage.getItem("cityname"));
            if(cityArray==null){
                cityArray=[]
                cityArray.push(city.toUpperCase()
                );
                localStorage.setItem("cityname", JSON.stringify(cityArray));
            }
            }
    })

  }




//ajax call to weather api for forecast

function forecast(city) {
    var queryUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + apiKey

    $.ajax({
    url: queryUrl,
    method: 'GET',
   
    
    }).then(function(response){
        console.log(response)
        for (i=0; i<6; i++){
            var icon = response.list[i].weather[0].icon;
            var iconadd= "https://openweathermap.org/img/wn/"+icon + "@2x.png"
            var tempKel = response.list[i].main.temp;
            var tempC =(tempKel);
            var humidityFore = response.list[i].main.humidity;
            var fDays= parseInt(day + i)
        

            $('#date'+i).html(''+ fDays +'/'+ month );
            $('#temp'+i).html(tempC);
            $('#hum'+i).html(humidityFore + '%')
            $('#img'+i).html('<img src='+iconadd+ '>')
            
            

        }
       
        }
    //})}
    )}
 //get uv index function
 function uvIndex(ln,lat){
    var uvUrl = 'https://api.openweathermap.org/data/2.5/uvi?' + apiKey + '&lat=' +lat + '&lon='+ ln;
    $.ajax({
        url: uvUrl,
        method: 'GET',



    }).then (function(response){
        if (response.value <2){
            uv.html("" +response.value)
            uv.css('background-color', 'pink')

        }else if (response.value <6){
            uv.html('' +response.value)
            uv.css('background-color', 'lightblue')
        }else if (response.value <8) {
            uv.html(''+response.value)
            uv.css('background-color', 'lightgreen')
        } else {
            uv.html (''+ response.value);
            uv.css ('background-color', 'gold')
        }


    })
}


//gets previously searched item and displays it as current city
    function reload () {
        newcitystore.empty()
        var cityArray = localStorage.getItem("cityname");
        if (cityArray !==null) {
        cityArray = JSON.parse(localStorage.getItem("cityname"));
           for (i=0; i<cityArray.length; i++){
            
            //newcitystore.prepend('<p>' + cityArray[i])
        }
        city=cityArray[i-1];
        
        currentWeather(city)
        forecast(city)

        }


    }



   function pastSearch (event) {
       console.log(event.target)
       var target=event.target;
       if(event.target.matches('p')){
           city=target.textContent.trim();
           currentWeather(city)
           forecast(city)
       }
   }
    
console.log(cityArray)
$(document).on('click', pastSearch)
