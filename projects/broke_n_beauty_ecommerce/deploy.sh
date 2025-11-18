#!/bin/bash

echo "======================================"
echo "Broken Beauty Deployment Script"
echo "======================================"

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    echo ""
    echo "Checking requirements..."
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed"
        exit 1
    fi
    print_success "git is installed"
    
    if ! command -v heroku &> /dev/null && ! command -v render &> /dev/null; then
        print_warning "Neither heroku CLI nor render CLI detected"
        echo "Install one of them for deployment"
    fi
    
    if ! command -v vercel &> /dev/null && ! command -v netlify &> /dev/null; then
        print_warning "Neither vercel CLI nor netlify CLI detected"
        echo "Install one of them for frontend deployment"
    fi
}

# Deploy backend
deploy_backend() {
    echo ""
    echo "======================================"
    echo "Backend Deployment Options"
    echo "======================================"
    echo "1. Render (recommended)"
    echo "2. Heroku"
    echo "3. Skip backend deployment"
    read -p "Choose option (1-3): " backend_choice
    
    case $backend_choice in
        1)
            echo ""
            echo "Deploying to Render..."
            print_warning "Please follow these steps:"
            echo "1. Go to render.com and sign in"
            echo "2. Click 'New +' → 'Blueprint'"
            echo "3. Connect your GitHub repository"
            echo "4. Render will automatically detect render.yaml"
            echo "5. Click 'Apply' to deploy"
            print_success "Render setup instructions provided"
            ;;
        2)
            echo ""
            echo "Deploying to Heroku..."
            cd backend
            
            # Check if heroku remote exists
            if git remote | grep -q heroku; then
                print_warning "Heroku remote already exists"
            else
                read -p "Enter your Heroku app name: " heroku_app
                heroku create $heroku_app
            fi
            
            # Add PostgreSQL
            heroku addons:create heroku-postgresql:mini || print_warning "Database already exists"
            
            # Set environment variables
            read -p "Enter JWT secret: " jwt_secret
            heroku config:set JWT_SECRET=$jwt_secret
            
            read -p "Enter frontend URL: " frontend_url
            heroku config:set FRONTEND_URL=$frontend_url
            
            # Deploy
            git push heroku main
            print_success "Backend deployed to Heroku"
            cd ..
            ;;
        3)
            print_warning "Skipping backend deployment"
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
}

# Deploy frontend
deploy_frontend() {
    echo ""
    echo "======================================"
    echo "Frontend Deployment Options"
    echo "======================================"
    echo "1. Vercel (recommended)"
    echo "2. Netlify"
    echo "3. Skip frontend deployment"
    read -p "Choose option (1-3): " frontend_choice
    
    case $frontend_choice in
        1)
            echo ""
            echo "Deploying to Vercel..."
            cd frontend
            
            if command -v vercel &> /dev/null; then
                read -p "Enter API URL (backend URL): " api_url
                vercel --prod -e VITE_API_URL=$api_url
                print_success "Frontend deployed to Vercel"
            else
                print_warning "Vercel CLI not installed"
                echo "Install it: npm i -g vercel"
                echo "Then run: vercel --prod"
            fi
            cd ..
            ;;
        2)
            echo ""
            echo "Deploying to Netlify..."
            cd frontend
            
            if command -v netlify &> /dev/null; then
                netlify deploy --prod
                print_success "Frontend deployed to Netlify"
            else
                print_warning "Netlify CLI not installed"
                echo "Install it: npm i -g netlify-cli"
                echo "Then run: netlify deploy --prod"
            fi
            cd ..
            ;;
        3)
            print_warning "Skipping frontend deployment"
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
}

# Main deployment flow
main() {
    check_requirements
    
    echo ""
    echo "======================================"
    echo "Starting Deployment Process"
    echo "======================================"
    
    # Ensure on main branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        print_warning "Not on main branch (currently on: $current_branch)"
        read -p "Continue anyway? (y/n): " continue_choice
        if [ "$continue_choice" != "y" ]; then
            print_error "Deployment cancelled"
            exit 1
        fi
    fi
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        print_warning "You have uncommitted changes"
        read -p "Commit them now? (y/n): " commit_choice
        if [ "$commit_choice" = "y" ]; then
            git add .
            read -p "Enter commit message: " commit_msg
            git commit -m "$commit_msg"
            git push origin main
            print_success "Changes committed and pushed"
        fi
    fi
    
    # Deploy backend
    deploy_backend
    
    # Deploy frontend
    deploy_frontend
    
    echo ""
    echo "======================================"
    print_success "Deployment Process Complete!"
    echo "======================================"
    echo ""
    echo "Next steps:"
    echo "1. Verify backend is running: Check health endpoint"
    echo "2. Verify frontend is accessible"
    echo "3. Test the integration"
    echo "4. Update DNS if using custom domain"
    echo ""
}

# Run main function
main