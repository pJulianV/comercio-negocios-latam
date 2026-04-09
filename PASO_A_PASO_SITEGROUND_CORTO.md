# Paso a paso corto: migracion a SiteGround (cliente + desarrollador)

Proyecto: https://github.com/pJulianV/comercio-negocios-latam
Objetivo: dejar el sitio estable, seguro, rapido y con buen SEO.

## 1) Lo que debe hacer el cliente

1. Comprar plan en SiteGround uno medio o sencillo
2. Confirmar dominio final: cynlatam.com (disponible y validado). o el que prefieras

3. Compartir accesos:
- SiteGround (panel y DNS)
- Registrador de dominio (si no esta en SiteGround)
- Cuenta de correo para formularios
4. Aprobar ventana de migracion (ideal: noche o fin de semana).
5. Aprobar presupuesto con facturacion anual (SiteGround suele cobrar por adelantado).

## 2) Lo que hago yo (desarrollador)

1. Preparar deploy desde el repo oficial y validar dependencias Node.js.
2. Configurar app Node.js en SiteGround:
- version Node LTS
- variables de entorno
- SSL activo
- logs y reinicio de app
3. Migrar DNS con minimo downtime.
4. Ejecutar pruebas completas:
- formularios y envio de correo
- rutas principales ES/EN/DE
- seguridad basica (headers, validaciones, rate limit)
5. Ajustar SEO tecnico:
- sitemap.xml y robots.txt correctos
- metadatos title/description por pagina
- canonical y hreflang
- redirecciones 301 si cambia URL
- alta en Google Search Console
6. Entregar checklist final y plan de monitoreo 7 dias.

## 3) Buenas practicas obligatorias

1. Sin cambios directos en produccion: todo pasa por GitHub.
2. Backups antes de migrar y despues del go-live.
3. Variables sensibles fuera del codigo (solo en entorno).
4. SSL forzado y revision de enlaces mixed content.
5. Medicion de rendimiento con PageSpeed y Core Web Vitals.

## 4) Costos estimados

1. Hosting SiteGround:
- Precio referencial mensual: aprox USD 5 a USD 15/mes (promocion)
- Precio referencial mensual de renovacion: aprox USD 20 a USD 40/mes (segun plan)
- Facturacion habitual: pago anual por adelantado.
2. Dominio:
- cynlatam.com: USD 17.99/anual (precio referencial de compra inicial)
- renovacion anual: confirmar monto final en checkout
3. Correo/servicios transaccionales (si aplica):
- desde USD 0 a USD 20/mes
4. Soporte tecnico y mantenimiento:
- definir bolsa mensual (recomendado)

Nota: precios referenciales de mercado; confirmar en checkout de SiteGround el total anual exacto antes de pagar.

## 5) Cronograma corto sugerido

1. Dia 1: compra, accesos y plan de migracion.
2. Dia 2: configuracion tecnica y pruebas en staging.
3. Dia 3: cambio DNS, validacion final y monitoreo.

## 6) Resultado esperado

1. Sitio en SiteGround funcionando al 100%.
2. HTTPS correcto, formularios operativos y sin errores criticos.
3. SEO tecnico base implementado para indexacion correcta.
4. Entrega de reporte final con pendientes opcionales de mejora.
