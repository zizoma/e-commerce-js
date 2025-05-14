class Product {
    constructor(id, name, price, category, genre, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.genre = genre;
        this.image = image;
        this.isFavorite = false;
        this.isInCart = false;
        this.quantity = 1;  
    }
}

const products = [
    new Product(1, 'Golden Watch', 400, 'Watches', 'women', 'imgs/accessories/2809f6567a8309c00022f8e273d8715c.jpg'),
    new Product(2, 'Silver necklace', 150, 'Necklace', 'men', 'imgs/accessories/686d4a051c21359b7577ee191b02fb70.jpg'),
    new Product(3, 'Golden Earrings', 200, 'Earrings', 'women', 'imgs/accessories/6f5d807b3ac44d8f5fdf2d94f7929177.jpg'),
    new Product(4, 'Black Watch', 350, 'Watches', 'men', 'imgs/accessories/a959c27ca359e1fc2c5453411253d1ad.jpg'),
    new Product(5, 'Silver Set Rings', 580, 'Rings', 'women', 'imgs/accessories/dd94301efd4caef4e84229be9a74bf90.jpg'),
    new Product(6, 'Silver necklace', 150, 'Necklace', 'men', 'imgs/accessories/3ca518ac387b3e07aaf503b2c1399707.jpg'),
    new Product(7, 'Black bracelet', 100, 'Bracelet', 'men', 'imgs/accessories/ef169eeb1097eaa0cd21f0311524820e.jpg'),
    new Product(8, 'Set Necklace', 500, 'Necklace', 'women', 'imgs/accessories/9f5a4002bc9bdda21f05e47dc80a38df.jpg'),
    new Product(9, 'Golden set bracelet', 300, 'Bracelet', 'women', 'imgs/accessories/2a384379039c5e05bd5905edc657e93c.jpg'),
    new Product(10, 'White Watch ', 500, 'Watches', 'men', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcrYcClTqlLhdjFEMALBVNQ2xu5o4HW9Ko6w&s'),
];

function renderProducts(productList) {
    //................testtt........
    
    console.log('Rendering products:', productList);
    
    const productsRow = document.getElementById('products-row');
    productsRow.innerHTML = '';

    productList.forEach(product => {
        const productCard =
            `<div class="col-md-4 mb-4">
                 <div class="card">
                     <img src="${product.image}" class="card-img-top" alt="${product.name}">
                     <div class="card-body">
                         <h5 class="card-title">${product.name}</h5>
                         <p class="card-text">Price: $${product.price}</p>
                         <p class="card-text">Category: ${product.category}</p>
                          <div class="action-container">
                             <i class="fas fa-heart ${product.isFavorite ? 'active' : ''}" onclick="toggleFavorite(${product.id})"></i>
                             <button class="btn ${product.isInCart ? 'btn-outline-danger' : 'btn-primary'} ${product.isInCart ? 'active' : ''}" onclick="toggleCart(${product.id})">
                                 ${product.isInCart ? 'Remove from Cart' : 'Add to Cart'}
                             </button>
                         </div>
                     </div>
                 </div>
             </div>`;
        productsRow.insertAdjacentHTML('beforeend', productCard);
    });
}

function searchProducts() {
    const searchType = document.getElementById('searchType').value;
    const searchText = document.getElementById('searchBox').value.toLowerCase();
    
    const filteredProducts = products.filter(product => {
        if (searchType === 'name') {
            return product.name.toLowerCase().includes(searchText);
        } else if (searchType === 'category') {
            return product.category.toLowerCase().includes(searchText);
        }
        return false;
    });
    
    renderProducts(filteredProducts);
}

function redirectTo(url) {
    window.location.href = url;
}

// ------------------------------------------------

let loggedIn = false;

function register() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!firstName || !lastName || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }
    const users = JSON.parse(localStorage.getItem('users')) || {};
    users[email] = { password, firstName, lastName };
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created successfully!');
    window.location.href = 'login.html';
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[email] && users[email].password === password) {
        localStorage.setItem('loggedInUser', JSON.stringify(users[email]));
        loggedIn = true;
        localStorage.setItem('loggedIn', loggedIn); 
        window.location.href = 'loggedin.html';
    } else {
        alert('Invalid email or password.');
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedIn');
    loggedIn=false;
    // localStorage.clear();
    localStorage.removeItem('cart');
    localStorage.removeItem('favorites');
    window.location.href = 'index.html';
}

//--------------------------------------------------

let cartCount=0;

