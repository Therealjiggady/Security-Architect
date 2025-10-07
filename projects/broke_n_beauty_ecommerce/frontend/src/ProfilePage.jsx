import React, { useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'Alice Johnson',
    email: 'alice@example.com',
    memberSince: 'January 2024',
    ordersCount: 3,
    favoriteCategory: 'Activewear'
  });

  const [orders] = useState([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 47.98,
      items: ['BnB Sport Bra – Black', 'BnB Biker Short – Navy']
    },
    {
      id: 'ORD-002',
      date: '2024-02-20',
      status: 'Shipped',
      total: 24.99,
      items: ['BnB Compression Leggings']
    },
    {
      id: 'ORD-003',
      date: '2024-03-10',
      status: 'Processing',
      total: 15.99,
      items: ['BnB Yoga Tank Top']
    }
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur border-b border-white/10 bg-zinc-950/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 ring-1 ring-emerald-400/40 grid place-items-center">
              <span className="text-emerald-300 font-bold">BnB</span>
            </div>
            <span className="font-semibold tracking-wide">Broken Beauty</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
            <a className="hover:text-white" href="/">Home</a>
            <a className="hover:text-white" href="/products">Products</a>
            <a className="hover:text-white" href="/cart">Cart</a>
            <a className="hover:text-white text-emerald-300" href="/profile">Profile</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-emerald-300 font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-zinc-400">{user.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Member since</span>
                  <span>{user.memberSince}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total orders</span>
                  <span>{user.ordersCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Favorite category</span>
                  <span>{user.favoriteCategory}</span>
                </div>
              </div>

              <button className="w-full mt-6 rounded-xl bg-zinc-700 px-4 py-2 font-medium hover:bg-zinc-600 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">Order History</h1>

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <p className="text-zinc-400 text-sm">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' ? 'bg-green-500/20 text-green-300' :
                        order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Items:</h4>
                    <ul className="text-sm text-zinc-300 space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 rounded-xl bg-zinc-700 px-4 py-2 font-medium hover:bg-zinc-600 transition-colors">
                      View Details
                    </button>
                    <button className="rounded-xl border border-white/15 px-4 py-2 hover:bg-white/10 transition-colors">
                      Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {orders.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
                <p className="text-zinc-400 mb-6">Your order history will appear here.</p>
                <a
                  href="/products"
                  className="inline-block rounded-2xl bg-emerald-500 px-6 py-3 font-medium text-zinc-950 hover:bg-emerald-400 transition-colors"
                >
                  Start Shopping
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}