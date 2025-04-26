"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input"; // Importa el componente de ShadcnUI
import { Button } from "@/components/ui/button"; // Botón de ShadcnUI
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/GlobalRedux/Features/auth/authSlice";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {

      let form = {
        "email": email,
        "password": password
      }
      const response = await fetchData(endpoints.auth_login(), {
        method: 'POST',
        body: JSON.stringify(form),
      });
    
      //actualiza el estado global con la información del usuario
      dispatch(setUser(response.data.user));

      //Redirige al usuario a la ruta adecuada
      if (response.data.user.role.scope === 'global') {
        router.push('/admin/dashboard');
      } else if (response.data.user.role.scope === 'agency') {
        router.push('/ota/dashboard');
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
            <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (<span className="w-4 h-4 border-[1.5px] border-white border-t-transparent rounded-full animate-spin"></span>) : "Iniciar sesión"}
          </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          
          <Button variant="link" onClick={() => router.push("/auth/forgot-password")}>
            ¿Olvidaste tu contraseña?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
