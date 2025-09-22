import React from 'react';
import Button from './Button';

const Card = ({ title, description, price, image, onAddToCart }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-gray-600 mt-1">{description}</p>
      <p className="text-xl font-bold mt-2">${price}</p>
      <Button onClick={onAddToCart} className="mt-4 w-full">Add to Cart</Button>
    </div>
  );
};

export default Card;