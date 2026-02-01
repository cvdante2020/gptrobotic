import "../styles/globals.css"; // ajusta la ruta si tu archivo está en otro lado
import React from "react";
import Navbar from "../src/components/Navbar"; // ajusta si cambia

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-950 text-white min-h-screen">
        
        {children}
      </body>
    </html>
  );
}
