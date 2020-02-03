const express = require("express");
const router = express.Router();
const Item = require("../../models/Item");
const User = require("../../models/User");
const adminAuth = require("../../middleware/adminAuth");
const { check, validationResult } = require("express-validator");


router.get("/", async (req, res) => {
    try {
      const items = await Item.find().sort({ date: -1 });
      res.json(items);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server error");
    }
  });



  router.post(
    "/",
    [
      adminAuth,
      [
        check("itemName", "item Name cannot be empty")
          .not()
          .isEmpty(),
        check("count", "Enter a valid count")
          .isNumeric(),
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const { itemName, itemDescription, count } = req.body;
        const user = await User.findById(req.user.id).select("-password");
  
        const newItem = new Item({
          createdBy: req.user.id,
          userName : user.userName,
          itemName,
          itemDescription,
          count
        });
  
        await newItem.save();
        res.json({ msg: "Item created!" });
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server error");
      }
    }
  );
  





  router.put("/:id", adminAuth, async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ msg: "Item Not Found!!" });
      }
      if (item.createdBy.toString() !== req.user.id) {
        return res.status(401).json({
          msg: "You are not authorized to edit,Only who created can edit!!"
        });
      }
  
      const { itemName, itemDescription, count } = req.body;
  
      const updateFields = {};
  
      if (itemName) updateFields.itemName = itemName;
      if (itemDescription) updateFields.itemDescription = itemDescription;
      if (count) updateFields.count = count;
  
      await item.updateOne(updateFields);
  
      res.status(200).json({ msg: "Item Changes Saved!!!" });
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Item Not Found!!" });
      }
      res.status(500).send("Internal Server error");
    }
  });
  
  //delete item route
  
  router.delete("/:id", adminAuth, async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
  
      if (!item) {
        return res.status(404).json({ msg: "Item Not Found!!" });
      }
  
      if (item.createdBy.toString() !== req.user.id) {
        return res.status(401).json({
          msg: "You are not authorized to delete,Only who created can delete!!"
        });
      }
  
      await item.remove();
  
      res.status(200).json({ msg: "Item Removed" });
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Item Not Found!!" });
      }
      res.status(500).send("Internal Server error");
    }
  });


  
module.exports = router;