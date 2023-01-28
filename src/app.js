const searchBtn = document.getElementById("search-btn");
const inputPin = document.getElementById("search-input");
const wrapper = document.querySelector('.search-wrapper');
const loading = document.getElementById('display_loading');
searchBtn.addEventListener('click', (el) => {
  if (searchBtn.getAttribute('src').indexOf('close') > -1) {
    inputPin.value = '';
    searchBtn.setAttribute('src', 'images/search.png');
    inputPin.focus();
    return;
  }
  inputPin.classList.remove('hide');
  inputPin.focus();
});

inputPin.addEventListener('keyup', (el) => {
  const keyValue = el.target.value;
  if (keyValue.length) {
    searchBtn.setAttribute('src', 'images/close.png');
    if (inputPin.value.length) {
      const pincode = inputPin.value;
      if (pincode.length == 6) {
        main(pincode);
      }
    }
  } else {
    searchBtn.setAttribute('src', 'images/search.png');
  }
})


const main = (pincode) => {
  loading.classList.remove('hide');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((currentPosition) => {
      let lat = currentPosition.coords.latitude;
      let long = currentPosition.coords.longitude;
      apiCall(lat, long, pincode, dataDisplay);
    });
  }
  // loading.classList.add('hide');
};

const apiCall = async (lat, long, pincode, currentWeather) => {
  loading.classList.remove('hide');
  const api = "8c0128a962301a10c65fdb2279ea5358";
  const apiKey = "7b5b7092e07305fcb5aa76f751d0f0c9";
  const excl = "hourly,minutely";
  const zipurl = `https://thezipcodes.com/api/v1/search?zipCode=${pincode}&countryCode=IN&apiKey=${apiKey}`;
  const zipdata = await (await fetch(zipurl)).json();
  if (zipdata.location.length !== 0) {
    const zipData = zipdata.location[0];
    lat = zipData.latitude;
    long = zipData.longitude;
  }else{
    if(pincode){
      alert('Please Check Pincode !');
      loading.classList.add('hide');
      return;
    }
  }
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&appid=${api}&exclude=${excl}`;
  const city_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}`;

  const data = await (await fetch(url)).json();
  const current = await (await fetch(city_url)).json();
  currentWeather(data, current.name);
  loading.classList.add('hide');
};

const dataDisplay = (data, city) => {
  loading.classList.remove('hide');
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
  loading.classList.add('hide');
};

const display = (c, d) => {
  document.querySelector(c).innerHTML = d;
};
const dailyDisplay = (daily) => {
  loading.classList.remove('hide');
  const dailyWeather = document.querySelector(".daily");
  dailyWeather.innerHTML = '';
  daily.forEach((element) => {
    const day = moment(element.dt * 1000).format("dddd");
    const date = moment(element.dt * 1000).format("DD MMMM, YYYY");
    const temp = element.temp.day;
    const desc = element.weather[0].main;
    const min = element.temp.min;
    const max = element.temp.max;
    const icon = element.weather[0].icon;
    const image_url = "http://openweathermap.org/img/w/" + icon + ".png";
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
  loading.classList.add('hide');
};
const getPositionByPincode = async (pincode) => {
  try {
    const result = await (await fetch(url)).json();
    return result.location[0];
  } catch (error) {
    console.log(error);
  }
};

main();


function handleBlur(el) {
  if (el.value.length > 0) return;
  inputPin.classList.add('hide');
  // wrapper.classList.add('deaminate');
}