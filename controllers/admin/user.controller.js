const md5=require('md5')
const Account = require('../../models/account.model');   
const User = require("../../models/user.model")
const searchHelper= require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
// /admin/user get
module.exports.index=async(req, res) => {
    let find ={
        deleted:false
    }
    //Goi ham paginationHelper
    const count = await User.countDocuments(find)
    const objectPagination = paginationHelper(req,count,4)
    //end Goi ham paginationHelper

    //Gọi hàm searchHelper
        const search = searchHelper(req)
        if(search.regex){
            find.fullName=search.regex
    }
    //End Gọi hàm searchHelper
    const records = await User.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)

    res.render('admin/pages/user/index',{
        pagaTitle: "Danh sach tài khoản người dùng",
        keyword:search.keyword,
        records: records,
        pagination: objectPagination
    })
}
// admin/users/edit/:id get
module.exports.edit= async (req, res) => {
    const find={
        deleted:false,
        _id:req.params.id
    }
    const records=await User.findOne(find)
    // console.log(product)
    res.render('admin/pages/user/edit',{
        pagaTitle: "Chinh sua san pham ",
        records:records
    })
}
// admin/users/edit/:id patch
module.exports.editPatch= async (req, res) => {
    if(req.body.password){
        req.body.password = md5(req.body.password)
    }else{
        delete req.body.password
    }
    try{
        await User.updateOne({_id:req.params.id},req.body);
        flash('success', 'Cập nhật thành công')
    }catch(err){
    }
    res.redirect('/admin/user')
}
// /admin/user/delete/:id get
module.exports.deleteUser=async (req, res) => {
    const id=req.params.id;
    await User.updateOne({_id:id},{
        deleted:true, 
        deletedAt:new Date()
    });
    res.redirect('back')
}

// /admin/user/detail get
module.exports.detail=async (req, res) => {
    const user=await User.findOne({_id:req.params.id})
    res.render('admin/pages/user/detail',{
        pagaTitle: "Chi tiết người dùng",
        user:user
    })
}