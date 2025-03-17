const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");
const User = require("../../models/user.model")

// /order get
module.exports.index= async(req, res) => {
    const cart = await Cart.find({status: 'active'});
    for(const item1 of cart){
        if(item1.product.length>0){
            const userInfor = await User.findOne({tokenUser: item1.user_id});
            item1.userInfor=userInfor
            for(const item2 of item1.product){
                const productInfo = await Product.findOne({_id: item2.product_id});
                productInfo.priceNew=(productInfo.price*(100-productInfo.discountPercentage)/100).toFixed(0)
                item2.totalPrice=item2.quantity*productInfo.priceNew;
                item2.productInfo=productInfo
            }
        }
    }
    // for(const item1 of cart){
    //     console.log(item1.userInfor.fullName)
    //     for(const item2 of item1.product){
    //         console.log(item2.productInfo.title,item2.quantity,item2.totalPrice)
    //     }
    // }
    res.render('admin/pages/order/index',{
        pagaTitle: "Trang quản lý giỏ hàng",
        cart: cart
    })
}