function toggleCart(productId) {
    const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
        //................testtt........

    console.log('Toggle Cart Clicked. Logged in:', isLoggedIn);
    
    if (!isLoggedIn) {
        //................testtt........
        console.log('Redirecting to login.html');
        redirectTo('login.html');
        return;
    }
    const product = products.find(p => p.id === productId);
    //l array el ha store feh el products el selected
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (product.isInCart) {
        product.isInCart = false;
        product.quantity = 0;
        const index = cart.findIndex(p => p.id === productId);
        if (index > -1) cart.splice(index, 1);
    } else {
        product.isInCart = true;
        product.quantity = 1;
        //l2eto hada5lo fl array
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: product.quantity });
    }
    //save in local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    saveCartAndFavorites();
    updateCartDropdown();
    updateCartCount();
    renderProducts(products);
}

// function toggleFavorite(productId) {
//     const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
//     console.log('Toggle Favorite Clicked. Logged in:', isLoggedIn);

//     if (!isLoggedIn) {
//         console.log('Redirecting to login.html');
//         redirectTo('login.html');
//         return;
//     }

//     const product = products.find(p => p.id === productId);

//     if (product.isFavorite) {
//         removeFavorite(productId);
//     } else {
//         product.isFavorite = true;
//         saveCartAndFavorites();
//         // Update the product card heart icon to active
//         const productCardHeart = document.querySelector(`.fa-heart[onclick="toggleFavorite(${productId})"]`);
//         if (productCardHeart) {
//             productCardHeart.classList.add('active');
//         }
//     }

//     renderProducts(products);
//     if (window.location.href.includes('cart.html')) {
//         renderFavoriteItems();
//     }
// }
function toggleFavorite(productId) {
    const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
    console.log('Toggle Favorite Clicked. Logged in:', isLoggedIn);

    if (!isLoggedIn) {
        console.log('Redirecting to login.html');
        redirectTo('login.html');
        return;
    }

    const product = products.find(p => p.id === productId);

    if (product.isFavorite) {
        removeFavorite(productId);
    } else {
        product.isFavorite = true;
        saveCartAndFavorites();
        const productCardHeart = document.querySelector(`.fa-heart[onclick="toggleFavorite(${productId})"]`);
        if (productCardHeart) {
            productCardHeart.classList.add('active');
        }
    }

    renderProducts(products);
    if (window.location.href.includes('cart.html')) {
        renderFavoriteItems();
    }
}

