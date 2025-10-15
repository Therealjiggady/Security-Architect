import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur border-b border-white/10 bg-zinc-950/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 ring-1 ring-emerald-400/40 grid place-items-center">
              <span className="text-emerald-300 font-bold">BnB</span>
            </div>
            <span className="font-semibold tracking-wide">Broken Beauty</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
            <a className="hover:text-white" href="#features">Features</a>
            <Link className="hover:text-white" to="/products">Products</Link>
            <Link className="hover:text-white" to="/cart">Cart</Link>
            <Link className="hover:text-white" to="/profile">Profile</Link>
          </nav>
          <Link to="/login" className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20">Sign In</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-16 right-8 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              New • SmartFit size helper
            </span>
            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Live Bold <br /> Move Free.
              <br />
            </h1>
            <p className="mt-4 text-zinc-300 md:text-lg">
              From workouts to workdays — every butterfly has its perfect balance. 
              
              Find yours in sports bras, shorts, and scrubs with sizing made simple and shipping made quick
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/products" className="rounded-2xl bg-emerald-500 px-6 py-3 font-medium text-zinc-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400">
                Shop the collection
              </Link>
              <a href="#features" className="rounded-2xl border border-white/15 px-6 py-3 font-medium text-white hover:bg-white/10">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "SmartFit guidance",
              desc: "Clear, simple fit suggestions so you choose once and feel great all day.",
            },
            {
              title: "Comfort fabrics",
              desc: "Soft, breathable materials designed for movement and durability.",
            },
            {
              title: "Fast checkout",
              desc: "Secure payments with a streamlined cart. In and out in seconds.",
            },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
              <div className="mb-3 h-10 w-10 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/30 grid place-items-center">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products placeholder */}
      <section id="products" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Featured Products</h2>
          <Link to="/products" className="text-sm text-emerald-300 hover:text-emerald-200">View all</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "BnB Sport Bra – Black",
              price: "$11.99",
              tag: "Sports Bras",
              img: "sports_bra.png",
            },
            {
              name: "BnB Biker Short – Grey",
              price: "$9.99",
              tag: "Biker Shorts",
              img: "Grey fit.png",
            },
            {
              name: "BnB Scrub Top",
              price: "$33.99",
              tag: "Scrubs",
              img: "Scrubs2.png",
            },
          ].map((p, i) => (
            <div key={i} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{p.name}</h3>
                  <span className="text-emerald-300">{p.price}</span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">{p.tag}</p>
                <div className="mt-4 flex items-center gap-2">
                  <button className="w-full rounded-xl bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400">Add to cart</button>
                  <button className="rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/10">Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="border-t border-white/10 bg-zinc-950/40 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h3 className="text-2xl font-semibold">Ready to feel the difference?</h3>
          <p className="mt-2 text-zinc-300">
            Start with our best-sellers and get personalized tips from SmartFit.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/products" className="rounded-2xl bg-emerald-500 px-6 py-3 font-medium text-zinc-950 hover:bg-emerald-400">Get started</Link>
            <a href="#features" className="rounded-2xl border border-white/15 px-6 py-3 font-medium text-white hover:bg-white/10">Why Broken Beauty?</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-400">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p>© {new Date().getFullYear()} Broken Beauty. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a className="hover:text-zinc-200" href="#">Privacy</a>
              <a className="hover:text-zinc-200" href="#">Terms</a>
              <a className="hover:text-zinc-200" href="#">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}