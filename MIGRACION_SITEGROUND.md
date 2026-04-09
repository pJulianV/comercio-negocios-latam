# 📋 INFORME: Migración de Render a SiteGround
**Comercio y Negocios Latam SAC**  
**Fecha:** 9 de Abril, 2026  
**Estado:** Análisis completo

---

## 📊 RESUMEN EJECUTIVO

### Situación Actual
- **Proveedor:** Render.com (plan gratuito)
- **Región:** Oregon
- **Aplicación:** Node.js 16+ con Express
- **Puerto:** 3000
- **Dominio:** comercio-negocios.onrender.com

### Objetivo
Migrar la aplicación a **SiteGround** manteniendo funcionalidad, seguridad y performance.

---

## 🏗️ ARQUITECTURA ACTUAL

### Stack Técnico
```
Frontend:
  - HTML5, CSS3, JavaScript vanilla
  - PWA (Progressive Web App)
  - i18n (Multiidioma: ES, EN, DE)
  - Archivos estáticos: /js, /css, /img, /pages

Backend:
  - Node.js (v16+)
  - Express.js 4.18.2
  - Middlewares: CORS, Helmet, Rate-Limit
  - Servicios: Email (Resend), AI Chat Proxy
  - Rutas: /contact, /sitemap

Seguridad:
  - Helmet (headers)
  - Rate-limit
  - CORS configurado
  - Validación de formularios
  - CSRF protection
```

### Dependencias Críticas
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "nodemailer": "^6.x.x",
  "resend": "^6.7.0",
  "express-validator": "^7.0.1"
}
```

---

## ⚠️ CONSIDERACIONES DE SITEGROUND

### Ventajas de SiteGround
✅ Servidor dedicado (actual es shared/free)  
✅ Node.js full support  
✅ CPanel para gestión fácil  
✅ SSL gratuito (Let's Encrypt)  
✅ Backups automáticos diarios  
✅ Soporte 24/7 técnico  
✅ IP dedicada opcional  
✅ Sin time-out (Render: 15 min inactividad)  

### Limitaciones a Considerar
⚠️ Ajustes de Node.js en CPanel necesarios  
⚠️ Variables de entorno (.env) requieren configuración manual  
⚠️ Process manager (PM2) debe estar configurado  
⚠️ Límites de memoria según plan (típico: 1GB-4GB)  

---

## ✅ CHECKLIST PRE-MIGRACIÓN

### 1. Preparación (Semana -1)
- [ ] Backup completo del proyecto en GitHub
- [ ] Documentar todas las variables de entorno actuales
- [ ] Extraer config de Render (variables, logs)
- [ ] Probar aplicación en ambiente local
- [ ] Verificar dependencias Node.js (versión compatible)
- [ ] Revisar certificados SSL actuales
- [ ] Documentar URLs de terceros (APIs, webhooks)

### 2. Plan de DNS
- [ ] Registrar/actualizar dominio en SiteGround
- [ ] Documentar nameservers actuales
- [ ] Crear zona DNS en SiteGround
- [ ] Configurar registros A, AAAA, CNAME
- [ ] Establecer TTL bajo (300s) para cambios rápidos
- [ ] Configurar MX si hay email corporativo

### 3. Configuración de Entorno
- [ ] Crear archivo .env con todas las variables
- [ ] Documentar cada variable necesaria
- [ ] Revisar NODE_ENV (development/production)
- [ ] Configurar PORT (SiteGround típicamente custom)
- [ ] Preparar credenciales de servicios (Resend, etc.)

### 4. Testing Local
- [ ] Ejecutar `npm install` y verificar
- [ ] Ejecutar `npm test` (si hay tests)
- [ ] Probar rutas principales: /, /contact, /pages
- [ ] Probar formulario de contacto
- [ ] Validar respuestas CORS
- [ ] Prueba de tasa límite (rate-limit)
- [ ] Validar archivos estáticos se sirven correctamente

---

## 🚀 PROCESO DE MIGRACIÓN (PASO A PASO)

### FASE 1: Preparación en SiteGround (2-3 horas)

#### 1.1 Crear Cuenta de Hosting
```
1. Ir a siteground.com
2. Seleccionar plan (GrowBig recomendado: $4.99/mes)
3. Registrar dominio o transferir existente
4. Completar pagina checkout
5. Acceder a CPanel
```

#### 1.2 Crear Aplicación Node.js en CPanel
```
CPanel > Node.js Selector > Create Application

Configuración:
- Node.js Version: 18.x o 20.x
- Application Display Name: comercio-negocios-latam
- Application Root: /home/username/comercio-negocios
- Application StartFile: server.js
- Application Port: 3000 (SiteGround asignará proxy)
- Port: 3000
- Environment: production
```

#### 1.3 Configurar Variables de Entorno
```
En CPanel > Node.js Selector > Edit variables

NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://tudominio.com
EMAIL_SERVICE=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
GMAIL_USER=tu-email@gmail.com
GMAIL_PASSWORD=tu-app-password
STRIPE_SECRET=sk_live_xxxxx (si usas payments)
```

#### 1.4 Configurar SSL Certificate
```
CPanel > AutoSSL o Let's Encrypt

- Activar SSL automático
- Verificar auto-renovación
- Esperar 24h para propagación
```

### FASE 2: Preparar Código (1-2 horas)

#### 2.1 Actualizar Archivos
```bash
# Crear .env.production
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://tudominio.com

# Hacer commit
git add .env.example
git commit -m "Add environment configuration for SiteGround"
git push origin main
```

#### 2.2 Verificar Server.js
```javascript
// Asegurar que servidor escucha en puerto correcto
const PORT = process.env.PORT || 3000;

// Validar rutas de archivos estáticos
app.use(express.static(__dirname));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));
```

#### 2.3 Update package.json Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "start:siteground": "NODE_ENV=production node server.js",
    "dev": "nodemon server.js"
  }
}
```

### FASE 3: Desplegar en SiteGround (30 min - 1 hora)

#### 3.1 Clone del Repositorio
```bash
# En CPanel > Terminal (SSH)
cd /home/username/comercio-negocios
git clone https://github.com/pJulianV/comercio-negocios-latam-backend.git .
```

#### 3.2 Instalar Dependencias
```bash
npm install --production

# Verificar instalación
npm list --depth=0
```

#### 3.3 Verificar Estructura
```bash
# Desde CPanel Terminal
ls -la
# Debe mostrar:
# - server.js
# - package.json
# - pages/
# - js/
# - css/
# - img/
# - middleware/
# - routes/
# - services/
```

#### 3.4 Iniciar Aplicación
```
En CPanel > Node.js Selector:
- Seleccionar aplicación
- Click "Start"
- Verificar estado = "Running"
```

#### 3.5 Verificar Logs
```bash
# Ver logs de error
tail -f /home/username/comercio-negocios/error.log

# Ver logs combinados
tail -f /home/username/comercio-negocios/access.log
```

### FASE 4: Configuración de Dominio (1 hora)

#### 4.1 Apuntar Nameservers
**Si el dominio está en diferente registrador:**

```
En registrador actual (GoDaddy, Namecheap, etc.):
1. Acceder a gestión de dominio
2. Cambiar nameservers a los de SiteGround:
   - ns1.siteground.com
   - ns2.siteground.com
   - ns3.siteground.com
3. Guardar cambios
4. Esperar propagación (24-48h)
```

#### 4.2 Configurar DNS en SiteGround
```
CPanel > Zone Editor > Registros A

A Record:
  Domain: tudominio.com
  IP: [IP de SiteGround]
  TTL: 3600

CNAME Record:
  www.tudominio.com -> tudominio.com
```

#### 4.3 Actualizar CORS en Código
```javascript
// server.js
app.use(cors({
  origin: [
    'https://tudominio.com',
    'https://www.tudominio.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### FASE 5: Testing & Validación (2-3 horas)

#### 5.1 Pruebas de Conectividad
```bash
# Test DNS
nslookup tudominio.com
dig tudominio.com

# Test HTTPS
curl -I https://tudominio.com
# Debe mostrar: HTTP/2 200

# Test port
curl http://tudominio.com:3000
```

#### 5.2 Pruebas Funcionales
```
Checklist manual:
- [ ] Homepage carga correctamente
- [ ] 404 muestra página de error
- [ ] CSS/JS se cargan (inspeccionar Network)
- [ ] Formulario de contacto funciona
- [ ] Validación de formulario funciona
- [ ] Email se envía correctamente
- [ ] CORS headers presentes
- [ ] Rate-limit funciona
- [ ] Helmet headers presentes (X-Content-Type-Options, etc.)
```

#### 5.3 Test de Performance
```bash
# Usando herramientas online:
- Google PageSpeed Insights: https://pagespeed.web.dev
- GTmetrix: https://gtmetrix.com
- WebPageTest: https://www.webpagetest.org

Métricas objetivo:
- FCP < 1.5s
- LCP < 2.5s
- CLS < 0.1
- Lighthouse Score > 90
```

#### 5.4 Test de Seguridad
```bash
# SSL Labs (https://www.ssllabs.com/ssltest/)
- Verificar certificado válido
- Grade A+ mínimo

# Security Headers (https://securityheaders.com)
- Verificar headers securidad
- Grade A+ mínimo

