require("dotenv").config()

const app=require("./app.js")



app.listen(process.env.PORT,function(){
    console.log("Server connected successfully")
})