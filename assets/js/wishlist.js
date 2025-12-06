// =================== WISHLIST PAGE SCRIPT ===================
document.addEventListener("DOMContentLoaded", function () {

    const WISHLIST_ITEMS_KEY = "ecoWishlistItems";
    const WISHLIST_IDS_KEY = "ecoWishlistIds";
    const CART_KEY = "ecoCartItems";
    const COUPON_APPLIED_KEY = "ecoCouponApplied";
    const COUPON_TOTAL_KEY = "ecoDiscountedTotal";

    const table = document.querySelector(".wishlist-table");
    if (!table) return;

    /* ---------------------- HELPERS ---------------------- */
    function getWishlistItems() {
        try {
            return JSON.parse(localStorage.getItem(WISHLIST_ITEMS_KEY)) || [];
        } catch { return []; }
    }

    function getWishlistIds() {
        try {
            return JSON.parse(localStorage.getItem(WISHLIST_IDS_KEY)) || [];
        } catch { return []; }
    }

    function saveWishlist(ids, items) {
        localStorage.setItem(WISHLIST_IDS_KEY, JSON.stringify(ids));
        localStorage.setItem(WISHLIST_ITEMS_KEY, JSON.stringify(items));
        updateHeaderWishlist(ids.length);
    }

    function updateHeaderWishlist(count) {
        const el = document.getElementById("ecoWishlistCount");
        if (el) el.textContent = count;
    }

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch { return []; }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));

        // ❗ VERY IMPORTANT:
        // If cart changes → remove coupon discount to avoid mismatch
        localStorage.removeItem(COUPON_APPLIED_KEY);
        localStorage.removeItem(COUPON_TOTAL_KEY);

        updateHeaderCart();
    }

    function updateHeaderCart() {
        const cart = getCart();
        const badge = document.querySelector(".eco-cart-badge");
        const amount = document.querySelector(".eco-cart-amount");

        if (!badge || !amount) return;

        const count = cart.reduce((t, i) => t + i.qty, 0);
        const subtotal = cart.reduce((t, i) => t + i.qty * i.price, 0);

        // 🔥 If coupon total exists, use it
        const couponActive = localStorage.getItem(COUPON_APPLIED_KEY) === "true";
        const savedTotal = parseFloat(localStorage.getItem(COUPON_TOTAL_KEY));

        let final = subtotal;
        if (couponActive && !isNaN(savedTotal) && savedTotal > 0) {
            final = savedTotal;
        }

        badge.textContent = count;
        amount.textContent = `$${final.toFixed(2)}`;
    }

    /* ---------------------- RENDER WISHLIST ---------------------- */
    function renderWishlist() {
        const ids = getWishlistIds();
        const items = getWishlistItems();

        table.querySelectorAll(".wishlist-row:not(.wishlist-header)").forEach(r => r.remove());

        if (!ids.length || !items.length) {
            const emptyRow = document.createElement("div");
            emptyRow.className = "wishlist-row";
            emptyRow.style.gridColumn = "1 / -1";
            emptyRow.style.textAlign = "center";
            emptyRow.innerHTML = `<p>Your wishlist is empty.</p>`;
            table.appendChild(emptyRow);

            updateHeaderWishlist(0);
            return;
        }

        updateHeaderWishlist(ids.length);

        items.forEach(item => {
            if (!ids.includes(item.id)) return;

            const inStock = item.isInStock !== false;

            const row = document.createElement("div");
            row.className = "wishlist-row";

            row.innerHTML = `
                <div class="col-product">
                    <img src="${item.imageMain || item.image}" alt="${item.name}">
                    <p>${item.name}</p>
                </div>

                <div class="col-price">
                    <span class="new-price">$${item.price.toFixed(2)}</span>
                    ${item.oldPrice ? `<span class="old-price">$${item.oldPrice.toFixed(2)}</span>` : ""}
                </div>

                <div class="col-stock">
                    <span class="stock ${inStock ? "in" : "out"}">
                        ${inStock ? "In Stock" : "Out of Stock"}
                    </span>
                </div>

                <div class="col-action">
                    <button class="add-btn" ${inStock ? "" : "disabled"}>
                        ${inStock ? "Add to Cart" : "Unavailable"}
                    </button>
                    <span class="remove" data-id="${item.id}">
                        <ion-icon name="close-outline"></ion-icon>
                    </span>
                </div>
            `;

            table.appendChild(row);

            // ADD TO CART
            const addBtn = row.querySelector(".add-btn");
            if (addBtn && inStock) {
                addBtn.addEventListener("click", () => {
                    const cart = getCart();
                    const found = cart.find(c => c.id === item.id);

                    if (found) {
                        found.qty++;
                    } else {
                        cart.push({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.imageMain || item.image,
                            qty: 1
                        });
                    }

                    saveCart(cart);
                    alert("Added to cart!");
                });
            }

            // REMOVE FROM WISHLIST
            const removeBtn = row.querySelector(".remove");
            if (removeBtn) {
                removeBtn.addEventListener("click", () => {
                    const newIds = getWishlistIds().filter(id => id !== item.id);
                    const newItems = getWishlistItems().filter(p => p.id !== item.id);

                    saveWishlist(newIds, newItems);
                    renderWishlist();
                });
            }
        });
    }

    /* INIT */
    renderWishlist();
    updateHeaderCart();
});
