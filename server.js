import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import contactRouter from './routes/contact.js';
import sitemapRouter from './routes/sitemap.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger, { requestLogger } from './utils/logger.js';
import { csrfProtection, getCsrfTokenEndpoint } from './middleware/csrfProtection.js';

// Para usar __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS - permitir todos los orígenes para mismo dominio
app.use(cors({
  origin: true, // Permite cualquier origen (incluyendo mismo dominio)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Middleware de seguridad con CSP estricto
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Para GTM y GA (idealmente usar nonce)
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "https://www.google-analytics.com"],
      connectSrc: [
        "'self'",
        "https://api.resend.com",
        "https://www.google-analytics.com",
        "https://www.googletagmanager.com",
      ],
      frameSrc: ["'self'", "https://www.googletagmanager.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// Servir archivos estáticos (Frontend)
app.use(express.static(__dirname));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Middleware para URLs limpias - servir .html sin extensión
app.use((req, res, next) => {
  if (req.path.indexOf('.') === -1 && req.path !== '/') {
    // Si la ruta comienza con /pages/, remover el prefijo
    const cleanPath = req.path.startsWith('/pages/') ? req.path.substring(7) : req.path;
    const htmlPath = path.join(__dirname, 'pages', cleanPath + '.html');
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
    // También intentar sin el prefijo pages/
    const rootHtmlPath = path.join(__dirname, req.path + '.html');
    if (fs.existsSync(rootHtmlPath)) {
      return res.sendFile(rootHtmlPath);
    }
  }
  next();
});

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

// Cookie parser (para CSRF y sesiones)
app.use(cookieParser());

// Sanitización de inputs (prevenir NoSQL injection)
app.use(mongoSanitize());

// Protección CSRF para todos los endpoints
app.use(csrfProtection);

// Middleware de logging
app.use(requestLogger);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API - Comercio y Negocios Latam SAC',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      contact: 'POST /api/contact'
    }
  });
});

// Rutas
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Endpoint para obtener token CSRF
app.get('/api/csrf-token', getCsrfTokenEndpoint);

// Rutas de contacto
app.use('/api/contact', contactLimiter, contactRouter);

// Rutas de sitemap y robots (dinámicos)
app.use('/', sitemapRouter);

// Servir página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

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
const PORT_TO_USE = process.env.PORT || PORT;
app.listen(PORT_TO_USE, () => {
  logger.info(`🚀 Servidor corriendo en puerto ${PORT_TO_USE}`);
  logger.info(`📧 Email configurado: ${process.env.EMAIL_TO || 'No configurado'}`);
  logger.info(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔒 Seguridad: Winston logging, CSP, CSRF, Sanitización activados`);
  console.log(`\n📌 Endpoints disponibles:`);
  console.log(`   GET  /api/health - Estado del servidor`);
  console.log(`   GET  /api/csrf-token - Obtener token CSRF`);
  console.log(`   POST /api/contact - Enviar formulario de contacto`);
  console.log(`   GET  /sitemap.xml - Sitemap dinámico`);
  console.log(`   GET  /robots.txt - Robots.txt dinámico`);
});

export default app;
