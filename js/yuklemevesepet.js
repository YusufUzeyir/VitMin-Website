		// Sayfa yüklendiğinde çalışacak kod
		document.addEventListener('DOMContentLoaded', function () {
			// Tüm tabları gizle
			var tabs = document.querySelectorAll('.tab-pane');
			tabs.forEach(function (tab) {
				tab.style.display = 'none';
			});

			// Sadece ilk tabı göster
			var initialTab = document.getElementById('products-list1');
			if (initialTab) {
				initialTab.style.display = 'block';
			}
		});

		function showTab(tabId, tabNumber) {
			// Tüm tabları gizle
			var tabs = document.querySelectorAll('.tab-pane');
			tabs.forEach(function (tab) {
				tab.style.display = 'none';
			});

			// Belirli tabı göster
			var selectedTab = document.getElementById(tabId + tabNumber);
			if (selectedTab) {
				selectedTab.style.display = 'block';
			}

			// Butonları güncelle, sadece tıklanan buton aktif olsun
			var buttons = document.querySelectorAll('.page-list li a');
			buttons.forEach(function (button) {
				button.classList.remove('current');
			});

			var currentButton = document.querySelector('.page-list li:nth-child(' + tabNumber + ') a');
			if (currentButton) {
				currentButton.classList.add('current');
			}
		}

		// Ürün bilgilerini tutmak için bir dizi oluştur
		var cartItems = [];

		// Tüm add-to-cart elementlerini seç
		var addToCartButtons = document.querySelectorAll('.product-buttons .add-to-cart');

		// Sepete ekle butonlarına click event listener ekle
		addToCartButtons.forEach(function (button) {
			button.addEventListener('click', function (event) {
				// Tıklanan butonun içindeki ürün bilgilerini al
				var productContainer = event.target.closest('.product-item');
				var productName = productContainer.querySelector('.product-title a').innerText;
				var productPrice = productContainer.querySelector('.sale-price').innerText;
				var productImageSrc = productContainer.querySelector('.product-image img').getAttribute('src');

				// Sepet verilerine yeni ürünü ekle
				cartItems.push({
					name: productName,
					price: parseFloat(productPrice.replace('₺', '').replace(',', '.')),
					imageSrc: productImageSrc
				});

				// Sepet tablosuna yeni satır ekleme
				updateCart();

				// Sepetten ürünü silme işlemi
				var removeButtons = document.querySelectorAll('.cart-content .remove');
				removeButtons.forEach(function (removeButton, index) {
					removeButton.addEventListener('click', function () {
						cartItems.splice(index, 1);
						updateCart();
					});
				});
			});
		});

		// Sepet güncelleme fonksiyonu
		function updateCart() {
			// Sepet tablosunu temizle
			var cartTable = document.querySelector('.cart-content table tbody');
			cartTable.innerHTML = '';

			// Yeni ürünleri sepete ekle
			cartItems.forEach(function (item, index) {
				var newRow = document.createElement('tr');
				newRow.innerHTML = `
            <td class="product-image">
                <img src="${item.imageSrc}" alt="Product">
            </td>
            <td class="product-name">${item.name}</td>
            <td class="product-price">₺${item.price.toFixed(2)}</td>
            <td class="action">
                <a class="remove">
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                </a>
            </td>
        `;
				cartTable.appendChild(newRow);

				// Sepetten ürünü silme işlemi
				var removeButton = newRow.querySelector('.remove');
				removeButton.addEventListener('click', function () {
					cartItems.splice(index, 1);
					updateCart();
				});
			});

			// Toplam fiyatı güncelle
			var totalElement = document.querySelector('.cart-content .total td:last-child');
			var newTotal = cartItems.reduce(function (acc, item) {
				return acc + item.price;
			}, 0);
			totalElement.innerText = '₺' + newTotal.toFixed(2);
		}





