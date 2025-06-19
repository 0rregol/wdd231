function getRadiusForMagnitude(magnitude) {
    return Math.min(5 + (magnitude * 3), 20);
}

function getColorForMagnitude(magnitude) {
    if (magnitude < 4.0) return '#4CAF50';
    if (magnitude < 5.0) return '#FFC107';
    if (magnitude < 6.0) return '#FF9800';
    return '#F44336';
}

function updateLastUpdated(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = new Date().toLocaleString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }
}

async function fetchEarthquakeData() {
    try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.features;
    } catch (error) {
        
        return null;
    }
}

async function fetchHistoricalQuakes() {
    try {
        const response = await fetch('data/history.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching historical earthquake data:', error);
        return null;
    }
}

let mapInstance;

function initMap() {
    if (document.getElementById('map') && !mapInstance) {
        mapInstance = L.map('map').setView([-35.6751, -71.5430], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);
        return mapInstance;
    }
    return mapInstance;
}

function displayEarthquakes(earthquakes) {
    if (!mapInstance) return;

    mapInstance.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
            mapInstance.removeLayer(layer);
        }
    });

    const quakeListContainer = document.getElementById('quake-list-container');
    if (!quakeListContainer) return;
    quakeListContainer.innerHTML = '';

    let maxMagnitude = 0;
    let totalQuakes = 0;

    const timeFilter = parseInt(document.getElementById('time-filter')?.value || '168');
    const magnitudeFilter = parseFloat(document.getElementById('magnitude-filter')?.value || '0');
    const now = new Date();

    const filteredQuakes = earthquakes.filter(quake => {
        const quakeProperties = quake.properties;
        const quakeMagnitude = parseFloat(quakeProperties.mag);
        if (isNaN(quakeMagnitude) || quakeMagnitude < magnitudeFilter) return false;

        const quakeTime = new Date(quakeProperties.time);
        if (isNaN(quakeTime.getTime())) {
            console.warn('Invalid date for quake:', quakeProperties.time);
            return false;
        }
        const hoursDiff = (now - quakeTime) / (1000 * 60 * 60);
        if (hoursDiff > timeFilter) return false;

        const lon = quake.geometry.coordinates[0];
        const lat = quake.geometry.coordinates[1];
        const minLat = -56.0;
        const maxLat = -17.0;
        const minLon = -80.0;
        const maxLon = -65.0;

        if (lat < minLat || lat > maxLat || lon < minLon || lon > maxLon) {
             return false;
        }

        return true;
    }).sort((a, b) => b.properties.time - a.properties.time);

    filteredQuakes.forEach(quake => {
        totalQuakes++;
        const quakeProperties = quake.properties;
        const currentMagnitude = parseFloat(quakeProperties.mag);
        if (currentMagnitude > maxMagnitude) {
            maxMagnitude = currentMagnitude;
        }

        const lon = quake.geometry.coordinates[0];
        const lat = quake.geometry.coordinates[1];
        const depth = quake.geometry.coordinates[2];

        if (!isNaN(lat) && !isNaN(lon)) {
            const marker = L.circleMarker([lat, lon], {
                radius: getRadiusForMagnitude(currentMagnitude),
                fillColor: getColorForMagnitude(currentMagnitude),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(mapInstance);

            marker.bindPopup(`
                <strong>Magnitude ${currentMagnitude}</strong><br>
                ${quakeProperties.place}<br> ${new Date(quakeProperties.time).toLocaleString('es-CL', { hour12: false })}<br>
                Depth: ${depth} km
            `);
        }

        const quakeItem = document.createElement('div');
        quakeItem.className = 'quake-item';
        quakeItem.innerHTML = `
            <div class="quake-magnitude">${currentMagnitude.toFixed(1)}</div>
            <div class="quake-info">
                <div class="quake-location">${quakeProperties.place}</div>
                <div class="quake-time">${new Date(quakeProperties.time).toLocaleString('es-CL', { hour12: false })}</div>
                <div class="quake-depth">Depth: ${depth} km</div>
            </div>
        `;
        quakeListContainer.appendChild(quakeItem);
    });

    document.getElementById('total-quakes').textContent = totalQuakes;
    document.getElementById('max-magnitude').textContent = maxMagnitude.toFixed(1);

    const alertBanner = document.getElementById('alert-banner');
    const alertText = document.getElementById('alert-text');
    if (alertBanner && alertText) {
        if (maxMagnitude >= 6.0) {
            const strongestQuake = filteredQuakes.find(q => parseFloat(q.properties.mag) === maxMagnitude);
            alertBanner.style.display = 'flex';
            alertText.textContent =
                `Magnitude ${maxMagnitude.toFixed(1)} earthquake detected near ${strongestQuake?.properties.place || 'Unknown'} at ${new Date(strongestQuake?.properties.time || Date.now()).toLocaleString('es-CL', { hour12: false })}`;
        } else {
            alertBanner.style.display = 'none';
        }
    }
}

function setupNavigation() {
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            hamburgerBtn.classList.toggle('open');
            const isOpen = navLinks.classList.contains('open');
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
        });
    }

    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                hamburgerBtn.classList.remove('open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

function setupModal() {
    const openModalBtn = document.getElementById('open-kit-modal');
    const closeModalBtn = document.getElementById('close-kit-modal');
    const modal = document.getElementById('kit-modal');

    if (openModalBtn && closeModalBtn && modal) {
        openModalBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            closeModalBtn.focus();
        });

        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            openModalBtn.focus();
        });

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                openModalBtn.focus();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                openModalBtn.focus();
            }
        });
    }
}

