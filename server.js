import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import contactRouter from './routes/contact.js';
import { errorHandler } from './middleware/errorHandler.js';

// Cargar variables de entorno
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'https://pjulianv.github.io'
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (como Postman) en desarrollo
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

// Middleware de seguridad
app.use(helmet());

// Rate limiting - máximo 100 requests por 15 minutos por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas solicitudes desde esta IP, intente nuevamente más tarde'
});

app.use(limiter);

// Rate limiting específico para formularios - máximo 5 envíos por hora
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Has alcanzado el límite de envíos. Intenta nuevamente en 1 hora'
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas de contacto
app.use('/api/contact', contactLimiter, contactRouter);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl 
  });
});

// Manejo de errores global
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📧 Email configurado: ${process.env.EMAIL_USER || 'No configurado'}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n📌 Endpoints disponibles:`);
  console.log(`   GET  /api/health - Estado del servidor`);
  console.log(`   POST /api/contact - Enviar formulario de contacto`);
});

export default app;
