"use client";
import { HelpCircle, Mail, ChevronDown } from "lucide-react";
import { useState } from "react";
import Layout from "@/app/agency/components/layout/layout";

const faqs = [
  {
    question: "¿Cómo sincronizo mis tours con los canales de venta?",
    answer:
      'Ve a la sección "Canales" y conecta cada plataforma siguiendo los pasos. Luego asigna tus tours a cada canal.',
  },
  {
    question: "¿Qué hago si una reserva no se sincroniza correctamente?",
    answer:
      'Revisa el estado de la conexión en "Canales". Si persiste el problema, usa la opción "Forzar sincronización" o contacta a soporte.',
  },
  {
    question: "¿Puedo modificar el cupo de un tour después de publicarlo?",
    answer:
      'Sí, puedes editar la capacidad desde la sección "Tours" > "Horarios". Los cambios se sincronizarán automáticamente.',
  },
];

export default function HelpCenterPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <Layout title="Ayuda y Soporte">
      <div className="mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-blue-500" />
            Centro de Ayuda
          </h1>
          <p className="text-gray-500">
            Encuentra respuestas y soporte técnico
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full text-left"
                  >
                    <h3 className="font-medium text-gray-900">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        expandedFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                Contactar a soporte
              </h2>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Asunto
                  </label>
                  <select
                    id="subject"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  >
                    <option>Problema técnico</option>
                    <option>Consulta sobre facturación</option>
                    <option>Integración con canales</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
