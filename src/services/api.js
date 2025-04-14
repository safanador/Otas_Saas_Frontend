import { toast } from "@/hooks/use-toast";

const handleResponse = async (response) => {
  if (response.status === 401) {
    window.location.href = '/auth/login';
    return null;
  }
  if (response.status === 403) {
    window.location.href = '/admin/unauthorized';
    return null;
  }
  if (!response.ok) {
    const errorData = await response.json();
    return { error: errorData.message };
  }
  return response.json();
};

export const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Uh oh! Parece que algo salió mal.",
      description: "No se pudo conectar con el servidor. Por favor, intenta más tarde.",
    });
  }
};