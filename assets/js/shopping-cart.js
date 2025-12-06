// ==============================
// SHOPPING CART + COUPON SYSTEM
// ==============================
document.addEventListener("DOMContentLoaded", function () {

    const cartTable = document.querySelector(".cart-table");
    if (!cartTable) return;

    // Use your existing IDs
    const summarySubtotal = document.getElementById("cartSubtotal");
    const summaryTotal    = document.getElementById("cartTotal");

    const headerCount  = document.querySelector(".eco-cart-badge");
    const headerAmount = document.querySelector(".eco-cart-amount");

    const couponBox     = document.getElementById("ecoLiveCouponBox");
    const couponCodeEl  = document.getElementById("ecoLiveCouponCode");
    const copyBtn       = document.getElementById("ecoCopyCouponBtn");
    const toast         = document.getElementById("ecoToast");

    const CART_KEY           = "ecoCartItems";
    const COUPON_APPLIED_KEY = "ecoCouponApplied";     // true / false
    const COUPON_TOTAL_KEY   = "ecoDiscountedTotal";   // final total after discount
    const AVAILABLE_COUPONS  = ["SAVE5NOW","ECO5OFF","BUYMORE5","FRESH5","GETGREEN5"];

    let couponCodeThisLoad = "";
    let couponUsedThisLoad = false;


    // -----------------------------
    // LOAD & SAVE CART
    // -----------------------------
    function loadCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch { 
            return []; 
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        renderCart();
    }


    // -----------------------------
    // SUMMARY + HEADER UPDATE
    // -----------------------------
    function updateSummaryAndHeader(subtotal, cart) {
        const couponActive = localStorage.getItem(COUPON_APPLIED_KEY) === "true";
        const savedFinal   = Number(localStorage.getItem(COUPON_TOTAL_KEY));

        let final = subtotal;

        if (couponActive && savedFinal > 0) {
            final = savedFinal;
        } else if (couponUsedThisLoad) {
            final = subtotal * 0.95;
        }

        // Subtotal = always original subtotal (no discount)
        if (summarySubtotal) {
            summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
        }

        // Total = after coupon / discount
        if (summaryTotal) {
            summaryTotal.textContent = `$${final.toFixed(2)}`;
        }

        if (headerCount && headerAmount) {
            const count = cart.reduce((t, i) => t + i.qty, 0);
            headerCount.textContent  = count;
            headerAmount.textContent = `$${final.toFixed(2)}`;
        }
    }


    // -----------------------------
    // COUPON BOX CONTROL
    // -----------------------------
    function generateCoupon() {
        return AVAILABLE_COUPONS[Math.floor(Math.random() * AVAILABLE_COUPONS.length)];
    }

    function hideCouponBox() {
        if (couponBox) couponBox.style.display = "none";
    }

    function showCouponBoxIfNeeded(cart) {
        if (!couponBox || !couponCodeEl) return;

        const couponActive = localStorage.getItem(COUPON_APPLIED_KEY) === "true";

        if (!cart.length || couponActive) {
            hideCouponBox();
            return;
        }

        if (!couponCodeThisLoad) couponCodeThisLoad = generateCoupon();

        couponCodeEl.textContent = couponCodeThisLoad;
        couponBox.style.display  = "block";
    }


    // -----------------------------
    // TOAST
    // -----------------------------
    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add("show");

        setTimeout(() => toast.classList.remove("show"), 2500);
    }


    // -----------------------------
    // RENDER CART
    // -----------------------------
    function renderCart() {
        const cart = loadCart();

        cartTable
            .querySelectorAll(".cart-row:not(.cart-header-row,.cart-bottom)")
            .forEach(r => r.remove());

        const bottomRow = cartTable.querySelector(".cart-bottom");

        if (!cart.length) {
            let empty = document.createElement("div");
            empty.className = "cart-row cart-empty";
            empty.style.gridColumn = "1 / -1";
            empty.style.textAlign  = "center";
            empty.style.padding    = "20px 0";
            empty.textContent      = "Your cart is empty.";

            cartTable.insertBefore(empty, bottomRow);
            updateSummaryAndHeader(0, cart);
            hideCouponBox();
            return;
        }

        cart.forEach(item => {
            let row = document.createElement("div");
            row.className = "cart-row";

            row.innerHTML = `
                <div class="cart-product">
                    <img src="${item.image}" alt="${item.name}">
                    <p>${item.name}</p>
                </div>

                <div class="cart-price">$${Number(item.price).toFixed(2)}</div>

                <div class="cart-qty-box">
                    <button class="qty-minus" data-id="${item.id}">
                        <ion-icon name="remove-outline"></ion-icon>
                    </button>
                    <span class="qty-number">${item.qty}</span>
                    <button class="qty-plus" data-id="${item.id}">
                        <ion-icon name="add-outline"></ion-icon>
                    </button>
                </div>

                <div class="cart-subtotal">$${(item.qty * Number(item.price)).toFixed(2)}</div>

                <button class="cart-remove" data-id="${item.id}">
                    <ion-icon name="close-outline"></ion-icon>
                </button>
            `;

            cartTable.insertBefore(row, bottomRow);
        });

        const subtotal = cart.reduce((t, i) => t + i.qty * i.price, 0);

        updateSummaryAndHeader(subtotal, cart);
        attachCartEvents();
        showCouponBoxIfNeeded(cart);
    }


    // -----------------------------
    // CART BUTTON EVENTS
    // -----------------------------
    function attachCartEvents() {

        document.querySelectorAll(".qty-plus").forEach(btn => {
            btn.onclick = () => {
                const cart = loadCart();
                const item = cart.find(i => i.id == btn.dataset.id);
                if (!item) return;

                item.qty++;

                localStorage.removeItem(COUPON_APPLIED_KEY);
                localStorage.removeItem(COUPON_TOTAL_KEY);

                saveCart(cart);
            };
        });

        document.querySelectorAll(".qty-minus").forEach(btn => {
            btn.onclick = () => {
                const cart = loadCart();
                const item = cart.find(i => i.id == btn.dataset.id);
                if (!item) return;

                if (item.qty > 1) item.qty--;
                else cart.splice(cart.indexOf(item), 1);

                localStorage.removeItem(COUPON_APPLIED_KEY);
                localStorage.removeItem(COUPON_TOTAL_KEY);

                saveCart(cart);
            };
        });

        document.querySelectorAll(".cart-remove").forEach(btn => {
            btn.onclick = () => {
                const cart  = loadCart();
                const index = cart.findIndex(i => i.id == btn.dataset.id);
                if (index > -1) cart.splice(index, 1);

                localStorage.removeItem(COUPON_APPLIED_KEY);
                localStorage.removeItem(COUPON_TOTAL_KEY);

                saveCart(cart);
            };
        });
    }


    // -----------------------------
    // APPLY COUPON (COPY → APPLY AUTOMATIC)
    // -----------------------------
    if (copyBtn) {
        copyBtn.onclick = () => {
            const cart = loadCart();
            if (!cart.length) return;

            if (!couponCodeThisLoad)
                couponCodeThisLoad = generateCoupon();

            navigator.clipboard.writeText(couponCodeThisLoad);

            const subtotal = cart.reduce((t, i) => t + i.qty * i.price, 0);
            const final    = subtotal * 0.95;

            couponUsedThisLoad = true;

            localStorage.setItem(COUPON_APPLIED_KEY, "true");
            localStorage.setItem(COUPON_TOTAL_KEY, final.toFixed(2));

            hideCouponBox();
            showToast("Coupon applied successfully!");

            updateSummaryAndHeader(subtotal, cart);
        };
    }


    // -----------------------------
    // INIT
    // -----------------------------
    renderCart();
});


// ==============================
// CHECKOUT BUTTON REDIRECT CONTROL
// ==============================
document.addEventListener("DOMContentLoaded", function () {

    const checkoutBtn = document.getElementById("ecoCheckoutBtn");
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener("click", function () {
        const cart = JSON.parse(localStorage.getItem("ecoCartItems")) || [];

        if (!cart.length) {
            alert("Your cart is empty!");
            return;
        }

        // SUCCESS → Checkout page e redirect
        window.location.href = "checkout.html";
    });
});
