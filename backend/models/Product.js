const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Please add a product type'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Please add quantity'],
        min: 0,
        default: 0
    },
    cost: {
        type: Number,
        required: [true, 'Please add cost'],
        min: 0
    },
    price: {
        type: Number,
        required: [true, 'Please add price'],
        min: 0
    },
    designer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Designer',
        required: [true, 'Please add a designer']
    }
}, {
    timestamps: true
});

// Instance method to check low stock
productSchema.methods.lowStock = function() {
    const LOW_QUANTITY = 5;
    return this.quantity <= LOW_QUANTITY && this.quantity > 0;
};

// Instance method to check out of stock
productSchema.methods.outOfStock = function() {
    return this.quantity <= 0;
};

// Instance method to calculate markup
productSchema.methods.calculateMarkup = function() {
    return this.price - this.cost;
};

module.exports = mongoose.model('Product', productSchema);
