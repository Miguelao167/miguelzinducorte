// Remove APENAS arquivos .pack do webpack cache (grandes demais pro Cloudflare)
// Mantém o resto do .next/cache intacto
const fs = require('fs');
const path = require('path');

const cacheDir = path.join(process.cwd(), '.next', 'cache', 'webpack');

function removePackFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      removePackFiles(fullPath);
    } else if (entry.name.endsWith('.pack')) {
      const sizeMB = fs.statSync(fullPath).size / 1024 / 1024;
      if (sizeMB > 24) {
        console.log(`Removendo ${entry.name} (${sizeMB.toFixed(1)} MiB)`);
        fs.unlinkSync(fullPath);
      }
    }
  }
}

removePackFiles(cacheDir);
console.log('Limpeza de cache concluída.');
