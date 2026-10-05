/* =====================================================
   GREENHILL FOOD CO-OP
   APPLICATION LOGIC
===================================================== */


/* =====================================================
   INITIAL PRODUCTS
===================================================== */

const defaultProducts = [

    {
        id: 1,
        name: "Rolled Oats, Organic",
        category: "drygoods",
        price: 3.40,
        saleType: "kg",
        emoji: "🌾",
        description: "Organic rolled oats, scooped from bulk sacks.",
        active: true
    },

    {
        id: 2,
        name: "Brown Rice, Medium Grain",
        category: "drygoods",
        price: 4.10,
        saleType: "kg",
        emoji: "🍚",
        description: "Medium grain brown rice from Harvest Belt.",
        active: true
    },

    {
        id: 3,
        name: "Red Lentils, Split",
        category: "drygoods",
        price: 4.85,
        saleType: "kg",
        emoji: "🫘",
        description: "Split red lentils, sold by weight.",
        active: true
    },

    {
        id: 4,
        name: "Coffee Beans, Whole",
        category: "drygoods",
        price: 32.00,
        saleType: "kg",
        emoji: "☕",
        description: "Whole coffee beans, scooped to order.",
        active: true
    },

    {
        id: 5,
        name: "Raw Almonds",
        category: "drygoods",
        price: 18.90,
        saleType: "kg",
        emoji: "🌰",
        description: "Raw almonds from the bulk sack.",
        active: true
    },

    {
        id: 6,
        name: "Carrots (Two Creeks)",
        category: "produce",
        price: 3.20,
        saleType: "kg",
        emoji: "🥕",
        description: "Carrots delivered Thursday morning.",
        active: true
    },

    {
        id: 7,
        name: "Pumpkin (Two Creeks)",
        category: "produce",
        price: 2.60,
        saleType: "kg",
        emoji: "🎃",
        description: "Whole or cut pumpkin, priced by weight.",
        active: true
    },

    {
        id: 8,
        name: "Tahini, 375 g Jar",
        category: "pantry",
        price: 9.80,
        saleType: "unit",
        emoji: "🥜",
        description: "Unhulled tahini in a 375 gram jar.",
        active: true
    },

    {
        id: 9,
        name: "Peanut Butter, 500 g Jar",
        category: "pantry",
        price: 8.40,
        saleType: "unit",
        emoji: "🥜",
        description: "Smooth peanut butter, 500 gram jar.",
        active: true
    },

    {
        id: 10,
        name: "Olive Oil, 1 L Tin",
        category: "pantry",
        price: 19.60,
        saleType: "unit",
        emoji: "🫒",
        description: "Extra virgin olive oil in a one litre tin.",
        active: true
    },

    {
        id: 11,
        name: "Eggs, Free Range, Dozen",
        category: "pantry",
        price: 7.50,
        saleType: "unit",
        emoji: "🥚",
        description: "Free range eggs, sold by the dozen.",
        active: true
    },

    {
        id: 12,
        name: "Olive Oil Soap Bar",
        category: "household",
        price: 4.20,
        saleType: "unit",
        emoji: "🧼",
        description: "Olive oil soap bar.",
        active: true
    }

];


/* =====================================================
   LOCAL STORAGE
===================================================== */

let products =
    JSON.parse(localStorage.getItem("greenhill_products"))
    || defaultProducts;

let cart =
    JSON.parse(localStorage.getItem("greenhill_cart"))
    || [];

let orders =
    JSON.parse(localStorage.getItem("greenhill_orders"))
    || [];


/* =====================================================
   HELPERS
===================================================== */

/* Escape anything typed by a user before putting it in the page. */

function escapeHtml(value) {

    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

}


/* =====================================================
   SAVE DATA
===================================================== */

function saveData() {

    localStorage.setItem(
        "greenhill_products",
        JSON.stringify(products)
    );

    localStorage.setItem(
        "greenhill_cart",
        JSON.stringify(cart)
    );

    localStorage.setItem(
        "greenhill_orders",
        JSON.stringify(orders)
    );

}


/* =====================================================
   PAGE NAVIGATION
===================================================== */

const navButtons =
    document.querySelectorAll(".nav-btn");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const page =
            button.dataset.page;

        showPage(page);

    });

});


