'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function HeroSection() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Three.js setup for 3D background
    const scene = new (require('three')).Scene();
    const camera = new (require('three')).PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new (require('three')).WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (canvasRef.current) {
      canvasRef.current.appendChild(renderer.domElement);
    }

    // GSAP animations
    gsap.to('.hero-title', {
      duration: 1.5,
      opacity: 1,
      y: 0,
      ease: 'power3.out'
    });

    return () => {
      if (canvasRef.current && renderer.domElement.parentNode === canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={canvasRef} className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <motion.h1
          className="hero-title text-6xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to Anime Blog
        </motion.h1>

        <motion.p
          className="text-2xl text-center max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Discover amazing anime characters, read reviews, and join the community
        </motion.p>

        <motion.button
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-lg font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Now
        </motion.button>
      </div>
    </div>
  );
}