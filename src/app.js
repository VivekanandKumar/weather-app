import { secret } from "../secret.js";
const api = secret;
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const exclude = "hourly,minutely";
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=${exclude}&units=metric&{""}&appid=${api}`;
    const city_url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api}`;
    // fetching data
    const currentCity = await (await fetch(city_url)).json();
    const data = await (await fetch(url)).json();

    const icon = data.current.weather[0].icon;
    const temp = data.current.temp;
    const feels = data.current.feels_like;
    const city = currentCity.name;
    const desc = currentCity.weather[0].main;
    const humidity = currentCity.main.humidity;
    const visibility = currentCity.visibility;
    const speed = currentCity.wind.speed;
    const pressure = currentCity.main.pressure;
    const uv = data.current.uvi;
    document
      .querySelector(".image")
      .setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png");

    document.querySelector(".temp").innerHTML =
      Math.round(temp) + "<sup>°C</sup>";

    document.querySelector(".bottom").innerHTML = desc;
    document.querySelector(".city").innerHTML = city;
    document.querySelector(".feels").innerHTML =
      "Feels like " + Math.round(feels) + " <sup>°C</sup>";
    document.querySelector(".humidity .value").textContent = humidity + " %";
    document.querySelector(".visibility .value").textContent =
      Math.round(visibility / 1000) + " Km";
    document.querySelector(".speed .value").textContent =
      Math.round(speed) + " Km/hr";
    document.querySelector(".pressure .value").textContent = pressure + " hPa";
    document.querySelector(".uv .value").textContent =
      Math.round(uv) + " of 10";

    data.daily.forEach((element) => {
      const day = moment(element.dt * 1000).format("dddd");
      const date = moment(element.dt * 1000).format("DD MMMM, YYYY");
      const temp = element.temp.day;
      const desc = element.weather[0].main;
      const min = element.temp.min;
      const max = element.temp.max;
      const icon = element.weather[0].icon;
      const image_url = "http://openweathermap.org/img/w/" + icon + ".png";
      const dailyWeather = document.querySelector(".daily");
      dailyWeather.innerHTML += `
      <div class="d-card">
          <section class="top">
              <div class="left">
                  <div class="date">${day}<br>${date}</div>
              </div>
              <div class="right">
                  <div class="wrapper">
                      <img src=${image_url} alt="">
                      <div class="d-temp">${temp}<sup> °C</sup></div>
                  </div>
                  <div class="d-desc">${desc}</div>
              </div>
          </section>
          <section class="mid">
              <div class="left">
                  <div class="min-temp"><sub>Min</sub>${min}<sup>°C</sup></div>
              </div>
              <div class="right">
                  <div class="max-temp">
                      <sub>Max</sub>${max}<sup>°C</sup>
                  </div>
              </div>

          </section>
      </div>`;
    });
  });
} else {
  alert("Please allow your location permission");
}
