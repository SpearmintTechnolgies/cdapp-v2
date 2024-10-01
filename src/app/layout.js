import { Inter } from "next/font/google";
import "./globals.css";
import  "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import localFont from "next/font/local"
// import { headers } from 'next/headers';
// import { Footer } from "@/components/common/Footer";


import { Providers } from "../Provider";
import { Navbar } from "../components/common/Navbar";

const inter = Inter({ subsets: ["latin"] });
const tomy = localFont({
  src:[
    {
      path: "./font/MADE_TOMMY_MEDIUM_PERSONAL_USE.otf",
      weight:"600"
    },
    {
      path: "./font/MADE_TOMMY_REGULAR_PERSONAL_USE.otf",
      weight:"400"
    }
  ],
  variable:"--font-tomy"
})
const odor = localFont({
  src:[{path:"./font/ODORMEANCHEY_REGULAR.ttf",weight:"400"}],
  variable:'--font-odor'
})
export const metadata = {
  title: "$cPUMP - The Ultimate Memecoin on Core Chain | Launch, Trade & Earn",
  description: "Join the $cPUMP revolution on Core Chain! Instantly launch your own memecoins, trade effortlessly, and stake to earn rewards. Don’t miss out on the next big thing in DeFi and memecoins—experience the future of crypto with $cPUMP today!",
};

export default function RootLayout({ children}) {

  return (
    <html lang="en">
      <body className={`${inter.className} ${tomy.variable} ${odor.variable}`}>
      <Providers>
        <Navbar/>
        {children}
        </Providers>
        {/* <Footer/> */}
      </body>
    </html>
  );
}
