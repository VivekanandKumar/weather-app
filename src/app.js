const main = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((currentPosition) => {
      const lat = currentPosition.coords.latitude;
      const long = currentPosition.coords.longitude;
      apiCall(lat, long, dataDisplay);
    });
  } else {
    alert("Please enable location access");
  }
};

const apiCall = async (lat, long, currentWeather) => {
  const api = "8c0128a962301a10c65fdb2279ea5358";
  const excl = "hourly,minutely";
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&appid=${api}&exclude=${excl}`;
  const city_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}`;
  const data = await (await fetch(url)).json();
  const current = await (await fetch(city_url)).json();
  currentWeather(data, current.name);
};

const dataDisplay = (data, city) => {
  const icon = data.current.weather[0].icon;
  const temp = data.current.temp;
  const feels = data.current.feels_like;
  const desc = data.current.weather[0].description;
  const humidity = data.current.humidity;
  const visibility = data.current.visibility;
  const speed = data.current.wind_speed * 3.6;
  const pressure = data.current.pressure;
  const uv = data.current.uvi;
  const obj = [
    {
      classname: ".temp",
      classdata: `${Math.round(temp)}<sup>°C</sup>`,
    },
    {
      classname: ".bottom",
      classdata: desc,
    },
    {
      classname: ".city",
      classdata: city,
    },
    {
      classname: ".feels",
      classdata: `Feels like ${Math.round(feels)}<sup>°C</sup>`,
    },
    {
      classname: ".humidity .value",
      classdata: `${humidity} %`,
    },
    {
      classname: ".visibility .value",
      classdata: `${Math.round(visibility / 1000)} Km`,
    },
    {
      classname: ".speed .value",
      classdata: `${Math.round(speed)} Km/Hr`,
    },
    {
      classname: ".pressure .value",
      classdata: `${pressure} hPa`,
    },
    {
      classname: ".uv .value",
      classdata: `${Math.round(uv)} of 10`,
    },
  ];
  document
    .querySelector(".image")
    .setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png");
  obj.forEach((objData) => {
    display(objData.classname, objData.classdata);
  });
  dailyDisplay(data.daily);
};

const display = (c, d) => {
  document.querySelector(c).innerHTML = d;
};
const dailyDisplay = (daily) => {
  daily.forEach((element) => {
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
                      <div class="d-temp">${Math.round(
                        temp
                      )}<sup> °C</sup></div>
                  </div>
                  <div class="d-desc">${desc}</div>
              </div>
          </section>
          <section class="mid">
              <div class="left">
                  <div class="min-temp"><sub>Min</sub>${Math.round(
                    min
                  )}<sup>°C</sup></div>
              </div>
              <div class="right">
                  <div class="max-temp">
                      <sub>Max</sub>${Math.round(max)}<sup>°C</sup>
                  </div>
              </div>

          </section>
      </div>`;
  });
};
main();
