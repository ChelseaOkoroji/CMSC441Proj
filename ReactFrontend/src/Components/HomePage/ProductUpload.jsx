import './ProductUpload.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';

const ProductUpload = () => {
    const {user} = useUser();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [color, setColor] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const userID = user.userID;

    const handleProductUpload = async (event) => {
        event.preventDefault();
    
        const myproduct = {
            name,
            description,
            price: parseFloat(price), 
            quantity: parseInt(quantity),  
            color,
            category,
            image: image ? image.name : '',  
            userID
        };
        const formData = new FormData();
        formData.append('userID', userID)
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('color', color);
        formData.append('category', category);
        formData.append('image', image);
    
        try {
            const response = await axios.post('/create-product/', formData);
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
                <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required/>
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required/>
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required/>
                <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required/>
                <select value={color} onChange={(e) => setColor(e.target.value)} >
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="gray">Gray</option>
                    <option value="pink">Pink</option>
                    <option value="white">White</option>
                    <option value="black">Black</option>
                </select>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="book">Books</option>
                    <option value="merch">Merch</option>
                    <option value="school-supplies">School Supplies</option>
                    <option value="technology">Technology</option>
                    <option value="dorm">Dorm</option>
                    <option value="health">Health/Fitness</option>
                </select>
                <input type="file" onChange={handleImageChange} accept="image/*" required/>
                <button type="submit">Upload Product</button>
            </form>
        </div>
    );
};

export default ProductUpload;