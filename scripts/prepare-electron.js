const fs = require('fs');
const path = require('path');

// Copia os arquivos estáticos para dentro do standalone
const standalonePath = path.join(__dirname, '../.next/standalone');
const staticPath = path.join(__dirname, '../.next/static');
const publicPath = path.join(__dirname, '../public');

if (fs.existsSync(standalonePath)) {
  console.log('Preparando arquivos para Electron...');
  
  // Copia .next/static para .next/standalone/.next/static
  if (fs.existsSync(staticPath)) {
    const targetStaticPath = path.join(standalonePath, '.next', 'static');
    console.log('Copiando arquivos estáticos de', staticPath, 'para', targetStaticPath);
    if (!fs.existsSync(targetStaticPath)) {
      fs.mkdirSync(targetStaticPath, { recursive: true });
    }
    copyRecursiveSync(staticPath, targetStaticPath);
    console.log('Arquivos estáticos copiados com sucesso!');
  } else {
    console.warn('Aviso: Pasta .next/static não encontrada');
  }

  // Copia public para .next/standalone/public
  if (fs.existsSync(publicPath)) {
    const targetPublicPath = path.join(standalonePath, 'public');
    console.log('Copiando arquivos públicos de', publicPath, 'para', targetPublicPath);
    if (!fs.existsSync(targetPublicPath)) {
      fs.mkdirSync(targetPublicPath, { recursive: true });
    }
    copyRecursiveSync(publicPath, targetPublicPath);
    console.log('Arquivos públicos copiados com sucesso!');
  } else {
    console.warn('Aviso: Pasta public não encontrada');
  }
  
  // Verifica se o server.js existe
  const serverPath = path.join(standalonePath, 'server.js');
  if (fs.existsSync(serverPath)) {
    console.log('✓ server.js encontrado em:', serverPath);
  } else {
    console.error('✗ ERRO: server.js NÃO encontrado em:', serverPath);
  }
} else {
  console.error('ERRO: Pasta .next/standalone não encontrada! Execute "npm run build" primeiro.');
  process.exit(1);
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Preparação para Electron concluída!');

