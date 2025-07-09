import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Office Network Monitoring",
  description: "Office network monitoring application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
