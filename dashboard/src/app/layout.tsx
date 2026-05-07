import type { Metadata } from "next"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "TrafficDash – Dashboard de Resultados",
  description: "Sistema de relatórios para agências de marketing digital",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
