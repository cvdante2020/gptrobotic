"use client";

import { useState } from "react";

export default function LeadForm({ codigoRef }: { codigoRef: string }) {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", producto: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/register-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, codigoRef }),
    });

    alert("Gracias por tu interés");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" onChange={handleChange} placeholder="Nombre" required />
      <input name="email" type="email" onChange={handleChange} placeholder="Email" required />
      <input name="telefono" onChange={handleChange} placeholder="Teléfono" />
      <input name="producto" onChange={handleChange} placeholder="Producto de interés" />
      <button type="submit">Enviar</button>
    </form>
  );
}
