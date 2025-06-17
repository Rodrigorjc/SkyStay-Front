"use client";
import Footer from "@/app/components/ui/Footer";
import Navbar from "@/app/components/ui/Navbar";
import Navigation from "@/app/components/ui/Navigation";
import { useDictionary, useLanguage } from "@/app/context/DictionaryContext";
import React from "react";

export default function LegalPage() {
  const { dict } = useDictionary();
  const lang = useLanguage();
  if (!dict) return null;

  return (
    <div className="bg-gradient-to-t from-glacier-950 via-zinc-900 to-glacier-900 bg-blend-exclusion">
      <Navbar />
      <Navigation />
      <main>
        <div className="text-white max-w-[1800px] max-lg:mx-10 mx-auto py-12 space-y-10">
          {lang === "en" ? (
            <div className="space-y-10">
              <h1 className="text-4xl font-bold">Legal Notice, Terms of Service, Privacy Policy & Cookie Policy</h1>

              <section>
                <h2 className="text-2xl font-semibold mb-2">1. Legal Notice</h2>
                <p>
                  This website is operated by <strong>SkyStay</strong>, a company based in Spain. Registered address:
                  <br />
                  <strong>C/ Tetuán 36, 41001 Seville, Spain</strong>
                  <br />
                  Email:{" "}
                  <a href="mailto:skystay.info.eu@gmail.com" className="underline">
                    skystay.info.eu@gmail.com
                  </a>
                  <br />
                  Phone:{" "}
                  <a href="tel:+34682319080" className="underline">
                    +34 682 319 080
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-2">2. Terms of Service</h2>
                <p>
                  By accessing this website, you agree to comply with these terms and applicable laws. SkyStay reserves the right to modify or discontinue services or content without prior notice.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Users must not engage in any unlawful, fraudulent, or harmful activities.</li>
                  <li>All content (text, graphics, code, etc.) is protected by copyright and may not be reused without permission.</li>
                  <li>We reserve the right to restrict access, block IPs, or delete user data in case of violations.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-2">3. Privacy Policy</h2>
                <p>
                  We are committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR - EU 2016/679). Any information you provide via contact forms,
                  bookings, or communications will be treated confidentially.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong>Data Controller:</strong> SkyStay
                  </li>
                  <li>
                    <strong>Purpose:</strong> To manage your requests, provide services, and ensure communication.
                  </li>
                  <li>
                    <strong>Legal Basis:</strong> User consent and/or contractual relationship.
                  </li>
                  <li>
                    <strong>Storage Period:</strong> Data will be stored for the minimum time necessary to fulfill the intended purpose.
                  </li>
                  <li>
                    <strong>Rights:</strong> You can access, rectify, or delete your data by emailing us at{" "}
                    <a href="mailto:skystay.info.eu@gmail.com" className="underline">
                      skystay.info.eu@gmail.com
                    </a>
                    .
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-2">4. Cookie Policy</h2>
                <p>This website uses cookies to enhance the user experience, gather analytics, and improve content. Cookies are small files stored in your browser.</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong>Technical Cookies:</strong> Essential for website operation.
                  </li>
                  <li>
                    <strong>Analytical Cookies:</strong> Help us understand user behavior (e.g., Google Analytics).
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> Store user preferences like language or location.
                  </li>
                </ul>
                <p className="mt-2">You may accept, reject, or configure cookies at any time through your browser settings or upon visiting the site.</p>
              </section>
            </div>
          ) : (
            <div className="space-y-10">
              <h1 className="text-4xl font-bold">Aviso Legal, Términos de Servicio, Política de Privacidad y Cookies</h1>

              <section>
                <h2 className="text-2xl font-semibold mb-2">1. Aviso Legal</h2>
                <p>
                  Este sitio web es operado por <strong>SkyStay</strong>, con domicilio social en:
                  <br />
                  <strong>C/ Tetuán 36, 41001 Sevilla, España</strong>
                  <br />
                  Correo electrónico:{" "}
                  <a href="mailto:skystay.info.eu@gmail.com" className="underline">
                    skystay.info.eu@gmail.com
                  </a>
                  <br />
                  Teléfono:{" "}
                  <a href="tel:+34682319080" className="underline">
                    +34 682 319 080
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-2">2. Términos de Servicio</h2>
                <p>
                  Al acceder a este sitio, aceptas cumplir con estos términos y con la legislación vigente. SkyStay se reserva el derecho de modificar o discontinuar servicios o contenidos sin previo
                  aviso.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Los usuarios no deben participar en actividades ilegales, fraudulentas o dañinas.</li>
                  <li>Todo el contenido (textos, gráficos, código, etc.) está protegido por derechos de autor y no puede reutilizarse sin autorización.</li>
                  <li>Nos reservamos el derecho de restringir el acceso, bloquear IPs o eliminar datos en caso de incumplimientos.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-2">3. Política de Privacidad</h2>
                <p>
                  Nos comprometemos a proteger tus datos personales conforme al Reglamento General de Protección de Datos (RGPD - UE 2016/679). Toda información facilitada mediante formularios,
                  reservas o comunicaciones será tratada de forma confidencial.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong>Responsable del tratamiento:</strong> SkyStay
                  </li>
                  <li>
                    <strong>Finalidad:</strong> Gestionar solicitudes, prestar servicios y facilitar la comunicación.
                  </li>
                  <li>
                    <strong>Base legal:</strong> Consentimiento del usuario y/o relación contractual.
                  </li>
                  <li>
                    <strong>Plazo de conservación:</strong> El mínimo necesario para cumplir con la finalidad.
                  </li>
                  <li>
                    <strong>Derechos:</strong> Acceder, rectificar o suprimir los datos escribiendo a{" "}
                    <a href="mailto:skystay.info.eu@gmail.com" className="underline">
                      skystay.info.eu@gmail.com
                    </a>
                    .
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-2">4. Política de Cookies</h2>
                <p>
                  Este sitio utiliza cookies para mejorar la experiencia del usuario, analizar estadísticas y optimizar el contenido. Las cookies son archivos pequeños que se almacenan en tu
                  navegador.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong>Cookies técnicas:</strong> Necesarias para el funcionamiento del sitio.
                  </li>
                  <li>
                    <strong>Cookies de análisis:</strong> Nos ayudan a comprender cómo navegas (por ejemplo, Google Analytics).
                  </li>
                  <li>
                    <strong>Cookies de preferencias:</strong> Guardan configuraciones como idioma o región.
                  </li>
                </ul>
                <p className="mt-2">Puedes aceptar, rechazar o configurar las cookies en cualquier momento desde los ajustes del navegador o al visitar el sitio.</p>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
