const users= require('../model/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const joi =require('@hapi/joi');
const products = require('../model/products');
const client = require('../redis');


client.connect()
   .then(()=>{
    console.log("connected to redis")
   })
   .catch((e)=>{
    console.log(e)
   })

//Verification with joi
const usersSchema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().min(3).required().email(),
    password: joi.string().min(8).required(),
    confirmPassword: joi.string().min(8).required(),
    confirmPassword: joi.any().equal(joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' })
});

//registration
const userRegistration = async (req, res) => {
    
    const emailfound = await users.findOne({ email: req.body.email })
    if (emailfound) {
        return res.status(400).send("Email already exist")
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const hashedconf = await bcrypt.hash(req.body.confirmPassword, salt);

    const createUser = new users({
        name: req.body.name,
        email: req.body.email,
        password: hashedPass,
        confirmPassword: hashedconf
    })


    try {
        const { error } = await usersSchema.validateAsync(req.body);
        if (error) {
            res.status(400).send(error)
        }
        else {

            await createUser.save();
            return res.status(201).send("Registration successfull please Login");
        }
    }

    catch (error) {
        res.status(400).send(error)

    }
}

//user login
const userLogin = async (req, res) => {
    const User = await users.findOne({ email: req.body.email })
    if (!User) {
        return res.status(400).send("Invalid email")
    }

    const validPassword = await bcrypt.compare(req.body.password, User.password);
    if (!validPassword)
        return res.status(400).send("Invalid password");
    try {

        const token = jwt.sign({ email: User.email }, process.env.TOKEN_SECRET);
        await client.set(`key-${req.body.email}`,token)
        res.header("auth_token", token).send({token:token,user:User.role});
    }

    catch (error) {
        res.status(400).send(error)
    }

}


//user login verification
const verifyLogin = async (req, res) => {
    const { token } = req.body
    try {
        const verify = jwt.verify(token, process.env.TOKEN_SECRET)
        if (verify) {
            await users.findOne({ email: verify.email })
                .then((res) =>res.toJSON()) 
                .then((data)=>{
                    
                    res.status(200).send(data)
                })

        }

    }
    catch {
        res.status(400).send('invalid token')
    }
}


const allUsers= async(req,res)=>{
    const findusers = await users.find();
    if(!findusers){
        return res.status(400).send(error)
    }
    else{
        return res.status(200).send(findusers)
    }
}

const deleteUser = async (req, res) => {
    const data =  await users.deleteOne({ _id: req.params.id });
      try {
          res.status(200).send(data)
      }
      catch (error) {
          res.status(400).send(error)
      }
  }

const cart= async(req,res)=>{
    try{
         const find= await users.findOne({"email":req.body.email})
         res.status(200).send(find.cart)

    }
    catch(error){
        res.status(400).send(error)
    }
}  

const deleteCart= async(req,res)=>{
    const {id}=req.params
    try{
        const deleteProduct= await users.updateOne({"email":req.body.email},{$pull:{cart:{_id:id}}})
        res.status(200).send(deleteProduct)
    } 
    catch(error){
            res.status(400).send(error)
    }
}

const updateorders= async(req,res)=>{
    const{email,address,orderid}=req.body
    
    try{
        const find= await users.findOne({"email":email})
        const cartitems=find.cart
        cartitems.map(async (items)=>
        await users.updateOne({"email":email},{$push:{"orderedItem":{"productName": items.productName ,"orderId":orderid,"productId":items.productId,"productPrice":items.productPrice,
        "category":items.category,"productImage":items.productImage,"quantity":items.quantity,"deliveryAddress":address}}})
        )
    
        cartitems.map(async (items)=>
        await users.updateOne({"role":"admin"},{$push:{"orderedList":{"userName":find.name ,"userEmail":find.email,"orderId":orderid ,"productName": items.productName ,"productPrice":items.productPrice,
        "category":items.category,"quantity":items.quantity,"deliveryAddress":address}}})
        )
        res.status(200).send('order placed sucessfull')
    }
    catch(error){
        res.status(400).send(error)
    }
}

const order= async(req,res)=>{
    const{email}=req.body
    try{
          const find= await users.findOne({"email":email})
        
          res.status(200).send(find.orderedItem)
    }
    catch(error){
        res.status(400).send(error)
    }
}

const postreview= async(req,res)=>{
    const{id}=req.params;
    try{
       await products.updateOne({_id:id},{$push:{"review":{"userName":req.body.userName,"rating":req.body.rating,"reviewTitle":req.body.reviewTitle,"review":req.body.review}}})
        const find= await products.findOne({_id:id})
        const totalrating= find.review.map(item=>item.rating)
        const final=(Math.round((totalrating.reduce((a,b)=>a+b)/totalrating.length)*10)/10).toFixed(1)
        await products.updateOne({_id:id},{$set:{"rating":final}})
         res.status(200).send({messsage:"Review added sucessfully"})
    }
    catch(error){
         res.status(400).send(error)
    }                                                                                                                                                                                                                                                                                                       
}

const getreview= async(req,res)=>{
    const {id}= req.params;
    try{
         const find= await products.findOne({_id:id});
         res.status(200).send(find.review)
    }
    catch(error){
         res.status(400).send(error)
    }
}

module.exports.getreview=getreview;
module.exports.postreview=postreview;
module.exports.order=order;
module.exports.updateorders=updateorders;
module.exports.cart=cart;
module.exports.deleteCart=deleteCart;
module.exports.userRegistration=userRegistration;
module.exports.userLogin=userLogin;
module.exports.verifyLogin=verifyLogin;
module.exports.allUsers=allUsers;
module.exports.deleteUser=deleteUser;