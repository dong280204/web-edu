const express=require("express")
const router=express.Router()
//router cho product
const controller=require("../../controllers/admin/product-category.controller")

router.get('/', controller.index)
router.get('/create', controller.create)
router.post('/create', controller.createPost)
router.get('/delete/:id', controller.deleteItem)
router.get('/detail/:id', controller.detail)
router.get('/edit/:id', controller.edit)
router.patch('/edit/:id', controller.editPatch)
module.exports=router