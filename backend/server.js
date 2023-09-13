require("dotenv").config()

const httpServer=require("./app.js")



httpServer.listen(10000,function ()
{
    console.log("Server is up")
});
