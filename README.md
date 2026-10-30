# 🕹️ Amigatronic Arcade

> **Videojuego arcade retro de terror y supervivencia para Web y Móvil (Android)**, desarrollado con **React 19**, **Vite**, **Tailwind CSS** y empaquetado nativo con **Capacitor 7**.

---

## 📖 Descripción del Proyecto

**Amigatronic Arcade** combina la jugabilidad clásica de laberintos de los 80s (al estilo arcade/Pac-Man/survival) con una atmósfera oscura y retro de horror animatrónico. El jugador debe infiltrarse en sectores abandonados, rescatar supervivientes humanos, destruir barricadas y escapar de entidades hostiles mientras recolecta pizzas para recuperar vidas.

Cuenta con un motor de audio sintético procedural de 8 bits (sin archivos de audio externos pesados), efectos visuales de monitor CRT con scanlines y viñetas personalizables, controles táctiles optimizados para pantallas móviles y persistencia local de récords y progreso.

---

## ✨ Características Principales

- **🎮 10 Niveles de Desafío Progresivo:**
  - Laberintos estratégicos (11x11) con dificultad escalable: *Cripta Inicial, Pasillos de Mantenimiento, Cocina de Pizzería, Calderas, Zona de Seguridad, Laboratorio Secreto, Nido Mecánico, Bahía de Carga, Almacén Maldito y Núcleo Amigatronic*.
- **🧱 Mecánicas Interactivas:**
  - Rescate de supervivientes humanos.
  - Paredes y barricadas destructibles.
  - Items especiales: Rebanadas de pizza (+1 Vida) y multiplicadores de puntuación.
  - Entidades animatrónicas hostiles con patrones de persecución.
- **📱 Optimización Móvil y Multiplataforma:**
  - D-Pad virtual táctil responsivo y botones de acción en pantalla.
  - Soporte completo para teclado en escritorio (Flechas direccionales / WASD / Barra Espaciadora).
  - Configuración optimizada de viewport y safe areas (sin scroll ni gestos accidentales).
- **📺 Estética Retro CRT:**
  - Filtro visual conmutador de líneas de escaneo (Scanlines CRT) y viñeta arcade.
  - Paleta de colores temáticos (*blood*, *toxic neon*, *crt green*, *dark metal*).
- **🔊 Motor de Audio Procedural 8-bit:**
  - Sintetizador nativo basado en Web Audio API para generación en tiempo real de bips, explosiones, alertas, fanfarrias y melodías retro sin dependencias externas.
  - Control de silenciado y persistencia de preferencias de volumen.
- **💾 Persistencia de Datos y Estadísticas:**
  - Guardado en `localStorage` del progreso de niveles desbloqueados.
  - Registro de récords (High Scores) y panel de estadísticas globales (partidas jugadas, puntuaciones máximas).
  - Menú de ajustes avanzados: selector de vidas iniciales (1 a 5) y opción para restablecer datos de fábrica.

---

## 🗂️ Arquitectura del Repositorio

```text
amigatronic/
├── android/                   # Proyecto nativo generado por Capacitor para Android Studio
├── dist/                      # Salida de compilación optimizada para producción
├── src/
│   ├── App.jsx                # Enrutador principal, control de pantallas y ciclo de vida
│   ├── main.jsx               # Punto de entrada de React 19
│   ├── index.css              # Estilos globales, animaciones y efectos CRT (scanlines, vignette)
│   ├── components/
│   │   ├── MainMenu.jsx       # Portada principal con logo animado, acceso a récords y ajustes
│   │   ├── LevelSelect.jsx    # Selector interactivo de sectores y niveles desbloqueados
│   │   ├── GameLevel.jsx      # Motor central del juego en Canvas, bucle de renderizado y lógica
│   │   ├── GameScreen.jsx     # HUD de partida, puntuación en tiempo real y vidas
│   │   ├── GameOver.jsx       # Pantalla de derrota/fin de partida con desglose de puntos
│   │   ├── SettingsModal.jsx  # Modal de configuración (audio, CRT scanlines, vidas iniciales)
│   │   └── HighScoresModal.jsx# Panel de mejores puntuaciones y estadísticas del jugador
│   └── utils/
│       ├── audio.js           # Sintetizador procedural 8-bit (Web Audio API)
│       └── storage.js         # Módulo de persistencia local (progreso, récords, ajustes)
├── capacitor.config.json      # Configuración del contenedor nativo móvil (App ID, rutas, esquemas)
├── tailwind.config.js         # Tema personalizado (fuentes pixel, sombras CRT, paleta de colores)
├── vite.config.js             # Configuración del bundler Vite
├── package.json               # Dependencias del proyecto y scripts
└── README.md                  # Documentación del proyecto
```

---

## 🕹️ Controles

| Acción | Móvil (Táctil) | Teclado (Desktop) |
| :--- | :--- | :--- |
| **Moverse (Arriba / Abajo / Izquierda / Derecha)** | D-Pad virtual en pantalla | `W`/`S`/`A`/`D` o Flechas |
| **Pausar / Reanudar** | Botón de pausa en HUD superior | Tecla `P` o `Escape` |
| **Alternar CRT Scanlines** | Interruptor rápido inferior | Clic en botón `CRT: ON/OFF` |

---

## 🛠️ Tecnologías Utilizadas

- **Núcleo:** [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS 3.4](https://tailwindcss.com/) + PostCSS + CSS CRT Filters
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Audio:** Web Audio API (Sintetizador 8-bit analógico procedural)
- **Empaquetado Móvil:** [Capacitor 7](https://capacitorjs.com/) (Android Bridge)

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos

- **Node.js** (versión 18 o superior recomendada)
- **npm** o gestor de paquetes preferido

### 1. Clonar el repositorio

```bash
git clone git@github.com:dynamicbytes-dev/amigatronic.git
cd amigatronic
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El juego estará disponible en tu navegador en `http://localhost:5173`. Para probar en un dispositivo móvil en la misma red local, ejecuta:

```bash
npm run dev -- --host
```

### 4. Compilar para producción (Web)

```bash
npm run build
```

Genera los archivos estáticos optimizados en la carpeta `/dist`.

---

## 📱 Compilación y Empaquetado para Android

El proyecto incluye la integración completa con **Capacitor 7** para generar el APK o Android App Bundle (AAB):

### 1. Compilar web y sincronizar con Android

```bash
npm run build:android
```
*(Este comando ejecuta `npm run build` y luego `npx cap sync android`)*

### 2. Abrir el proyecto en Android Studio

```bash
npm run cap:open:android
```

Desde Android Studio podrás:
- Conectar un dispositivo físico mediante depuración USB o iniciar un emulador AVD.
- Ejecutar la aplicación directamente con **Run 'app'**.
- Generar el APK firmado desde **Build > Generate Signed Bundle / APK**.

---

## 📜 Licencia y Autoría

Desarrollado para el ecosistema **Amigatronic Arcade**.  
Repositorio oficial: [dynamicbytes-dev/amigatronic](https://github.com/dynamicbytes-dev/amigatronic.git)
