import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

const ReviewSection = ({ productId }) => {
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchReviews();
    fetchSummary();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:8000/reviews/product/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch(`http://localhost:8000/reviews/product/${productId}/summary`);
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      console.error('Error fetching review summary:', error);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      alert('You can upload up to 5 images per review');
      return;
    }
    setSelectedImages([...selectedImages, ...files]);
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to write a review');
      return;
    }
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('rating', rating);
    formData.append('title', title);
    formData.append('comment', comment);

    selectedImages.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await fetch('http://localhost:8000/reviews/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        setShowForm(false);
        setRating(0);
        setTitle('');
        setComment('');
        setSelectedImages([]);
        fetchReviews();
        fetchSummary();
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, size = 'text-xl') => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${size} cursor-${interactive ? 'pointer' : 'default'} ${
              star <= (interactive ? (hoveredRating || rating) : rating)
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      {summary && summary.total_reviews > 0 && (
        <Card className="border border-white/10 bg-white/5">
          <CardHeader>
            <h3 className="text-xl font-semibold">Customer Reviews</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold">{summary.average_rating.toFixed(1)}</div>
              <div>
                {renderStars(Math.round(summary.average_rating))}
                <div className="text-sm text-muted-foreground mt-1">
                  Based on {summary.total_reviews} {summary.total_reviews === 1 ? 'review' : 'reviews'}
                </div>
              </div>
            </div>

            {/* Star Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = summary.rating_distribution[stars] || 0;
                const percentage = summary.total_reviews > 0
                  ? (count / summary.total_reviews) * 100
                  : 0;
                return (
                  <div key={stars} className="flex items-center gap-2 text-sm">
                    <span className="w-12">{stars} star</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Write Review Button */}
      {user && !showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          Write a Review
        </Button>
      )}

      {/* Review Form */}
      {showForm && (
        <Card className="border border-white/10 bg-white/5">
          <CardHeader>
            <h3 className="text-lg font-semibold">Write Your Review</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">Rating *</label>
                {renderStars(rating, true, 'text-3xl')}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sum up your review in one line"
                  maxLength={200}
                  required
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium mb-2">Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product"
                  className="w-full min-h-[120px] px-3 py-2 rounded-md border border-white/10 bg-white/5 text-sm"
                  maxLength={2000}
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Photos (optional, max 5)</label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageSelect}
                  disabled={selectedImages.length >= 5}
                />
                {selectedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="h-20 w-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setRating(0);
                    setTitle('');
                    setComment('');
                    setSelectedImages([]);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="border border-white/10 bg-white/5">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    {renderStars(review.rating, false, 'text-lg')}
                    <h4 className="font-semibold mt-2">{review.title}</h4>
                    {review.verified_purchase && (
                      <span className="inline-block text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded mt-1">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
                )}
                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {review.images.map((image) => (
                      <img
                        key={image.id}
                        src={`http://localhost:8000${image.image_url}`}
                        alt="Review"
                        className="h-24 w-24 object-cover rounded border cursor-pointer hover:opacity-80 transition"
                        onClick={() => window.open(`http://localhost:8000${image.image_url}`, '_blank')}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
