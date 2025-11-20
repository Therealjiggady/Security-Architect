# Day 14: Backend Endpoints for Image Upload

## Objective
Develop backend API endpoints to handle image uploads for products, allowing users to associate images with product listings.

## Achievements
- Successfully implemented a secure image upload endpoint.
- Added image URL field to the product model for storing image paths.
- Ensured proper file validation and storage.

## Challenges
- Handling multipart/form-data requests in FastAPI.
- Implementing file type and size validation to prevent security issues.
- Managing file naming and avoiding conflicts.

## What Was Done
- Created a new endpoint `POST /products/{product_id}/upload-image` in the products router.
- Used `UploadFile` for handling file uploads and saved images to the static/images directory.
- Updated the product schema to include an optional image_url field.
- Added error handling for invalid file types and sizes.

## Files Created/Modified
- `backend/app/routers/products.py` (modified)
- `backend/app/schemas.py` (modified, added image_url to Product schema)
- `backend/app/models/product.py` (modified, added image_url column if applicable)

## Usage
Clients can upload images by sending a POST request to `/products/{product_id}/upload-image` with the image file in the request body.

## Next Steps
Update the frontend to include image upload functionality in the product management interface.

## Monday.com Submission
- Documented backend endpoint implementation on Monday.com.
- Link: [Monday.com Item Link]