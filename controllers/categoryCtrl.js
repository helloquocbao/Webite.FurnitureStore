const Category = require('../models/categoryModel')

const categoryCtrl = {
    getCategories: async(req,res) =>{
       try {
           const categories = await Category.find()
           res.json(categories)
       } catch (error) {
           return res.status(500).json({msg: error.message})
       }
    },
    createCategory: async (req,res) =>{
        try {
        // nếu tài khoản có role = 1 => admin
         // chỉ có admin mới có thẻ tạo, xóa và update category
         const {name} = req.body;
         const category = await Category.findOne({name})
         if(category) return res.status(400).json({msg:"This category already exists"})

         const newCatgory = new Category({name})

        await newCatgory.save()
        res.json('Created a category')
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    deleteCategory: async (req,res) =>{
        try {
            await Category.findByIdAndDelete(req.params.id)
            
            res.json({msg:"Deleted a Category"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    updateCategory: async (req,res)=>{
        try {
            const {name} = req.body;
            await Category.findByIdAndUpdate({_id:req.params.id},{name})

            res.json({msg:"Update a Category"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}

module.exports = categoryCtrl