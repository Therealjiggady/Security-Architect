import { Link, Route, Routes } from 'react-router-dom'
import LandingPage from './LandingPage'

function Home() {
  return <LandingPage />
}

function About() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold">About</h2>
      <p className="mt-2 text-gray-700">React + Vite + Tailwind starter. Connect to FastAPI backend.</p>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}
