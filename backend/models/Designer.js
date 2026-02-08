const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a designer name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true,
        lowercase: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Virtual for products
designerSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'designer'
});

// Method to get detail string
designerSchema.methods.detail = function() {
    return `All products by ${this.name}. Order more by email ${this.email}.`;
};

module.exports = mongoose.model('Designer', designerSchema);
