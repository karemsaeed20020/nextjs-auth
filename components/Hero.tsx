"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative w-full min-h-screen flex items-center bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-20 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 mb-6">
            <span className="text-sm font-medium">Trusted Since 2005</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            Premium <span className="text-emerald-600">Pharmacy</span> Care <br />For Your Family
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
            Your trusted partner for quality medications, health products, and personalized care from our expert pharmacists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => router.push("/products")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-emerald-200"
            >
              Browse Products
            </button>
            <button
              onClick={() => router.push("/services")}
              className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-600 px-8 py-4 rounded-lg text-lg font-medium transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Video
            </button>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white"></div>
                ))}
              </div>
              <span className="text-sm text-gray-600">500+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gray-600">4.9 (1200 Reviews)</span>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 relative">
          <div className="relative aspect-square w-full h-auto rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Friendly pharmacist helping customer"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="absolute -bottom-6 -right-6 bg-white px-6 py-3 rounded-lg shadow-lg border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="font-medium text-gray-800">24/7 Online Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute top-1/4 left-10 w-16 h-16 rounded-full bg-emerald-100 opacity-50"></div>
      <div className="hidden lg:block absolute bottom-1/3 right-20 w-24 h-24 rounded-full bg-blue-100 opacity-50"></div>
    </section>
  );
}
