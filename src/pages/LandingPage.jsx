import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import About from '../components/landing/About';
import Pricing from '../components/landing/Pricing';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
 return (
 <div className="min-h-screen bg-gray-50 font-sans text-brand-dark flex flex-col">
 <Navbar />
 
 <main className="flex-1">
 <Hero />
 <About />
 <Features />
 <Pricing />
 </main>
 
 <Footer />
 </div>
 );
}
