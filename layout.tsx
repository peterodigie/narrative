import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Music Collection Manager',
  description: 'Analyze and optimize your music playlists',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 min-h-screen`}>
        <header className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Music Collection Manager</h1>
          </div>
        </header>
        {children}
        <footer className="bg-gray-800 text-white py-6 mt-12">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm">
              Music Collection Manager - Created on April 25, 2025
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
