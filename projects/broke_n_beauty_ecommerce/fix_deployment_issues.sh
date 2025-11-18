#!/bin/bash

echo "======================================"
echo "🔧 Fix Common Deployment Issues"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }

echo ""
echo "What issue are you experiencing?"
echo "1. CORS errors (frontend can't access backend)"
echo "2. Images not loading"
echo "3. Both CORS and image issues"
echo "4. Run deployment diagnostics"
echo "5. Exit"
read -p "Choose option (1-5): " choice

case $choice in
    1)
        echo ""
        echo "======================================"
        echo "Fixing CORS Configuration"
        echo "======================================"
        
        read -p "Enter your frontend URL (e.g., https://your-app.vercel.app): " frontend_url
        
        echo ""
        echo "Add this environment variable to Render:"
        echo ""
        print_warning "FRONTEND_URL=$frontend_url"
        echo ""
        echo "Steps:"
        echo "1. Go to Render dashboard"
        echo "2. Select your service"
        echo "3. Click 'Environment' tab"
        echo "4. Add environment variable:"
        echo "   Name: FRONTEND_URL"
        echo "   Value: $frontend_url"
        echo "5. Save and wait for auto-redeploy"
        echo ""
        echo "The backend will automatically use this in CORS configuration."
        print_success "Instructions provided for CORS fix"
        ;;
        
    2)
        echo ""
        echo "======================================"
        echo "Fixing Image Path Issues"
        echo "======================================"
        
        # Check if static directory exists
        if [ -d "backend/static/images" ]; then
            image_count=$(ls -1 backend/static/images/*.{png,jpg,jpeg} 2>/dev/null | wc -l)
            print_success "Found static/images directory with $image_count images"
            
            echo ""
            echo "Checklist:"
            echo "1. Verify images are committed to Git:"
            git ls-files backend/static/images/ | head -10
            
            if [ $(git ls-files backend/static/images/ | wc -l) -eq 0 ]; then
                print_warning "Images not tracked by Git!"
                echo ""
                read -p "Add images to Git now? (y/n): " add_images
                if [ "$add_images" = "y" ]; then
                    git add backend/static/images/
                    git commit -m "Add product images for deployment"
                    git push
                    print_success "Images committed and pushed!"
                fi
            else
                print_success "Images are tracked by Git"
            fi
            
            echo ""
            echo "2. Verify image URLs in database use correct format:"
            echo "   Correct: /static/images/product.png"
            echo "   Wrong:   static/images/product.png (missing /)"
            echo "   Wrong:   http://localhost:8000/static/images/product.png (absolute URL)"
            
        else
            print_error "Static directory not found!"
            echo ""
            read -p "Create static/images directory now? (y/n): " create_dir
            if [ "$create_dir" = "y" ]; then
                mkdir -p backend/static/images
                print_success "Created backend/static/images directory"
                echo "Now add your product images to this directory"
            fi
        fi
        ;;
        
    3)
        echo "Running both CORS and image fixes..."
        
        # CORS
        read -p "Enter your frontend URL: " frontend_url
        echo ""
        print_warning "Set in Render: FRONTEND_URL=$frontend_url"
        
        # Images
        if [ -d "backend/static/images" ]; then
            git add backend/static/images/
            image_count=$(ls -1 backend/static/images/*.{png,jpg,jpeg} 2>/dev/null | wc -l)
            print_success "Found $image_count images"
        else
            mkdir -p backend/static/images
            print_warning "Created static/images directory - add your images!"
        fi
        ;;
        
    4)
        echo ""
        echo "======================================"
        echo "Running Deployment Diagnostics"
        echo "======================================"
        
        if [ -f "backend/debug_deployment.py" ]; then
            cd backend
            source ../.venv/bin/activate 2>/dev/null || source .venv/bin/activate 2>/dev/null
            python debug_deployment.py
            cd ..
        else
            print_error "debug_deployment.py not found"
        fi
        ;;
        
    5)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "======================================"
print_success "Fix process complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. If you made changes, commit and push to trigger redeploy"
echo "2. Wait for deployment to complete"
echo "3. Test the staging site again"
echo "4. Use QA_TESTING_CHECKLIST.md for comprehensive testing"
echo ""