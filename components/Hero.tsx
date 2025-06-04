"use clint";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Hero = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const router = useRouter();

  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-gray-500 text-white px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Welcome to Kareem
          </h1>
          <p className="text-lg md:text-xl mb-6">Scroll down to learn more.</p>
          {!isLoggedIn && (
            <button
              onClick={() => router.push("/login")}
              className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition"
            >
              Get Started
            </button>
          )}
        </motion.div>
      </section>
      <section className="py-20 px-6 bg-gray-50 text-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Kareem</h2>
          <p className="text-lg md:text-xl text-gray-600">
            Kareem is a powerful platform built for modern web experiences. We
            help users connect and grow.
          </p>
        </div>
      </section>
      <section className="py-20 px-6 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              Secure Authentication
            </h3>
            <p>
              We use strong validation and secure flows like Zod + Redux
              Toolkit.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Modern UI</h3>
            <p>
              Built with Framer Motion, React Hook Form, and Tailwind CSS for a
              stunning interface.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
            <p>
              Fully responsive layout that adapts to all screen sizes without
              performance issues.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
