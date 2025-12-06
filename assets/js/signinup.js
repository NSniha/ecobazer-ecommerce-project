// ====================== AUTH SYSTEM =========================

// KEY for authentication state
const AUTH_KEY = "ecoUserAuth";
const USER_DATA_KEY = "ecoUserData";

// ------------------------------------------------------------
// Check if user is logged in
// ------------------------------------------------------------
function isUserLoggedIn() {
    return localStorage.getItem(AUTH_KEY) === "true";
}

// ------------------------------------------------------------
// Require login for restricted actions
// ------------------------------------------------------------
function requireLogin() {
    alert("Please sign up or sign in first!");
    window.location.href = "signin.html";
}

// ------------------------------------------------------------
// Protect pages: cart, checkout, wishlist
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const restrictedPages = ["shopping-cart.html", "checkout.html", "wishlist.html"];

    const currentPage = window.location.pathname.split("/").pop();

    if (restrictedPages.includes(currentPage) && !isUserLoggedIn()) {
        requireLogin();
    }

    // Header icons — block actions if not logged in
    const cartBtn = document.querySelector(".eco-cart-btn");
    const wishBtn = document.querySelector(".eco-wishlist-btn");

    if (cartBtn) {
        cartBtn.addEventListener("click", function () {
            if (!isUserLoggedIn()) return requireLogin();
            window.location.href = "shopping-cart.html";
        });
    }

    if (wishBtn) {
        wishBtn.addEventListener("click", function () {
            if (!isUserLoggedIn()) return requireLogin();
            window.location.href = "wishlist.html";
        });
    }

    // Add-to-cart buttons (global)
    document.querySelectorAll(".add-to-cart, .eco-add-cart-btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            if (!isUserLoggedIn()) {
                e.preventDefault();
                return requireLogin();
            }
        });
    });

    // Wishlist heart buttons
    document.querySelectorAll(".add-wishlist-btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            if (!isUserLoggedIn()) {
                e.preventDefault();
                return requireLogin();
            }
        });
    });
});

// ------------------------------------------------------------
// SIGN UP HANDLER
// ------------------------------------------------------------
function handleSignupForm(form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = form.querySelector("input[name='name']");
        const email = form.querySelector("input[name='email']");
        const pass = form.querySelector("input[name='password']");

        if (!name.value || !email.value || !pass.value) {
            alert("All fields are required!");
            return;
        }

        // Save user & auth
        localStorage.setItem(USER_DATA_KEY, JSON.stringify({
            name: name.value,
            email: email.value,
            password: pass.value
        }));

        localStorage.setItem(AUTH_KEY, "true");

        alert("Signup successful! Redirecting...");
        window.location.href = "index.html";
    });
}

// ------------------------------------------------------------
// SIGN IN HANDLER
// ------------------------------------------------------------
function handleSigninForm(form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = form.querySelector("input[name='email']");
        const pass = form.querySelector("input[name='password']");

        if (!email.value || !pass.value) {
            alert("All fields are required!");
            return;
        }

        const storedUser = JSON.parse(localStorage.getItem(USER_DATA_KEY));

        if (!storedUser || storedUser.email !== email.value || storedUser.password !== pass.value) {
            alert("Invalid email or password!");
            return;
        }

        localStorage.setItem(AUTH_KEY, "true");

        alert("Login successful! Redirecting...");
        window.location.href = "index.html";
    });
}

// ------------------------------------------------------------
// PASSWORD TOGGLE (eye icon)
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".eco-auth-eye-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const input = this.previousElementSibling;
            const icon = this.querySelector("ion-icon");

            if (input.type === "password") {
                input.type = "text";
                icon.setAttribute("name", "eye-off-outline");
            } else {
                input.type = "password";
                icon.setAttribute("name", "eye-outline");
            }
        });
    });

    // Attach signin/signup handlers automatically
    const signupForm = document.querySelector(".eco-signup-form");
    if (signupForm) handleSignupForm(signupForm);

    const signinForm = document.querySelector(".eco-signin-form");
    if (signinForm) handleSigninForm(signinForm);
});
