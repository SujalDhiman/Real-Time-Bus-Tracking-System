require("dotenv").config()

const httpServer=require("./app.js")



httpServer.listen(process.env.PORT,function ()
{
    console.log(`Server is up ${process.env.PORT}`);
});