function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.remove("active-page");

        });


    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {

            button.classList.remove("active");

        });


    if (page === "shop") {

        document
            .getElementById("shopPage")
            .classList.add("active-page");

        document
            .querySelector('[data-page="shop"]')
            .classList.add("active");

    }


    if (page === "orders") {

        document
            .getElementById("ordersPage")
            .classList.add("active-page");

        document
            .querySelector('[data-page="orders"]')
            .classList.add("active");

        renderOrders();

    }


    if (page === "coordinator") {

        document
            .getElementById("coordinatorPage")
            .classList.add("active-page");

        document
            .querySelector('[data-page="coordinator"]')
            .classList.add("active");

        renderCoordinator();

    }

}


/* =====================================================
   PRODUCT RENDERING
===================================================== */

let currentCategory = "all";


function renderProducts() {

    const grid =
        document.getElementById("productGrid");

    const search =
        document
            .getElementById("productSearch")
            .value
            .toLowerCase();


    let filtered =
        products.filter(product => {

            if (!product.active)
                return false;

            const matchesCategory =
                currentCategory === "all"
                || product.category === currentCategory;

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search);

            return matchesCategory && matchesSearch;

        });


    if (filtered.length === 0) {

        grid.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🔎</div>
                <strong>No products found</strong>
                <p>Try another search.</p>
            </div>
        `;

        return;
    }


    grid.innerHTML =
        filtered.map(product => `

            <article class="product-card">

                <div class="product-image">

                    <span class="product-badge">
                        LOCAL
                    </span>

                    ${product.emoji}

                </div>


                <div class="product-body">

                    <div class="product-category">
                        ${escapeHtml(product.category)}
                    </div>

                    <div class="product-name">
                        ${escapeHtml(product.name)}
                    </div>

                    <div class="product-description">
                        ${escapeHtml(product.description)}
                    </div>


                    <div class="product-footer">

                        <div class="product-price">

                            <strong>
                                $${product.price.toFixed(2)}
                            </strong>

                            <span>
                                ${unitLabel(product)}
                            </span>

                        </div>


                        <button
                            class="add-btn"
                            onclick="addToCart(${product.id})"
                        >
                            +
                        </button>

                    </div>

                </div>

            </article>

        `).join("");

}


/* =====================================================
   CATEGORY FILTER
===================================================== */

document
    .querySelectorAll(".category")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".category")
                .forEach(btn =>
                    btn.classList.remove("active")
                );


            button.classList.add("active");


            currentCategory =
                button.dataset.category;


            renderProducts();

        });

    });


/* =====================================================
   SEARCH
===================================================== */

document
    .getElementById("productSearch")
    .addEventListener(
        "input",
        renderProducts
    );


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(productId) {

    const product =
        products.find(p => p.id === productId);

    if (!product)
        return;


    const existing =
        cart.find(item =>
            item.productId === productId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            productId: productId,

            quantity: 1

        });

    }


    saveData();

    updateCart();

    showToast(
        `${product.name} added to your cart`
    );

}


/* =====================================================
   UPDATE CART
===================================================== */

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <strong>
                    Your cart is empty
                </strong>

                <p>
                    Add products to get started.
                </p>

            </div>

        `;

    } else {

        cartItems.innerHTML =

            cart.map(item => {

                const product =
                    products.find(
                        p => p.id === item.productId
                    );

                if (!product)
                    return "";


                const total =
                    calculateLineTotal(product, item.quantity);


                return `

                    <div class="cart-item">

                        <div class="cart-item-icon">
                            ${product.emoji}
                        </div>


                        <div class="cart-item-info">

                            <strong>
                                ${escapeHtml(product.name)}
                            </strong>

                            <small>
                                $${product.price.toFixed(2)}
                                / ${unitLabel(product)}
                            </small>


                            <div class="quantity-controls">

                                <button
                                    onclick="changeQuantity(${product.id}, -1)"
                                >
                                    −
                                </button>


                                <input
                                    type="number"
                                    min="0"
                                    step="${quantityStep(product)}"
                                    value="${item.quantity}"
                                    onchange="setQuantity(${product.id}, this.value)"
                                    style="width:70px;padding:6px;text-align:center;
                                           border:1px solid #d8dee9;border-radius:8px;
                                           font-family:inherit;font-size:14px;"
                                >


                                <span>
                                    ${product.saleType === "kg" ? "kg" : ""}
                                </span>


                                <button
                                    onclick="changeQuantity(${product.id}, 1)"
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <div class="cart-item-total">

                            $${total.toFixed(2)}

                        </div>

                    </div>

                `;

            }).join("");

    }


    updateCartTotals();

}


