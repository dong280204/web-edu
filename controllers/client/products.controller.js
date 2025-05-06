
const Product = require("../../models/product.model");
const ProductHelper = require("../../helpers/product");
const paginationHelper = require("../../helpers/pagination");
const ProductCategory = require("../../models/product_category.model");

// /products get
module.exports.index=async (req, res) => {
    // ket noi voi database
    const find={
        status:"active",
        deleted:false
    }
    if(req.query.product_category_id){
        find.product_category_id=req.query.product_category_id
    }
    //Goi ham paginationHelper
    const ProductCategories = await ProductCategory.find({})
    const count = await Product.countDocuments(find)
    const objectPagination = paginationHelper(req,count,6)
    //end Goi ham paginationHelper
    //in ra moi trang 
    // const products = await Product.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip)
    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)
    // them gia moi
    const Products=await ProductHelper.newPrice(products);

    // console.log(ProductCategories)
    res.render("client/pages/products/index",{
        pageTitle :"Danh sach san pham",
        products:Products,
        pagination: objectPagination,
        productCategories:ProductCategories,
        query: req.query.product_category_id
    })
}

//products/detail get
module.exports.detail=async (req, res) => {
    const find={
        deleted:false,
        slug:req.params.slug
    }
    const products=await Product.findOne(find);

    products.priceNew=(products.price*(100-products.discountPercentage)/100).toFixed(0)
    res.render("client/pages/products/detail",{
        pageTitle :"Danh sach san pham",
        product:products
    })
}