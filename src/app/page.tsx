'use client';

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css"
import dynamic from 'next/dynamic'
 
const Clock = dynamic(() => import('../components/clock'), { ssr: false })

export default function MainPage() {

  return (
    <>
      <Clock />
    </>
  )
}
