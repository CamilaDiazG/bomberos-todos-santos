import createNextIntlPlugin from 'next-intl/plugin';

// Le indicamos exactamente la ruta donde guardaste tu archivo de configuración
const withNextIntl = createNextIntlPlugin(
  './src/lib/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Si tenías algo más aquí adentro, déjalo igual
};

export default withNextIntl(nextConfig);