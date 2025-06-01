document.addEventListener('DOMContentLoaded', async () => {
 
  const container = document.getElementById('business-container');
  const gridBtn = document.getElementById('grid-btn');
  const listBtn = document.getElementById('list-btn');


  async function loadBusinesses() {
    const response = await fetch('./data/members.json');
    return await response.json();
  }


  function renderBusinesses(businesses, viewType = 'grid') {
    container.className = `${viewType}-view`; // Añade la clase 'grid-view' o 'list-view'
    container.innerHTML = businesses.map(biz => `
      <div class="business-card">
        <img src="images/${biz.image}" alt="${biz.name}">
        <h3>${biz.name}</h3>
        <p>📍 ${biz.address}</p>
        <p>📞 ${biz.phone}</p>
        <p>🌐 <a href="${biz.url}" target="_blank">Website</a></p>
        <p>⭐ ${biz.membership} Member</p>
      </div>
    `).join('');
  }


  gridBtn.addEventListener('click', () => {
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
    renderBusinesses(businesses, 'grid');
  });

  listBtn.addEventListener('click', () => {
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
    renderBusinesses(businesses, 'list');
  });

 
  const businesses = await loadBusinesses();
  renderBusinesses(businesses, 'grid'); // Vista por defecto: grid
});
