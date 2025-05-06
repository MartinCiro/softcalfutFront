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

## Estructura del proyecto
- `src/components`: Componentes React reutilizables
- `src/services`: Servicios para comunicación con la API
- `src/assets`: Recursos estáticos (imágenes, estilos, etc.)

## Servicios principales
- `AuthService.js`: Gestión de autenticación y tokens
- `FacturaService.js`: Operaciones relacionadas con facturas
- `ClienteService.js`: Operaciones relacionadas con clientes

## Tecnologías utilizadas
- React
- Vite
- Axios para peticiones HTTP
- React Router para navegación

## Conexión con el backend
Esta aplicación se conecta a un backend desarrollado en Django. Asegúrate de que el servidor backend esté en funcionamiento antes de iniciar la aplicación frontend.

## Crea un Pull Request:
Desde: tu rama -> feature/login
Hacia: la rama destino -> dev

## Licencia
Este proyecto está bajo la licencia [MIT](https://opensource.org/licenses/MIT).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
