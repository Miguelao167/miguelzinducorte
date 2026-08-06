// Limpa arquivos de cache que excedem o limite de 25 MiB do Cloudflare Pages
const fs = require('fs');
const path = require('path');

const cacheDir = path.join(process.cwd(), '.next', 'cache');

if (fs.existsSync(cacheDir)) {
  console.log('Limpando cache do Next.js para reduzir tamanho do build...');
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('Cache removido com sucesso.');
} else {
  console.log('Nenhum cache para limpar.');
}