Manual:
- Probar CORS con origen no autorizado (debe fallar)
- Intentar inyección SQL en formularios
- Probar XSS con script en inputs
```

---

## 🔄 ESTRATEGIA DE ROLLBACK

En caso de que algo salga mal, tienes estas opciones:

### Opción 1: Rollback Rápido a Render (RECOMENDADO)
```
Tiempo: 5 minutos
Pasos:
1. En Render dashboard, recrear aplicación desde GitHub
2. Cambiar DNS/registrador apuntando a Render
3. Esperar propagación DNS
```

### Opción 2: Rollback en SiteGround
```
Opción A - Revertir a versión anterior:
git reset --hard HEAD~1
npm install
npm start

Opción B - Mantener ambos servidores simultáneamente:
1. Mantener Render activo con código anterior
2. SiteGround con código nuevo
3. Cambiar DNS según sea necesario
```

### DNS Rollback Quick Guide
```
Si necesitas volver a Render rápidamente:

1. Render > Dashboard > obtener URL (ej: comercio.onrender.com)
2. CPanel > Zone Editor
3. Cambiar A Record apuntando a IP de Render
4. O cambiar nameservers a los de Render
5. TTL bajo = propagación rápida
```

---

## 📊 COMPARATIVA: Render vs SiteGround

| Aspecto | Render (Actual) | SiteGround (Nuevo) |
|---------|-----------------|-------------------|
| **Costo** | Gratis | $4.99-24.99/mes |
| **Uptime** | 99.9% | 99.99% |
| **CPU/RAM** | Limitado (free) | 1-4GB dependiendo plan |
| **Inactividad** | Se duerme 15 min | Sin límite |
| **Escalabilidad** | Horizontal fácil | Vertical: upgrade plan |
| **Soporte** | Community | 24/7 Premium |
| **SSL** | Gratuito | Gratuito (Let's Encrypt) |
| **Node.js** | Full support | Full support |
| **Backups** | Manual GitHub | Diarios automáticos |
| **Process Manager** | Integrado | PM2 (manual) |

---

## ⚙️ CONFIGURACIÓN DE PM2 (OPCIONAL pero RECOMENDADO)

Para mayor estabilidad en SiteGround, instala PM2:

```bash
# Instalar PM2
npm install -g pm2

# Crear archivo ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'comercio-negocios',
    script: './server.js',
    instances: '2',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

# Iniciar con PM2
pm2 start ecosystem.config.js

# Ver estado
pm2 list

# Guardar configuración para reinicio automático
pm2 save
pm2 startup
```

---

## 📝 VARIABLES DE ENTORNO REQUERIDAS

```bash
# Obligatorias
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://tudominio.com

# Email (Resend - RECOMENDADO)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx

# O Email (Gmail)
GMAIL_USER=tu-email@gmail.com
GMAIL_PASSWORD=tu-app-password

# API Keys de terceros
OPENAI_API_KEY=sk_xxx (si usas Chat AI)
STRIPE_SECRET_KEY=sk_live_xxx (si tienes payments)

# Seguridad
CSRF_SECRET=your-random-secret-here
SESSION_SECRET=your-random-secret-here
```

---

## 📞 REFERENCIAS DE SOPORTE

### Documentación
- SiteGround Node.js: https://www.siteground.com/kb/nodejs-application/
- Express.js: https://expressjs.com/
- PM2 Docs: https://pm2.keymetrics.io/docs/usage/quick-start/

### Contactos
- SiteGround Support: https://www.siteground.com/contact-support
- Número de cuenta: [Tu referencia SiteGround]
- Email de soporte: support@siteground.com

---

## 🗓️ CRONOGRAMA ESTIMADO

```
Semana 1:
  Lunes: Compra SiteGround + Preparación
  Martes-Miércoles: Setup infrastructure
  Jueves: Deploy código
  Viernes: Testing completo

Día del cambio (Fin de semana recomendado):
  Sábado 00:00: Cambio DNS
  Sábado 01:00: Verificación completa
  Sábado 02:00: Rollback si es necesario
  Domingo: Monitoreo 24h
```

---

## ✨ PRÓXIMAS ACCIONES

1. **Confirmación de cliente** sobre:
   - Presupuesto (plan SiteGround)
   - Fecha de migración
   - Dominio (renta en SiteGround o transferencia)

2. **Preparación técnica**:
   - [ ] Finalizar todas las variables de entorno
   - [ ] Crear cuenta SiteGround
   - [ ] Configurar Node.js en CPanel
   - [ ] Deploy código

3. **Validación**:
   - [ ] Testing completo
   - [ ] Validación seguridad
   - [ ] Monitoreo post-migración

---

**Documento Preparado Por:** Julian (Desarrollo)  
**Fecha:** 9 de Abril, 2026  
**Versión:** 1.0  
**Estado:** Listo para revisión
