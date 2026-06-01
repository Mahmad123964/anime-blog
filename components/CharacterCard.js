'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function CharacterCard({ character }) {
  useEffect(() => {
    gsap.to('.card', {
      duration: 0.5,
      opacity: 1,
      y: 0
    });
  }, []);

  return (
    <motion.div
      className="card bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
      whileHover={{ scale: 1.05, rotateY: 5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden h-64">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-purple-600 px-3 py-1 rounded-full text-white text-sm">
          {character.anime}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{character.name}</h3>
        <p className="text-gray-400 mb-3 line-clamp-2">{character.description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-yellow-400 font-semibold">⭐ {character.rating.toFixed(1)}</span>
          <span className="text-gray-500 text-sm">{character.views} views</span>
        </div>

        <div className="flex gap-2">
          <motion.button
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            View
          </motion.button>
          <motion.button
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            Rate
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}