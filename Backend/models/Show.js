
import mongoose from "mongoose";


const showSchema= new mongoose.Schema({
movie:{
    type:String,
    require:true,
    ref:"Movie",
},
showDateTime:{
    type:Date, require:true,
},
showPrice:{
    type:Number,
    require:true,
},
occupidSeats:{
    type:Object, default:{},
},

},{minimize:false})

const Show= mongoose.model("Show", showSchema);
export default Show;