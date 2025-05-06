const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

module.exports.index= async(req, res) => {
    const user_id = req.cookies.tokenUser;
    const cart = await Cart.findOne({user_id: user_id});

    if(cart.product.length>0){
        for(const item of cart.product){
            const productInfo = await Product.findOne({_id: item.product_id});

            productInfo.priceNew=(productInfo.price*(100-productInfo.discountPercentage)/100).toFixed(0)
            item.totalPrice=item.quantity*productInfo.priceNew;


            item.productInfo=productInfo;
        }
    }
    cart.product = cart.product.filter(item => item.status === "active");
    cart.totalPrice=cart.product.reduce((total, item) => total + item.totalPrice, 0);
    res.render("client/pages/checkout/index",{
        pageTitle :"Thanh toán",
        cart:cart
    })
}
module.exports.order= async(req, res) => {
    const user_id = req.cookies.tokenUser;
    const cart = await Cart.findOne({user_id: user_id});
    cart.product = cart.product.filter(item => item.status === "active");
    const order= new Order({
        user_id: user_id,
        userInfo: {
            fullName: req.body.fullName,
            phone: req.body.phone,
            address: req.body.address
        },
        products: cart.product.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
        })),
        totalPrice: req.body.totalPrice
    });
    for(const item of order.products){
        const product = await Product.findOne({_id: item.product_id});
        item.productInfo=product;
    }
    await order.save();
    cart.product = cart.product.map(item => {
        item.status = "inactive";
        return item;    
    });
    await cart.save();
    console.log(order);
    res.render("client/pages/checkout/order",{
        pageTitle :"Đặt hàng thành công",
        order:order
    })
}
