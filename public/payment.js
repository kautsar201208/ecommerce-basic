// Format angka menjadi format Rupiah
function formatRupiah(number) {
  return `Rp ${number.toLocaleString('id-ID')}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const discountSelect = document.getElementById('discount-select');
  const discountAmount = document.getElementById('discount-amount');
  const totalAmount = document.getElementById('total-amount');
  const shippingCostElement = document.getElementById('shipping-cost');
  const orderSummaryElement = document.getElementById('order-summary');

  // Ambil data keranjang dari localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Variabel dinamis
  let discountPercent = 0;
  let shippingCost = 0;

  // Hitung subtotal dari keranjang
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Fungsi untuk render item di order summary
  function renderOrderSummary() {
    orderSummaryElement.innerHTML = '';

    if (cart.length === 0) {
      orderSummaryElement.innerHTML = '<p>Keranjang kosong.</p>';
      return;
    }

    cart.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'flex justify-between';
      itemEl.innerHTML = `
        <span class="text-gray-600">${item.title} x ${item.quantity}</span>
        <span class="text-[#6C2A2A]">${formatRupiah(item.price * item.quantity)}</span>
      `;
      orderSummaryElement.appendChild(itemEl);
    });

    // Tambahkan estimasi pajak
    const taxEl = document.createElement('div');
    taxEl.className = 'flex justify-between';
    taxEl.innerHTML = `
      <span class="text-gray-600">Estimated Tax</span>
      <span>${formatRupiah(10)}</span>
    `;
    orderSummaryElement.appendChild(taxEl);

    // Tambahkan biaya kirim
    const shippingEl = document.createElement('div');
    shippingEl.className = 'flex justify-between';
    shippingEl.id = 'shipping-cost'; // Pastikan ID ini ada
    shippingEl.innerHTML = `
      <span class="text-gray-600">Shipping</span>
      <span>${shippingCost > 0 ? formatRupiah(shippingCost) : 'Gratis'}</span>
    `;
    orderSummaryElement.appendChild(shippingEl);

    updateTotal(); // Panggil sekali setelah render
  }

  // Render order summary awal
  renderOrderSummary();

  // Event listener untuk metode pengiriman
  const shippingRadio = document.querySelectorAll('input[name="payment"]');
  shippingRadio.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'standard') {
        shippingCost = 0;
      } else if (radio.value === 'second-day') {
        shippingCost = 15500;
      } else if (radio.value === 'overnight') {
        shippingCost = 30000;
      }
      updateTotal();
    });
  });

  // Event listener untuk diskon
  discountSelect.addEventListener('change', () => {
    discountPercent = parseInt(discountSelect.value);
    updateTotal();
  });

  // Fungsi untuk menghitung total
  function updateTotal() {
    const tax = 10;
    const discountValue = (subtotal * discountPercent) / 100;
    const total = subtotal - discountValue + shippingCost + tax;

    // Update DOM
    const subtotalEl = document.getElementById('subtotal');
    if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);

    const shippingCostEl = document.getElementById('shipping-cost');
    if (shippingCostEl) {
      shippingCostEl.innerHTML = `
        <span class="text-gray-600">Shipping</span>
        <span>${shippingCost > 0 ? formatRupiah(shippingCost) : 'Gratis'}</span>
      `;
    }

    if (discountAmount) discountAmount.textContent = formatRupiah(discountValue);
    if (totalAmount) totalAmount.textContent = formatRupiah(total);
  }

  // Event listener untuk tombol pembayaran dengan SweetAlert
  document.getElementById('complete-payment')?.addEventListener('click', () => {
    const totalDisplay = totalAmount.textContent;

    Swal.fire({
      title: 'Konfirmasi Pembayaran',
      html: `
        <p>Apakah Anda yakin ingin melanjutkan pembayaran?</p>
        <div class="text-lg font-semibold mt-4">Total: <span class="text-primary">${totalDisplay}</span></div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Bayar Sekarang',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton: 'bg-[#6C2A2A] hover:bg-[#5a2020] text-white py-2 px-4 rounded-md',
        cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md ml-2'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Pembayaran Berhasil!',
          text: 'Pesanan Anda akan segera diproses.',
          confirmButtonText: 'Lanjutkan'
        }).then(() => {
          localStorage.removeItem('cart');
          localStorage.removeItem('checkoutTotal');
          window.location.href = 'home.html';
        });
      }
    });
  });
});