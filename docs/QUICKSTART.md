# 🚀 Guía Rápida de Inicio - Backend

## ⚡ Inicio Rápido (5 minutos)

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Email
```bash
# Copiar archivo de ejemplo
copy .env.example .env

# Editar .env con tus credenciales
notepad .env
```

### 3. Obtener Contraseña de Gmail
1. Ve a https://myaccount.google.com/apppasswords
2. Crea contraseña para "Correo"
3. Copia la contraseña en `.env`

### 4. (Opcional) Configurar el chat AI
1. Crea un token en https://huggingface.co/settings/tokens
2. En `.env`, agrega el valor a `HF_TOKEN`
3. (Opcional) Ajusta `HF_MODEL` si quieres usar otro modelo

### 5. Iniciar Servidor
```bash
npm run dev
```

### 5. Probar
Abre: http://localhost:3000/api/health

---

## 📋 Checklist de Configuración

- [ ] Node.js instalado (v16+)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` creado y configurado
- [ ] Contraseña de aplicación de Gmail obtenida
- [ ] Variables `EMAIL_USER` y `EMAIL_PASSWORD` configuradas
- [ ] Servidor iniciado sin errores
- [ ] Endpoint `/api/health` responde correctamente
- [ ] Formulario de contacto probado

---

## 🔧 Comandos Útiles

```bash
# Desarrollo (auto-reload)
npm run dev

# Producción
npm start

# Probar health check
curl http://localhost:3000/api/health

# Probar formulario
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","empresa":"Test","email":"test@test.com","mensaje":"Mensaje de prueba"}'
```

---

## ❓ Problemas Comunes

### Error: "Credenciales de email no configuradas"
- Revisa que `.env` exista y tenga `EMAIL_USER` y `EMAIL_PASSWORD`

### Error: "Invalid login"
- Usa contraseña de aplicación, no tu contraseña normal
- Verifica que la verificación en 2 pasos esté activa

### Error: "CORS"
- Agrega tu dominio a `ALLOWED_ORIGINS` en `.env`

---

## 📖 Documentación Completa

Ver [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para documentación detallada.

---

## 🎯 Próximos Pasos

1. ✅ Backend configurado y funcionando
2. 📧 Probar envío de emails
3. 🌐 Conectar frontend con backend
4. 🚀 Deploy a producción (Vercel/Railway)
5. 📊 Configurar monitoreo

---

¿Listo? ¡Empecemos! 🎉
