const redis= require('redis');

const redisClient=()=>{
   return redis.createClient({
    url:process.env.redis_url
   })
}

const client=redisClient();

client.on("error",(err)=>{
    console.log(err)
})

client.on("connect",()=>{
    console.log("connectecd to redis")
})

client.on("end",()=>{
    console.log("redis connection ended")
})

client.on("SIGQUIT",()=>{
    client.quit();
})

module.exports=client;

