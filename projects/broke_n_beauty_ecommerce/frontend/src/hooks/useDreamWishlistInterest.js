import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dreamWishlistInterest';

/**
 * Custom hook for managing Dream Wishlist interest tracking
 * Uses localStorage to persist user's interested products
 */
export const useDreamWishlistInterest = () => {
  const [interestedProducts, setInterestedProducts] = useState([]);

  // Load interested products from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setInterestedProducts(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading dream wishlist interest:', error);
      // If there's an error, start with empty array
      setInterestedProducts([]);
    }
  }, []);

  // Save to localStorage whenever interestedProducts changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(interestedProducts));
    } catch (error) {
      console.error('Error saving dream wishlist interest:', error);
    }
  }, [interestedProducts]);

  /**
   * Toggle interest for a product
   * @param {string} productId - The product ID to toggle
   */
  const toggleInterest = (productId) => {
    setInterestedProducts((prev) => {
      if (prev.includes(productId)) {
        // Remove interest
        return prev.filter((id) => id !== productId);
      } else {
        // Add interest
        return [...prev, productId];
      }
    });
  };

  /**
   * Check if user is interested in a product
   * @param {string} productId - The product ID to check
   * @returns {boolean} - True if user is interested
   */
  const isInterested = (productId) => {
    return interestedProducts.includes(productId);
  };

  /**
   * Clear all interested products (utility function)
   */
  const clearAll = () => {
    setInterestedProducts([]);
  };

  return {
    interestedProducts,
    toggleInterest,
    isInterested,
    clearAll
  };
};

export default useDreamWishlistInterest;
