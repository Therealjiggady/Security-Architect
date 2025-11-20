import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "./components/ui/navigation-menu";
import { cn } from "./lib/utils";
import { MetaTags } from "./components/SEO/MetaTags";
import { OrganizationSchema, WebsiteSchema } from "./components/SEO/StructuredData";
import { getPageSEO } from "./config/seo";

export default function LandingPage() {
  const seoData = getPageSEO('home');

  return (
    <div className="min-h-screen text-foreground">
      {/* SEO Meta Tags */}
      <MetaTags
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        type="website"
      />
      
      {/* Structured Data */}
      <OrganizationSchema />
      <WebsiteSchema />

      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="skip-to-content sr-only-focusable"
        style={{
          position: 'absolute',
          top: '-100px',
          left: '0',
          background: '#1D4ED8',
          color: 'white',
          padding: '12px 16px',
          textDecoration: 'none',
          fontWeight: 'bold',
          zIndex: 10000,
          transition: 'top 0.3s ease'
        }}
        onFocus={(e) => { e.target.style.top = '0'; }}
        onBlur={(e) => { e.target.style.top = '-100px'; }}
      >
        Skip to main content
      </a>
      {/* Background Video */}
      <video
        src="/Thats her.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      />
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur border-b border-border bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/20 ring-1 ring-primary/40 grid place-items-center">
              <span className="text-primary font-bold">BnB</span>
            </div>
            <span className="font-semibold tracking-wide">Broken Beauty</span>
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a className={cn(navigationMenuTriggerStyle(), "cursor-pointer")} href="#features">
                    Features
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link className={cn(navigationMenuTriggerStyle(), "cursor-pointer")} to="/products">
                    Products
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link className={cn(navigationMenuTriggerStyle(), "cursor-pointer")} to="/cart">
                    Cart
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link className={cn(navigationMenuTriggerStyle(), "cursor-pointer")} to="/chat">
                    Chat
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link className={cn(navigationMenuTriggerStyle(), "cursor-pointer")} to="/profile">
                    Profile
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Link to="/login" className="rounded-xl bg-secondary px-3 py-2 text-sm text-secondary-foreground hover:bg-secondary/80">Sign In</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" role="banner" aria-labelledby="hero-heading">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-16 right-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              New • SmartFit size helper
            </span>
            <h1 id="hero-heading" className="mt-3 text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
              Live Bold <br /> Move Free.
              <br />
            </h1>
            <p className="mt-4 text-white/90 md:text-lg">
              From workouts to workdays — every butterfly has its perfect balance.

              Find yours in sports bras, shorts, and scrubs with sizing made simple and shipping made quick
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/products">
                <Button size="lg" className="shadow-lg shadow-primary/25">
                  Shop the collection
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg">
                  Learn more
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="main-content" tabIndex="-1" style={{ outline: 'none' }}>
        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-14 md:py-20" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">Key Features</h2>
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
            <Card key={i} className="bg-card/5">
              <CardHeader>
                <div className="mb-3 h-10 w-10 rounded-xl bg-primary/15 ring-1 ring-primary/30 grid place-items-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{f.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Products placeholder */}
      <section id="products" className="mx-auto max-w-6xl px-4 pb-20" aria-labelledby="products-heading">
        <div className="mb-6 flex items-end justify-between">
          <h2 id="products-heading" className="text-2xl font-semibold tracking-tight">Featured Products</h2>
          <Link
            to="/products"
            className="text-sm text-primary hover:text-primary/80"
            aria-label="View all products in our complete collection"
          >
            View all
          </Link>
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
              img: "Ambs.png",
            },
          ].map((p, i) => (
            <Card key={i} className="group overflow-hidden bg-card/5" role="article" aria-labelledby={`product-title-${i}`}>
              <CardHeader>
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={`${p.name} - ${p.tag} in high-quality activewear material, showing style and fit`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <h3 id={`product-title-${i}`} className="font-medium">{p.name}</h3>
                  <span className="text-primary" aria-label={`Price: ${p.price}`}>
                    {p.price}
                    <span className="sr-only">dollars</span>
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.tag}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    className="flex-1"
                    aria-label={`Add ${p.name} to shopping cart`}
                  >
                    Add to cart
                  </Button>
                  <Button
                    variant="outline"
                    aria-label={`View details for ${p.name}`}
                  >
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </section>
      </main>

      {/* CTA */}
      <section id="cta" className="border-t border-border bg-background/40 py-16" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h3 id="cta-heading" className="text-2xl font-semibold">Ready to feel the difference?</h3>
          <p className="mt-2 text-muted-foreground">
            Start with our best-sellers and get personalized tips from SmartFit.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/products">
              <Button size="lg" aria-label="Get started shopping our activewear collection">
                Get started
              </Button>
            </Link>
            <a href="#features">
              <Button
                variant="outline"
                size="lg"
                aria-label="Learn more about Broken Beauty features and benefits"
              >
                Why Broken Beauty?
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50" role="contentinfo" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Footer Navigation and Information</h2>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-primary grid place-items-center">
                  <span className="text-primary-foreground text-xs font-bold">BnB</span>
                </div>
                <span className="font-semibold">Broken Beauty</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Live bold, move free with our smart sizing and premium comfort.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Shop</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link to="/products" className="block hover:text-foreground" aria-label="Browse our complete product collection">Products</Link>
                <a href="#features" className="block hover:text-foreground" aria-label="Learn about our key features and benefits">Features</a>
                <Link to="/cart" className="block hover:text-foreground" aria-label="View your shopping cart">Cart</Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground" aria-label="View our comprehensive size guide">Size Guide</a>
                <a href="#" className="block hover:text-foreground" aria-label="Learn about shipping options and delivery times">Shipping</a>
                <a href="#" className="block hover:text-foreground" aria-label="Read our returns and exchange policy">Returns</a>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground" aria-label="Learn about Broken Beauty's story and mission">About</a>
                <a href="#" className="block hover:text-foreground" aria-label="Contact our customer support team">Contact</a>
                <a href="#" className="block hover:text-foreground" aria-label="Read our privacy policy">Privacy</a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Broken Beauty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}