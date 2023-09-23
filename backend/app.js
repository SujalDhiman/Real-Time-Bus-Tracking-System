const express=require("express")
const app=express()
const cors=require("cors")
const connectToDb=require("./Database/db")
const busRouter=require("./router/busRoute")
const { createServer } = require("http");
const { Server } = require("socket.io");
const expressFileUpload=require("express-fileupload")
const cloudinary=require("cloudinary")
const {cache} = require("./Cache/cache");



//enabling cloudinary for image upload
cloudinary.config({ 
cloud_name: process.env.CLOUDINARY_NAME, 
api_key: process.env.CLOUDINARY_API_KEY, 
api_secret:process.env.CLOUDINARY_API_SECRET
});


app.use(cors({
    origin:"*",
    methods:["GET","POST","DELETE","PATCH"],
}))

app.use(expressFileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))


app.options('*', cors());

//connecting to database
connectToDb()


app.use((req, res, next) => {
    console.log(req.method, req.ip);
    next();
})

//setting up cross origin resource sharing

app.get("/", (req, res) => {res.send("HELLO")});

//setting up middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors:"*",
});

io.on("connection", (socket) => {
    socket.on("busId",(payload)=>{
        console.log(payload);

    cache.set(payload.id, payload);
    console.log(cache);
    console.log(`busLocation-${payload.id}`)
    io.emit(`busLocation-${payload.id}`,payload)})

    socket.on("panicAlarm",(payload)=>{
        socket.broadcast.emit("sendAlarm",payload)
    })

    socket.on("count",(payload)=>{
        io.emit("sendCountPassenger",{countPassenger:payload.countPassenger})
    })

});





//setting up routes
app.use("/api/v1",busRouter)

module.exports=httpServer
