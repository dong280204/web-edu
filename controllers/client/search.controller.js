
const Product = require("../../models/product.model");
const ProductHelper = require("../../helpers/product");
const paginationHelper = require("../../helpers/pagination");

module.exports.index= async(req, res) => {
    const keyword = req.query.keyword;
    let Products = [];
    if(keyword){
        const keywordRegex = new RegExp(keyword, "i");
        // ket noi voi database
        const find={
            status: "active",
            deleted: false,
            title:keywordRegex
        }
        //Goi ham paginationHelper
        const count = await Product.countDocuments(find)
        const objectPagination = paginationHelper(req,count,6)
        //end Goi ham paginationHelper
        const products = await Product.find(find)
        Products=ProductHelper.newPrice(products);
        console.log(objectPagination);
    }
    res.render("client/pages/search/index",{
        pageTitle :"Kết quả tìm kiếm",
        keyword: keyword,
        products:Products,
    })
}