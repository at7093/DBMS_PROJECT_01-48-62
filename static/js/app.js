let currentUser = null;

// DOM Elements
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const navUserInfo = document.getElementById('nav-user-info');
const userNameEl = document.getElementById('user-name');
const userBalanceEl = document.getElementById('user-balance');
const logoutBtn = document.getElementById('logout-btn');
const dashboardTitle = document.getElementById('dashboard-title');
const dashboardSubtitle = document.getElementById('dashboard-subtitle');
const productsContainer = document.getElementById('products-container');
const productList = document.getElementById('product-list');
const transactionList = document.getElementById('transaction-list');

const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');
const signupForm = document.getElementById('signup-form');
const signupError = document.getElementById('signup-error');

const addFundsSection = document.getElementById('add-funds-section');
const customerActions = document.getElementById('customer-actions');
const openAddFundsBtn = document.getElementById('open-add-funds-btn');
const cancelAddFundsBtn = document.getElementById('cancel-add-funds');
const addFundsForm = document.getElementById('add-funds-form');
const addFundsError = document.getElementById('add-funds-error');
const paymentMethodRadios = document.getElementsByName('payment-method');
const upiDetails = document.getElementById('upi-details');
const cardDetails = document.getElementById('card-details');
// Initialize
async function init() {
    const token = api.getToken();
    if (token) {
        try {
            const res = await api.getMe();
            currentUser = res.data;
            showDashboard();
        } catch (err) {
            console.error(err);
            api.clearToken();
            showAuth();
        }
    } else {
        showAuth();
    }
}

// UI State Toggles
function showAuth() {
    authSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    navUserInfo.style.display = 'none';
    loginContainer.style.display = 'block';
    signupContainer.style.display = 'none';
    if(addFundsSection) addFundsSection.style.display = 'none';
}

async function showDashboard() {
    authSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    navUserInfo.style.display = 'flex';
    
    userNameEl.textContent = `${currentUser.username} (${currentUser.role})`;
    userBalanceEl.textContent = `₹${currentUser.balance.toFixed(2)}`;
    
    // Customize dashboard based on role
    if (currentUser.role === 'CUSTOMER') {
        dashboardTitle.textContent = 'Customer Vault';
        dashboardSubtitle.textContent = 'Browse products and track your purchases.';
        productsContainer.style.display = 'block';
        customerActions.style.display = 'block';
        await loadProducts();
    } else if (currentUser.role === 'BUSINESS_OWNER') {
        dashboardTitle.textContent = 'Business Dashboard';
        dashboardSubtitle.textContent = 'Manage your sales and dispatches.';
        productsContainer.style.display = 'none';
        customerActions.style.display = 'none';
    } else if (currentUser.role === 'DELIVERY_AGENT') {
        dashboardTitle.textContent = 'Agent Operations';
        dashboardSubtitle.textContent = 'Update delivery statuses in real-time.';
        productsContainer.style.display = 'none';
        customerActions.style.display = 'none';
    }
    
    if(addFundsSection) addFundsSection.style.display = 'none';
    
    await loadTransactions();
}

// Data Loaders
async function loadProducts() {
    try {
        const res = await api.getProducts();
        renderProducts(res.data);
    } catch (err) {
        console.error(err);
    }
}

async function loadTransactions() {
    try {
        const res = await api.getTransactions();
        renderTransactions(res.data);
    } catch (err) {
        console.error(err);
    }
}

// Event Listeners
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    loginError.style.display = 'none';
    
    try {
        const res = await api.login(username, password);
        api.setToken(res.data.token);
        currentUser = res.data.user;
        showDashboard();
    } catch (err) {
        loginError.textContent = err.message;
        loginError.style.display = 'block';
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('signup-role').value;
    
    signupError.style.display = 'none';
    
    try {
        const res = await api.signup(username, password, role);
        api.setToken(res.data.token);
        currentUser = res.data.user;
        showDashboard();
    } catch (err) {
        signupError.textContent = err.message;
        signupError.style.display = 'block';
    }
});

showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

openAddFundsBtn.addEventListener('click', () => {
    dashboardSection.style.display = 'none';
    addFundsSection.style.display = 'block';
});

cancelAddFundsBtn.addEventListener('click', () => {
    addFundsSection.style.display = 'none';
    dashboardSection.style.display = 'block';
});

Array.from(paymentMethodRadios).forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'UPI') {
            upiDetails.style.display = 'block';
            cardDetails.style.display = 'none';
        } else {
            upiDetails.style.display = 'none';
            cardDetails.style.display = 'block';
        }
    });
});

addFundsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = document.getElementById('fund-amount').value;
    addFundsError.style.display = 'none';
    
    // Simulate processing time
    const btn = addFundsForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Processing...';
    btn.disabled = true;
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // mock delay
        await api.addFunds(amount);
        alert('Funds successfully added to your vault!');
        addFundsSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        addFundsForm.reset();
        await refreshState();
    } catch (err) {
        addFundsError.textContent = err.message || 'Failed to add funds';
        addFundsError.style.display = 'block';
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
});

logoutBtn.addEventListener('click', () => {
    api.clearToken();
    currentUser = null;
    showAuth();
});

// Renderers
function renderProducts(products) {
    productList.innerHTML = '';
    products.forEach(p => {
        const el = document.createElement('div');
        el.className = 'glass-card product-card';
        el.innerHTML = `
            <h3>${p.name}</h3>
            <p style="color: var(--text-muted); font-size: 0.875rem;">Sold by ${p.owner_username}</p>
            <p style="margin-top: 0.5rem">${p.description}</p>
            <div class="product-price">₹${p.price.toFixed(2)}</div>
            <button class="btn btn-primary w-100 mt-auto" onclick="buyProduct(${p.id})">Buy Safely via Escrow</button>
        `;
        productList.appendChild(el);
    });
}

function renderTransactions(transactions) {
    transactionList.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionList.innerHTML = '<p style="color: var(--text-muted);">No active transactions found.</p>';
        return;
    }

    // Sort by created_at desc
    transactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    transactions.forEach(t => {
        const el = document.createElement('div');
        el.className = 'glass-card transaction-card';
        
        let actionsHtml = '';
        
        // Actions logic based on role and status
        if (currentUser.role === 'BUSINESS_OWNER') {
            if (t.status === 'FUNDS_HELD_BY_MEDIATOR') {
                actionsHtml = `<button class="btn btn-warning btn-sm" onclick="dispatchProduct(${t.id})">Dispatch Product</button>`;
            } else if (t.status === 'RETURN_IN_PROGRESS') {
                actionsHtml = `<button class="btn btn-success btn-sm" onclick="confirmReturn(${t.id})">Verify Return & Refund Customer</button>`;
            }
        } else if (currentUser.role === 'DELIVERY_AGENT') {
            if (t.status === 'IN_TRANSIT' || t.status === 'FUNDS_HELD_BY_MEDIATOR') {
                actionsHtml = `
                    <button class="btn btn-success btn-sm" onclick="confirmDelivery(${t.id})">Accept Payment (Release to Owner)</button>
                    <button class="btn btn-danger btn-sm" onclick="cancelDelivery(${t.id})">Cancel Order (Refund Customer)</button>
                `;
            }
        } else if (currentUser.role === 'CUSTOMER') {
            if (t.status === 'IN_TRANSIT') {
                // Informational or they could tell agent
                actionsHtml = `<span style="color: var(--text-muted); font-size: 0.875rem;">Awaiting your acceptance with agent.</span>`;
            }
        }
        
        el.innerHTML = `
            <div class="transaction-info">
                <h4>${t.product_name} <span class="status-badge status-${t.status}">${t.status.replace(/_/g, ' ')}</span></h4>
                <p>Transaction ID: #${t.id} | Amount: ₹${t.amount.toFixed(2)}</p>
                <p>Customer: ${t.customer_username} | Agent: ${t.delivery_agent_username || 'Pending'}</p>
            </div>
            <div class="transaction-actions">
                ${actionsHtml}
            </div>
        `;
        transactionList.appendChild(el);
    });
}

// Action Handlers
async function refreshState() {
    const res = await api.getMe();
    currentUser = res.data;
    userBalanceEl.textContent = `₹${currentUser.balance.toFixed(2)}`;
    await loadTransactions();
}

async function buyProduct(id) {
    if(!confirm("Deposit funds into secure escrow vault?")) return;
    try {
        await api.buyProduct(id);
        alert("Success! Funds are now safely held by the Mediator Vault.");
        await refreshState();
    } catch (err) {
        alert(err.message);
    }
}

async function dispatchProduct(id) {
    try {
        await api.dispatchProduct(id);
        await refreshState();
    } catch (err) {
        alert(err.message);
    }
}

async function confirmDelivery(id) {
    if(!confirm("Confirm product delivered and accepted? Funds will be released to the seller.")) return;
    try {
        await api.confirmDelivery(id);
        await refreshState();
    } catch (err) {
        alert(err.message);
    }
}

async function cancelDelivery(id) {
    if(!confirm("Cancel the order? This will immediately refund the customer's dashboard.")) return;
    try {
        await api.cancelDelivery(id);
        await refreshState();
    } catch (err) {
        alert(err.message);
    }
}

async function confirmReturn(id) {
    if(!confirm("Confirm you received the returned product? An instant refund will be issued to the customer.")) return;
    try {
        await api.confirmReturn(id);
        await refreshState();
    } catch (err) {
        alert(err.message);
    }
}

// Boot
init();
