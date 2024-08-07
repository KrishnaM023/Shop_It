import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Product from '../models/product.js';
import APIFilters from '../utils/apiFilter.js';
import ErrorHandler from '../utils/errorhandler.js';

// Get all Product => /api/v1/products
export const getProducts = catchAsyncErrors( async (req, res) => {

    const resPerPage = 4;
    const apiFilters = new APIFilters(Product, req.query).search().filters();

    let products = await apiFilters.query;
    let filterProductCount = products.length;

    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();

    res.status(200).json({
        resPerPage,
        filterProductCount,
        products,
    });
});

// Create new Product => /api/v1/admin/products
export const newProduct = catchAsyncErrors( async (req, res) => {
    req.body.user = req.user._id;
    
    const product = await Product.create(req.body);

    res.status(200).json({
        product,
    })
});

// Get Single Product => /api/v1/products
export const getProductDetails = catchAsyncErrors( async (req, res, next) => {
    const product = await Product.findById(req?.params?.id);

    if(! product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        product,
    });
});

// Update Product Product => /api/v1/products
export const updateProduct = catchAsyncErrors( async (req, res) => {
    let product = await Product.findById(req?.params?.id);

    if(! product) {
        return res.status(404).json({
            error: "Product not found",
        });
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
        new: true,
    });

    res.status(200).json({
        product,
    });
});

// Delete Product Product => /api/v1/products
export const deleteProduct = catchAsyncErrors( async (req, res) => {
    const product = await Product.findById(req?.params?.id);

    if(! product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await Product.deleteOne()

    res.status(200).json({
        message: "Product Deleted",
    });
});