const express=require('express')
const router= express.Router();
const adminData=require('../controller/admin')
const userData=require('../controller/users')

router.get('/users',adminData.getUsers);
router.post('/createProduct',adminData.createProduct); 
router.delete('/deleteProduct/:id',adminData.deleteProduct);
router.patch('/updateProduct/:id',adminData.updateProduct)
router.get('/users',userData.allUsers)
router.post('/updatestatus',adminData.updatestatus)

module.exports=router;