/* =====================================================
   CHANGE QUANTITY
===================================================== */

function changeQuantity(productId, direction) {

    const item =
        cart.find(item => item.productId === productId);

    const product =
        products.find(p => p.id === productId);

    if (!item || !product)
        return;


    const next =
        item.quantity + (direction * quantityStep(product));


    setQuantity(
        productId,
        product.saleType === "kg"
            ? roundToGrams(next)
            : next
    );

}


/* =====================================================
   SET QUANTITY

   Weighed products accept decimal kilograms.
   Unit products accept whole numbers only.
===================================================== */

function setQuantity(productId, value) {

    const item =
        cart.find(item => item.productId === productId);

    const product =
        products.find(p => p.id === productId);

    if (!item || !product)
        return;


    const amount = Number(value);


    if (isNaN(amount) || amount <= 0) {

        cart =
            cart.filter(
                entry => entry.productId !== productId
            );

        saveData();

        updateCart();

        return;

    }


    if (!isValidQuantity(product, amount)) {

        showToast(
            `${product.name} is sold each — please use whole numbers`
        );

        updateCart();

        return;

    }


    item.quantity =
        product.saleType === "kg"
            ? roundToGrams(amount)
            : amount;


    saveData();

    updateCart();

}


/* =====================================================
   CART TOTAL
===================================================== */

function updateCartTotals() {

    let total = 0;


    cart.forEach(item => {

        const product =
            products.find(
                p => p.id === item.productId
            );

        if (!product)
            return;


        total +=
            calculateLineTotal(product, item.quantity);

    });


    total = roundToCents(total);


    document
        .getElementById("cartCount")
        .textContent = cart.length;


    document
        .getElementById("cartSubtotal")
        .textContent =
            `$${total.toFixed(2)}`;


    document
        .getElementById("cartTotal")
        .textContent =
            `$${total.toFixed(2)}`;

}


/* =====================================================
   CART DRAWER
===================================================== */

const cartDrawer =
    document.getElementById("cartDrawer");

const cartOverlay =
    document.getElementById("cartOverlay");


document
    .getElementById("cartButton")
    .addEventListener("click", () => {

        cartDrawer.classList.add("open");

        cartOverlay.classList.add("show");

    });


document
    .getElementById("closeCart")
    .addEventListener("click", closeCart);


cartOverlay.addEventListener(
    "click",
    closeCart
);


function closeCart() {

    cartDrawer.classList.remove("open");

    cartOverlay.classList.remove("show");

}


/* =====================================================
   PLACE ORDER
===================================================== */

function placeOrder() {

    if (cart.length === 0) {

        showToast(
            "Your cart is empty"
        );

        return;

    }


    const items =
        cart.map(item => {

            const product =
                products.find(
                    p => p.id === item.productId
                );

            return {

                productId: product.id,

                name: product.name,

                emoji: product.emoji,

                price: product.price,

                saleType: product.saleType,
               
                quantity: item.quantity,

                total:
                    calculateLineTotal(
                        product,
                        item.quantity
                    )

            };

        });


    const total =
        calculateOrderTotal(items);


    const order = {

        id:
            "GH-" +
            Date.now()
                .toString()
                .slice(-6),

        date:
            new Date()
                .toLocaleDateString(),

        items: items,

        total: total,

        status: "Placed"

    };


    orders.unshift(order);


    cart = [];


    saveData();

    updateCart();

    closeCart();

    updateStatistics();

    showToast(
        `Order ${order.id} placed successfully`
    );

}


/* =====================================================
   MY ORDERS
===================================================== */

