const Product = require("../../models/product.model");
const ProductHelper = require("../../helpers/product");


module.exports.index= async(req, res) => {
    // Lay cac san pham noi bat
    const products = await Product.find({
        deleted: false,
        featured: '1',
        status: 'active'
    }).limit(6);
    //lay cac san pham moi nhat
    const newProducts = await Product.find({
        deleted:false,
        status:'active'
    }).limit(6)

    const Products=ProductHelper.newPrice(products);
    const NewProducts=ProductHelper.newPrice(newProducts);
    res.render("client/pages/home/index",{
        pageTitle :"Trang chu",
        products: Products,
        newProducts: NewProducts
    })
}