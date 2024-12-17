"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input"; // Importa el componente de ShadcnUI
import { Button } from "@/components/ui/button"; // Botón de ShadcnUI
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/api/v1/auth/login", {
        email,
        password,
      });
      
      // Supongamos que el backend retorna un token o algún dato relevante
      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Almacenar el token
        router.push("/dashboard"); // Redirigir al dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <Button onClick={handleLogin} className="w-full" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar sesión"}
          </Button>
          <Button variant="link" onClick={() => router.push("/app/auth/forgot-password")}>
            ¿Olvidaste tu contraseña?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
