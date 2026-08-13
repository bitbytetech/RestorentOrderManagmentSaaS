/**
 * Landing Page Interactive Script (Alpine.js Components)
 */

document.addEventListener('alpine:init', () => {

    // 1. Live Interactive QR Menu Sandbox Component
    Alpine.data('qrSandbox', () => ({
        activeCategory: 'All',
        cart: [],
        tableNumber: 'T4',
        selectedVariants: {},

        init() {
            // Default selected variants for items
            this.selectedVariants['item-1'] = 1; // Half
            this.selectedVariants['item-2'] = 1; // Full
            this.selectedVariants['item-3'] = 0; // Half
            this.selectedVariants['item-4'] = 1; // 250g
        },

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

    // 2. Interactive Commission & ROI Savings Calculator
    Alpine.data('savingsCalculator', () => ({
        dailyOrders: 100,
        avgOrderValue: 350,

        get monthlyRevenue() {
            return this.dailyOrders * this.avgOrderValue * 30;
        },

        get annualRevenue() {
            return this.monthlyRevenue * 12;
        },

        get aggregatorCommission() {
            // Aggregators like Swiggy/Zomato charge ~25%
            return Math.round(this.monthlyRevenue * 0.25);
        },

        get annualCommissionSaved() {
            return Math.round(this.annualRevenue * 0.25);
        },

        get isFreeEligible() {
            return this.dailyOrders <= 100;
        }
    }));

    // 3. Quick Owner Signup Form Component
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
                    // Reset form
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

// CSRF helper
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
