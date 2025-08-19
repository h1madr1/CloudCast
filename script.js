const apiKey = "e50556343ba1461b9c4175901251908";
const searchButton = document.getElementById("searchButton");
const inputSection = document.getElementById("inputSection");
const weatherResult = document.getElementById("weatherResult");

searchButton.addEventListener("click", () => {
  const city = inputSection.value.trim();
  if (!city) {
    alert("Please enter a city name");
    return;
  }
  fetchWeather(city);
});

inputSection.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchButton.click();
  }
});

async function fetchWeather(city) {
  try {
    weatherResult.innerHTML = "Loading...";

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
    );

    if (!response.ok) {
      throw new Error("City not found or API error");
    }

    const data = await response.json();

    displayWeather(data);
  } catch (error) {
    alert(error.message);
    weatherResult.innerHTML = "";
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    weatherResult.innerHTML = "Loading...";

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`
    );

    if (!response.ok) {
      throw new Error("Unable to fetch weather for your location");
    }

    const data = await response.json();

    displayWeather(data);
  } catch (error) {
    alert(error.message);
    weatherResult.innerHTML = "";
  }
}

function displayWeather(data) {
  const { temp_c, condition, humidity, wind_kph, wind_dir, feelslike_c, uv, vis_km } = data.current;
  const { name, country, localtime } = data.location;

  weatherResult.innerHTML = `
    <h2>${name}, ${country}</h2>
    <p><em>Local time: ${localtime}</em></p>
    <div style="display: flex; align-items: center; gap: 10px; justify-content: center; margin: 0 auto; width: fit-content;">
      <img src="https:${condition.icon}" alt="${condition.text}" style="width:64px; height:64px;">
      <div>
        <p style="font-size: 1.5rem; margin: 0;">${temp_c}°C</p>
        <p style="margin: 0;">${condition.text}</p>
      </div>
    </div>
    <hr style="border-color: white;">
    <p><strong>Feels like:</strong> ${feelslike_c}°C</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Wind:</strong> ${wind_kph} kph (${wind_dir})</p>
  `;
}

// On page load, get current position and fetch weather
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        alert("Could not get your location. Please search manually.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});