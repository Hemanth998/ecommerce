const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref: "user",
        required : true
    },
    item : {
        type: Schema.Types.ObjectId,
        ref: "item",
        required : true
    },
    email : {
        type : String,
        required : true
    },
    numberOfItems : {
        type : Number,
        required : true
    },
    date : {
        type: Date,
        default: Date.now
    }
});

module.exports = Order = mongoose.model("order", OrderSchema);