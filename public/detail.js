// detail.js
document.addEventListener('DOMContentLoaded', () => {
  const detailContainer = document.getElementById('product-detail');
  if (!detailContainer) return console.error('#product-detail tidak ditemukan');

  let selectedQuantity = 1;  // default quantity

  // Fetch produk berdasarkan query param ?id=…
  async function fetchProduct() {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id') || '1';
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      const product = await res.json();
      renderProduct(product);
    } catch (err) {
      console.error('Gagal ambil produk:', err);
      detailContainer.innerHTML = `<p class="text-red-500">Gagal memuat produk.</p>`;
    }
  }

  // Render HTML detail sesuai Figma
  function renderProduct(product) {
    detailContainer.innerHTML = `
      <div class="flex flex-col lg:flex-row gap-10 p-6">
        <!-- Gambar -->
        <div class="lg:w-1/2 flex justify-center">
          <img src="${product.image}"
               alt="${product.title}"
               class="w-full max-w-md object-contain rounded-lg" />
        </div>

        <!-- Info -->
        <div class="lg:w-1/2 flex flex-col justify-between">
          <!-- Judul & rating -->
          <div>
            <h1 class="text-4xl font-serif font-bold mb-2 leading-tight">
              ${product.title}
            </h1>
            <div class="flex items-center text-gray-600 text-sm mb-6">
              <span class="mr-4">${product.rating.count}rb Penilaian</span>
              <button id="report-btn" class="underline">laporkan</button>
            </div>

            <!-- Harga -->
            <div class="flex items-baseline gap-4 mb-8">
              <span class="text-3xl font-bold">RP.${product.price.toLocaleString('id')}</span>
              <span class="text-gray-400 line-through">RP.${product.price.toLocaleString('id')}</span>
            </div>
          </div>

          <!-- Quantity controls -->
          <div class="flex items-center gap-4 mb-8">
            <button id="decrease-btn"
                    class="w-12 h-12 rounded-full bg-[#5E1D1D] flex items-center justify-center text-white text-2xl">
              &minus;
            </button>
            <span id="quantity-display"
                  class="text-xl font-semibold">${selectedQuantity}</span>
            <button id="increase-btn"
                    class="w-12 h-12 rounded-full bg-[#5E1D1D] flex items-center justify-center text-white text-2xl">
              &#43;
            </button>
          </div>

          <!-- Add to cart -->
          <button id="add-to-cart"
                  class="px-8 py-4 bg-[#5E1D1D] text-white font-semibold rounded-lg hover:opacity-90 transition">
            Tambah ke Keranjang
          </button>
        </div>
      </div>

      <div class="container mx-auto mt-20">
        <!-- Deskripsi full-width -->
        <div class="relative p-8 bg-white rounded-lg shadow-sm">
          <h2 class="relative text-2xl font-semibold mb-4">Deskripsi :</h2>
          <p class="relative text-gray-700 leading-relaxed">${product.description}</p>
        </div>
      </div>
    `;

    // Pasang listener quantity
    document.getElementById('increase-btn')
      .addEventListener('click', () => updateQuantity(1));
    document.getElementById('decrease-btn')
      .addEventListener('click', () => updateQuantity(-1));

    // Pasang listener addToCart
    document.getElementById('add-to-cart')
      .addEventListener('click', () => addToCart(product));
  }

  // Update UI & state quantity
  function updateQuantity(delta) {
    selectedQuantity = Math.max(1, selectedQuantity + delta);
    document.getElementById('quantity-display').innerText = selectedQuantity;
  }

  // Simpan ke localStorage dengan jumlah selectedQuantity
  function addToCart(product) {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const exists = cart.find(item => item.id === product.id);

      if (exists) {
        exists.quantity += selectedQuantity;
      } else {
        cart.push({
          id:        product.id,
          title:     product.title,
          price:     product.price,
          image:     product.image,
          quantity:  selectedQuantity
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${selectedQuantity} × "${product.title}" berhasil ditambahkan!`);
    } catch (err) {
      console.error('Gagal menambahkan ke cart:', err);
      alert('Terjadi kesalahan saat menambahkan ke keranjang.');
    }
  }

  fetchProduct();
});
