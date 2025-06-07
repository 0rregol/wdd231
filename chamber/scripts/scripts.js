const hamburguesa = document.getElementById('hamburger');
const enlaces = document.querySelector('.nav-links');

hamburguesa.addEventListener('click', () => {
    enlaces.classList.toggle('show');
});

const apiKey = 'de00757dfc7a95e715c594a564faab54';
const weatherCurrent = document.querySelector('.weather-current');
const weatherForecast = document.querySelector('.weather-forecast');


async function getCurrentWeather() {
    try {
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Villa%20Alemana,cl&units=metric&appid=${apiKey}`);
        const data = await response.json();
        
        const weatherHTML = `
            <div class="weather-info">
                <p class="temperature">${Math.round(data.main.temp)}°C</p>
                <p class="description">${data.weather[0].description}</p>
                <p>High: ${Math.round(data.main.temp_max)}°C</p>
                <p>Low: ${Math.round(data.main.temp_min)}°C</p>
                <p>Humidity: ${data.main.humidity}%</p>
            </div>
        `;
        weatherCurrent.innerHTML = weatherHTML;
    } catch (error) {
        console.error('Error fetching current weather:', error);
        weatherCurrent.innerHTML = '<p>Weather data unavailable</p>';
    }
}


async function getWeatherForecast() {
    try {
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Villa%20Alemana,cl&units=metric&appid=${apiKey}`);
        const data = await response.json();
        
    
        const forecastHTML = `
            <div class="forecast-info">
                <div class="forecast-day">
                    <p>Tomorrow: ${Math.round(data.list[7].main.temp)}°C</p>
                    <p>${data.list[7].weather[0].description}</p>
                </div>
                <div class="forecast-day">
                    <p>Day after: ${Math.round(data.list[15].main.temp)}°C</p>
                    <p>${data.list[15].weather[0].description}</p>
                </div>
            </div>
        `;
        weatherForecast.innerHTML = forecastHTML;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        weatherForecast.innerHTML = '<p>Forecast unavailable</p>';
    }
}
async function getBusinesses() {
    try {
        const response = await fetch('data/members.json');
        const businesses = await response.json();
        
        
        const shuffled = [...businesses].sort(() => 0.5 - Math.random());
        const selectedBusinesses = shuffled.slice(0, 3);
        
        const businessCards = document.querySelectorAll('.business-card');
        
       
        selectedBusinesses.forEach((business, index) => {
            
            let membershipClass = '';
            if (business.membership) {
                membershipClass = business.membership.toLowerCase();
            }
            
            businessCards[index].innerHTML = `
                <img src="images/${business.image}" alt="${business.name}">
                <h3>${business.name}</h3>
                <p class="business-address">${business.address}</p>
                <p class="business-phone">${business.phone}</p>
                <p class="business-url">
                    <a href="${business.url}" target="_blank">Visitar sitio web</a>
                </p>
                ${business.membership ? 
                    `<span class="membership-badge ${membershipClass}">${business.membership}</span>` : 
                    ''}
            `;
        });
    } catch (error) {
        console.error('Error fetching businesses:', error);
        document.querySelectorAll('.business-card').forEach(card => {
            card.innerHTML = '<p>Información de negocio no disponible</p>';
        });
    }
}