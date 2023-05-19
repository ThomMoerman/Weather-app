const apiKey = '2f6da3047fdb593f8ea05df07e5d38bd';
const forecastElement = document.getElementById('requestContainer');
const cityInput = document.querySelector('.cityInput');
let cityResults = [];

// Function to fetch weather data
function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            saveCityResults(city, data);
        })
        .catch(error => console.log(error));
}

// Function to save city results
function saveCityResults(city, data) {
    const cityResult = {
        city: city,
        data: data
    };
    cityResults.push(cityResult);
    saveCityResultsToLocalStorage();
}

// Function to display weather data
function displayWeatherData(data) {
    const resultsContainer = document.createElement('div');
    resultsContainer.classList.add('results-container');
    resultsContainer.innerHTML = `<h2>${data.city.name}</h2>`;

    for (let i = 0; i < data.list.length; i++) {
        const forecast = data.list[i];
        const temperature = convertKelvinToCelsius(forecast.main.temp);
        const description = forecast.weather[0].description;
        const date = new Date(forecast.dt_txt);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[date.getDay()];
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        if (i % 8 === 0) {
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
          <p class="dayDate">${dayOfWeek} ${formattedDate}</p>
          <p>Temperature: ${temperature} °C</p>
          <p>Description: ${description}</p>
        `;
            resultsContainer.appendChild(forecastItem);
        }
    }

    forecastElement.appendChild(resultsContainer);
    cityInput.value = "";
}

// Event listener for the submit button
const submitBtn = document.querySelector('.submitBtn');
submitBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();

    if (city !== '') {
        getWeatherData(city);
        cityInput.value = '';
    }
});

// Event listener for the Enter key
cityInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();

        if (city !== '') {
            getWeatherData(city);
            cityInput.value = '';
        }
    }
});

// Clear results
const clearBtn = document.querySelector('.clearBtn');
clearBtn.addEventListener('click', () => {
    forecastElement.innerHTML = '';
    cityResults = [];
    localStorage.removeItem('cityResults');
});

// Function to convert temperature from Kelvin to Celsius
function convertKelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

// Function to save city results to localStorage
function saveCityResultsToLocalStorage() {
    localStorage.setItem('cityResults', JSON.stringify(cityResults));
}

// Retrieve saved city results on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedCityResults = localStorage.getItem('cityResults');
    if (savedCityResults) {
        cityResults = Array.from(JSON.parse(savedCityResults));
        cityResults.forEach(result => {
            displayWeatherData(result.data);
        });
    }
});