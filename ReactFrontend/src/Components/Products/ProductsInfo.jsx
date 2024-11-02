import React from 'react';
import { useParams } from 'react-router-dom';
import all_products from '../Assests/all_products';

const ProductsInfo = () => {
    const { productId } = useParams(); 
    const product = all_products.find(p => p.id === parseInt(productId)); 

    if (!product) return <p>Product not found.</p>; 

    return (
        <div className="product-info">
            <h1>{product.name}</h1>
            <img src={product.image} alt={product.name} />
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
            {/* Add other product details here */}
        </div>
    );
};

export default ProductsInfo;