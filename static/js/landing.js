/**
 * RestroHub Production Interactive Engine (Alpine.js + Theme Toggle)
 */

// Initialize theme immediately before render to avoid flash
(function() {
    const savedTheme = localStorage.getItem('restrohub_theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('restrohub_theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
});

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark-mode');
    if (isDark) {
        document.documentElement.classList.remove('dark-mode');
        document.body.classList.remove('dark-mode');
        localStorage.setItem('restrohub_theme', 'light');
    } else {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
        localStorage.setItem('restrohub_theme', 'dark');
    }
}

document.addEventListener('alpine:init', () => {

    // 1. Live Interactive QR Menu Sandbox Component
    Alpine.data('qrSandbox', () => ({
        activeCategory: 'All',
        cart: [],
        tableNumber: 'T4',

        get cartTotal() {
            return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        },

        get cartItemCount() {
            return this.cart.reduce((sum, item) => sum + item.qty, 0);
        },

        addToCart(itemName, price, variantName) {
            const existing = this.cart.find(i => i.name === itemName && i.variant === variantName);
            if (existing) {
                existing.qty++;
            } else {
                this.cart.push({
                    name: itemName,
                    variant: variantName,
                    price: price,
                    qty: 1
                });
            }
        },

        removeFromCart(index) {
            if (this.cart[index].qty > 1) {
                this.cart[index].qty--;
            } else {
                this.cart.splice(index, 1);
            }
        },

        clearCart() {
            this.cart = [];
        }
    }));

    // 2. Multi-Outlet Interactive Sandbox Component
    Alpine.data('multiOutletDemo', () => ({
        selectedOutlet: 'hazratganj',
        outlets: {
            'hazratganj': {
                name: 'Hazratganj Outlet (High Street)',
                paneerPrice: 310,
                kajuKatliPrice: 1150,
                status: 'Master Menu Active'
            },
            'gomti': {
                name: 'Gomti Nagar Outlet (Mall)',
                paneerPrice: 350,
                kajuKatliPrice: 1200,
                status: 'Price Override Active (+12%)'
            }
        }
    }));

    // 3. Pricing Tier Billing Toggle (Monthly vs Annual)
    Alpine.data('pricingToggle', () => ({
        billingCycle: 'monthly',

        get growthPrice() {
            return this.billingCycle === 'annual' ? 559 : 699;
        },

        get proPrice() {
            return this.billingCycle === 'annual' ? 1199 : 1499;
        }
    }));

    // 4. Quick Owner Signup Form Component
    Alpine.data('signupForm', () => ({
        brandName: '',
        ownerName: '',
        mobile: '',
        city: 'Lucknow',
        isSubmitting: false,
        responseMsg: '',
        isSuccess: false,

        async submitSignup() {
            if (!this.brandName || !this.ownerName || !this.mobile) {
                this.responseMsg = 'Please fill out all required fields.';
                this.isSuccess = false;
                return;
            }

            this.isSubmitting = true;
            this.responseMsg = '';

            try {
                const response = await fetch('/quick-signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCsrfToken()
                    },
                    body: JSON.stringify({
                        brand_name: this.brandName,
                        owner_name: this.ownerName,
                        mobile: this.mobile,
                        city: this.city
                    })
                });

                const data = await response.json();
                this.isSubmitting = false;

                if (data.success) {
                    this.isSuccess = true;
                    this.responseMsg = data.message;
                    this.brandName = '';
                    this.ownerName = '';
                    this.mobile = '';
                } else {
                    this.isSuccess = false;
                    this.responseMsg = data.message || 'Signup failed. Please try again.';
                }
            } catch (err) {
                this.isSubmitting = false;
                this.isSuccess = false;
                this.responseMsg = 'Network error. Please try again.';
            }
        }
    }));
});

// CSRF token helper
function getCsrfToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, 10) === ('csrftoken=')) {
                cookieValue = decodeURIComponent(cookie.substring(10));
                break;
            }
        }
    }
    return cookieValue || '';
}
