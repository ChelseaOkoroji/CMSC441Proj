import './ProductUpload.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductUpload = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [color, setColor] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const userID = sessionStorage.getItem('userID');

    const handleProductUpload = async (event) => {
        event.preventDefault();
    
        const myproduct = {
            name,
            description,
            price: parseFloat(price), 
            quantity: parseInt(quantity),  
            color,
            category,
            image: image ? image.name : ''  
        };
    
        try {
            const response = await axios.post('/create-product/', myproduct, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            sessionStorage.setItem('product', JSON.stringify(response.data));
            navigate('/product-upload-success');
        } catch (error) {
            console.error("Error uploading product:", error);
            alert("Failed to upload product. Please try again.");
        }
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    return (
        <div className='product-upload'>
            <h1>Upload your Product</h1>
            <form onSubmit={handleProductUpload}>
                <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                <input type="text" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="book">Books</option>
                    <option value="merch">Merch</option>
                    <option value="school-supplies">School Supplies</option>
                    <option value="technology">Technology</option>
                    <option value="dorm">Dorm</option>
                    <option value="health">Health/Fitness</option>
                </select>
                <input type="file" onChange={handleImageChange} accept="image/*" />
                <button type="submit">Upload Product</button>
            </form>
        </div>
    );
};

export default ProductUpload;