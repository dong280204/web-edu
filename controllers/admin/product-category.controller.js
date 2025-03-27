
const ProductCategory = require("../../models/product_category.model");
// /admin/procuct-category get
module.exports.index=async (req, res) => {
    const find={
        deleted:false
    }
    var count=0
    function createTree(arr, parentId = "") {
        const tree = [];
        arr.forEach((item) => {
            if (item.parent_id === parentId) {
                count++
                const newItem = item;
                newItem.index=count 
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

    res.render('admin/pages/product-category/index',{
        pagaTitle: "Trang Danh mục sản phẩm"
        ,productCategories:tree
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
                newItem.index=count
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

