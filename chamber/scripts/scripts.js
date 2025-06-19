document.addEventListener('DOMContentLoaded', function() {
   
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('show');
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

    
        const temp = Math.round(data.main.temp);
        const description = capitalizeFirstLetter(data.weather[0].description);
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    
        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


            weatherCurrent.innerHTML = `
           <div class="weather-info">
  <div class="weather-left">
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" 
         alt="${data.weather[0].description}" 
         class="weather-icon">
  </div>
  <div class="weather-right">
    <p class="temperature">${Math.round(data.main.temp)}°C</p>
    <p class="description">${capitalizeFirstLetter(data.weather[0].description)}</p>
    <p>High: ${Math.round(data.main.temp_max)}°C</p>
    <p>Low: ${Math.round(data.main.temp_min)}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Sunrise: ${sunriseTime}</p>
    <p>Sunset: ${sunsetTime}</p>
  </div>
</div>
        `;
    } catch (error) {
        console.error('Error fetching current weather:', error);
        weatherCurrent.innerHTML = '<p>Weather data unavailable</p>';
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
                    <p><strong>Tomorrow</strong></p>
                    <p>${Math.round(tomorrow.main.temp)}°C</p>
                    <p>${capitalizeFirstLetter(tomorrow.weather[0].description)}</p>
                </div>
                <div class="forecast-day">
                    <p><strong>Day after tomorrow</strong></p>
                    <p>${Math.round(dayAfter.main.temp)}°C</p>
                    <p>${capitalizeFirstLetter(dayAfter.weather[0].description)}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        weatherForecast.innerHTML = '<p>Forecast unavailable</p>';
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

        const selectedBusinesses = businesses.slice(0, 3);

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
                    <a href="${business.url}" target="_blank">Visit website</a>
                </p>
                ${business.membership ? 
                    `<span class="membership-badge ${membershipClass}">${business.membership}</span>` : 
                    ''}
            `;
        });
    } catch (error) {
        console.error('Error fetching businesses:', error);
        businessCards.forEach(card => {
            card.innerHTML = '<p>Business information unavailable</p>';
        });
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
document.getElementById("lastModified").textContent = document.lastModified;
document.addEventListener('DOMContentLoaded', function() {
 
  const now = new Date();
  document.getElementById('timestamp').value = now.toISOString();
  
  
  const modals = document.querySelectorAll('.modal');
  const infoBtns = document.querySelectorAll('.info-btn');
  const closeBtns = document.querySelectorAll('.close');
  
  infoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      document.getElementById(modalId).style.display = 'block';
    });
  });
  
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').style.display = 'none';
    });
  });
  
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });
  
  
  document.getElementById('current-year').textContent = new Date().getFullYear();
});

    document.addEventListener('DOMContentLoaded', function() {
      const params = new URLSearchParams(window.location.search);
      
      document.getElementById('display-name').textContent = 
        `${params.get('first-name')} ${params.get('last-name')}`;
      document.getElementById('display-email').textContent = params.get('email');
      document.getElementById('display-phone').textContent = params.get('phone');
      document.getElementById('display-business').textContent = params.get('business-name');
      
      const level = params.get('membership-level');
      let levelText = '';
      switch(level) {
        case 'np': levelText = 'NP Membership'; break;
        case 'bronze': levelText = 'Bronze Membership'; break;
        case 'silver': levelText = 'Silver Membership'; break;
        case 'gold': levelText = 'Gold Membership'; break;
        default: levelText = 'Unknown';
      }
      document.getElementById('display-level').textContent = levelText;
      
      const timestamp = new Date(params.get('timestamp'));
      document.getElementById('display-date').textContent = timestamp.toLocaleString();
    });
    
// Add to DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
  // ... existing code ...
  
  if (document.querySelector('.discover-container')) {
    loadDiscoverData();
    displayVisitMessage();
  }
});

async function loadDiscoverData() {
  try {
     const response = await fetch('data/discover.json');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    const gallery = document.querySelector('.gallery');
    
    data.attractions.forEach(attraction => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `
        <figure>
          <img src="images/${attraction.image}" alt="${attraction.name}" loading="lazy">
        </figure>
        <div class="gallery-item-content">
          <h2>${attraction.name}</h2>
          <address>${attraction.address}</address>
          <p>${attraction.description}</p>
        </div>
      `;
      gallery.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading discover data:', error);
    document.querySelector('.gallery').innerHTML = '<p>Unable to load attractions data.</p>';
  }
}

function displayVisitMessage() {
  const visitMessage = document.getElementById('visit-message');
  const lastVisit = localStorage.getItem('lastVisit');
  const currentDate = Date.now();
  
  if (!lastVisit) {
    visitMessage.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const daysBetween = Math.floor((currentDate - lastVisit) / (1000 * 60 * 60 * 24));
    
    if (daysBetween === 0) {
      visitMessage.textContent = "Back so soon! Awesome!";
    } else {
      const dayText = daysBetween === 1 ? "day" : "days";
      visitMessage.textContent = `You last visited ${daysBetween} ${dayText} ago.`;
    }
  }
  
  localStorage.setItem('lastVisit', currentDate);
}
