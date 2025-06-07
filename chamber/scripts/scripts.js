document.addEventListener('DOMContentLoaded', function() {
    
    const hamburguesa = document.getElementById('hamburger');
    const enlaces = document.querySelector('.nav-links');
    
    if (hamburguesa && enlaces) {
        hamburguesa.addEventListener('click', () => {
            enlaces.classList.toggle('show');
        });
    }

    
    loadAllData();
});

async function loadAllData() {
    try {
        await getCurrentWeather();
        await getWeatherForecast();
        await getBusinesses();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

async function getCurrentWeather() {
    const weatherCurrent = document.querySelector('.weather-current');
    if (!weatherCurrent) return;

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Villa%20Alemana,cl&units=metric&appid=de00757dfc7a95e715c594a564faab54`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Current weather data:', data); 
        
        weatherCurrent.innerHTML = `
            <div class="weather-info">
                <p class="temperature">${Math.round(data.main.temp)}°C</p>
                <p class="description">${capitalizeFirstLetter(data.weather[0].description)}</p>
                <p>Max: ${Math.round(data.main.temp_max)}°C</p>
                <p>Min: ${Math.round(data.main.temp_min)}°C</p>
                <p>Humedad: ${data.main.humidity}%</p>
                <p>Viento: ${data.wind.speed} m/s</p>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching current weather:', error);
        weatherCurrent.innerHTML = '<p>Datos meteorológicos no disponibles</p>';
    }
}

async function getWeatherForecast() {
    const weatherForecast = document.querySelector('.weather-forecast');
    if (!weatherForecast) return;

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Villa%20Alemana,cl&units=metric&appid=de00757dfc7a95e715c594a564faab54`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Forecast data:', data); 

        const tomorrow = data.list.find(item => {
            const date = new Date(item.dt * 1000);
            return date.getDate() === new Date().getDate() + 1;
        });
        
        const dayAfter = data.list.find(item => {
            const date = new Date(item.dt * 1000);
            return date.getDate() === new Date().getDate() + 2;
        });

        weatherForecast.innerHTML = `
            <div class="forecast-info">
                <div class="forecast-day">
                    <p><strong>Mañana</strong></p>
                    <p>${Math.round(tomorrow.main.temp)}°C</p>
                    <p>${capitalizeFirstLetter(tomorrow.weather[0].description)}</p>
                </div>
                <div class="forecast-day">
                    <p><strong>Pasado mañana</strong></p>
                    <p>${Math.round(dayAfter.main.temp)}°C</p>
                    <p>${capitalizeFirstLetter(dayAfter.weather[0].description)}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        weatherForecast.innerHTML = '<p>Pronóstico no disponible</p>';
    }
}

async function getBusinesses() {
    const businessCards = document.querySelectorAll('.business-card');
    if (businessCards.length === 0) return;

    try {
        const response = await fetch('data/members.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const businesses = await response.json();
        console.log('Businesses data:', businesses);  

        const selectedBusinesses = businesses.slice(0, 3); // 👈 aquí el cambio

        selectedBusinesses.forEach((business, index) => {
            const membershipClass = business.membership ? business.membership.toLowerCase() : '';
            
            businessCards[index].innerHTML = `
                <div class="business-image-container">
                    <img src="images/${business.image}" alt="${business.name}" onerror="this.onerror=null;this.src='images/default-business.jpg'">
                </div>
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
        businessCards.forEach(card => {
            card.innerHTML = '<p>Información de negocio no disponible</p>';
        });
    }
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