function toggleCartDropdown() {
    const cartDropdown = document.getElementById('cartDropdown').nextElementSibling;
    cartDropdown.classList.toggle('show');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

function updateCartDropdown() {
    const cartItems = products.filter(product => product.isInCart);
    const cartDropdownItems = document.getElementById('cartDropdownItems');
    cartDropdownItems.innerHTML = '';

    if (cartItems.length === 0) {
        cartDropdownItems.innerHTML = '<p style="text-align: center;">Your cart is empty.</p>';
    } else {
        cartItems.forEach(item => {
            const cartItem = `
                <div class="cart-item_dd justify-content-between align-items-center mb-2 p-2"> 
                    <div class="ml-2 d-flex">
                        <h6 class="mb-0">${item.name}</h6>
                        <p class="mb-0">Price: $<span id="itemPrice${item.id}">${item.price * item.quantity}</span></p>                  
                        </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity(${item.id})">-</button>
                        <span id="itemQuantity${item.id}" class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="increaseQuantity(${item.id})">+</button>
                    </div>
                </div>`;
            cartDropdownItems.insertAdjacentHTML('beforeend', cartItem);
        });
    }
    updateCartCount();
}

function increaseQuantity(productId) {
    const product = products.find(p => p.id === productId);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    product.quantity++;
    const cartItem = cart.find(p => p.id === productId);
    if (cartItem) {
        cartItem.quantity = product.quantity;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById(`itemQuantity${productId}`).textContent = product.quantity;
    document.getElementById(`itemPrice${productId}`).textContent = product.price * product.quantity;
    updateCartDropdown();
    renderCartItems()
}

function decreaseQuantity(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    if (product && product.isInCart) {
        product.quantity--;
        if (product.quantity <= 0) {
            product.isInCart = false;
            const index = cart.findIndex(p => p.id === productId);
            if (index > -1) {
                cart.splice(index, 1);
            }
            const productCardButton = document.querySelector(`button[onclick="toggleCart(${productId})"]`);
            if (productCardButton) {
                productCardButton.textContent = 'Add to Cart';
                productCardButton.classList.remove('btn-outline-danger');
                productCardButton.classList.add('btn-primary');
            }
            const cartItemCard = document.querySelector(`#cart-items .card[data-product-id="${productId}"]`);
            if (cartItemCard) {
                cartItemCard.remove();
            }
        } else {
            const cartItem = cart.find(p => p.id === productId);
            if (cartItem) {
                cartItem.quantity = product.quantity;
            }
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        document.getElementById(`itemQuantity${productId}`).textContent = product.quantity;
        document.getElementById(`itemPrice${productId}`).textContent = product.price * product.quantity;
        updateCartDropdown();
        renderCartItems();
        updateTotalPrice();
    }
}

function saveCartAndFavorites() {
    const cart = products.filter(product => product.isInCart);
    const favorites = products.filter(product => product.isFavorite);
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function loadCartAndFavorites() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    products.forEach(product => {
        const cartProduct = cart.find(p => p.id === product.id);
        const favoriteProduct = favorites.find(p => p.id === product.id)
        if (cartProduct) {
            product.isInCart = true;
            product.quantity = cartProduct.quantity;
        } else {
            product.isInCart = false;
            product.quantity = 0;
        }
        product.isFavorite = !!favoriteProduct;
    });
}

//-----------------------------------------------------------

function renderCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center;">Your cart is empty.</p>';
        return;
    }
    const cartItemsHtml = cartItems.map(item => `
        <div class="col-md-6 mb-4">
            <div class="card d-flex flex-row align-items-center" data-product-id="${item.id}">
                <img src="${item.image}" class="card-img-left" alt="${item.name}" style="width: 100px; height: auto;">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">Category: ${item.category}</p>
                    <p class="card-text">Price: $${item.price * item.quantity}</p>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity(${item.id})">-</button>
                        <span id="itemQuantity${item.id}" class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="increaseQuantity(${item.id})">+</button>
                        <button class="btn btn-danger  ml-5" onclick="removeFromCart(${item.id})">Remove from Cart</button>
                    </div>
                    
                </div>
            </div>
        </div>
    `).join('');
    cartItemsContainer.innerHTML = `
        <div class="row">
            ${cartItemsHtml}
        </div>
    `;

    updateTotalPrice();
}

function renderFavoriteItems() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteItemsContainer = document.getElementById('favorite-items');
    favoriteItemsContainer.innerHTML = '';
    if (favorites.length === 0) {
        favoriteItemsContainer.innerHTML = '<p class="text-center">You have no favorite items.</p>';
        return;
    }
    const favoriteItemsHtml = favorites.map(item => `
        <div class="card card_fav" data-product-id="${item.id}">
            <img src="${item.image}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">Category: ${item.category}</p>
                <i class="fas fa-heart ${item.isFavorite ? 'active' : ''}" onclick="toggleFavorite(${item.id})"></i>
            </div>
        </div>
    `).join('');
    favoriteItemsContainer.innerHTML = favoriteItemsHtml;
}

function updateTotalPrice() {
    const totalPrice = products
        .filter(product => product.isInCart)
        .reduce((total, product) => total + product.price * product.quantity, 0);
        document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}

function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.isInCart = false;
        product.quantity = 0;
        saveCartAndFavorites();
        renderCartItems();
        updateCartDropdown();
        updateTotalPrice()
        document.querySelector(`#cart-items .card[data-product-id="${productId}"]`).remove();
    }
}

function removeFavorite(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const product = products.find(p => p.id === productId);

    if (product && product.isFavorite) {
        product.isFavorite = false;
        const index = favorites.findIndex(p => p.id === productId);
        if (index > -1) {
            favorites.splice(index, 1);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        const productCardHeart = document.querySelector(`.fa-heart[onclick="toggleFavorite(${productId})"]`);
        if (productCardHeart) {
            productCardHeart.classList.remove('active');
        }
        const favoriteItemCard = document.querySelector(`#favorite-items .card[data-product-id="${productId}"]`);
        if (favoriteItemCard) {
            favoriteItemCard.remove();
        }
        renderFavoriteItems();
    }
}

//-----------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
   
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
    if (loggedInUser && isLoggedIn) {
    loggedIn = true;
    document.getElementById('usernameDisplay').textContent = `Hello, ${loggedInUser.firstName}`;
    } else {
    loggedIn = false;
    }
    //................testtt........
    console.log('DOM fully loaded and parsed');
    loadCartAndFavorites();
    renderProducts(products);
    updateCartDropdown();
    updateCartCount();
    if (window.location.href.includes('cart.html')) {
        renderFavoriteItems();
    }
    // const cartIcon = document.getElementById('cartDropdown');
    const cartIcon = document.querySelector('.fas.fa-shopping-cart');
    cartIcon.addEventListener('click', toggleCartDropdown);
});