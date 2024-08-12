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

// Delete Product => /api/v1/products/:id
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

// Create/Update Product Reviews => /api/v1/reviews
export const createProductReview = catchAsyncErrors( async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req?.user?._id,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const isReviewed = product?.reviews?.find(
        (r) => r.user.toString() === req?.user?._id.toString()
    );

    if(isReviewed) {
        product.reviews.forEach((review) => {
            if(review?.user?.toString() === req?.user?._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    } else {
        product.reviews.push(review);
        product.numofReviews = product.reviews.length;
    }

    product.ratings = 
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false});  

    res.status(200).json({
        success: true,
    });
});

// Get Product Reviews => /api/v1/reviews
export const getProductReviews = catchAsyncErrors( async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if(! product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        reviews: product.reviews,
    });
});

// Delete Product Reviews => /api/v1/admin/reviews
export const deleteReview = catchAsyncErrors( async (req, res, next) => {
    let product = await Product.findById(req.query.productId);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product?.reviews?.filter(
        (review) => review._id.toString() !== req?.query?._id.toString()
    );

    const numofReviews = reviews.length;

    const ratings = 
      numofReviews === 0 
      ? 0 
      : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      numofReviews;

    product = await Product.findByIdAndUpdate(
        req.query.productId,
        { reviews, numofReviews, ratings},
        { new: true}
    ); 

    res.status(200).json({
        success: true,
        product,
    });
});