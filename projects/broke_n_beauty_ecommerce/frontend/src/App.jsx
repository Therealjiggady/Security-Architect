import { Link, Route, Routes } from 'react-router-dom'
import LandingPage from './LandingPage'
import ProductsPage from './ProductsPage'
import CartPage from './CartPage'
import WishlistPage from './WishlistPage'
import ProfilePage from './ProfilePage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'

function Home() {
  return <LandingPage />
}

function Products() {
  return <ProductsPage />
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}
