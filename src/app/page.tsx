'use client';

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css"
import dynamic from 'next/dynamic'
import { RecoilRoot, atom } from "recoil";
import About from "@/components/about";

const Clock = dynamic(() => import('../components/clock'), { ssr: false });
const Footer = dynamic(() => import('../components/footer'), { ssr: false });
const Settings = dynamic(() => import('../components/settings'), { ssr: false });

export default function MainPage() {
  return (
    <>
      <RecoilRoot>
        <About />
        <Clock />
        <Settings />
        <Footer />
      </RecoilRoot>
    </>
  )
}
