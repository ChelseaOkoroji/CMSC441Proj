{/*Comment*/}
// File: src/Components/Marketplace.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './itempage.css';


const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { category } = useParams();
  const itemsPerPage = 25;
  const navigate = useNavigate();

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Build URL with pagination and optional category filter
        let url = `http://localhost:8000/products/?page=${currentPage}&limit=${itemsPerPage}`;
        if (category) {
          url += `&category=${category}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch items');
        const data = await response.json();
        setItems(data.items);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentPage, category]);

  // Handle item click
  const handleItemClick = (item) => {
    navigate(`/home/product/${item.productID}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="marketplace-container">
      <div className="items-grid">
        {items.map((item) => (
          <div 
            key={item.productID} 
            className="item-card"
            onClick={() => handleItemClick(item)}
          >
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-info">
              <h3>{item.name}</h3>
              <p className="price">${item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;