import { Link, Route, Routes } from 'react-router-dom'

function Home() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Clover Line</h1>
      <p className="mt-2 text-gray-600">Secure E‑Commerce + SmartFit Size Recommender</p>
      <div className="mt-6 flex gap-3">
        <a className="px-4 py-2 rounded-md border" href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer">API Docs</a>
        <Link className="px-4 py-2 rounded-md border" to="/about">About</Link>
      </div>
    </div>
  )
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
