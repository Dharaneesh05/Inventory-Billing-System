const Product = require('../models/Product');
const Designer = require('../models/Designer');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('designer', 'name email status');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('designer', 'name email status');
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get products by type
// @route   GET /api/products/type/:type
// @access  Public
exports.getProductsByType = async (req, res) => {
    try {
        const products = await Product.find({ type: req.params.type }).populate('designer', 'name email status');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get products by designer
// @route   GET /api/products/designer/:designerId
// @access  Public
exports.getProductsByDesigner = async (req, res) => {
    try {
        const products = await Product.find({ designer: req.params.designerId }).populate('designer', 'name email status');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get unique product types
// @route   GET /api/products/types/all
// @access  Public
exports.getProductTypes = async (req, res) => {
    try {
        const types = await Product.distinct('type');
        res.json(types);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Public
exports.createProduct = async (req, res) => {
    try {
        const { name, type, description, quantity, cost, price, designer } = req.body;
        
        // Validate required fields
        if (!name || !type || !description || quantity === undefined || !cost || !price || !designer) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        
        // Check if designer exists
        const designerExists = await Designer.findById(designer);
        if (!designerExists) {
            return res.status(404).json({ message: 'Designer not found' });
        }
        
        const product = await Product.create({
            name,
            type,
            description,
            quantity,
            cost,
            price,
            designer
        });
        
        const populatedProduct = await Product.findById(product._id).populate('designer', 'name email status');
        
        res.status(201).json(populatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public
exports.updateProduct = async (req, res) => {
    try {
        const { name, type, description, quantity, cost, price, designer } = req.body;
        
        // Check if designer exists
        if (designer) {
            const designerExists = await Designer.findById(designer);
            if (!designerExists) {
                return res.status(404).json({ message: 'Designer not found' });
            }
        }
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, type, description, quantity, cost, price, designer },
            { new: true, runValidators: true }
        ).populate('designer', 'name email status');
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
