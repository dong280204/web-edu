const express=require("express")
const router=express.Router()
//router cho product
const controller=require("../../controllers/admin/product.controller")

router.get('/', controller.index)

router.patch('/change-status/:status/:id', controller.changeStatus)

router.delete('/delete/:id', controller.deleteItem)

router.get('/create', controller.create)
router.post('/create', controller.createPost)

router.get('/edit/:id', controller.edit)
router.patch('/edit/:id', controller.editPatch)

router.get('/detail/:id', controller.detail)

module.exports=router