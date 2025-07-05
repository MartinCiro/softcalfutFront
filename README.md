# Scrapping Front

## Descripción
Interfaz de usuario para el sistema de gestión de facturas y clientes. Esta aplicación frontend se conecta con el backend para proporcionar una interfaz amigable para la visualización y gestión de facturas electrónicas.

## Características
- Visualización de facturas con información detallada
- Gestión de clientes y proveedores
- Autenticación de usuarios
- Interfaz responsiva y amigable

## Requisitos previos
- Node.js (v14 o superior)
- npm (v6 o superior)

## Instalación

1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd scrapping_front
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno (opcional)
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
VITE_API_URL=http://192.168.0.20:8000
```

4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

## Tecnologías utilizadas
- React
- Vite
- Axios para peticiones HTTP
- React Router para navegación

## Conexión con el backend
Esta aplicación se conecta a un backend desarrollado en nestjs. Asegúrate de que el servidor backend esté en funcionamiento antes de iniciar la aplicación frontend.

## Crea un Pull Request:
Desde: tu rama -> feature/login
Hacia: la rama destino -> dev

## Licencia
Este proyecto está bajo la licencia [MIT](https://opensource.org/licenses/MIT).

## Estructura de carpetas
```
/src
├── /Utils                    # Funciones auxiliares reutilizables
│   ├── helpers.js            # Funciones de apoyo generales
│   ├──constants/             # Metodos en comun
│
├── /Lib                      # Librerías del proyecto (núcleo funcional)
│   ├── /Hooks                # Custom hooks reutilizables (useAuth, useFetch, etc.)
│   ├── /Services             # Lógica de conexión a APIs o servicios externos
│   ├── /Layouts              # Componentes de layout general (Sidebar, Header)
│
├── /UI                       # Todo lo relacionado con la interfaz visual
│   ├── /screen-components    # Componentes que se usan en una pantalla específica
│   ├── /useable-components   # Componentes reutilizables (Button, Modal, Card)
│   ├── /screens              # Vistas o páginas principales (Login, Dashboard, etc.)
```