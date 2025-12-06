/* -----------------------------------
   CHANGE MAIN IMAGE (GLOBAL for onclick)
----------------------------------- */
function changeImage(element) {
    const mainImg = document.getElementById("mainProductImage");
    if (!mainImg || !element) return;

    const thumbs = document.querySelectorAll(".thumb");

    // Update main image source
    const src = element.getAttribute("src") || element.src;
    mainImg.src = src;

    // Update active state
    thumbs.forEach(t => t.classList.remove("active"));
    element.classList.add("active");
}


/* -----------------------------------
   ALL PRODUCT DETAILS LOGIC
   (RUN AFTER DOM IS READY)
----------------------------------- */
document.addEventListener("DOMContentLoaded", function () {

    /* ==============================
       QUANTITY HANDLING
    ============================== */
    const qtyNumberEl = document.querySelector(".qty-number");
    const qtyBtns     = document.querySelectorAll(".qty-box .qty-btn");
    let qty = parseInt(qtyNumberEl?.innerText, 10) || 1;

    function syncQty() {
        if (qtyNumberEl) qtyNumberEl.innerText = qty;

        // optional mirror element
        const mirror = document.getElementById("qtyNumber");
        if (mirror) mirror.innerText = qty;
    }

    if (qtyNumberEl && qtyBtns.length >= 2) {
        const minusBtn = qtyBtns[0];
        const plusBtn  = qtyBtns[1];

        minusBtn.addEventListener("click", function (e) {
            e.preventDefault();
            if (qty > 1) {
                qty--;
                syncQty();
            }
        });

        plusBtn.addEventListener("click", function (e) {
            e.preventDefault();
            qty++;
            syncQty();
        });
    }


    /* ==============================
       TABS SWITCHING
    ============================== */
    const tabs     = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    if (tabs.length && contents.length) {
        tabs.forEach(tab => {
            tab.addEventListener("click", function (e) {
                e.preventDefault();

                // Active state on tab buttons
                tabs.forEach(t => t.classList.remove("active"));
                this.classList.add("active");

                // Show matching tab content
                const tabID = this.getAttribute("data-tab");
                contents.forEach(c => c.classList.remove("active"));

                const target = document.getElementById(tabID);
                if (target) {
                    target.classList.add("active");
                }
            });
        });
    }


    /* ==============================
       RELATED PRODUCT CARD HOVER
    ============================== */
    const cards = document.querySelectorAll(".rp-card");

    if (cards.length) {
        cards.forEach(card => {
            card.addEventListener("mouseenter", () => {
                // Remove active & green from all
                cards.forEach(c => {
                    c.classList.remove("active");
                    const btn = c.querySelector(".rp-cart");
                    if (btn) btn.classList.remove("green");
                });

                // Add active to current
                card.classList.add("active");
                const cartBtn = card.querySelector(".rp-cart");
                if (cartBtn) cartBtn.classList.add("green");
            });
        });
    }


    /* ==============================
       LOAD MORE REVIEWS
    ============================== */
    const feedbackItems = document.querySelectorAll(".feedback-item");
    const loadMoreBtn   = document.querySelector(".load-more-btn");

    if (feedbackItems.length && loadMoreBtn) {
        const BATCH = 4;   // first 4 visible
        let visibleCount = BATCH;

        // Initial: show first batch only
        feedbackItems.forEach((item, index) => {
            item.style.display = index < visibleCount ? "flex" : "none";
        });

        // Hide button if few items
        if (feedbackItems.length <= visibleCount) {
            loadMoreBtn.style.display = "none";
        }

        loadMoreBtn.addEventListener("click", function (e) {
            e.preventDefault();
            visibleCount += BATCH;

            feedbackItems.forEach((item, index) => {
                if (index < visibleCount) {
                    item.style.display = "flex";
                }
            });

            if (visibleCount >= feedbackItems.length) {
                loadMoreBtn.style.display = "none";
            }
        });
    }

});
