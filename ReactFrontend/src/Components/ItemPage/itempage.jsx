{/*Comment*/}
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ItemGrid = ({ items, onItemClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {items.map((item) => (
        <Card 
          key={item.productID}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onItemClick(item)}
        >
          <CardContent className="p-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-md mb-2"
            />
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-xl font-bold">${item.price}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const ItemDetails = ({ item, isOpen, onClose }) => {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
            <p className="text-3xl font-bold text-primary mb-4">${item.price}</p>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <div className="space-y-2">
              <p><span className="font-semibold">Category:</span> {item.category}</p>
              <p><span className="font-semibold">Color:</span> {item.color}</p>
              <p><span className="font-semibold">Quantity Available:</span> {item.quantity}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-4 my-6">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

const ItemListingPage = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  const fetchItems = async (page) => {
    try {
      const response = await fetch(`/api/products?page=${page}&limit=25`);
      const data = await response.json();
      setItems(data.items);
      setTotalPages(Math.ceil(data.total / 25));
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ItemGrid items={items} onItemClick={handleItemClick} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ItemDetails
        item={selectedItem}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

export default ItemListingPage;