const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");

// cart/add/:id post
module.exports.add = async (req, res) => {
    // const cartId = req.cookies.cartId;
    const productId = req.params.id;
    const quantity = parseInt(req.body.quantity);
    const user_id = req.cookies.tokenUser;
    const cart = await Cart.findOne({user_id: user_id})

    const objectCart={
        product_id:productId,
        quantity:quantity
    }
    
    const existProduct = cart.product.find((product) => product.product_id == productId);
    if (existProduct) {
        const newQuantity = existProduct.quantity + quantity;
        await Cart.updateOne(
            {
                user_id: user_id,
                "product.product_id": productId
            },
            {
                // them so luong moi vao so luong cu
                "product.$.quantity": newQuantity
            })
    } else {
        await Cart.updateOne(
            {
                user_id: user_id
            },
            {
                $push: {
                    product: objectCart
                }
            }
        )
    }
    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");
    res.redirect(`back`);
}

// cart get
module.exports.index= async(req, res) => {  
    // const cartId = req.cookies.cartId;
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

    res.render("client/pages/cart/index",{
        pageTitle :"GIỏ hàng",
        cart:cart,
    })
}

// cart/delete/:id get
module.exports.delete = async (req, res) => {
    // const cartId = req.cookies.cartId;
    const user_id = req.cookies.tokenUser;
    const productId = req.params.id;
    await Cart.updateOne(
        {
            user_id: user_id
        },
        {
            $pull: {
                product: {
                    product_id: productId
                }
            }
        }
    )
    req.flash("success", "Xóa sản phẩm khỏi giỏ hàng thành công");
    res.redirect("back");
}

// cart/update/:id/:quantity get
module.exports.update = async (req, res) => {
    // const cartId = req.cookies.cartId;
    const user_id = req.cookies.tokenUser;
    const productId = req.params.id;
    const quantity = parseInt(req.params.quantity);
    await Cart.updateOne(
        {
            user_id: user_id,
            "product.product_id": productId
        },
        {
            "product.$.quantity": quantity
        }
    )
    req.flash("success", "Cập nhật giỏ hàng thành công");
    res.redirect("back");
}

// cart/history get
module.exports.history = async (req, res) => {
    // const cartId = req.cookies.cartId;
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
    cart.product = cart.product.filter(item => item.status === "inactive");
    cart.totalPrice=cart.product.reduce((total, item) => total + item.totalPrice, 0);

    res.render("client/pages/cart/history",{
        pageTitle :"Lich sử giỏ hàng",
        cart:cart,
    })
}
