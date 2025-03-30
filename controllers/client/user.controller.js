const User = require("../../models/user.model")
const md5= require("md5")
const generate=require('../../helpers/ganerate')
// /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký"
    })
}
// /user/register POST
module.exports.registerPost = async (req, res) => {
    const existUser = await User.findOne({
        email :req.body.email,
        deleted:false
    })
    if(existUser){
        req.flash("error", "Email đã tồn tại")
        res.redirect("back")
        return
    }
    req.body.password = md5(req.body.password)
    req.body.tokenUser = generate.generateRandomString(20)
    const user=new User(req.body)
    await user.save()
    res.cookie("tokenUser",user.tokenUser)
    res.redirect("/")
}

// /user/login GET
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng ký"
    })
}
// /user/login POST
module.exports.loginPost = async (req, res) => {
    const email=req.body.email
    const password=req.body.password
    const user=await User.findOne({
        email:email,
        deleted:false
    })
    if(!user){
        req.flash("error", "Email không tồn tại")
        res.redirect("back")
        return
    }
    if(md5(password)!==user.password){
        req.flash("error", "Mật khẩu không đúng")
        res.redirect("back")
        return
    }
    if(user.status=="inactive"){
        req.flash("error", "Tài khoản chưa kích hoạt")
        res.redirect("back")
        return
    }
    res.cookie("tokenUser",user.tokenUser)
    res.redirect("/")
}

// /user/logout GET
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")
    res.redirect("/")
}

// /user/info GET
module.exports.info = async (req, res) => {
    res.render("client/pages/user/info", {
        pageTitle: "Thông tin tài khoản"
    })
}
// /user/edit GET
module.exports.edit = async (req, res) => {
    res.render("client/pages/user/edit", {
        pageTitle: "Chỉnh sửa thông tin"
    })
}