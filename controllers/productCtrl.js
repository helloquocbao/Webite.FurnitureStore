const { query } = require("express");
const Products = require("../models/productModel");

//Lọc data, sắp xếp và phan trang
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = {...this.queryString} // queryString = req.query
  
    const excludedFields = ['page', 'sort', 'limit']
    excludedFields.forEach(el =>delete(queryObj[el]))

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g,match=>'$' +match)
    
    this.query.find(JSON.parse(queryStr))

    // gte = greater than or equal == lớn hơn hoặc bằng
    // lte = lesser than orr equal == bé hơn hoặc bằng
    // lt = lesser than == bé hơn
    // gt = greater than  == lớn hơn
    return this;
  }

  sorting() {}

  paginating() {}
}

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query).filtering()

      const products = await features.query;

      res.json(products);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;
      if (!images) return res.status(400).json({ msg: "No image upload" });

      const product = await Products.findOne({ product_id });
      if (product)
        return res.status(400).json({ msg: "This product already exixts." });

      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });
      await newProduct.save();
      res.json({ msg: "Create a product" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a product" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { title, price, description, content, images, category } = req.body;
      if (!images) return res.status(400).json({ msg: "No image upload" });

      await Products.findByIdAndUpdate(
        { _id: req.params.id },
        {
          title,
          price,
          description,
          content,
          images,
          category,
        }
      );

      res.json({ msg: "Updated a Product" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = productCtrl;
