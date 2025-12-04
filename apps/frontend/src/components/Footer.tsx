import React from 'react'

export default function Footer(){
  return (
    <footer className="w-full mt-8 py-6">
      <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} CryptoAlert 
      </div>
    </footer>
  )
}
