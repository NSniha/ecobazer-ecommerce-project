// =============  ECO FAQ ACCORDION JS  =================
document.addEventListener("DOMContentLoaded", function () {
    const ecoFaqItems = document.querySelectorAll(".ecoFaq_item");

    ecoFaqItems.forEach(function (item) {
        const header = item.querySelector(".ecoFaq_header");
        const body = item.querySelector(".ecoFaq_body");

        // set initial open height
        if (item.classList.contains("ecoFaq_item--active")) {
            body.style.maxHeight = body.scrollHeight + "px";
        }

        header.addEventListener("click", function () {
            const isActive = item.classList.contains("ecoFaq_item--active");

            // close all items
            ecoFaqItems.forEach(function (otherItem) {
                otherItem.classList.remove("ecoFaq_item--active");
                const otherBody = otherItem.querySelector(".ecoFaq_body");
                otherBody.style.maxHeight = null;
            });

            // open clicked one (if it was not active)
            if (!isActive) {
                item.classList.add("ecoFaq_item--active");
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });
});
