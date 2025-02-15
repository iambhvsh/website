'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FiMenu, FiX, FiDownload } from 'react-icons/fi'
import { SITE_DATA } from '../../lib/shared'
import { usePWA } from './PWA'

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { showInstallPrompt } = usePWA()

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-xl z-50 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            <Link href="/" className="text-2xl font-bold duration-300 hover:text-zinc-500">iambhvsh</Link>
            
            {/* Hamburger Button */}
            <button 
              type="button"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Overlay */}
      <div 
        className={`${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        } fixed top-[55px] left-0 right-0 bottom-0 z-40 bg-black/50 backdrop-blur-xl text-white transition-all duration-200 ease-out transform-gpu`}
      >
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-2">
          {SITE_DATA.pages.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.path 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
          <button onClick={showInstallPrompt} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white">
            <FiDownload className="w-5 h-5" />
            Install App
          </button>
        </div>
      </div>
    </>
  )
}

