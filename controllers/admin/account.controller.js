const md5=require('md5')
const Account = require('../../models/account.model');   
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper= require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
// /admin/accounts get
module.exports.index=async(req, res) => {
    let find ={
        deleted:false
    }
    //Goi ham paginationHelper
    const count = await Account.countDocuments(find)
    const objectPagination = paginationHelper(req,count)
    //end Goi ham paginationHelper

    //Gọi hàm searchHelper
        const search = searchHelper(req)
        if(search.regex){
            find.fullName=search.regex
    }
    //End Gọi hàm searchHelper
    const records = await Account.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)

    res.render('admin/pages/accounts/index',{
        pagaTitle: "Danh sach tài khoản admin",
        keyword:search.keyword,
        records: records,
        pagination: objectPagination
    })
}

// admin/accounts/create get
module.exports.create=async(req, res) => {
    res.render('admin/pages/accounts/create',{
        pagaTitle: "Tạo mới tài khoản",
    })
}

// admin/accounts/create post
module.exports.postCreate= async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted:false
    })
    if(emailExist){
        req.flash('error', 'Email đã tồn tại')
        res.redirect('back')
    }else{
        //dung mb5 de ma hoa password
        req.body.password = md5(req.body.password)

        const account = new Account(req.body)
        await account.save()
        res.redirect('/admin/accounts')
    }
}

// admin/accounts/edit/:id get
module.exports.edit= async (req, res) => {
    const find={
        deleted:false,
        _id:req.params.id
    }
    const records=await Account.findOne(find)
    // console.log(product)
    res.render('admin/pages/accounts/edit',{
        pagaTitle: "Chinh sua san pham ",
        records:records
    })
}

// admin/accounts/edit/:id patch
module.exports.editPatch= async (req, res) => {
    if(req.body.password){
        req.body.password = md5(req.body.password)
    }else{
        delete req.body.password
    }
    try{
        await Account.updateOne({_id:req.params.id},req.body);
        flash('success', 'Cập nhật thành công')
    }catch(err){
    }
    res.redirect('/admin/accounts')
}