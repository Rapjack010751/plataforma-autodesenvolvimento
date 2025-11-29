/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir mudança de porta via variável de ambiente
  env: {
    PORT: process.env.PORT || '3000',
  },
  // Configurações de desenvolvimento
  reactStrictMode: true,
  // Otimizações
  swcMinify: true,
}

module.exports = nextConfig
