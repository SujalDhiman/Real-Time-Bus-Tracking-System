require("dotenv").config()

const server=require("./socket.js")

server.listen(process.env.PORT,function(){
    console.log("Server connected successfully")
})