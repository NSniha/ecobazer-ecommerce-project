// =====================================================
// HOME PAGE — CART + WISHLIST SYSTEM (ALL SECTIONS)
// + CATEGORIES → SHOP CATEGORY SYNC
// =====================================================
document.addEventListener("DOMContentLoaded", function () {

    const CART_KEY = "ecoCartItems";
    const WISHLIST_IDS_KEY = "ecoWishlistIds";
    const WISHLIST_ITEMS_KEY = "ecoWishlistItems";

    // ---------------- CART HELPERS ----------------
    function getCart() {
        try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
        catch { return []; }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateHeaderCart();
    }

    function updateHeaderCart() {
        const cart = getCart();
        const badge = document.querySelector(".eco-cart-badge");
        const amount = document.querySelector(".eco-cart-amount");

        if (!badge || !amount) return;

        const count = cart.reduce((t, i) => t + i.qty, 0);
        const total = cart.reduce((t, i) => t + i.qty * i.price, 0);

        badge.textContent = count;
        amount.textContent = `$${total.toFixed(2)}`;
    }

    // ---------------- WISHLIST HELPERS ----------------
    function getWishlistIds() {
        try { return JSON.parse(localStorage.getItem(WISHLIST_IDS_KEY)) || []; }
        catch { return []; }
    }

    function getWishlistItems() {
        try { return JSON.parse(localStorage.getItem(WISHLIST_ITEMS_KEY)) || []; }
        catch { return []; }
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

    // ---------------- ADD TO CART (GLOBAL) ----------------
    function addToCart(name, price, image) {
        const cart = getCart();

        const found = cart.find(p => p.name === name);

        if (found) {
            found.qty++;
        } else {
            cart.push({
                id: Date.now(),
                name,
                price,
                image,
                qty: 1
            });
        }

        saveCart(cart);
    }

    // ---------------- ADD TO WISHLIST (GLOBAL) ----------------
    function addToWishlist(name, price, image) {
        const ids = getWishlistIds();
        const items = getWishlistItems();

        const exists = items.find(p => p.name === name);
        if (exists) return;

        const newItem = {
            id: Date.now(),
            name,
            price,
            image,
            isInStock: true
        };

        ids.push(newItem.id);
        items.push(newItem);

        saveWishlist(ids, items);
    }

    // ==========================================================
    // --------- HOME PAGE SECTIONS FUNCTIONALITY BELOW ---------
    // ==========================================================

    // ---------------- FEATURED PRODUCTS SLIDER ----------------
    document.querySelectorAll(".fp-card-item").forEach(card => {
        const name = card.querySelector("h4")?.textContent.trim() || "";
        const priceEl = card.querySelector(".new");
        const price = priceEl ? Number(priceEl.textContent.replace("$", "")) : 0;
        const image = card.querySelector("img")?.src || "";

        const cartBtn = card.querySelector(".cart-btn");
        if (cartBtn) {
            cartBtn.addEventListener("click", () => {
                addToCart(name, price, image);
            });
        }

        const wishIcon = card.querySelector(".icon-btn ion-icon[name='heart-outline']");
        if (wishIcon && wishIcon.parentElement) {
            wishIcon.parentElement.addEventListener("click", () => {
                addToWishlist(name, price, image);
            });
        }
    });

    // ---------------- HOT DEALS SECTION ----------------
    const bigCard = document.querySelector(".big-card");
    if (bigCard) {
        const name = bigCard.querySelector(".big-title")?.textContent.trim() || "";
        const priceEl = bigCard.querySelector(".price-row .new");
        const price = priceEl ? Number(priceEl.textContent.replace("$", "")) : 0;
        const image = bigCard.querySelector(".big-img")?.src || "";

        const addBtn = bigCard.querySelector(".add-btn");
        if (addBtn) {
            addBtn.addEventListener("click", () => {
                addToCart(name, price, image);
            });
        }

        const heartIcon = bigCard.querySelector(".big-actions .circle ion-icon[name='heart-outline']");
        if (heartIcon && heartIcon.parentElement) {
            heartIcon.parentElement.addEventListener("click", () => {
                addToWishlist(name, price, image);
            });
        }
    }

    document.querySelectorAll(".p-card").forEach(card => {
        const name = card.querySelector("h4")?.textContent.trim() || "";
        const priceText = card.querySelector(".p-price")?.textContent || "$0";
        const price = Number(priceText.replace("$", "").split(" ")[0]);
        const image = card.querySelector("img")?.src || "";

        const cartIcon = card.querySelector(".lock");
        if (cartIcon) {
            cartIcon.addEventListener("click", () => {
                addToCart(name, price, image);
            });
        }
    });

    // ---------------- POPULAR FRESH PICKS ----------------
    document.querySelectorAll(".products-section .product-card").forEach(card => {
        const name = card.querySelector("h4")?.textContent.trim() || "";
        const priceEl = card.querySelector(".new-price");
        const price = priceEl ? Number(priceEl.textContent.replace("$", "")) : 0;
        const image = card.querySelector(".product-food-img img")?.src || "";

        const cartBtn = card.querySelector(".cart-icon");
        if (cartBtn) {
            cartBtn.addEventListener("click", () => {
                addToCart(name, price, image);
            });
        }

        const wishIcon = card.querySelector(".action-btn ion-icon[name='heart-outline']");
        if (wishIcon && wishIcon.parentElement) {
            wishIcon.parentElement.addEventListener("click", () => {
                addToWishlist(name, price, image);
            });
        }
    });

    // ---------------- HOME → SHOP CATEGORY SYNC ----------------
    const nameToSlugMap = {
        "Fresh Fruit": "fresh-fruit",
        "Fresh Fruits": "fresh-fruit",
        "Fresh Vegetables": "vegetables",
        "Vegetables": "vegetables",
        "Snacks": "snacks",
        "Beverages": "beverages",
        "Bread & Bakery": "bread-bakery",
        "Cooking": "cooking"
    };

    document.querySelectorAll(".categories-section .cat-box").forEach(cat => {
        const text = cat.querySelector("p")?.textContent.trim() || "";
        const dataSlug =
            cat.dataset.category ||
            cat.dataset.ecoCat ||
            nameToSlugMap[text] ||
            "all";

        cat.addEventListener("click", function () {
            localStorage.setItem("ecoSelectedCategory", dataSlug);
            window.location.href = "shop.html";
        });
    });

    updateHeaderCart();
    updateHeaderWishlist(getWishlistIds().length);
});
