const express=require("express")
const router=express.Router()
const controller=require("../../controllers/admin/account.controller")

router.get('/', controller.index)

router.get('/create', controller.create)
router.post('/create', controller.postCreate)

router.get('/edit/:id', controller.edit)
router.patch('/edit/:id', controller.editPatch)

module.exports=router