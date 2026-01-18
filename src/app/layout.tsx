import "./globals.css";

export const metadata = {
  title: "Knit Tracker",
  description: "Track knitting projects and progress logs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
    <body>{children}</body>
    </html>
  );
}
