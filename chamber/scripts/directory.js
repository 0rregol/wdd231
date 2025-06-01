document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('business-container');
  
  async function loadBusinesses() {
    try {
      const response = await fetch('data/members.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return Array.isArray(data) ? data : []; // Asegura que sea un array
    } catch (error) {
      console.error('Error loading JSON:', error);
      return []; // Retorna array vacío si hay error
    }
  }

  function renderBusinesses(businesses) {
    if (!businesses.length) {
      container.innerHTML = '<p class="error">No businesses found. Please try again later.</p>';
      return;
    }
    
    container.innerHTML = businesses.map(biz => `
      <div class="business-card">
        <img src="images/${biz.image || 'placeholder.jpg'}" alt="${biz.name}">
        <h3>${biz.name}</h3>
        <p>📍 ${biz.address}</p>
        <p>📞 ${biz.phone}</p>
        <p>🌐 <a href="${biz.url}" target="_blank">Visit Website</a></p>
        <p>⭐ ${biz.membership} Member</p>
      </div>
    `).join('');
  }

  // Inicialización
  const businesses = await loadBusinesses();
  renderBusinesses(businesses);
});
