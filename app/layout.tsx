import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["latin", "thai"], // recommend to include 'thai' subset for Thai characters
  variable: "--font-noto-sans",
  weight: ["400", "700"], // optional: include weights you need
});

export const metadata: Metadata = {
  title: "Finny",
  description: "Your friendly guide to smarter investing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        cssLayerName: "clerk",
        baseTheme: [dark],
      }}
    >
      <html lang="en">
        <body className={`${notoSansThai.variable} antialiased`}>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Slide}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
