const express=require("express")
const router=express.Router()
const controller=require("../../controllers/admin/user.controller")

router.get('/', controller.index)
router.get('/detail/:id', controller.detail)
router.get('/edit/:id', controller.edit)
router.patch('/edit/:id', controller.editPatch)
router.get('/delete/:id', controller.deleteUser)


module.exports=router