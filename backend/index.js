import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import routerCliente from './routes/clienteRoutes.js';
import routerEmpleado from './routes/empleadoRoutes.js';
import routerAdmin from './routes/adminRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar CORS para permitir solicitudes solo desde el frontend
app.use(cors({
  origin: 'http://localhost:5173', // Permite solo este origen
}));

// Middleware para verificar que el Content-Type sea application/json
app.use((req, res, next) => {
  // Si es un método GET o OPTIONS, permitimos la solicitud
  if (req.method === 'GET' || req.method === 'OPTIONS') {
    return next();
  }

  // Aseguramos que req.body esté definido y sea un objeto
  const hasBody = req.body && Object.keys(req.body).length > 0;

  // Si hay cuerpo y el Content-Type no es application/json, retornamos error
  if (hasBody && req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: 'El Content-Type debe ser application/json' });
  }

  // Continuamos con el siguiente middleware
  next();
});

// Middleware para analizar JSON
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/clientes', routerCliente);
app.use('/empleados', routerEmpleado);
app.use('/admins', routerAdmin);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error en el servidor');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
