const razorpay= require('razorpay')
const crypto= require('crypto');


const orderpayment= async(req,res)=>{
       try{
            const instance= new razorpay({
                key_id:process.env.KEY_ID,
                key_secret:process.env.KEY_SECRET,
            });

            const options= {
                amount:req.body.amount*100,
                currency:"INR",
                receipt: crypto.randomBytes(10).toString('hex')

            };
            instance.orders.create(options,(error,order)=>{
                if(error){
                  
                    return res.status(500).send({message:"Something went wrong"})
                }
                res.status(200).send({order})
            })
       }
       catch(error){
             
              res.status(500).send("Internal server error")
       }
}

const verifyorder=async(req,res)=>{
    
    try{
      const{  razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature} = req.body;
        const sign=  razorpay_order_id + "|"+ razorpay_payment_id;
        const expectedsign= crypto.createHmac("sha256", process.env.KEY_SECRET).update(sign.toString()).digest("hex")
        if(razorpay_signature=== expectedsign){
            return res.status(200).send({message:"Payment verified sucessfully", orderid:razorpay_order_id})
        }
        else{
            return res.status(200).send("Invalid signature")
        }
    }
    catch(error){
           res.status(400).send("Internal server error")
    }
}

module.exports.orderpayment=orderpayment;
module.exports.verifyorder=verifyorder;