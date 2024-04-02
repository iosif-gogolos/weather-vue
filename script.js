function searchWeather() {
	const apiKey = '6be593f4f465d791251f8d9979a702f9';
	const city = document.getElementById('cityInput').value;
	const url =  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

	fetch(url)
		.then(response => {
			if(!response.ok){
				throw new Error('City not found');
			}
			return response.json();
		})
		.then(data => {
			displayCurrentWeather(data);
			fetchForecast(data.coord.lat, data.coord.lon);
		})
		.catch(error => {
			alert(error.message);
		});
}

function displayCurrentWeather(data) {
	const weatherInfo = document.getElementById('weatherInfo');
	weatherInfo.innerHTML = `
	<h2>${data.name}, ${data.sys.country}</h2>
	<p>Temperature: ${data.main.temp}°C</p>
	<p>Weather: ${data.weather[0].description}</p>
	<p>Humidity: ${data.main.humidity}%</p>
	<p>Wind Speed: ${data.wind.speed} m/s</p>
	`;
}

function fetchForecast(latitude, longitude) {
	const apiKey = '6be593f4f465d791251f8d9979a702f9';
	const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly&appid=${apiKey}&units=metric`;

	fetch(url)
		.then(response => {
			if (!response.ok) {
				throw new Error('Forecast data not available')
			}
			return response.json();
		})
		.then(data => {
			displayForecast(data.daily);
		})
		.catch(error => {
			alert(error.message);
		});
}

function displayForecast(dailyForecast) {
	const weatherInfo = document.getElementById('weatherInfo');
	const forecastSection = document.createElement('div');
	forecastSection.classList.add('forecast');

	dailyForecast.forEach(day => {
		const forecastDay = document.createElement('div');
		forecastDay.classList.add('forecast-day');
		forecastDay.innerHTML = `
			<p>${convertUnixTimestamp(day.dt)}</p>
			<p>${day.weather[0].description}</p>
			<p>Max Temp: ${day.temp.max}°C</p>
			<p>Min Temp: ${day.temp.min}°C</p>
		`;
		forecastSection.appendChild(forecastDay);
	});

	weatherInfo.appendChild(forecastSection)
}

function convertUnixTimestamp(timestamp) {
	const date = new Date(timestamp * 1000);
	const options = {weekday: 'short'};
	return date.toLocaleDateString('en-US', options);
}