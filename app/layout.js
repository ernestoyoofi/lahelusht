import App from "./App"
import "./globals.css"

export const metadata = {
  title: "Lahelu Short (Beta)",
  description: "Meme dari lahelu dengan format video pendek, situs ini tidak berkerja sama tetapi semua sumber berasal dari lahelu.com",
}

export default function RootLayout({ children }) {
  return <html lang="id">
    <body>
      <App>{children}</App>
    </body>
  </html>
}
