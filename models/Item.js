const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    itemName: {
        type: String,
        required: true
      },
    itemDescription: {
        type: String
      },
    count : {
        type : Number,
        required : true
    },
    createdBy : {
      type: Schema.Types.ObjectId,
      ref: "user"
    },
    userName : {
      type : String
    },
    date: {
        type: Date,
        default: Date.now
      }
});

module.exports = Item = mongoose.model("item", ItemSchema);