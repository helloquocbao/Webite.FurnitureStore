import {useState, useEffect} from 'react'
import axios from "axios";

function ProductsAPI() {
  const [products, setProducts] = useState([]);

  const getPruducts = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data.products);
  }

  useEffect(() => {
    getPruducts();
  }, []);

  return {products: [products, setProducts]};
}

export default ProductsAPI;
