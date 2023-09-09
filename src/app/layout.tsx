'use clinet';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'jPomo',
  description: 'Flexible pomodoro timer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children} </body>
      
      
      <footer className='footer'>
        <div className='container mx-0'>
          <a href="https://www.flaticon.com/free-icons/tomato" title="tomato icons">Tomato icons created by Flat Icons Design - Flaticon</a>
        </div>
      </footer>
    </html>
  )
}
