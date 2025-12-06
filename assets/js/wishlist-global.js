// =========================
// GLOBAL HEADER NAV CLICKS
// =========================
document.addEventListener("click", function (e) {
    // Wishlist button → wishlist.html
    const wishlistBtn = e.target.closest(".eco-wishlist-btn");
    if (wishlistBtn) {
        e.preventDefault();
        window.location.href = "wishlist.html";   // ensure file name exactly matches
        return;
    }

    // Cart button → shopping.html
    const cartBtn = e.target.closest(".eco-cart-btn");
    if (cartBtn) {
        e.preventDefault();
        window.location.href = "shopping-cart.html";
        return;
    }
});

/* ============================================================
   GLOBAL HEADER — CART & WISHLIST COUNTER (WITH COUPON TOTAL)
============================================================ */
document.addEventListener("DOMContentLoaded", function () {

    /* ---------- CART ---------- */
    const CART_KEY = "ecoCartItems";
    const COUPON_TOTAL_KEY = "ecoDiscountedTotal";  
    const COUPON_APPLIED_KEY = "ecoCouponApplied";  

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch { 
            return []; 
        }
    }

    function updateGlobalCartHeader() {
        const badge  = document.querySelector(".eco-cart-badge");
        const amount = document.querySelector(".eco-cart-amount");
        if (!badge || !amount) return;

        const cart = getCart();

        const itemCount = cart.reduce((t, i) => t + i.qty, 0);
        const subtotal  = cart.reduce((t, i) => t + i.qty * i.price, 0);

        const couponApplied = localStorage.getItem(COUPON_APPLIED_KEY) === "true";
        const savedTotalStr = localStorage.getItem(COUPON_TOTAL_KEY);
        const savedTotal    = savedTotalStr ? parseFloat(savedTotalStr) : NaN;

        let finalTotal = subtotal;

        if (couponApplied && !isNaN(savedTotal) && savedTotal > 0) {
            finalTotal = savedTotal;
        }

        badge.textContent  = itemCount;
        amount.textContent = `$${finalTotal.toFixed(2)}`;
    }

    /* ---------- WISHLIST ---------- */
    const WISHLIST_IDS_KEY   = "ecoWishlistIds";
    const WISHLIST_ITEMS_KEY = "ecoWishlistItems";

    function getWishlistCount() {
        try {
            const items = JSON.parse(localStorage.getItem(WISHLIST_ITEMS_KEY)) || [];
            const ids   = JSON.parse(localStorage.getItem(WISHLIST_IDS_KEY)) || [];
            return items.length || ids.length || 0;
        } catch { 
            return 0; 
        }
    }

    function updateGlobalWishlistHeader() {
        const el = document.getElementById("ecoWishlistCount");
        if (el) el.textContent = getWishlistCount();
    }

    /* ---------- INIT ---------- */
    updateGlobalCartHeader();
    updateGlobalWishlistHeader();

});



