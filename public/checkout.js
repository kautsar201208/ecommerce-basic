function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
}

document.addEventListener('DOMContentLoaded', () => {
  const form          = document.getElementById('checkout-form');
  const subtotalEl    = document.getElementById('subtotal');
  const orderTotalEl  = document.getElementById('order-total');
  const itemCountEl   = document.getElementById('item-count');

  // Ambil subtotal dan cart dari localStorage
  const subtotalValue = parseFloat(localStorage.getItem('checkoutTotal')) || 0;
  const cart          = JSON.parse(localStorage.getItem('cart')) || [];
  const itemCount     = cart.length;

  // Atur diskon & pajak (ubah sesuai kebijakan)
  const discount          = 15;         // diskon fixed
  const estimatedTaxRate  = 0.10;       // 10% tax
  const estimatedTax      = subtotalValue * estimatedTaxRate;

  // Render ke halaman
  itemCountEl.textContent  = itemCount;
  subtotalEl.textContent   = formatRupiah(subtotalValue);
  orderTotalEl.textContent = formatRupiah(subtotalValue - discount + estimatedTax);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) return;

    // TODO: simpan data atau kirim API
    alert('Data checkout berhasil disimpan!');
    window.location.href = 'payment.html';
  });
});
