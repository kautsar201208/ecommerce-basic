    async function fetchProducts() {
    try {
      const response = await fetch('https://fakestoreapi.com/products'); // GANTI dengan API kamu
      const products = await response.json();

      const grid = document.getElementById('productGrid');
      grid.innerHTML = ''; // Kosongkan sebelum render

      products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl p-4 w-5xl h-6xl  shadow-lg';

        card.innerHTML = `
        <a href="detail.html?id=${product.id}" class="block">
          <img src="${product.image}" alt="${product.title}" class="h-40 mx-auto object-contain mb-2">
          <h3 class="text-sm font-semibold">${product.title}</h3>
          <p class="text-xs text-gray-700 mt-1">${product.description.substring(0, 60)}...</p>
          <p class="text-2xl font-bold mt-2 text-[#6C2A2A]">RP.${product.price.toLocaleString('id-ID')}</p>
          <p class="text-yellow-400 text-lg mb-2 ">★★★★★</p>
        <button class="bg-[#5B2C2C] w-2/4 hover:bg-amber-900 rounded-2xl float-right text-white">add to cart</button>
        </a>`
        ;

        grid.appendChild(card);
      });
    } catch (error) {
      console.error('Gagal memuat produk:', error);
    }
  }

  window.addEventListener('DOMContentLoaded', fetchProducts);
