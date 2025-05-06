const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const User = require("../../models/user.model")
const searchHelper= require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
// /order get
module.exports.index= async(req, res) => {
    let find ={
    }
    //Goi ham paginationHelper
    const count = await User.countDocuments(find)
    const objectPagination = paginationHelper(req,count,4)
    //end Goi ham paginationHelper
    //Gọi hàm searchHelper
    const search = searchHelper(req)
    if(search.regex){
        find["userInfo.fullName"] = search.regex;
    }
    //End Gọi hàm searchHelper
    const order = await Order.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)
    res.render('admin/pages/order/index',{
        pagaTitle: "Trang quản lý giỏ hàng",
        keyword:search.keyword,
        order: order,
        pagination: objectPagination
    })
}
module.exports.detail= async(req, res) => {
    const id=req.params.id;
    const order = await Order.findOne({_id:id})
    for(const item of order.products){
        const product = await Product.findOne({_id: item.product_id});
        item.productInfo=product;
    }
    res.render('admin/pages/order/detail',{
        pagaTitle: "Chi tiết đơn hàng",
        order: order
    })
}
module.exports.delete= async(req, res) => {
    const id=req.params.id;
    await Order.deleteOne({_id:id})
    res.redirect('back')
}
module.exports.edit= async(req, res) => {
    const id=req.params.id;
    const order = await Order.findOne({_id:id})
    
    res.render('admin/pages/order/edit',{
        pagaTitle: "Sửa đơn hàng",
        order: order
    })
}
module.exports.editPatch = async(req, res) => {
    const id = req.params.id;
    
    await Order.updateOne(
        { _id: id },
        {
            $set: {
                status: req.body.status,
                'userInfo.fullName': req.body.fullName,
                'userInfo.phone': req.body.phone,
                'userInfo.address': req.body.address
            }
        }
    );
    
    // req.flash('success', 'Cập nhật đơn hàng thành công!');
    res.redirect(`/admin/order`);
}