
const ProductCategory = require("../../models/product_category.model");
const searchHelper= require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
// /admin/procuct-category get
module.exports.index=async (req, res) => {
    const find={
        deleted:false
    }
    const count = await ProductCategory.countDocuments(find)
    const objectPagination = paginationHelper(req,count,4)
    const search = searchHelper(req)
    if(search.regex){
        find.title=search.regex
    }
    const productCategories = await ProductCategory.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)
    res.render('admin/pages/product-category/index',{
        pagaTitle: "Trang Danh mục sản phẩm"
        ,productCategories:productCategories,
        keyword:search.keyword,
        pagination: objectPagination
    })
}
// /admin/procuct-category/create get
module.exports.create=async (req, res) => {
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
    res.render('admin/pages/product-category/create',{
        pagaTitle: "Trang tạo danh mục sản phẩm",
        productCategories:tree
    })
}

// /admin/procuct-category/create post
module.exports.createPost=async (req, res) => {
    if(req.body.position==''){
        const count=await ProductCategory.countDocuments()
        req.body.position=count+1
    }else{
        req.body.position=parseInt(req.body.position)
    }
    const productCategory=new ProductCategory(req.body)
    await productCategory.save()
    res.redirect('/admin/products-category')
}
// /admin/procuct-category/delete/:id post
module.exports.deleteItem=async (req, res) => {
    const id=req.params.id
    await ProductCategory.updateOne({_id:id},{
        deleted:true, 
        deletedAt:new Date()
    });
    res.redirect('back')
}
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const productCategory = await ProductCategory.findOne({_id: id});
        
        if (!productCategory) {
            req.flash("error", "Không tìm thấy danh mục sản phẩm");
            return res.redirect("/admin/products-category");
        }

        // Khởi tạo parentCategory là null
        let parentCategory = null;
        
        // Chỉ tìm parentCategory nếu parent_id tồn tại và hợp lệ
        if (productCategory.parent_id && productCategory.parent_id !== "") {
            parentCategory = await ProductCategory.findOne({_id: productCategory.parent_id});
        }
        
        res.render('admin/pages/product-category/detail', {
            pagaTitle: "Trang chi tiết danh mục sản phẩm",
            productCategory: productCategory,
            parentCategory: parentCategory  // Truyền parentCategory vào view
        });
    } catch (error) {
        console.error("Lỗi khi xem chi tiết danh mục:", error);
        req.flash("error", "Có lỗi xảy ra khi xử lý yêu cầu");
        res.redirect("/admin/products-category");
    }
}
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const productCategory = await ProductCategory.findOne({_id: id});
    res.render('admin/pages/product-category/edit', {
        pagaTitle: "Trang sửa danh mục sản phẩm",
        productCategory: productCategory
    });
}
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    const productCategory = await ProductCategory.updateOne({_id: id}, req.body);
    res.redirect('/admin/products-category')
}

