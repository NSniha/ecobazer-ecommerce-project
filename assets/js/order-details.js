// ===================== CHECKOUT PAGE SCRIPT =====================
document.addEventListener("DOMContentLoaded", function () {

    const CART_KEY = "ecoCartItems";
    const COUPON_APPLIED_KEY = "ecoCouponApplied";
    const COUPON_TOTAL_KEY = "ecoDiscountedTotal";

    const orderBox = document.querySelector(".chkOrderBox");
    const placeOrderBtn = document.querySelector(".chkBtn");
    if (!orderBox || !placeOrderBtn) return; 

    // ---------- CART HELPERS ----------
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
    }

    function updateHeaderCart() {
        const cart = getCart();
        const badge = document.querySelector(".eco-cart-badge");
        const amount = document.querySelector(".eco-cart-amount");
        if (!badge || !amount) return;

        const count = cart.reduce((t, i) => t + i.qty, 0);
        const subtotal = cart.reduce((t, i) => t + i.qty * i.price, 0);

        // use coupon total if exists
        const couponApplied = localStorage.getItem(COUPON_APPLIED_KEY) === "true";
        const savedTotal = parseFloat(localStorage.getItem(COUPON_TOTAL_KEY));
        let finalTotal = subtotal;

        if (couponApplied && !isNaN(savedTotal) && savedTotal > 0) {
            finalTotal = savedTotal;
        }

        badge.textContent = count;
        amount.textContent = `$${finalTotal.toFixed(2)}`;
    }

    function clearCart() {
        localStorage.removeItem(CART_KEY);
        localStorage.removeItem(COUPON_APPLIED_KEY);
        localStorage.removeItem(COUPON_TOTAL_KEY);
        updateHeaderCart();
    }

    // ---------- ORDER SUMMARY FROM CART ----------
    function getCartTotals() {
        const cart = getCart();
        const subtotal = cart.reduce((t, i) => t + i.qty * i.price, 0);

        const couponApplied = localStorage.getItem(COUPON_APPLIED_KEY) === "true";
        const savedTotal = parseFloat(localStorage.getItem(COUPON_TOTAL_KEY));
        let finalTotal = subtotal;

        if (couponApplied && !isNaN(savedTotal) && savedTotal > 0) {
            finalTotal = savedTotal;
        }

        return { cart, subtotal, finalTotal };
    }

    function buildOrderSummary() {
        const { cart, subtotal, finalTotal } = getCartTotals();

        orderBox.querySelectorAll(".chkOrderItem").forEach(i => i.remove());

        const firstLine = orderBox.querySelector(".chkLine");
        const wrapper = document.createElement("div");
        wrapper.className = "chkOrderItems";

        if (!cart.length) {
            wrapper.innerHTML = `<p class="chkEmpty">Your cart is empty.</p>`;
        } else {
            cart.forEach(item => {
                const row = document.createElement("div");
                row.className = "chkOrderItem";
                row.innerHTML = `
                    <img src="${item.image}" class="chkOrderImg" alt="${item.name}">
                    <p class="chkOrderName">${item.name} x${item.qty}</p>
                    <span class="chkOrderPrice">$${(item.qty * item.price).toFixed(2)}</span>
                `;
                wrapper.appendChild(row);
            });
        }

        if (firstLine) {
            orderBox.insertBefore(wrapper, firstLine);
        } else {
            orderBox.appendChild(wrapper);
        }

        // update subtotal / shipping / total
        const lines = orderBox.querySelectorAll(".chkLine");
        if (lines[0]) {
            const spanRight = lines[0].querySelector("span:last-child");
            if (spanRight) spanRight.textContent = `$${subtotal.toFixed(2)}`;
        }
        if (lines[1]) {
            const spanRight = lines[1].querySelector("span:last-child");
            if (spanRight) spanRight.textContent = cart.length ? "Free" : "$0.00";
        }

        const totalSpan = orderBox.querySelector(".chkTotal span:last-child");
        if (totalSpan) {
            totalSpan.textContent = `$${finalTotal.toFixed(2)}`;
        }
    }

    // ---------- VALIDATION ----------
    function clearErrors() {
        document.querySelectorAll(".chkErrorField").forEach(el =>
            el.classList.remove("chkErrorField")
        );
        document.querySelectorAll(".chkErrorMsg").forEach(el => el.remove());
    }

    function addError(field, message) {
        field.classList.add("chkErrorField");

        const parent = field.parentElement || field.closest(".chkGroup");
        if (!parent) return;

        if (parent.querySelector(".chkErrorMsg")) return;

        const msg = document.createElement("p");
        msg.className = "chkErrorMsg";
        msg.textContent = message;

        parent.appendChild(msg);
    }

    function validateCheckoutForm() {
        clearErrors();
        let isValid = true;

        const groups = document.querySelectorAll(".chkLeft .chkGroup");

        groups.forEach(group => {
            const label = group.querySelector(".chkLabel");
            const field = group.querySelector(".chkInput, .chkSelect");
            if (!field) return;

            const labelText = label ? label.textContent.toLowerCase() : "";
            const isOptional = labelText.includes("optional");

            if (isOptional) return; 

            const value = (field.value || "").trim();

            if (!value) {
                isValid = false;
                addError(field, "This field is required");
            } else if (field.type === "email") {
                const re = /^\S+@\S+\.\S+$/;
                if (!re.test(value)) {
                    isValid = false;
                    addError(field, "Enter a valid email address");
                }
            }
        });

        // payment method
        const paymentChecked = document.querySelector("input[name='payment']:checked");
        if (!paymentChecked) {
            isValid = false;
            const payWrap = document.querySelector(".chkPayments");
            if (payWrap && !payWrap.querySelector(".chkErrorMsg")) {
                const msg = document.createElement("p");
                msg.className = "chkErrorMsg";
                msg.textContent = "Please select a payment method.";
                payWrap.appendChild(msg);
            }
        }

        if (!isValid) {
            const firstError = document.querySelector(".chkErrorField");
            if (firstError) {
                firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }

        return isValid;
    }

    // ---------- SUCCESS POPUP ----------
    const overlay = document.getElementById("ecoOrderSuccessOverlay");
    const btnClose = document.getElementById("ecoOrderModalClose");
    const btnViewOrder = document.getElementById("ecoGoOrderDetails");
    const btnContinue = document.getElementById("ecoContinueShopping");
    const orderIdSpan = document.getElementById("ecoOrderId");
    const orderTotalSpan = document.getElementById("ecoOrderTotal");

    function showSuccessModal(orderId, total) {
        if (!overlay) return;
        if (orderIdSpan) orderIdSpan.textContent = `#${orderId}`;
        if (orderTotalSpan) orderTotalSpan.textContent = `$${total.toFixed(2)}`;
        // keep same class name as your old CSS
        overlay.classList.add("is-visible");
    }

    function hideSuccessModal() {
        if (overlay) overlay.classList.remove("is-visible");
    }

    if (btnClose) {
        btnClose.addEventListener("click", hideSuccessModal);
    }
    if (btnContinue) {
        btnContinue.addEventListener("click", function () {
            hideSuccessModal();
            window.location.href = "index.html";
        });
    }
    if (btnViewOrder) {
        btnViewOrder.addEventListener("click", function () {
            window.location.href = "order-details.html";
        });
    }

    // ---------- BILLING DATA ----------
    function getBillingData() {
        const getVal = (selector) => {
            const el = document.querySelector(selector);
            return el ? el.value.trim() : "";
        };

        return {
            firstName: getVal(".chkInput[data-field='First name']"),
            lastName:  getVal(".chkInput[data-field='Last name']"),
            address:   getVal(".chkInput[data-field='Street Address']"),
            country:   getVal(".chkSelect[data-field='Country / Region']"),
            state:     getVal(".chkSelect[data-field='State']"),
            zip:       getVal(".chkInput[data-field='Zip Code']"),
            email:     getVal(".chkInput[data-field='Email']"),
            phone:     getVal(".chkInput[data-field='Phone']")
        };
    }

    // ---------- PLACE ORDER CLICK ----------
    placeOrderBtn.addEventListener("click", function (e) {
        e.preventDefault();

        const { cart, subtotal, finalTotal } = getCartTotals();

        if (!cart.length) {
            alert("Your cart is empty.");
            return;
        }

        if (!validateCheckoutForm()) return;

        const orderId = "ECO-" + Date.now();
        const paymentChecked = document.querySelector("input[name='payment']:checked");
        const paymentMethod = paymentChecked ? paymentChecked.value : "cod";

        const couponApplied = localStorage.getItem(COUPON_APPLIED_KEY) === "true";
        let discountPercent = 0;

        if (couponApplied && subtotal > 0 && finalTotal < subtotal) {
            // e.g. subtotal 100, finalTotal 95 → 5%
            discountPercent = Math.round((1 - finalTotal / subtotal) * 100);
        }

        // SAVE ORDER WITH BILLING INFO + discountPercent
        localStorage.setItem(
            "ecoLastOrder",
            JSON.stringify({
                id: orderId,
                date: new Date().toISOString(),
                payment: paymentMethod,
                subtotal,
                total: finalTotal,
                shippingAmount: 0,
                discountPercent,      
                items: cart,
                billing: getBillingData()
            })
        );

        clearCart();
        buildOrderSummary();

        showSuccessModal(orderId, finalTotal);
    });

    // ---------- INIT ----------
    buildOrderSummary();
    updateHeaderCart();
});


