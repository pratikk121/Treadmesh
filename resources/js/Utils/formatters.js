// resources/js/Utils/formatters.js

/**
 * Format an amount in Indian Rupees (INR) using Indian numbering format (Lakhs / Crores)
 * Example: 150000 -> "₹1,50,000"
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }).format(amount || 0);
};

/**
 * Short human-readable Indian commercial scale formatting
 * Example: 25000000 -> "₹2.5 Cr", 450000 -> "₹4.5 L"
 */
export const formatIndianScale = (amount) => {
    const num = Number(amount) || 0;
    if (num >= 10000000) {
        return `₹${(num / 10000000).toFixed(1)} Cr`;
    }
    if (num >= 100000) {
        return `₹${(num / 100000).toFixed(1)} L`;
    }
    return formatCurrency(num);
};

/**
 * Format Indian standard dates (DD Mon YYYY)
 * Example: "2026-09-10" -> "10 Sep 2026"
 */
export const formatIndianDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date);
};

/**
 * Enterprise B2B Order Status Label Normalizer
 */
export const formatOrderStatus = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
        case 'pending':
        case 'pending_confirmation':
            return 'Awaiting Confirmation';
        case 'confirmed':
        case 'sure':
            return 'PO Confirmed';
        case 'processing':
            return 'In Production';
        case 'shipped':
            return 'Dispatched (E-Way Bill)';
        case 'delivered':
            return 'Delivered & Accepted';
        case 'cancelled':
        case 'cancel':
            return 'Cancelled';
        case 'completed':
            return 'Settled & Completed';
        default:
            return status || 'Pending';
    }
};

/**
 * Enterprise B2B Payment Status Label Normalizer
 */
export const formatPaymentStatus = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
        case 'paid':
            return 'Paid (Nodal Escrow)';
        case 'unpaid':
        case 'unrefined':
            return 'Payment Pending';
        case 'pending':
            return 'Awaiting Escrow Settlement';
        case 'refunded':
            return 'Refunded to Source';
        default:
            return status || 'Pending';
    }
};

/**
 * Enterprise B2B RFQ Status Label Normalizer
 */
export const formatRfqStatus = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
        case 'open':
            return 'Active Tender';
        case 'quoted':
            return 'Bids Received';
        case 'closed':
        case 'off':
            return 'Closed Tender';
        default:
            return status || 'Open';
    }
};

