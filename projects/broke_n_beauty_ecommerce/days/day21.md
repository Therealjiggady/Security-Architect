# Day 21: Advanced Clothing Size Recommendation Algorithm

## Overview
Implemented a comprehensive clothing size recommendation system with advanced features including multiple measurements, separate top/bottom sizing, weighted scoring, fit preferences, fabric stretch considerations, confidence ratings, and per-user learning.

## Features Implemented

### Backend Algorithm
- **Measurements**: Height, weight, chest, waist, hips, shoulders, inseam
- **Separate Size Charts**: Distinct charts for tops (chest, shoulders, waist) and bottoms (waist, hips, inseam)
- **Weighted Scoring**: Sophisticated scoring system considering measurement importance and fabric properties
- **Fit Preferences**: Slim, regular, relaxed options that adjust size ranges
- **Fabric Stretch**: Low, medium, high stretch levels affecting deviation tolerances
- **Confidence & Notes**: Returns confidence scores (0-1) and contextual notes
- **Per-User Learning**: Stores user-specific size offsets based on feedback

### API Endpoints
- `POST /sizing/recommend-size`: Main recommendation endpoint
- `POST /sizing/feedback`: User feedback for learning

### Frontend Integration
- Size Recommender modal in Products page
- Form with all measurement inputs
- Height input split into feet/inches for user convenience
- Displays recommendations with confidence and notes

## Technical Implementation

### Backend Files
- `backend/app/models/sizing.py`: UserSizingOffset model
- `backend/app/schemas/sizing.py`: Request/response schemas
- `backend/app/routers/sizing.py`: Algorithm logic and API endpoints

### Frontend Files
- `frontend/src/components/SizeRecommender.jsx`: Modal component
- `frontend/src/ProductsPage.jsx`: Integration button

### Key Algorithm Features
- Constants for size charts and measurement weights
- If...else logic with logical operators for size determination
- Function with multiple arguments: `recommend_sizes(height, weight, chest, waist, hips, shoulders, inseam, fit_preference, fabric_stretch)`
- Returns separate top_size and bottom_size with confidence scores

## Usage
1. Click "Size Recommender" on products page
2. Enter height (e.g., "5'6" or "66 inches") and weight (pounds) - required
3. Optionally enter additional measurements (chest, waist, hips, shoulders, inseam in inches)
4. Select fit preference, fabric stretch, and product type
5. Get personalized size recommendations with confidence and notes

## Product Types
- **General**: Standard sizing for all products
- **Sports Bra**: Optimized for athletic tops
- **Biker Shorts**: Focused on bottom fit
- **Tank Top**: Upper body emphasis
- **Scrub Top/Bottom**: Professional wear sizing
- **Compression Leggings**: Activewear bottoms
- **Yoga Tank Top**: Flexible upper body wear

## Key Features
- **Minimum Requirements**: Only height and weight required for basic recommendations
- **Optional Measurements**: Add more measurements for higher confidence
- **Flexible Height Input**: Accepts formats like "5'6", "5 feet 6 inches", "66 inches", or just "66"
- **Units Display**: Clear labeling (inches, pounds)
- **Flexible Algorithm**: Handles missing measurements gracefully with appropriate confidence scores
5. Optional: Provide feedback to improve future recommendations

## Testing
- API tested with sample measurements
- Frontend integration working
- Error handling for invalid inputs
- Hot reload support during development

This implementation provides a production-ready size recommendation system that learns from user feedback and handles complex sizing scenarios.