function renderOrders() {

    const container =
        document.getElementById(
            "ordersContainer"
        );


    if (orders.length === 0) {

        container.innerHTML = `

            <div class="management-card">

                <div class="empty-cart"
                     style="height:300px">

                    <div class="empty-cart-icon">
                        📦
                    </div>

                    <strong>
                        No orders yet
                    </strong>

                    <p>
                        Your orders will appear here.
                    </p>

                </div>

            </div>

        `;

        return;

    }


    container.innerHTML =

        orders.map(order => `

            <div class="order-card">

                <div class="order-header">

                    <div>

                        <div class="order-id">
                            ${order.id}
                        </div>

                        <div class="order-date">
                            ${order.date}
                        </div>

                    </div>

                    <div class="order-status">
                        ${order.status}
                    </div>

                </div>


                <div class="order-items">

                    ${order.items.map(item => `

                        <div class="order-item">

                            <div class="order-item-icon">
                                ${item.emoji}
                            </div>

                            <div class="order-item-info">

                                <strong>
                                    ${escapeHtml(item.name)}
                                </strong>

                                <span>
                                    ${quantityLabel(item, item.quantity)}
                                    ×
                                    $${item.price.toFixed(2)}
                                    ${unitLabel(item)}
                                </span>

                            </div>

                            <div class="order-item-price">

                                $${item.total.toFixed(2)}

                            </div>

                        </div>

                    `).join("")}

                </div>


                <div class="order-footer">

                    <div class="order-total">

                        <span>
                            ORDER TOTAL
                        </span>

                        <strong>
                            $${order.total.toFixed(2)}
                        </strong>

                    </div>


                    <div class="order-actions">

                        ${
                            order.status === "Placed"
                            ? `
                                <button
                                    class="small-btn"
                                    onclick="changeOrder('${order.id}')"
                                >
                                    ✏️ Change
                                </button>

                                <button
                                    class="small-btn danger"
                                    onclick="cancelOrder('${order.id}')"
                                >
                                    Cancel
                                </button>
                            `
                            : ""
                        }

                    </div>

                </div>

            </div>

        `).join("");

}


/* =====================================================
   CHANGE ORDER
===================================================== */

let editingOrderId = null;

let editingItems = [];


function changeOrder(orderId) {

    const order =
        orders.find(o => o.id === orderId);

    if (!order)
        return;


    editingOrderId = orderId;


    /* Work on a copy so "Keep Current Order" really keeps it. */

    editingItems =
        order.items.map(item => ({ ...item }));


    renderOrderEditItems();


    document
        .getElementById("orderEditModal")
        .classList.add("show");

}


function renderOrderEditItems() {

    const container =
        document.getElementById("orderEditItems");


    if (editingItems.length === 0) {

        container.innerHTML = `
            <div class="empty-cart" style="height:160px">
                <strong>No items left</strong>
                <p>Saving now will cancel this order.</p>
            </div>
        `;

    } else {

        container.innerHTML =

            editingItems.map(item => `

                <div class="order-item">

                    <div class="order-item-icon">
                        ${item.emoji}
                    </div>

                    <div class="order-item-info">

                        <strong>
                            ${escapeHtml(item.name)}
                        </strong>

                        <span>
                            $${item.price.toFixed(2)}
                            ${unitLabel(item)}
                        </span>

                    </div>

                    <input
                        type="number"
                        min="0"
                        step="${quantityStep(item)}"
                        value="${item.quantity}"
                        onchange="updateEditQuantity(${item.productId}, this.value)"
                        style="width:70px;padding:6px;text-align:center;
                               border:1px solid #d8dee9;border-radius:8px;
                               font-family:inherit;font-size:14px;margin-right:10px;"
                    >

                    <button
                        class="small-btn danger"
                        onclick="removeEditItem(${item.productId})"
                    >
                        Remove
                    </button>

                </div>

            `).join("");

    }


    document
        .getElementById("orderEditTotal")
        .textContent =
            `$${calculateOrderTotal(editingItems).toFixed(2)}`;

}


function updateEditQuantity(productId, value) {

    const item =
        editingItems.find(i => i.productId === productId);

    if (!item)
        return;


    const amount = Number(value);


    if (isNaN(amount) || amount <= 0) {

        removeEditItem(productId);

        return;

    }


    if (!isValidQuantity(item, amount)) {

        showToast(
            `${item.name} is sold each — please use whole numbers`
        );

        renderOrderEditItems();

        return;

    }


    item.quantity =
        item.saleType === "kg"
            ? roundToGrams(amount)
            : amount;

    item.total =
        calculateLineTotal(item, item.quantity);


    renderOrderEditItems();

}


