const express = require("express");
const router = express.Router();
var request = require("request");
const User = require("../../models/User");
const Order = require("../../models/Order");
const Item = require("../../models/Item");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

router.post(
  "/",
  [
    auth,
    [
      check("email", "Please enter a valid email Address").isEmail(),
      check("item", "please select an item")
        .not()
        .isEmpty(),
      check("numberOfItems", "please enter valid number of items").isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, item, numberOfItems } = req.body;
      
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "User doen't exist" }] });
      }

      const itemObj = await Item.findById(item);
      if (!itemObj) {
        return res.status(400).json({ errors: [{ msg: "Item doen't exist" }] });
      }
      if (itemObj.count === 0) {
        return res.status(400).json({ errors: [{ msg: "Item Out of stock" }] });
      }
      if (numberOfItems > itemObj.count) {
        return res
          .status(400)
          .json({
            errors: [
              {
                msg: `Your order exceeded the number of items available, only ${itemObj.count} item(s) available`
              }
            ]
          });
      }

      const newOrder = new Order({
        user : user.id,
        email,
        item,
        numberOfItems
      });

      await newOrder.save();
      //update count of items
      const updatedCount = itemObj.count - numberOfItems;
      const updateObj = {
        count : updatedCount
      }
      await itemObj.updateOne(updateObj);
      res.status(200).json({ msg: "Order Placed!!!" });
    } catch (err) {
        res.status(500).send("Internal Server error");
    }
  }
);


router.get('/getOrdersByUser/:userId' , async (req, res) => {
    try {
        const orders = await Order.find({user:req.params.userId}).sort({date:-1});
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server error");
    }
})


router.delete("/:id", auth, async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
  
      if (!order) {
        return res.status(404).json({ msg: "Order Not Found!!" });
      }
  
      if (order.user.toString() !== req.user.id) {
        return res.status(401).json({
          msg: "You are not authorized to delete,Only who created can delete!!"
        });
      }
  
      await order.remove();
  
      res.status(200).json({ msg: "Order Cancelled" });
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Order Not Found!!" });
      }
      res.status(500).send("Internal Server error");
    }
  });




module.exports = router;
