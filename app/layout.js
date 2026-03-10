import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BridgePay | ซื้อขายสบายใจ จ่ายแค่ยี่สิบ",
  description: "Secure Your Deal with BridgePay. แพลตฟอร์มตัวกลางสร้างความมั่นใจในการซื้อขายออนไลน์ หักแค่ 20 บาท",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <main className="app-container">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
