import React, { useState, useEffect } from 'react';
import { useUser } from './contexts/UserContext';

const API_BASE = 'http://localhost:8000';

export default function ProfilePage() {
  const { user: contextUser, updateProfile } = useUser();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    age: '',
    newsletterSubscribed: false
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (contextUser) {
      setUser(contextUser);
      setFormData({
        username: contextUser.username || '',
        age: contextUser.age || '',
        newsletterSubscribed: contextUser.newsletter_subscribed || false
      });
      fetchOrders();
    }
  }, [contextUser]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/orders/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const ordersData = await res.json();
        setOrders(ordersData);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = {
        username: formData.username || null,
        age: formData.age ? parseInt(formData.age) : null,
        newsletter_subscribed: formData.newsletterSubscribed
      };
      const updatedUser = await updateProfile(updates);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      age: user?.age || '',
      newsletterSubscribed: user?.newsletter_subscribed || false
    });
    setIsEditing(false);
  };


  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-xl">Please log in to view your profile.</div>
      </div>
    );
  }

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
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full mx-auto mb-4 flex items-center justify-center hover:ring-2 hover:ring-emerald-400 transition-all duration-300 cursor-pointer">
                  <span className="text-2xl text-emerald-300 font-bold">
                    {(user.full_name || user.email).split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold">{user.full_name || 'User'}</h2>
                <p className="text-zinc-400">{user.email}</p>
              </div>

              <div className="space-y-4">
                {user.username && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Username</span>
                    <span>@{user.username}</span>
                  </div>
                )}
                {user.age && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Age</span>
                    <span>{user.age}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-400">Member since</span>
                  <span>{new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total orders</span>
                  <span>{orders.length}</span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full mt-6 rounded-xl bg-zinc-700 px-4 py-2 font-medium hover:bg-zinc-600 transition-colors"
              >
                Edit Profile
              </button>
            </div>

            {/* Preferences Section */}
            <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Newsletter</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.newsletter_subscribed
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-zinc-600/20 text-zinc-400'
                  }`}>
                    {user.newsletter_subscribed ? 'Subscribed' : 'Not subscribed'}
                  </span>
                </div>
              </div>
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
                      <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                      <p className="text-zinc-400 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total_amount}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs capitalize ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        order.status === 'shipped' ? 'bg-blue-500/20 text-blue-300' :
                        order.status === 'paid' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Items:</h4>
                    <ul className="text-sm text-zinc-300 space-y-1">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          Product #{item.product_variant_id} (Qty: {item.quantity})
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

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors ${
                  formData.username ? 'text-emerald-400' : 'text-zinc-400'
                }`}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors ${
                  formData.age ? 'text-emerald-400' : 'text-zinc-400'
                }`}>
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="Enter age"
                  min="1"
                  max="120"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="newsletterSubscribed"
                  checked={formData.newsletterSubscribed}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <label className="text-sm text-zinc-300">
                  Subscribe to newsletter
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-xl border border-zinc-600 px-4 py-2 hover:bg-zinc-700 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-emerald-500 px-4 py-2 font-medium hover:bg-emerald-400 transition-colors disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}