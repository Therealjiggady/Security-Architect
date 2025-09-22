import { Link, Route, Routes } from 'react-router-dom'
import LandingPage from './LandingPage'
import ProductsPage from './ProductsPage'
import CartPage from './CartPage'
import ProfilePage from './ProfilePage'

function Home() {
  return <LandingPage />
}

function Products() {
  return <ProductsPage />
}

function Cart() {
  return <CartPage />
}

function Profile() {
  return <ProfilePage />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}