function displayHistoricalQuakes(quakes) {
    const container = document.getElementById('historical-quake-cards');
    if (!container) return;

    container.innerHTML = '';

    const quakesToDisplay = quakes.slice(0, 15); 
    quakesToDisplay.forEach(quake => {
        const card = document.createElement('div');
        card.className = 'historical-card';

        
        let imageHtml = '';
        if (quake.image) {
           
            imageHtml = `<img src="${quake.image}" alt="Image of the ${quake.year} ${quake.location} earthquake" class="historical-card-image" loading="lazy">`;
        }

        card.innerHTML = `
            ${imageHtml} <div class="historical-card-content">
                <h3>M${quake.magnitude} ${quake.location} (${quake.year})</h3>
                <p><strong>Date:</strong> ${quake.date}</p>
                <p>${quake.description}</p>
                <p class="sr-only">Magnitude: ${quake.magnitude}, Year: ${quake.year}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

function displayFormData() {
    const submittedDataContainer = document.getElementById('submitted-data');
    if (!submittedDataContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    let htmlContent = '<h4>Information Shared:</h4><ul>';
    let dataFound = false;

    const labelMap = {
        name: 'Name',
        location: 'Location',
        date: 'Approximate Date',
        magnitude: 'Approximate Magnitude',
        message: 'Your Story',
    };

    for (const [key, value] of urlParams.entries()) {
        if (key === 'impact') continue;
        dataFound = true;
        const displayKey = labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
        htmlContent += `<li><strong>${displayKey}:</strong> ${decodeURIComponent(value)}</li>`;
    }
    htmlContent += '</ul>';

    if (dataFound) {
        submittedDataContainer.innerHTML = htmlContent;
    } else {
        submittedDataContainer.innerHTML = '<p>No data submitted.</p>';
    }
}

function setupStoryForm() {
    const form = document.getElementById('storyForm');
    if (form) {
        const nameInput = document.getElementById('story-name');
        const locationInput = document.getElementById('story-location');
        const dateInput = document.getElementById('story-date');
        const magnitudeInput = document.getElementById('story-magnitude');
        const messageInput = document.getElementById('story-message');

        const formElements = [nameInput, locationInput, dateInput, magnitudeInput, messageInput].filter(Boolean);

        formElements.forEach(input => {
            const storedValue = localStorage.getItem(`storyForm-${input.id}`);
            if (storedValue) {
                input.value = storedValue;
            }
        });

        formElements.forEach(input => {
            input.addEventListener('input', (e) => {
                localStorage.setItem(`storyForm-${input.id}`, e.target.value);
            });
        });

        form.addEventListener('submit', () => {
            formElements.forEach(input => {
                localStorage.removeItem(`storyForm-${input.id}`);
            });
        });
    }
}

async function init() {
    setupNavigation();

    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html' || currentPage === '') {
        initMap();
        await handleIndexPageData();

        document.getElementById('refresh-btn')?.addEventListener('click', handleIndexPageData);

        const timeFilter = document.getElementById('time-filter');
        const magnitudeFilter = document.getElementById('magnitude-filter');

        if (timeFilter && magnitudeFilter) {
            timeFilter.value = localStorage.getItem('quakeTimeFilter') || '168';
            magnitudeFilter.value = localStorage.getItem('quakeMagnitudeFilter') || '0';

            timeFilter.addEventListener('change', (e) => {
                localStorage.setItem('quakeTimeFilter', e.target.value);
                handleIndexPageData();
            });
            magnitudeFilter.addEventListener('change', (e) => {
                localStorage.setItem('quakeMagnitudeFilter', e.target.value);
                handleIndexPageData();
            });
        }

    } else if (currentPage === 'safety.html') {
        setupModal();
        updateLastUpdated('last-updated-safety');
    } else if (currentPage === 'history.html') {
        const historicalData = await fetchHistoricalQuakes();
        if (historicalData) {
            displayHistoricalQuakes(historicalData);
        }
        setupStoryForm();
        updateLastUpdated('last-updated-history');
    } else if (currentPage === 'form-action.html') {
        displayFormData();
        updateLastUpdated('last-updated-form-action');
    } else if (currentPage === 'attributions.html') {
        updateLastUpdated('last-updated-attributions');
    }
}

async function handleIndexPageData() {
    const data = await fetchEarthquakeData();
    if (data) {
        displayEarthquakes(data);
        updateLastUpdated('last-updated');
    }
}

document.addEventListener('DOMContentLoaded', init);
