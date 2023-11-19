const express=require('express')
const router= express.Router();
const userData=require('../controller/users')

router.delete('/deleteUser/:id',userData.deleteUser);
router.post('/login',userData.userLogin);
router.post('/register',userData.userRegistration);
router.post('/verifylogin',userData.verifyLogin); 
router.post('/cart/:id',userData.deleteCart)
router.post('/cart',userData.cart)
router.post('/orders',userData.updateorders)
router.post('/getorder',userData.order)
router.post('/postreview/:id',userData.postreview);
router.get('/getreview/:id',userData.getreview)

module.exports=router;