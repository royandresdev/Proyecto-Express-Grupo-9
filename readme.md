# ConverSAFe - Chat con IA para la gestión de proyectos

<img width="1902" height="909" alt="image" src="https://github.com/user-attachments/assets/b230f388-db8a-4aaa-9e5f-b944075ac8d8" />


## 📖 Descripción

Una aplicación web que consiste en un chat con IA para ayudar a los usuarios a gestionar sus proyectos de manera más eficiente.

---

## 🚀 Demo 
Puedes ver una demostración en vivo de la aplicación en [este enlace](https://proyecto-express-grupo-9.vercel.app/).

---

## ✨ Funcionalidades
- Chat simple e intuitivo.
- Panel de análisis en tiempo real: Tono, participación y claridad.
- Diseño centrado en la experiencia del usuario.

---

## 🧠 Decisiones Técnicas

### 📦 ¿Por qué Vite?
Usé [Vite](https://vitejs.dev/) porque:
- Es un bundler moderno y rápido para aplicaciones web.
- Mejora el rendimiento de construcción y desarrollo en comparación con Webpack.

### 📚 ¿Por qué React?
Usé [React](https://reactjs.org/) porque:
- Es una biblioteca popular para construir interfaces de usuario.
- Permite crear componentes reutilizables y escalables.
- Facilita el manejo del estado y la lógica de la UI.

### 🎨 ¿Por qué TailwindCSS?
Usé [TailwindCSS](https://tailwindcss.com/) porque:
- Permite una construcción rápida y flexible de la UI.
- Facilita crear una interfaz profesional con clases utilitarias.

### 🗂️ ¿Por qué TypeScript?
Usé [TypeScript](https://www.typescriptlang.org/) porque:
- Proporciona tipado estático, lo que mejora la calidad del código.
- Facilita la detección temprana de errores y mejora la mantenibilidad del proyecto.
- Mejora la experiencia de desarrollo con autocompletado y documentación integrada.

### 🛠️ ¿Por qué Express?
Usé [Express](https://expressjs.com/) porque:
- Es un framework minimalista y flexible para Node.js.
- Permite crear APIs websocket de manera sencilla y rápida.

### 🌐 ¿Por qué Socket.IO? 
Usé [Socket.IO](https://socket.io/) porque:
- Facilita la comunicación en tiempo real entre el cliente y el servidor.
- Permite la implementación de funcionalidades como el chat en tiempo real.
- Es compatible con múltiples navegadores y dispositivos.

### ¿Por qué ShadCN?
Usé [ShadCN](https://ui.shadcn.com/) porque:
- Proporciona componentes de interfaz de usuario preconstruidos y personalizables.
- Facilita la creación de una UI atractiva y funcional sin necesidad de diseñar desde cero.
- Se integra bien con TailwindCSS, lo que permite una personalización rápida y eficiente.

---

## 📂 Estructura del Proyecto

```
src/
├── client/          # Código del cliente (React)
│   ├── src/
│   │   ├── assets/       # Activos estáticos (imágenes, fuentes, etc.)
│   │   ├── components/   # Componentes de React
│   │   ├── hooks/        # Hooks personalizados
│   │   ├── lib/          # Funciones y utilidades compartidas
│   │   ├── router/       # Configuración del enrutador
│   │   ├── services/     # Servicios y API calls
│   │   ├── store/        # Estado global y gestión de datos
│   │   ├── types/        # Tipos y definiciones de TypeScript
│   │   ├── App.tsx       # Componente principal de la aplicación
│   │   └── main.tsx      # Punto de entrada de la aplicación
│   └──────────────────────────────────────────────────────────────────
├── backend/         # Código del servidor (Node.js + Express)
│   ├── src/
│   │   ├── config/   # Configuración del servidor
│   │   ├── controllers/  # Controladores de las rutas
│   │   ├── lib/          # Funciones y utilidades compartidas
│   │   ├── models/       # Modelos de datos
│   │   ├── modules/      # Módulos de la API
│   │   ├── routes/       # Rutas de la API
│   │   ├── index.ts      # Punto de entrada del servidor
└──────────────────────────────────────────────────────────────────

```  

---

## ⚙️ Instalación local

1. Clona el proyecto:
   ```bash
   git clone https://github.com/royandresdev/Proyecto-Express-Grupo-9
   cd Proyecto-Express-Grupo-9
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Corre el proyecto en desarrollo:
   ```bash
   npm run dev
   ```

---

## 📝 Autores

**Roy Huaman**  
📫 [contact@royandresdev.com](mailto:contact@royandresdev.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/royhuamanavila/)  
💻 [Portafolio](https://royandresdev.com/) <br/>
🐈‍⬛ [GitHub](https://github.com/royandresdev)

**Santiago Usca**  
🐈‍⬛ [GitHub](https://github.com/santiago-dev0x0)

**Facundo Gomez**  
🐈‍⬛ [GitHub](https://github.com/ffffacu)

**Roly Ochoa**  
🐈‍⬛ [GitHub](https://github.com/kachamozo)

---

¡Gracias por revisar este proyecto! 🚀
