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
    orderStatus : {
        type : String,
        default : "Processing"
    },
    date : {
        type: Date,
        default: Date.now
    }
});

module.exports = Order = mongoose.model("order", OrderSchema);