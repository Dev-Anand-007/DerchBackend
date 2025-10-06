const constant=require('../utils/constants')
const mongoose=require('mongoose');


const adminschema=mongoose.Schema({
    fullname: String,
    email: String,
    password:String,
    products: {
        type:Array,
        defaut: [],
    },
    contact: Number,
    picture: String,
    gstin:String,
});

module.exports=mongoose.model('admin',adminschema,'admin');