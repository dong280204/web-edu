const ProductCategory = require("../../models/product_category.model");

const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper= require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
// /admin/procuct get
module.exports.index=async (req, res) => {
    //Tạo biến find để truy vấn dữ liệu
    let find={
        deleted:false
    }
    // truy van theo status va them status vao find
    if(req.query.status){
        find.status=req.query.status
    }
    //sort
    let sort = {}
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }else{
        sort.position = 'desc'
    }

    //Gọi hàm filterStatusHelper
    const filterStatus = filterStatusHelper(req)
    //End Gọi hàm filterStatusHelper

    //Gọi hàm searchHelper
    const search = searchHelper(req)
    if(search.regex){
        find.title=search.regex
    }
    //End Gọi hàm searchHelper

    //Goi ham paginationHelper
    const count = await Product.countDocuments(find)
    const objectPagination = paginationHelper(req,count,4)
    //end Goi ham paginationHelper

    //in ra moi trang 
    const products = await Product.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip)
    // console.log(req.query.status)
    // console.log(products)
    res.render('admin/pages/product/index',{
        pagaTitle: "Trang san pham",
        products: products,
        filterStatus:filterStatus ,
        keyword:search.keyword,
        pagination: objectPagination
    })
}

// /admin/products/change-status/:status/:id get
module.exports.changeStatus=async (req, res) => {
    const statu=req.params.status;
    const id=req.params.id;
    await Product.updateOne({_id:id},{status:statu});
    req.flash('success', 'Thay đổi trạng thái thành công')
    res.redirect('back')
}

// /admin/products/delete/:id get
module.exports.deleteItem=async (req, res) => {
    const id=req.params.id;
    await Product.updateOne({_id:id},{
        deleted:true, 
        deletedAt:new Date()
    });
    res.redirect('back')
}

// /admin/products/create get
module.exports.create= async(req, res) => {
    const find={
            deleted:false
        }
        function createTree(arr, parentId = "") {
            const tree = [];
            arr.forEach((item) => {
                if (item.parent_id === parentId) {
                    const newItem = item;
                    const children = createTree(arr, item.id);
                    if (children.length > 0) {
                        newItem.children = children;
                    }
                    tree.push(newItem);
                }
            });
            return tree;
        }
        const productCategories = await ProductCategory.find(find)
        const tree = createTree(productCategories)
    res.render('admin/pages/product/create',{
        pagaTitle: "Trang tao san pham"
        ,productCategories:tree
    })
}

// /admin/products/create post
module.exports.createPost= async (req, res) => {
    //ep kieu cho cac truong
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    const product =new Product(req.body);
    await product.save();
    req.flash('success', 'Tạo sản phẩm thành công')
    res.redirect('/admin/products/create')
}

// /admin/products/edit/:id get
module.exports.edit=async (req, res) => {
    const find={
        deleted:false,
        _id:req.params.id
    }
    const product=await Product.findOne(find);
    res.render('admin/pages/product/edit',{
        pagaTitle: "Chinh sua san pham",
        product:product
    })
}

// /admin/products/edit/:id patch
module.exports.editPatch=async (req, res) => {
    //ep kieu cho cac truong
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    try{
        await Product.updateOne({_id:req.params.id},req.body);
    }catch(err){
    }
    req.flash('success', 'Chỉnh sửa sản phẩm thành công')
    res.redirect('back')
}

// /admin/products/detail/:id get
module.exports.detail=async (req, res) => {
    const find={
        deleted:false,
        _id:req.params.id
    }
    const product=await Product.findOne(find);
    
    res.render('admin/pages/product/detail',{
        pagaTitle:product.title,
        product:product
    })
}
