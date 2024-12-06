import { Toaster } from "react-hot-toast";
import Script from "next/script";
import "@/app/styles/global.css";
import {
  PoppinsBlack,
  PoppinsBold,
  PoppinsExtraBold,
  PoppinsExtraLight,
  PoppinsLight,
  PoppinsMedium,
  PoppinsRegular,
  PoppinsSemiBold,
  PoppinsThin,
} from "@/app/fonts/font";




export const metadata = {
  metadataBase: new URL("https://slimpath.vercel.app/"),
  title: "slimpath - A smarter way to slim down",
  applicationName: "slimpath",
  author: "slimpath",
  images:
    "https://raw.githubusercontent.com/DarknessMonarch/slimpath/refs/heads/master/public/assets/banner.png",
  description:
    "slimpath helps you lose weight smartly by tracking calories in and out. With precise calculations, it makes meal tracking, goal-setting, and staying on track easy for a healthier, slimmer you.",
  metadataBase: new URL("https://slimpath.vercel.app/"),
  keywords: [
    "slimpath",
    "slim",
    "weight",
    "weight loss",
    "weight management",
    "weight management app",
    "weight management website",
    "weight loss app",
    "weight loss website",
    "slim app",
    "slim website",
    "health",
    "health tips",
    "health tips app",
    "health tips website",
    "health management",
    "health management app",
    "health management website",
    "health management tips",
    "health management tips app",
    "health management tips website",
    "health management tips app",
  ],
  openGraph: {
    title: "slimpath - A smarter way to slim down",
    description:
      "",
    url: "https://slimpath.vercel.app/",
    siteName: "slimpath",
    images:
      "https://raw.githubusercontent.com/DarknessMonarch/slimpath/refs/heads/master/public/assets/banner.png",
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0a0e1a" />
        <head>
          <Script
            async
            src={`https://www.paypal.com/sdk/js?client-id=AecSsqZBM68JtGP4BOA4Agcdk4cDGldQJwYoU83Ig4VM7ItL6Tou_wVnixLw2d0ouZf2ap30kjv4dB-J`}
          ></Script>
        </head>
      </head>
      <body className={`
      ${PoppinsBlack.variable}
       ${PoppinsBold.variable} 
       ${PoppinsExtraBold.variable}
        ${PoppinsExtraLight.variable}
         ${PoppinsLight.variable} 
         ${PoppinsMedium.variable} 
         ${PoppinsRegular.variable} 
         ${PoppinsSemiBold.variable}
          ${PoppinsThin.variable}`}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            className: "",
            duration: 8000,
            style: {
              background: "#fe692f",
              color: "#ffffff",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