// ================= ORDER DETAILS PAGE SCRIPT =================
document.addEventListener("DOMContentLoaded", function () {

    // ---------- Helpers ----------
    function formatDate(isoString) {
        if (!isoString) return "";
        const d = new Date(isoString);
        if (isNaN(d.getTime())) return isoString;
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function money(n) {
        return "$" + Number(n || 0).toFixed(2);
    }

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    // ---------- Read last order from localStorage ----------
    let lastOrder = null;
    try {
        lastOrder = JSON.parse(localStorage.getItem("ecoLastOrder")) || null;
    } catch {
        lastOrder = null;
    }

    // If NO order found → show message and stop
    if (!lastOrder) {
        setText("odBillName", "No recent order found");
        return;
    }

    // ---------- Compute derived amounts ----------
    const items = Array.isArray(lastOrder.items) ? lastOrder.items : [];

    const computedSubtotal = items.reduce(
        (t, it) => t + Number(it.price || 0) * Number(it.qty || 0),
        0
    );

    const subtotal =
        typeof lastOrder.subtotal === "number"
            ? lastOrder.subtotal
            : computedSubtotal;

    const shippingAmount =
        typeof lastOrder.shippingAmount === "number"
            ? lastOrder.shippingAmount
            : 0;

    const discountPercent =
        typeof lastOrder.discountPercent === "number"
            ? lastOrder.discountPercent
            : 0;

    const discountAmount = (subtotal * discountPercent) / 100;

    const total =
        typeof lastOrder.total === "number"
            ? lastOrder.total
            : subtotal - discountAmount + shippingAmount;

    // ---------- Fill top info ----------
    setText("odOrderDate", formatDate(lastOrder.date));
    setText(
        "odProductsCount",
        items.length + (items.length === 1 ? " Product" : " Products")
    );
    setText("odOrderId", lastOrder.id || "#0000");
    setText("odPaymentMethod", lastOrder.payment || "Cash on Delivery");
    setText("odSubtotal", money(subtotal));
    setText("odDiscount", discountPercent + "%");
    setText(
        "odShipping",
        shippingAmount > 0 ? money(shippingAmount) : "Free"
    );
    setText("odTotal", money(total));

    // ---------- Billing / Shipping ----------
    const bill = lastOrder.billing && typeof lastOrder.billing === "object"
        ? lastOrder.billing
        : {};

    const ship = lastOrder.shipping && typeof lastOrder.shipping === "object"
        ? lastOrder.shipping
        : bill;

    function fill(prefix, obj) {
        const nameEl  = document.getElementById(prefix + "Name");
        const addrEl  = document.getElementById(prefix + "Address");
        const emailEl = document.getElementById(prefix + "Email");
        const phoneEl = document.getElementById(prefix + "Phone");

        const fullName = `${obj.firstName || ""} ${obj.lastName || ""}`.trim();
        if (nameEl) nameEl.textContent = fullName || "Customer";

        if (addrEl) {
            const parts = [];

            if (obj.address) parts.push(obj.address);

            const locationParts = [];
            if (obj.state)   locationParts.push(obj.state);
            if (obj.country) locationParts.push(obj.country);
            if (locationParts.length) {
                parts.push(locationParts.join(", "));
            }

            if (obj.zip) {
                if (parts.length) {
                    parts[parts.length - 1] =
                        parts[parts.length - 1] + " - " + obj.zip;
                } else {
                    parts.push(obj.zip);
                }
            }

            const fullAddress = parts.join(", ").trim();
            addrEl.textContent = fullAddress || "Address not provided";
        }

        if (emailEl) emailEl.textContent = obj.email || "—";
        if (phoneEl) phoneEl.textContent = obj.phone || "—";
    }

    fill("odBill", bill);
    fill("odShip", ship);

    // ---------- Items table ----------
    const itemsContainer = document.getElementById("odItemsContainer");
    if (!itemsContainer) return;

    if (!items.length) {
        itemsContainer.innerHTML =
            '<div class="od-table-row"><div class="od-col-product">No items found.</div></div>';
    } else {
        itemsContainer.innerHTML = "";
        items.forEach(function (it) {
            const row = document.createElement("div");
            row.className = "od-table-row";

            const lineTotal =
                Number(it.price || 0) * Number(it.qty || 0);

            row.innerHTML = `
                <div class="od-col-product">
                    <img src="${it.image || "images/placeholder.png"}" 
                         alt="${it.name || "Product"}"
                         class="od-prod-img">
                    <span class="od-prod-name">${it.name || "Product"}</span>
                </div>
                <div class="od-col-price">${money(it.price)}</div>
                <div class="od-col-qty">x${it.qty || 1}</div>
                <div class="od-col-subtotal">${money(lineTotal)}</div>
            `;

            itemsContainer.appendChild(row);
        });
    }
});
