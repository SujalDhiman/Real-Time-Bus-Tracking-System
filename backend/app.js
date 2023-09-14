const express=require("express")
const app=express()
const cors=require("cors")
const connectToDb=require("./Database/db")
const busRouter=require("./router/busRoute")
const { createServer } = require("http");
const { Server } = require("socket.io");

//connecting to database
connectToDb()

app.use((req, res, next) => {
    console.log(req.method, req.ip);
    next();
})

//setting up cross origin resource sharing
app.use(cors({
    origin:"*",
    methods:["GET","POST","DELETE","PATCH"]
}))

app.get("/", (req, res) => {res.send("HELLO")});

//setting up middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors:"*"
});

io.on("connection", (socket) => {
    socket.on("busId",(payload)=>{
        console.log(payload)
    console.log(`busLocation-${payload.id}`)
    io.emit(`busLocation-${payload.id}`,payload)
})
});





//setting up routes
app.use("/api/v1",busRouter)

module.exports=httpServer
