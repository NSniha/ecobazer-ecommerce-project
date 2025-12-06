// assets/js/nav.js
document.addEventListener("DOMContentLoaded", function () {
    const navToggle  = document.querySelector(".eco-nav-toggle");
    const navMenu    = document.querySelector(".eco-nav-menu");
    const navClose   = document.querySelector(".eco-nav-close");
    const navLinks   = document.querySelectorAll(".eco-nav-menu a.eco-nav-link");
    const dropdownBtns = document.querySelectorAll(
        ".eco-nav-item.eco-has-dropdown > button.eco-nav-link"
    );

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener("click", function () {
        navMenu.classList.add("eco-nav-open");
        document.body.classList.add("eco-nav-opened");
    });

    if (navClose) {
        navClose.addEventListener("click", function () {
            navMenu.classList.remove("eco-nav-open");
            document.body.classList.remove("eco-nav-opened");
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("eco-nav-open");
            document.body.classList.remove("eco-nav-opened");
        });
    });

    dropdownBtns.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();       
            e.stopPropagation();      

            const item = this.closest(".eco-nav-item");
            item.classList.toggle("eco-submenu-open");
        });
    });
});



// ================= PROMO TIMER ==================
document.addEventListener("DOMContentLoaded", function () {
    const timerEl = document.getElementById("promoTimer");
    if (!timerEl) return;

    const daysEl  = timerEl.querySelector(".time-days");
    const hoursEl = timerEl.querySelector(".time-hours");
    const minsEl  = timerEl.querySelector(".time-mins");
    const secsEl  = timerEl.querySelector(".time-secs");

    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 7);

    function updateTimer() {
        const now = new Date();
        let diff = endTime - now;

        if (diff <= 0) {
            diff = 0;
            clearInterval(timerInterval);
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days  = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const mins  = Math.floor((totalSeconds % 3600) / 60);
        const secs  = totalSeconds % 60;

        if (daysEl)  daysEl.textContent  = String(days).padStart(2, "0");
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
        if (minsEl)  minsEl.textContent  = String(mins).padStart(2, "0");
        if (secsEl)  secsEl.textContent  = String(secs).padStart(2, "0");
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
});



// ================ HOT DEALS COUNTDOWN ===================
document.addEventListener("DOMContentLoaded", function () {
    const ecoHotDealsTimerBox2 = document.querySelector(".hot-deals .big-card .countdown");
    if (!ecoHotDealsTimerBox2) return;

    const ecoHotDealsTimeSpans2 = ecoHotDealsTimerBox2.querySelectorAll(".countdown-flex span");
    if (ecoHotDealsTimeSpans2.length < 4) return;

    const ecoDaysEl2  = ecoHotDealsTimeSpans2[0];
    const ecoHoursEl2 = ecoHotDealsTimeSpans2[1];
    const ecoMinsEl2  = ecoHotDealsTimeSpans2[2];
    const ecoSecsEl2  = ecoHotDealsTimeSpans2[3];

    let ecoDays2  = parseInt(ecoDaysEl2.textContent.trim(), 10)  || 0;
    let ecoHours2 = parseInt(ecoHoursEl2.textContent.trim(), 10) || 0;
    let ecoMins2  = parseInt(ecoMinsEl2.textContent.trim(), 10)  || 0;
    let ecoSecs2  = parseInt(ecoSecsEl2.textContent.trim(), 10)  || 0;

    let ecoHotDealsTotalSeconds2 =
        ecoDays2  * 24 * 60 * 60 +
        ecoHours2 * 60 * 60 +
        ecoMins2  * 60 +
        ecoSecs2;

    function ecoHotDealsUpdateTimer2() {
        if (ecoHotDealsTotalSeconds2 <= 0) {
            clearInterval(ecoHotDealsIntervalId2);
            ecoDaysEl2.textContent  = "00";
            ecoHoursEl2.textContent = "00";
            ecoMinsEl2.textContent  = "00";
            ecoSecsEl2.textContent  = "00";
            return;
        }

        ecoHotDealsTotalSeconds2--;

        const d = Math.floor(ecoHotDealsTotalSeconds2 / (24 * 60 * 60));
        const h = Math.floor((ecoHotDealsTotalSeconds2 % (24 * 60 * 60)) / (60 * 60));
        const m = Math.floor((ecoHotDealsTotalSeconds2 % (60 * 60)) / 60);
        const s = ecoHotDealsTotalSeconds2 % 60;

        ecoDaysEl2.textContent  = String(d).padStart(2, "0");
        ecoHoursEl2.textContent = String(h).padStart(2, "0");
        ecoMinsEl2.textContent  = String(m).padStart(2, "0");
        ecoSecsEl2.textContent  = String(s).padStart(2, "0");
    }

    const ecoHotDealsIntervalId2 = setInterval(ecoHotDealsUpdateTimer2, 1000);
});


// ------------------ SLIDER ------------------
let currentSlide = 0;

const track = document.querySelector('.slide-track');
const cards = document.querySelectorAll('.fp-card-item');
const totalOriginal = cards.length;

cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
});

function updateActiveCard() {
    const allCards = document.querySelectorAll('.fp-card-item');
    allCards.forEach(card => card.classList.remove('active'));
    let index = currentSlide % totalOriginal;
    allCards[index].classList.add('active');
}

function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 0;
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
}

function nextSlide() {
    currentSlide++;
    updateCarousel();
    updateActiveCard();

    if (currentSlide >= totalOriginal) {
        setTimeout(() => {
            track.style.transition = "none";
            currentSlide = 0;
            updateCarousel();
            setTimeout(() => track.style.transition = "0.5s ease", 20);
        }, 520);
    }
}

function prevSlide() {
    if (currentSlide === 0) {
        track.style.transition = "none";
        currentSlide = totalOriginal - 1;
        updateCarousel();
        setTimeout(() => track.style.transition = "0.5s ease", 20);
    } else {
        currentSlide--;
        updateCarousel();
    }
    updateActiveCard();
}

document.querySelector('.next-btn').addEventListener('click', nextSlide);
document.querySelector('.prev-btn').addEventListener('click', prevSlide);

updateActiveCard();

setInterval(nextSlide, 2500);
function updateActiveCard() {
    const allCards = document.querySelectorAll('.fp-card-item');

    allCards.forEach(c => c.classList.remove('active'));

    let index = currentSlide % totalOriginal;
    allCards[index].classList.add('active');
}


//localStorage.clear()