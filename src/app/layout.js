import "./globals.css";
import ThemeRegistry from "@/lib/ThemeRegistry";
import ReduxProvider from "@/lib/ReduxProvider"; // ✅ New wrapper component

export const metadata = {
  title: "RR_Traders",
  description: "E-commerce RR_Traders",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ThemeRegistry>
          <ReduxProvider>
            <main className="flex-grow container mx-auto">{children}</main>
          </ReduxProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
