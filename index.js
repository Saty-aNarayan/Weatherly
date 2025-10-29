document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "7966ecb61ecc24fbd089dc8ca66c85ed";

  // Elements
  const locationEl = document.getElementById("location");
  const timeEl = document.getElementById("time");
  const dateEl = document.getElementById("date");
  const summaryEl = document.getElementById("summary");
  const weatherIcon = document.getElementById("weather-icon");
  const forecastCards = document.querySelectorAll(".forecast .card");
  const searchBtn = document.getElementById("search-btn");
  const cityInput = document.getElementById("city-input");
  const themeToggle = document.getElementById("theme-toggle");

  // Handle city search
  searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
      fetchCurrentWeather(city);
      fetchForecast(city);
    }
  });

  // Handle theme switching
  let isDark = true;
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    isDark = !isDark;
    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  });

  // Update time and date
  function updateDateTime() {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    dateEl.textContent = now.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }

  // Fetch current weather
  async function fetchCurrentWeather(city = "Chennai") {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod !== 200) throw new Error(data.message);

      locationEl.textContent = `${data.name}, ${data.sys.country}`;
      summaryEl.textContent = `${data.weather[0].main} — ${data.weather[0].description}`;
      weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherIcon.alt = data.weather[0].description;
    } catch (err) {
      console.error("Error fetching weather:", err);
      summaryEl.textContent = "Could not load weather data 😢";
      locationEl.textContent = "Unknown";
    }
  }

  // Fetch 5-day forecast
  async function fetchForecast(city = "Chennai") {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod !== "200") throw new Error(data.message);

      const dailyForecasts = data.list
        .filter((item) => item.dt_txt.includes("12:00:00"))
        .slice(0, 5);

      dailyForecasts.forEach((forecast, i) => {
        const date = new Date(forecast.dt_txt);
        const dayName = date.toLocaleDateString(undefined, {
          weekday: "short",
        });
        const temp = Math.round(forecast.main.temp);
        const icon = forecast.weather[0].icon;
        const desc = forecast.weather[0].description;

        if (forecastCards[i]) {
          forecastCards[i].innerHTML = `
            <h4>${dayName}</h4>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}">
            <p>${temp}°C</p>
            <p style="font-size:0.8rem; opacity:0.8;">${desc}</p>
          `;
        }
      });
    } catch (err) {
      console.error("Error fetching forecast:", err);
    }
  }

  // Initialize
  updateDateTime();
  setInterval(updateDateTime, 60000);
  fetchCurrentWeather();
  fetchForecast();
});
