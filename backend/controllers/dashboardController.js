const Product = require('../models/Product');

// @desc    Get dashboard metrics
// @route   GET /api/dashboard
// @access  Public
exports.getDashboardMetrics = async (req, res) => {
    try {
        // Get all products with populated designer data
        const products = await Product.find().populate('designer', 'name email status');
        
        // Calculate dashboard metrics
        const totalItems = products.length;
        const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
        
        let lowStockCount = 0;
        let outOfStockCount = 0;
        let suggestedReorderValue = 0;
        
        products.forEach(product => {
            if (product.outOfStock()) {
                outOfStockCount++;
                suggestedReorderValue += product.cost * 10;
            } else if (product.lowStock()) {
                lowStockCount++;
                suggestedReorderValue += product.cost * 10;
            }
        });
        
        // Get unique product types
        const types = await Product.distinct('type');
        const itemGroups = types.length;
        
        // Mock data for future implementation
        const toBeShipped = 6;
        const toBeDelivered = 10;
        const toBeInvoiced = 474;
        const toBeReceived = 168;
        const unconfirmedItems = 121;
        
        // Determine stock risk level
        let stockRiskLevel = 'low';
        if (lowStockCount > 5 || outOfStockCount > 2) {
            stockRiskLevel = 'high';
        } else if (lowStockCount > 2 || outOfStockCount > 0) {
            stockRiskLevel = 'medium';
        }
        
        // Get top products by quantity
        const topProducts = products
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 4);
        
        res.json({
            totalItems,
            totalStock,
            lowStockCount,
            outOfStockCount,
            itemGroups,
            toBeShipped,
            toBeDelivered,
            toBeInvoiced,
            toBeReceived,
            unconfirmedItems,
            stockRiskLevel,
            suggestedReorder: suggestedReorderValue.toFixed(2),
            topProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
