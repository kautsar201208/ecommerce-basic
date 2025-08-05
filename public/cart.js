document.addEventListener('DOMContentLoaded', () => {
  const container   = document.getElementById('cart-container');
  const clearBtn    = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!container) {
    console.error('Elemen #cart-container tidak ditemukan');
    return;
  }
  if (!clearBtn)    console.warn('Tombol #clear-cart tidak ditemukan');
  if (!checkoutBtn) console.warn('Tombol #checkout-btn tidak ditemukan');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function renderCart() {
    container.innerHTML = '';
    if (cart.length === 0) {
      container.innerHTML = `<p class="text-center text-gray-600">Keranjang masih kosong.</p>`;
      return;
    }

    let total = 0;

    cart.forEach((product, index) => {
      const subtotal = product.price * product.quantity;
      total += subtotal;

      const productEl = document.createElement('div');
      productEl.className = 'bg-white rounded-xl shadow p-4 mb-4 flex flex-col sm:flex-row items-center justify-between';

      productEl.innerHTML = `
        <div class="w-32 h-auto flex-shrink-0 mr-4 object-cover">
          <img src="${product.image}" alt="${product.title}" class="w-25 h-auto rounded-lg">
        </div>
        <div class="flex-1">
          <h3 class="font-semibold flex items-center">
            <input type="checkbox" class="mr-2 product-checkbox" data-index="${index}">
            ${product.title}
          </h3>
          <p>${formatCurrency(product.price)}</p>
        </div>
        <div class="flex items-center gap-2">
          <button data-index="${index}" class="decrease px-2 py-1 border rounded">-</button>
          <span>${product.quantity}</span>
          <button data-index="${index}" class="increase px-2 py-1 border rounded">+</button>
          <button data-index="${index}" class="delete-item ml-4 text-red-500">Hapus</button>
        </div>
        <div class="font-semibold ml-4">${formatCurrency(subtotal)}</div>
      `;

      container.appendChild(productEl);
    });

    const totalEl = document.createElement('div');
    totalEl.className = 'text-right mt-6 text-xl font-bold text-gray-800';
    totalEl.innerText = `Total: ${formatCurrency(total)}`;
    container.appendChild(totalEl);
  }

  container.addEventListener('click', e => {
    const idx = e.target.dataset.index;
    if (idx == null) return;

    if (e.target.classList.contains('increase')) {
      cart[idx].quantity++;
      updateCart();
    } else if (e.target.classList.contains('decrease')) {
      if (cart[idx].quantity > 1) {
        cart[idx].quantity--;
        updateCart();
      }
    } else if (e.target.classList.contains('delete-item')) {
      cart.splice(idx, 1);
      updateCart();
    }
  });

  clearBtn?.addEventListener('click', () => {
    const checkboxes = container.querySelectorAll('.product-checkbox:checked');
    const indexes = Array.from(checkboxes)
      .map(cb => parseInt(cb.dataset.index))
      .sort((a, b) => b - a);

    if (indexes.length === 0) {
      alert('Pilih setidaknya satu item untuk dihapus.');
      return;
    }

    if (confirm('Yakin ingin menghapus item terpilih?')) {
      indexes.forEach(index => {
        cart.splice(index, 1);
      });
      updateCart();
    }
  });

  checkoutBtn?.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Keranjang kosong. Tidak ada yang bisa di-checkout.');
      return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    localStorage.setItem('checkoutTotal', total); // simpan subtotal
    window.location.href = 'checkout.html';
  });

  function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }

  renderCart();
});

// Helper untuk format harga
function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
}
