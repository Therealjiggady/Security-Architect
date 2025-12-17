import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './LandingPage'
import ProductsPage from './ProductsPage'
import ProductDetailPage from './ProductDetailPage'
import CartPage from './CartPage'
import WishlistPage from './WishlistPage'
import DreamWishlistPage from './DreamWishlistPage'
import ProfilePage from './ProfilePage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import PaymentTestPage from './PaymentTestPage'
import OrderHistoryPage from './OrderHistoryPage'
import OrderTrackingPage from './OrderTrackingPage'
import ChatPage from './ChatPage'

function Home() {
  return <LandingPage />
}

function Products() {
  return <ProductsPage />
}

function ProductDetail() {
  return <ProductDetailPage />
}

function Cart() {
  return <CartPage />
}

function Wishlist() {
  return <WishlistPage />
}

function Profile() {
  return <ProfilePage />
}

function Login() {
  return <LoginPage />
}

function Register() {
  return <RegisterPage />
}

function PaymentTest() {
  return <PaymentTestPage />
}

function Orders() {
  return <OrderHistoryPage />
}

function OrderTracking() {
  return <OrderTrackingPage />
}

function Chat() {
  return <ChatPage />
}

function DreamWishlist() {
  return <DreamWishlistPage />
}

export default function App() {
  const location = useLocation();
  // Don't show navbar on login/register pages
  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/dream-wishlist" element={<DreamWishlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment-test" element={<PaymentTest />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  )
}
