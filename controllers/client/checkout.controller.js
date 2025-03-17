const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

// cart get
module.exports.index= async(req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({_id: cartId});

    if(cart.product.length>0){
        for(const item of cart.product){
            const productInfo = await Product.findOne({_id: item.product_id});

            productInfo.priceNew=(productInfo.price*(100-productInfo.discountPercentage)/100).toFixed(0)
            item.totalPrice=item.quantity*productInfo.priceNew;


            item.productInfo=productInfo;
        }
    }
    cart.totalPrice=cart.product.reduce((total, item) => total + item.totalPrice, 0);
    res.render("client/pages/checkout/index",{
        pageTitle :"Thanh toán",
        cart:cart
    })
}
