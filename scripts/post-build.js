const fs = require('fs');
const path = require('path');

// Cesta k build složce
const buildDir = path.join(__dirname, '..', 'build');
const indexPath = path.join(buildDir, 'index.html');

// Cesty pro jednotlivé stránky
const routes = ['gallery', 'about', 'contact'];

// Kopíruj index.html pro každou routu
routes.forEach(route => {
  const routePath = path.join(buildDir, `${route}.html`);
  
  try {
    fs.copyFileSync(indexPath, routePath);
    console.log(`✅ Vytvořen ${route}.html`);
  } catch (error) {
    console.error(`❌ Chyba při vytváření ${route}.html:`, error);
  }
});

console.log('🎉 Post-build skript dokončen!');