function removeEditItem(productId) {

    editingItems =
        editingItems.filter(
            item => item.productId !== productId
        );

    renderOrderEditItems();

}


function saveOrderChanges() {

    const order =
        orders.find(o => o.id === editingOrderId);

    if (!order)
        return;


    if (editingItems.length === 0) {

        order.status = "Cancelled";

        showToast("Order cancelled — all items were removed");

    } else {

        order.items = editingItems;

        order.total = calculateOrderTotal(editingItems);

        order.updated =
            new Date().toLocaleDateString();

        showToast(`Order ${order.id} updated`);

    }


    saveData();

    closeOrderEditModal();

    renderOrders();

    updateStatistics();

}


function closeOrderEditModal() {

    document
        .getElementById("orderEditModal")
        .classList.remove("show");

    editingOrderId = null;

    editingItems = [];

}


/* =====================================================
   CANCEL ORDER
===================================================== */

function cancelOrder(orderId) {

    const order =
        orders.find(o => o.id === orderId);

    if (!order)
        return;


    /* The order is kept for the records, marked as cancelled. */

    order.status = "Cancelled";


    saveData();

    renderOrders();

    updateStatistics();

    showToast(
        `Order ${order.id} cancelled`
    );

}


/* =====================================================
   COORDINATOR DASHBOARD
===================================================== */

function renderCoordinator() {

    const table =
        document.getElementById(
            "productTableBody"
        );


    table.innerHTML =

        products.map(product => `

            <tr>

                <td>

                    <div class="product-table-name">

                        <div class="table-product-icon">
                            ${product.emoji}
                        </div>

                        <strong>
                            ${product.name}
                        </strong>

                    </div>

                </td>


                <td>
                    ${product.category}
                </td>


                <td>
                    $${product.price.toFixed(2)}
                </td>


                <td>
                    ${product.saleType === "kg" ? "per kg" : "each"}
                </td>


                <td>

                    ${
                        product.active

                        ? `
                            <span class="status-active">
                                Active
                            </span>
                        `

                        : `
                            <span class="status-withdrawn">
                                Withdrawn
                            </span>
                        `
                    }

                </td>


                <td>

                    <div class="table-actions">

                        <button
                            class="icon-btn"
                            title="Edit"
                            onclick="editProduct(${product.id})"
                        >
                            ✏️
                        </button>


                        <button
                            class="icon-btn"
                            title="Withdraw"
                            onclick="withdrawProduct(${product.id})"
                        >
                            ${
                                product.active
                                ? "🚫"
                                : "↩️"
                            }
                        </button>

                    </div>

                </td>

            </tr>

        `).join("");


    renderCoordinatorOrders();

    updateCoordinatorStats();

}


/* =====================================================
   COORDINATOR ORDERS
===================================================== */

function renderCoordinatorOrders() {

    const container =
        document.getElementById(
            "coordinatorOrders"
        );


    if (orders.length === 0) {

        container.innerHTML = `

            <div class="empty-cart"
                 style="height:200px">

                <div class="empty-cart-icon">
                    📦
                </div>

                <strong>
                    No member orders
                </strong>

            </div>

        `;

        return;

    }


    container.innerHTML =

        orders.map(order => `

            <div class="order-card">

                <div class="order-header">

                    <div>

                        <div class="order-id">
                            ${order.id}
                        </div>

                        <div class="order-date">
                            Member Order • ${order.date}
                        </div>

                    </div>

                    <div class="order-status">
                        ${order.status}
                    </div>

                </div>


                <div class="order-items">

                    ${order.items.map(item => `

                        <div class="order-item">

                            <div class="order-item-icon">
                                ${item.emoji}
                            </div>

                            <div class="order-item-info">

                                <strong>
                                    ${escapeHtml(item.name)}
                                </strong>

                                <span>
                                    Quantity:
                                    ${quantityLabel(item, item.quantity)}
                                </span>

                            </div>

                            <div class="order-item-price">

                                $${item.total.toFixed(2)}

                            </div>

                        </div>

                    `).join("")}

                </div>


                <div class="order-footer">

                    <div class="order-total">

                        <span>
                            TOTAL
                        </span>

                        <strong>
                            $${order.total.toFixed(2)}
                        </strong>

                    </div>

                </div>

            </div>

        `).join("");

}


