import React, {useContext} from "react";
import {GlobalState} from '../../../GlobalState'
import ProductsItem from "../utils/productItem/ProductItem";

function Products(){
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
   // console.log(products)


    return (
        <div className="products">
                {
                    products.map(product =>{
                        return <ProductsItem key={product._id} product={product}/>
                    })
                }
        </div>
    )
}

export default Products