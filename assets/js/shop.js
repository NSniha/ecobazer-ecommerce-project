// =================== SHOP PAGE SCRIPT ===================
document.addEventListener("DOMContentLoaded", function () {
    const shopGrid = document.getElementById("ecoShopGrid");
    if (!shopGrid) return; // Only run on shop.html

    const paginationEl = document.getElementById("ecoPagination");

    /* ============================================================
       MASTER PRODUCT LIST
    ============================================================ */
    const ecoProducts = [];
    let ecoProductId = 1;
    const PAGE_SIZE = 21;
    let currentPage = 1;
    let filteredList = [];

    /* ============================================================
       RANDOMIZER
    ============================================================ */
    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /* ============================================================
       ADD TEMPLATE PRODUCTS
    ============================================================ */
    function addProducts(categoryKey, displayCategory, count, baseTemplates) {
        for (let i = 0; i < count; i++) {
            const base = baseTemplates[i % baseTemplates.length];

            ecoProducts.push({
                id: ecoProductId++,
                category: categoryKey,
                displayCategory,
                name: base.name,
                price: base.price,
                oldPrice: base.oldPrice || null,
                discount: base.discount || 0,
                rating: 5,
                isInStock: base.isInStock !== false,
                tags: base.tags || [],
                imageMain: base.imageMain,
                gallery: base.gallery || [base.imageMain]
            });
        }
    }

    /* ============================================================
       IMAGE PATHS
    ============================================================ */

    /* ---- Vegetables ---- */
    const imgVegPumpkinSlice = "images/pd-veg-pumpkin-slice.png";
    const imgVegGreenBeansFresh = "images/pd-veg-beans.png";
    const imgVegOnionWhite = "images/pd-veg-onion-white.png";
    const imgVegCabbageCut = "images/pd-veg-cabbage-cut.png";
    const imgVegTomatoCherryBox = "images/pd-veg-tomato-cherry.png";
    const imgVegGarlicWhole = "images/pd-veg-garlic.png";
    const imgVegBeetrootFresh = "images/pd-veg-beetroot.png";
    const imgVegPeasFresh = "images/pd-veg-peas.png";
    const imgVegEggplantBrinjal = "images/pd-veg-eggplant.png";
    const imgVegRadishWhite = "images/pd-veg-mint.png";
    const imgVegOnionRed = "images/pd-veg-onion-red.png";
    const imgVegPotatoFresh = "images/pd-veg-potato.png";
    const imgVegTomatoFresh = "images/pd-veg-tomato.png";
    const imgVegMushroomButton = "images/pd-veg-mushroom.png";
    const imgVegCornFresh = "images/pd-veg-corn.png";
    const imgVegCarrotFresh = "images/pd-veg-carrot.png";
    const imgVegGingerRoot = "images/pd-veg-ginger.png";
    const imgVegBroccoliFresh = "images/pd-veg-broccoli.png";

    /* ---- Fruits ---- */
    const imgFruitGreenAppleSingle = "images/pd-fruit-green-apple-1.png";
    const imgFruitRedAppleSingle = "images/pd-fruit-red-apple-1.png";
    const imgFruitBananaBunch = "images/pd-fruit-banana-bunch.png";
    const imgFruitGrapesGreen = "images/pd-fruit-green-grapes.png";
    const imgFruitOrangeSingle = "images/pd-fruit-orange-1.png";
    const imgFruitStrawberryPack = "images/pd-fruit-strawberry-pack.png";
    const imgFruitPineappleWhole = "images/pd-fruit-pineapple.png";
    const imgFruitKiwiPack = "images/pd-fruit-kiwi-pack.png";
    const imgFruitMangoPack = "images/pd-fruit-mango-pack.png";
    const imgFruitWatermelonSlice = "images/pd-fruit-watermelon-slice.png";
    const imgFruitPapayaCut = "images/pd-fruit-papaya-cut.png";
    const imgFruitMixedFruitBowl = "images/pd-fruit-mixed-bowl.png";

    /* ---- Cooking ---- */
    const imgCookBasmatiRice = "images/pd-cook-basmati-rice.png";
    const imgCookSunflowerOil = "images/pd-cook-sunflower-oil.png";
    const imgCookAllPurposeFlour = "images/pd-cook-all-purpose-flour.png";
    const imgCookOliveOilPremium = "images/pd-cook-olive-oil-premium.png";
    const imgCookBrownSugar = "images/pd-cook-brown-sugar.png";

    /* ---- Snacks ---- */
    const imgSnackBakedChips = "images/pd-snack-baked-chips.png";
    const imgSnackSaltedPeanuts = "images/pd-snack-salted-peanuts.png";
    const imgSnackChocolateCookies = "images/pd-snack-chocolate-cookies.png";
    const imgSnackNachoCheeseChips = "images/pd-snack-nacho-cheese-chips.png";
    const imgSnackPopcornButter = "images/pd-snack-popcorn-butter.png";
    const imgSnackGranolaBar = "images/pd-snack-granola-bar.png";
    const imgSnackMixedNuts = "images/pd-snack-mixed-nuts.png";
    const imgSnackPretzelSticks = "images/pd-snack-pretzel-sticks.png";

    /* ---- Beverages ---- */
    const imgBevOrangeJuice = "images/pd-bev-orange-juice.png";
    const imgBevFreshMilk = "images/pd-bev-fresh-milk.png";
    const imgBevGreenTea = "images/pd-bev-green-tea.png";
    const imgBevColaCan = "images/pd-bev-cola-can.png";
    const imgBevLemonadeBottle = "images/pd-bev-lemonade-bottle.png";
    const imgBevEnergyDrink = "images/pd-bev-energy-drink.png";
    const imgBevIcedCoffee = "images/pd-bev-iced-coffee.png";
    const imgBevMangoJuice = "images/pd-bev-mango-juice.png";
    const imgBevSparklingWater = "images/pd-bev-sparkling-water.png";

    /* ---- Bread & Bakery ---- */
    const imgBreadWholeWheat = "images/pd-bread-whole-wheat.png";
    const imgBreadBurgerBuns = "images/pd-bread-burger-buns.png";
    const imgBreadCroissantPack = "images/pd-bread-croissant-pack.png";
    const imgBreadGarlicLoaf = "images/pd-bread-garlic-loaf.png";
    const imgBreadMultigrainBread = "images/pd-bread-multigrain.png";
    const imgBreadBananaBread = "images/pd-bread-banana-bread.png";
    const imgBreadDinnerRolls = "images/pd-bread-dinner-rolls.png";
    const imgBreadHotdogBuns = "images/pd-bread-hotdog-buns.png";
    const imgBreadFrenchBaguette = "images/pd-bread-french-baguette.png";
    const imgBreadPitaBread = "images/pd-bread-pita.png";
    const imgBreadChocolateDonut = "images/pd-bread-chocolate-donut.png";
    const imgBreadVanillaCupcake = "images/pd-bread-vanilla-cupcake.png";
    const imgBreadCinnamonRoll = "images/pd-bread-cinnamon-roll.png";

    /* ============================================================
       BASE TEMPLATES
    ============================================================ */

    const vegetablesTemplates = [
        { name: "Pumpkin Slice", price: 2.89, oldPrice: 3.49, tags: ["Healthy"], imageMain: imgVegPumpkinSlice },
        { name: "Green Beans", price: 2.19, oldPrice: 2.79, discount: 21, tags: ["Low fat"], imageMain: imgVegGreenBeansFresh },
        { name: "White Onion", price: 1.49, oldPrice: 1.89, discount: 21, tags: ["Cooking"], imageMain: imgVegOnionWhite },
        { name: "Cut Cabbage", price: 1.99, oldPrice: 2.49, tags: ["Vegetarian"], imageMain: imgVegCabbageCut },
        { name: "Cherry Tomato", price: 2.49, oldPrice: 3.19, tags: ["Snacks"], imageMain: imgVegTomatoCherryBox },
        { name: "Garlic", price: 1.29, oldPrice: 1.69, tags: ["Cooking"], imageMain: imgVegGarlicWhole },
        { name: "Beetroot", price: 2.39, oldPrice: 2.89, tags: ["Healthy"], imageMain: imgVegBeetrootFresh },
        { name: "Green Peas", price: 2.19, oldPrice: 2.79, discount: 21, tags: ["Dinner"], imageMain: imgVegPeasFresh },
        { name: "Brinjal", price: 1.89, oldPrice: 2.29, tags: ["Vegetarian"], imageMain: imgVegEggplantBrinjal },
        { name: "White Radish", price: 1.79, oldPrice: 2.19, tags: ["Cooking"], imageMain: imgVegRadishWhite },
        { name: "Red Onion", price: 1.69, oldPrice: 2.09, tags: ["Cooking"], imageMain: imgVegOnionRed },
        { name: "Fresh Potato", price: 2.09, oldPrice: 2.69, tags: ["Dinner"], imageMain: imgVegPotatoFresh },
        { name: "Tomato", price: 1.59, oldPrice: 1.99, tags: ["Cooking"], imageMain: imgVegTomatoFresh },
        { name: "Mushroom", price: 2.99, oldPrice: 3.69, tags: ["Healthy"], imageMain: imgVegMushroomButton },
        { name: "Sweet Corn", price: 1.49, oldPrice: 1.89, tags: ["Snacks"], imageMain: imgVegCornFresh },
        { name: "Carrot", price: 1.29, oldPrice: 1.69, tags: ["Breakfast"], imageMain: imgVegCarrotFresh },
        { name: "Ginger", price: 1.39, oldPrice: 1.79, tags: ["Cooking"], imageMain: imgVegGingerRoot },
        { name: "Broccoli", price: 2.79, oldPrice: 3.39, tags: ["Healthy"], imageMain: imgVegBroccoliFresh }
    ];

    const freshFruitTemplates = [
        { name: "Green Apple", price: 4.49, oldPrice: 5.29, discount: 15, tags: ["Fruit"], imageMain: imgFruitGreenAppleSingle },
        { name: "Red Apple", price: 4.69, oldPrice: 5.39, discount: 13, tags: ["Fruit"], imageMain: imgFruitRedAppleSingle },
        { name: "Banana Bunch", price: 3.29, oldPrice: 3.89, tags: ["Fruit"], imageMain: imgFruitBananaBunch },
        { name: "Green Grapes", price: 4.99, oldPrice: 5.79, tags: ["Fruit"], imageMain: imgFruitGrapesGreen },
        { name: "Orange", price: 3.79, oldPrice: 4.39, tags: ["Fruit"], imageMain: imgFruitOrangeSingle },
        { name: "Strawberry Pack", price: 5.49, oldPrice: 6.29, tags: ["Fruit"], imageMain: imgFruitStrawberryPack },
        { name: "Whole Pineapple", price: 3.99, oldPrice: 4.69, tags: ["Fruit"], imageMain: imgFruitPineappleWhole },
        { name: "Kiwi Pack", price: 4.39, oldPrice: 5.09, tags: ["Fruit"], imageMain: imgFruitKiwiPack },
        { name: "Mango Pack", price: 5.99, oldPrice: 6.99, tags: ["Fruit"], imageMain: imgFruitMangoPack },
        { name: "Watermelon Slice", price: 6.29, oldPrice: 7.19, tags: ["Fruit"], imageMain: imgFruitWatermelonSlice },
        { name: "Papaya Cut", price: 4.19, oldPrice: 4.89, tags: ["Fruit"], imageMain: imgFruitPapayaCut },
        { name: "Mixed Fruit Bowl", price: 5.79, oldPrice: 6.69, discount: 13, tags: ["Fruit"], imageMain: imgFruitMixedFruitBowl }
    ];

    const cookingTemplates = [
        { name: "Basmati Rice", price: 7.99, oldPrice: 9.49, discount: 16, tags: ["Cooking"], imageMain: imgCookBasmatiRice },
        { name: "Sunflower Oil", price: 6.49, oldPrice: 7.49, tags: ["Cooking", "Low fat"], imageMain: imgCookSunflowerOil },
        { name: "All Purpose Flour", price: 3.29, oldPrice: 3.99, tags: ["Bread", "Cooking"], imageMain: imgCookAllPurposeFlour },
        { name: "Premium Olive Oil", price: 8.99, oldPrice: 10.49, tags: ["Cooking", "Healthy"], imageMain: imgCookOliveOilPremium },
        { name: "Brown Sugar", price: 2.89, oldPrice: 3.39, discount: 15, tags: ["Cooking", "Baking"], imageMain: imgCookBrownSugar }
    ];

    const snacksTemplates = [
        { name: "Baked Chips", price: 2.99, oldPrice: 3.49, tags: ["Snacks"], imageMain: imgSnackBakedChips },
        { name: "Salted Peanuts", price: 1.99, oldPrice: 2.49, tags: ["Snacks"], imageMain: imgSnackSaltedPeanuts },
        { name: "Chocolate Cookies", price: 2.49, oldPrice: 2.99, discount: 17, tags: ["Snacks"], imageMain: imgSnackChocolateCookies },
        { name: "Nacho Cheese Chips", price: 3.19, oldPrice: 3.69, tags: ["Snacks"], imageMain: imgSnackNachoCheeseChips },
        { name: "Butter Popcorn", price: 1.79, oldPrice: 2.19, tags: ["Snacks", "Movies"], imageMain: imgSnackPopcornButter },
        { name: "Granola Bar", price: 1.49, oldPrice: 1.89, tags: ["Snacks", "Healthy"], imageMain: imgSnackGranolaBar },
        { name: "Mixed Nuts", price: 3.49, oldPrice: 4.19, tags: ["Snacks", "Protein"], imageMain: imgSnackMixedNuts },
        { name: "Pretzel Sticks", price: 2.19, oldPrice: 2.69, tags: ["Snacks"], imageMain: imgSnackPretzelSticks }
    ];

    const beveragesTemplates = [
        { name: "Orange Juice", price: 3.49, oldPrice: 3.99, discount: 12, tags: ["Beverages"], imageMain: imgBevOrangeJuice },
        { name: "Fresh Milk", price: 2.19, oldPrice: 2.49, tags: ["Beverages"], imageMain: imgBevFreshMilk },
        { name: "Green Tea", price: 4.29, oldPrice: 4.99, tags: ["Beverages"], imageMain: imgBevGreenTea },
        { name: "Cola Can", price: 1.49, oldPrice: 1.89, tags: ["Beverages"], imageMain: imgBevColaCan },
        { name: "Lemonade Bottle", price: 2.39, oldPrice: 2.89, tags: ["Beverages"], imageMain: imgBevLemonadeBottle },
        { name: "Energy Drink", price: 2.99, oldPrice: 3.49, tags: ["Beverages"], imageMain: imgBevEnergyDrink },
        { name: "Iced Coffee", price: 3.19, oldPrice: 3.79, tags: ["Beverages"], imageMain: imgBevIcedCoffee },
        { name: "Mango Juice", price: 3.69, oldPrice: 4.19, tags: ["Beverages"], imageMain: imgBevMangoJuice },
        { name: "Sparkling Water", price: 1.99, oldPrice: 2.39, tags: ["Beverages"], imageMain: imgBevSparklingWater }
    ];

    const breadBakeryTemplates = [
        { name: "Wheat Bread", price: 2.49, oldPrice: 2.99, discount: 17, tags: ["Bread"], imageMain: imgBreadWholeWheat },
        { name: "Burger Buns", price: 2.19, oldPrice: 2.69, tags: ["Bread"], imageMain: imgBreadBurgerBuns },
        { name: "Croissant", price: 3.49, oldPrice: 3.99, tags: ["Bakery"], imageMain: imgBreadCroissantPack },
        { name: "Garlic Loaf", price: 3.29, oldPrice: 3.89, tags: ["Bread"], imageMain: imgBreadGarlicLoaf },
        { name: "Multigrain Bread", price: 2.99, oldPrice: 3.49, tags: ["Bread"], imageMain: imgBreadMultigrainBread },
        { name: "Banana Bread", price: 4.49, oldPrice: 5.19, tags: ["Bakery"], imageMain: imgBreadBananaBread },
        { name: "Dinner Rolls", price: 3.19, oldPrice: 3.79, tags: ["Bread"], imageMain: imgBreadDinnerRolls },
        { name: "Hotdog Buns", price: 2.29, oldPrice: 2.89, tags: ["Bread"], imageMain: imgBreadHotdogBuns },
        { name: "French Baguette", price: 2.59, oldPrice: 3.19, tags: ["Bread"], imageMain: imgBreadFrenchBaguette },
        { name: "Pita Bread", price: 2.49, oldPrice: 2.99, tags: ["Bread"], imageMain: imgBreadPitaBread },
        { name: "Chocolate Donut", price: 1.99, oldPrice: 2.39, tags: ["Bakery"], imageMain: imgBreadChocolateDonut },
        { name: "Vanilla Cupcake", price: 2.29, oldPrice: 2.79, tags: ["Bakery"], imageMain: imgBreadVanillaCupcake },
        { name: "Cinnamon Roll", price: 2.89, oldPrice: 3.39, tags: ["Bakery"], imageMain: imgBreadCinnamonRoll }
    ];

    /* ============================================================
       CREATE PRODUCTS
    ============================================================ */
    addProducts("fresh-fruit", "Fresh Fruit", 12, freshFruitTemplates);
    addProducts("vegetables", "Vegetables", 18, vegetablesTemplates);
    addProducts("cooking", "Cooking", 5, cookingTemplates);
    addProducts("snacks", "Snacks", 8, snacksTemplates);
    addProducts("beverages", "Beverages", 9, beveragesTemplates);
    addProducts("bread-bakery", "Bread & Bakery", 13, breadBakeryTemplates);

    /* ============================================================
       FILTER STATE
    ============================================================ */
    const filterState = {
        searchText: "",
        category: "all",
        minPrice: 0,
        maxPrice: 150,
        ratingMin: 4,
        tag: null,
        sortBy: "latest"
    };

    /* ============================================================
       HOME → SHOP CATEGORY SYNC  (ROBUST)
    ============================================================ */

    function normaliseHomeCategory(raw) {
        if (!raw) return null;
        raw = String(raw).trim();

        const map = {
            // slugs
            "fresh-fruit": "fresh-fruit",
            "vegetables": "vegetables",
            "snacks": "snacks",
            "beverages": "beverages",
            "bread-bakery": "bread-bakery",
            "cooking": "cooking",
            // labels
            "Fresh Fruit": "fresh-fruit",
            "Fresh Fruits": "fresh-fruit",
            "Fresh Vegetables": "vegetables",
            "Vegetables": "vegetables",
            "Snacks": "snacks",
            "Beverages": "beverages",
            "Bread & Bakery": "bread-bakery",
            "Cooking": "cooking"
        };

        return map[raw] || null;
    }

    function initCategoryFromHome() {
        // accept both keys just in case
        const possibleKeys = ["ecoHomeCategory", "ecoSelectedCategory"];
        let saved = null;
        let usedKey = null;

        for (const key of possibleKeys) {
            const val = localStorage.getItem(key);
            if (val) {
                saved = val;
                usedKey = key;
                break;
            }
        }

        if (!saved) return;

        const cat = normaliseHomeCategory(saved);
        if (!cat) {
            // invalid value, just clean and skip
            if (usedKey) localStorage.removeItem(usedKey);
            return;
        }

        filterState.category = cat;

        // Sidebar radio update
        document
            .querySelectorAll(".category-list input[type='radio']")
            .forEach(r => {
                r.checked = (r.dataset.ecoCat === filterState.category);
            });

        // clean both keys
        possibleKeys.forEach(k => localStorage.removeItem(k));
    }

    /* ============================================================
       WISHLIST SYSTEM
    ============================================================ */
    const WISHLIST_IDS_KEY = "ecoWishlistIds";
    const WISHLIST_ITEMS_KEY = "ecoWishlistItems";

    let wishlistIds = [];
    let wishlistItems = [];

    function initWishlistFromStorage() {
        try {
            wishlistIds = JSON.parse(localStorage.getItem(WISHLIST_IDS_KEY)) || [];
        } catch {
            wishlistIds = [];
        }

        try {
            wishlistItems = JSON.parse(localStorage.getItem(WISHLIST_ITEMS_KEY)) || [];
        } catch {
            wishlistItems = [];
        }

        // safety rebuild
        if (!Array.isArray(wishlistItems) || wishlistItems.length < wishlistIds.length) {
            wishlistItems = [];
            wishlistIds.forEach(id => {
                const p = ecoProducts.find(x => x.id === id);
                if (p) {
                    wishlistItems.push({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        oldPrice: p.oldPrice || null,
                        imageMain: p.imageMain,
                        isInStock: p.isInStock
                    });
                }
            });
        }

        updateWishlistCount();
    }

    function saveWishlist() {
        localStorage.setItem(WISHLIST_IDS_KEY, JSON.stringify(wishlistIds));
        localStorage.setItem(WISHLIST_ITEMS_KEY, JSON.stringify(wishlistItems));
        updateWishlistCount();
    }

    function updateWishlistCount() {
        const el = document.getElementById("ecoWishlistCount");
        if (el) el.textContent = wishlistIds.length;
    }

    function toggleWishlist(productId) {
        productId = Number(productId);
        const idx = wishlistIds.indexOf(productId);

        if (idx > -1) {
            wishlistIds.splice(idx, 1);
            wishlistItems = wishlistItems.filter(p => p.id !== productId);
        } else {
            const p = ecoProducts.find(x => x.id === productId);
            if (p) {
                wishlistIds.push(productId);
                wishlistItems.push({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    oldPrice: p.oldPrice || null,
                    imageMain: p.imageMain,
                    isInStock: p.isInStock
                });
            }
        }

        saveWishlist();
        renderCurrentPage();
    }

    /* ============================================================
       CART SYSTEM
    ============================================================ */
    const CART_KEY = "ecoCartItems";

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
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

        const count = cart.reduce((t, item) => t + item.qty, 0);
        const total = cart.reduce((t, item) => t + item.qty * item.price, 0);

        badge.textContent = count;
        amount.textContent = `$${total.toFixed(2)}`;
    }

    function addToCart(productId) {
        productId = Number(productId);
        const p = ecoProducts.find(x => x.id === productId);
        if (!p) return;

        const cart = getCart();
        const found = cart.find(item => item.id === productId);

        if (found) {
            found.qty++;
        } else {
            cart.push({
                id: p.id,
                name: p.name,
                price: p.price,
                image: p.imageMain,
                qty: 1
            });
        }

        saveCart(cart);
    }

    /* ============================================================
       STAR BUILDER
    ============================================================ */
    function stars() {
        return `
            <ion-icon name="star"></ion-icon>
            <ion-icon name="star"></ion-icon>
            <ion-icon name="star"></ion-icon>
            <ion-icon name="star"></ion-icon>
            <ion-icon name="star"></ion-icon>
        `;
    }

    /* ============================================================
       RENDER PRODUCTS
    ============================================================ */
    function renderProducts(items) {
        if (!items.length) {
            shopGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;">No products found.</p>`;
            return;
        }

        shopGrid.innerHTML = items
            .map(p => {
                const liked = wishlistIds.includes(p.id);
                return `
                    <div class="shop-card">

                        ${p.discount ? `<span class="sale-badge">Sale ${p.discount}%</span>` : ""}

                        <div class="icons-top">
                            <button class="icon shop-like-btn ${liked ? "liked" : ""}" data-id="${p.id}">
                                <ion-icon name="${liked ? "heart" : "heart-outline"}"></ion-icon>
                            </button>

                            <button class="icon shop-quickview-btn" data-id="${p.id}">
                                <ion-icon name="eye-outline"></ion-icon>
                            </button>
                        </div>

                        <div class="shop-categories-h">
                            <img src="${p.imageMain}" class="shop-img" alt="${p.name}">
                        </div>

                        <h3 class="shop-title">${p.name}</h3>

                        <p class="shop-price">
                            $${p.price.toFixed(2)}
                            ${p.oldPrice ? `<span>$${p.oldPrice.toFixed(2)}</span>` : ""}
                        </p>

                        <div class="rating">${stars()}</div>

                        <button class="cart-btn" data-id="${p.id}">
                            <ion-icon name="cart-outline"></ion-icon>
                        </button>
                    </div>
                `;
            })
            .join("");

        // HEART
        shopGrid.querySelectorAll(".shop-like-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault();
                const id = Number(btn.dataset.id);
                toggleWishlist(id);
            });
        });

        // ADD TO CART
        shopGrid.querySelectorAll(".cart-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault();
                const id = Number(btn.dataset.id);
                addToCart(id);
            });
        });
    }

    /* ============================================================
       PAGINATION
    ============================================================ */
    function getTotalPages() {
        return Math.ceil(filteredList.length / PAGE_SIZE) || 1;
    }

    function renderPagination() {
        if (!paginationEl) return;

        const total = getTotalPages();
        let html = `<button data-page="prev">&lt;</button>`;

        for (let i = 1; i <= total; i++) {
            html += `<span data-page="${i}" class="${i === currentPage ? "active-page" : ""}">${i}</span>`;
        }

        html += `<button data-page="next">&gt;</button>`;
        paginationEl.innerHTML = html;

        paginationEl.querySelectorAll("[data-page]").forEach(btn => {
            btn.addEventListener("click", () => {
                let type = btn.dataset.page;

                if (type === "prev") currentPage = Math.max(1, currentPage - 1);
                else if (type === "next") currentPage = Math.min(total, currentPage + 1);
                else currentPage = Number(type);

                renderCurrentPage();
            });
        });
    }

    function renderCurrentPage() {
        const start = (currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        const resultsEl = document.querySelector(".results");
        if (resultsEl) resultsEl.textContent = `${filteredList.length} Results Found`;

        renderProducts(filteredList.slice(start, end));
        renderPagination();
    }

    /* ============================================================
       APPLY FILTERS
    ============================================================ */
    function applyFilters() {
        let list = ecoProducts.slice();

        if (filterState.searchText) {
            const t = filterState.searchText.toLowerCase();
            list = list.filter(p => p.name.toLowerCase().includes(t));
        }

        if (filterState.category !== "all") {
            list = list.filter(p => p.category === filterState.category);
        }

        if (filterState.tag) {
            list = list.filter(p => p.tags.includes(filterState.tag));
        }

        list = list.filter(
            p => p.price >= filterState.minPrice && p.price <= filterState.maxPrice
        );

        switch (filterState.sortBy) {
            case "price-asc":
                list.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                list.sort((a, b) => b.price - a.price);
                break;
            case "latest":
            default:
                list.sort((a, b) => b.id - a.id);
        }

        if (filterState.category === "all") list = shuffle(list);

        filteredList = list;
        currentPage = 1;
        renderCurrentPage();
    }

    /* ============================================================
       SEARCH INPUT
    ============================================================ */
    const searchInput = document.querySelector(".eco-search-field input");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            filterState.searchText = this.value.trim();
            applyFilters();
        });
    }

    /* ============================================================
       CATEGORY FILTER SIDEBAR
    ============================================================ */
    document.querySelectorAll(".category-list input[type='radio']").forEach(r => {
        r.addEventListener("change", function () {
            filterState.category = this.dataset.ecoCat || "all";
            applyFilters();
        });
    });

    /* ============================================================
       PRICE RANGE
    ============================================================ */
    const priceRange = document.getElementById("ecoPriceRange");
    const priceLabel = document.getElementById("ecoPriceLabel");

    if (priceRange && priceLabel) {
        priceRange.addEventListener("input", function () {
            filterState.maxPrice = Number(this.value);
            priceLabel.textContent = `Price: $0 — $${filterState.maxPrice}`;
            applyFilters();
        });
    }

    /* ============================================================
       TAGS
    ============================================================ */
    const tagContainer = document.getElementById("ecoTagList");

    if (tagContainer) {
        tagContainer.addEventListener("click", function (e) {
            const span = e.target.closest("span[data-tag]");
            if (!span) return;

            tagContainer.querySelectorAll("span").forEach(s => s.classList.remove("active"));

            if (filterState.tag === span.dataset.tag) {
                filterState.tag = null;
            } else {
                filterState.tag = span.dataset.tag;
                span.classList.add("active");
            }

            applyFilters();
        });
    }

    /* ============================================================
       SORT SELECT
    ============================================================ */
    const sortSelect = document.getElementById("ecoSortSelect");

    if (sortSelect) {
        sortSelect.addEventListener("change", function () {
            filterState.sortBy = this.value;
            applyFilters();
        });
    }

    /* ============================================================
       INIT
    ============================================================ */
    initWishlistFromStorage();
    updateHeaderCart();
    initCategoryFromHome();   // <-- IMPORTANT: category set here before first filter
    applyFilters();
});
