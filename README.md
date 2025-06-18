# SkyStay – Frontend

## Descripción general

SkyStay Frontend es la aplicación web de interfaz de usuario para la plataforma **SkyStay**, un portal integral de reservas de viajes que permite buscar y reservar vuelos y alojamientos (hoteles y apartamentos) desde un solo lugar. Está desarrollada con Next.js (React y TypeScript), ofreciendo una experiencia rápida e interactiva. La aplicación es **responsive**, soporta español e inglés y se comunica con el backend mediante una API REST para autenticación y gestión de reservas.

## Funcionalidades principales

* ### Búsqueda y reserva de vuelos

  1. Buscar vuelos por origen, destino, fechas y número de pasajeros.
  2. Visualizar detalles (aerolínea, horarios, precios) y seleccionar asientos.
  3. Confirmar reserva y recibir el billete electrónico en PDF por correo.

* ### Búsqueda y reserva de alojamientos

  1. Explorar hoteles y apartamentos según ubicación, fechas y número de huéspedes.
  2. Filtrar por precio, categoría y valoraciones.
  3. Reservar habitación y recibir factura en PDF por correo.

* ### Gestión de cuenta de usuario

  * Registro e inicio de sesión.
  * Perfil personal con pestañas de **Reservas**, **Favoritos** y **Reseñas**.
  * Cancelación de reservas y gestión de favoritos.

* ### Reseñas y calificaciones

  * Dejar y consultar reseñas tras la estancia.
  * Mostrar puntuaciones promedio y comentarios de otros usuarios.

* ### Favoritos

  * Marcar alojamientos como favoritos para guardar o comparar.

* ### Soporte multilingüe

  * Interfaz en español e inglés.
  * Cambio de idioma dinámico.

* ### Otras características

  * Navegación por destinos populares.
  * Indicadores de carga y estados de error.
  * Páginas de ayuda, contacto y legales (Aviso legal, Privacidad, Cookies).

## Tecnologías utilizadas

* **Next.js 13** (React + TypeScript)
* **Tailwind CSS** y PostCSS
* **React Context API** para estado global
* **JWT** para autenticación
* **Axios** o `fetch` para llamadas a la API
* **ESLint** y Prettier para calidad de código
* **Vercel** para despliegue

## Instalación

Asegúrate de tener **Node.js 18+**.

```bash
# Clonar el repositorio
git clone https://github.com/Rodrigorjc/SkyStay-Front.git
cd SkyStay-Front

# Instalar dependencias
npm install

# Crear archivo de variables de entorno (.env.local)
# Ejemplo:
# NEXT_PUBLIC_API_URL=http://localhost:8080/api
# NEXT_PUBLIC_OTHER_KEY=...

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación se iniciará en [http://localhost:3000](http://localhost:3000).

Para producción:

```bash
npm run build
npm start
```

## Uso

1. Abrir [http://localhost:3000](http://localhost:3000).
2. Buscar vuelos o alojamientos desde la página principal.
3. Seleccionar y reservar (requiere sesión).
4. Consultar perfil para ver reservas, favoritos y reseñas.
5. Cambiar idioma usando el selector ES/EN.

## Enlaces relevantes

* **Repositorio Backend:** [https://github.com/Noogues/SkyStay-Back](https://github.com/Noogues/SkyStay-Back)
* **Sitio desplegado:** [https://sky-stay-front.vercel.app](https://sky-stay-front.vercel.app)

## Autores y créditos

* **Rodrigo (Rodrigorjc)** – Desarrollador Full-Stack
* **Antonio Nogués (Noogues)** – Desarrollador Full-Stack

Gracias por usar **SkyStay**. ¡Disfruta de tu viaje!
