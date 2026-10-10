const mongoose= require("mongoose");


exports.DbConnect=()=>{

mongoose.connect(process.env.MONGODB_URL,{

})
.then(console.log("Database is connected Successfully"))
.catch((error)=>{
console.log(error);
console.log("Database is not connected");
process.exit(1);
})

}