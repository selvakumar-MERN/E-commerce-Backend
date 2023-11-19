const express=require('express')
const router= express.Router();
const productData=require('../controller/products');
const orderData=require('../controller/payementcontrol');

router.get('/products',productData.allProducts)
router.post('/payment',orderData.orderpayment)
router.post('/verify',orderData.verifyorder)
router.post('/products/:id',productData.cartProducts)
router.get('/category/:category',productData.getcategory)
router.get('/:id',productData.getoneproduct)

module.exports=router;