/* =====================================================
   ADD PRODUCT
===================================================== */

function openProductModal() {

    document
        .getElementById("productModal")
        .classList.add("show");


    document
        .getElementById("modalTitle")
        .textContent =
            "Add Product";


    document
        .getElementById("productForm")
        .reset();


    document
        .getElementById("productId")
        .value = "";

}


/* =====================================================
   CLOSE PRODUCT MODAL
===================================================== */

function closeProductModal() {

    document
        .getElementById("productModal")
        .classList.remove("show");

}


/* =====================================================
   PRODUCT FORM
===================================================== */

document
    .getElementById("productForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const id =
                document
                    .getElementById("productId")
                    .value;


            const productData = {

                name:
                    document
                        .getElementById("productName")
                        .value,

                category:
                    document
                        .getElementById("productCategory")
                        .value,

                price:
                    Number(
                        document
                            .getElementById("productPrice")
                            .value
                    ),

                  saleType:
                    document
                        .getElementById("productSaleType")
                        .value,

                emoji:
                    document
                        .getElementById("productEmoji")
                        .value || "🥬",

                description:
                    "Fresh product available from Greenhill Food Co-op.",

                active: true

            };


            if (id) {

                const index =
                    products.findIndex(
                        p => p.id === Number(id)
                    );


                if (index !== -1) {

                    products[index] = {

                        ...products[index],

                        ...productData

                    };

                }


                showToast(
                    "Product updated successfully"
                );

            } else {

                products.push({

                    id:
                        Date.now(),

                    ...productData

                });


                showToast(
                    "Product added successfully"
                );

            }


            saveData();

            renderProducts();

            renderCoordinator();

            closeProductModal();

        }
    );


/* =====================================================
   EDIT PRODUCT
===================================================== */

function editProduct(id) {

    const product =
        products.find(
            p => p.id === id
        );

    if (!product)
        return;


    document
        .getElementById("productId")
        .value = product.id;


    document
        .getElementById("productName")
        .value = product.name;


    document
        .getElementById("productCategory")
        .value = product.category;


    document
        .getElementById("productPrice")
        .value = product.price;


    document
        .getElementById("productSaleType")
        .value = product.saleType;


    document
        .getElementById("productEmoji")
        .value = product.emoji;


    document
        .getElementById("modalTitle")
        .textContent =
            "Update Product";


    document
        .getElementById("productModal")
        .classList.add("show");

}


/* =====================================================
   WITHDRAW PRODUCT
===================================================== */

function withdrawProduct(id) {

    const product =
        products.find(
            p => p.id === id
        );

    if (!product)
        return;


    product.active =
        !product.active;


    saveData();

    renderProducts();

    renderCoordinator();

    showToast(
        product.active
        ? "Product restored"
        : "Product withdrawn"
    );

}


/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics() {

    const activeProducts =
        products.filter(
            p => p.active
        ).length;


    document
        .getElementById("productCount")
        .textContent =
            activeProducts;


    document
        .getElementById("orderCount")
        .textContent =
            orders.filter(
                order => order.status !== "Cancelled"
            ).length;

}


function updateCoordinatorStats() {

    const activeProducts =
        products.filter(
            p => p.active
        ).length;


    const total =
        orders.reduce(
            (sum, order) =>
                sum +
                (
                    order.status !== "Cancelled"
                    ? order.total
                    : 0
                ),
            0
        );


    document
        .getElementById(
            "coordProductCount"
        )
        .textContent =
            activeProducts;


    document
        .getElementById(
            "coordOrderCount"
        )
        .textContent =
            orders.filter(
                order => order.status !== "Cancelled"
            ).length;


    document
        .getElementById(
            "coordTotal"
        )
        .textContent =
            `$${total.toFixed(2)}`;

}


/* =====================================================
   SCROLL TO PRODUCTS
===================================================== */

function scrollToProducts() {

    document
        .getElementById("productsSection")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById("toast");


    document
        .getElementById("toastMessage")
        .textContent = message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

}


/* =====================================================
   INITIALIZE APPLICATION
===================================================== */

function initializeApp() {

    renderProducts();

    updateCart();

    renderOrders();

    updateStatistics();

    renderCoordinator();

}


initializeApp();
