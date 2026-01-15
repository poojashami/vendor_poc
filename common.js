// Common JavaScript - Shared across all pages
// This file contains shared utilities, navigation logic, and global data structures

$(document).ready(function () {
    // ========== SIDEBAR NAVIGATION ==========

    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Set active state on sidebar based on current page
    $('.sidebar .nav-link').each(function () {
        const linkPage = $(this).attr('href');
        if (linkPage === currentPage) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });

    // ========== SHARED DATA STRUCTURES ==========
    // Note: In PHP version, these will be replaced with database queries

    // Products catalog
    window.productsData = [
        {
            id: 1,
            name: "Floral Summer Maxidress",
            vendor: "Vendor 1 (Women Wear)",
            price: "₹29.99",
            img: "assets/product1.png",
        },
        {
            id: 2,
            name: "Silk Embroidered Saree",
            vendor: "Vendor 1 (Women Wear)",
            price: "₹105.00",
            img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=400",
        },
        {
            id: 3,
            name: "Formal Silk Shirt",
            vendor: "Vendor 2 (Men Wear)",
            price: "₹45.99",
            img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=400",
        },
        {
            id: 4,
            name: "Classic Denim Jacket",
            vendor: "Vendor 2 (Men Wear)",
            price: "₹59.00",
            img: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=400",
        },
        {
            id: 5,
            name: "Leather Handbag",
            vendor: "Vendor 3 (Accessories)",
            price: "₹120.00",
            img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=400",
        },
        {
            id: 6,
            name: "High-Waist Trousers",
            vendor: "Vendor 1 (Women Wear)",
            price: "₹35.50",
            img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=400",
        },
        {
            id: 7,
            name: "Designer Kurti Set",
            vendor: "Vendor 1 (Women Wear)",
            price: "₹42.00",
            img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400",
        },
        {
            id: 8,
            name: "Casual Polo",
            vendor: "Vendor 2 (Men Wear)",
            price: "₹25.00",
            img: "https://images.unsplash.com/photo-1574245428935-3dd8965f375c?auto=format&fit=crop&q=80&w=400",
        },
        {
            id: 9,
            name: "Premium Sunglasses",
            vendor: "Vendor 3 (Accessories)",
            price: "₹85.00",
            img: "https://images.unsplash.com/photo-1539109132382-381bb3f1c261?auto=format&fit=crop&q=80&w=400",
        },
        {
            id: 10,
            name: "Cotton Scarf",
            vendor: "Vendor 3 (Accessories)",
            img: "https://images.unsplash.com/photo-1534452283893-eb0a010d7a0c?auto=format&fit=crop&q=80&w=400",
        },
    ];

    // ========== SHARED UTILITY FUNCTIONS ==========

    // Format currency
    window.formatCurrency = function (amount, currency = '€') {
        return `${currency}${parseFloat(amount).toFixed(2)}`;
    };

    // Format date
    window.formatDate = function (date) {
        if (!date) return new Date().toLocaleDateString();
        return new Date(date).toLocaleDateString();
    };

    // Generate unique ID
    window.generateId = function (prefix = 'ID') {
        return `${prefix}-${Date.now().toString().slice(-6)}`;
    };

    // Show notification (using SweetAlert2 if available, otherwise alert)
    window.showNotification = function (title, message, type = 'success') {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: type,
                title: title,
                text: message,
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            alert(`${title}\n${message}`);
        }
    };

    // ========== LOCAL STORAGE HELPERS ==========
    // For temporary data persistence between pages (will be replaced with PHP sessions/DB)

    window.saveToStorage = function (key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    };

    window.getFromStorage = function (key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    };

    window.removeFromStorage = function (key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    };

    console.log('Common.js loaded successfully');
});
