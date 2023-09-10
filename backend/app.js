const express=require("express")
const app=express()
const cors=require("cors")
const connectToDb=require("./Database/db")
const busRouter=require("./router/busRoute")


//connecting to database
connectToDb()

//setting up cross origin resource sharing
app.use(cors({
    origin:"*",
    methods:["GET","POST","DELETE","PATCH"]
}))

//setting up middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//setting up routes
app.use("/api/v1",busRouter)

module.exports=app
