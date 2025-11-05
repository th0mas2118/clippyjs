/**
 * Bun Dev Server for ClippyJS demos
 * Serves HTML demos and assets
 */

import { file } from 'bun';

const PORT = 3000;

console.log('🚀 Starting ClippyJS Dev Server...\n');

Bun.serve({
  port: PORT,

  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // Log requests
    console.log(`📄 ${req.method} ${path}`);

    try {
      // Root - show menu
      if (path === '/') {
        return new Response(
          `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ClippyJS - Dev Server</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 20px;
            color: #333;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        h1 { text-align: center; margin-bottom: 30px; }
        h2 { color: #667eea; margin-top: 30px; }
        .demos {
            display: grid;
            gap: 15px;
            margin: 20px 0;
        }
        a {
            display: block;
            padding: 20px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 10px;
            transition: all 0.3s ease;
        }
        a:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .desc {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 5px;
        }
        code {
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 4px;
            color: #e83e8c;
        }
        .info {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            color: #1976d2;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 ClippyJS Dev Server</h1>

        <div class="info">
            ⚡ Serveur Bun actif sur <code>http://localhost:${PORT}</code>
        </div>

        <h2>📺 Démos HTML</h2>
        <div class="demos">
            <a href="/minimal">
                <strong>Minimal Demo</strong>
                <div class="desc">Démo ultra-simple (30 lignes)</div>
            </a>

            <a href="/simple">
                <strong>Simple Demo</strong>
                <div class="desc">Démo interactive avec sélecteur d'agents</div>
            </a>

            <a href="/local">
                <strong>Local Demo</strong>
                <div class="desc">Version 100% locale avec gestion d'erreurs</div>
            </a>

            <a href="/original">
                <strong>Original Demo</strong>
                <div class="desc">Démo originale (zoo d'agents)</div>
            </a>
        </div>

        <h2>🎨 Exemples</h2>
        <div class="demos">
            <a href="/example/vanilla">
                <strong>Vanilla TypeScript</strong>
                <div class="desc">Exemple avec l'API TypeScript</div>
            </a>
        </div>

        <h2>📚 Documentation</h2>
        <p>Pour la documentation complète :</p>
        <ul>
            <li><code>BUN_GUIDE.md</code> - Guide Bun</li>
            <li><code>TYPESCRIPT_README.md</code> - Guide TypeScript</li>
            <li><code>DEMOS_README.md</code> - Guide des démos</li>
            <li><code>PROJECT_SUMMARY.md</code> - Résumé du projet</li>
        </ul>
    </div>
</body>
</html>`,
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      }

      // Demos routing
      if (path === '/minimal') {
        return new Response(await file('./minimal-demo.html').text(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      if (path === '/simple') {
        return new Response(await file('./simple-demo.html').text(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      if (path === '/local') {
        return new Response(await file('./local-demo.html').text(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      if (path === '/original') {
        return new Response(await file('./demo/index.html').text(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      if (path === '/example/vanilla') {
        return new Response(await file('./examples/vanilla/index.html').text(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      // Serve assets
      if (path.startsWith('/assets/')) {
        const filePath = '.' + path;
        const f = file(filePath);

        if (await f.exists()) {
          // Determine content type
          let contentType = 'application/octet-stream';
          if (path.endsWith('.css')) contentType = 'text/css';
          else if (path.endsWith('.js')) contentType = 'application/javascript';
          else if (path.endsWith('.png')) contentType = 'image/png';
          else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) contentType = 'image/jpeg';

          return new Response(await f.arrayBuffer(), {
            headers: { 'Content-Type': contentType },
          });
        }
      }

      // Serve demo files
      if (path.startsWith('/demo/')) {
        const filePath = '.' + path;
        const f = file(filePath);

        if (await f.exists()) {
          let contentType = 'application/octet-stream';
          if (path.endsWith('.js')) contentType = 'application/javascript';

          return new Response(await f.arrayBuffer(), {
            headers: { 'Content-Type': contentType },
          });
        }
      }

      // 404
      return new Response(
        `<!DOCTYPE html>
<html>
<head>
    <title>404 - Not Found</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background: #f5f5f5;
        }
        h1 { color: #e74c3c; }
        a { color: #667eea; text-decoration: none; }
    </style>
</head>
<body>
    <h1>404 - Page Non Trouvée</h1>
    <p>Le fichier <code>${path}</code> n'existe pas.</p>
    <p><a href="/">← Retour à l'accueil</a></p>
</body>
</html>`,
        {
          status: 404,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }
      );

    } catch (error) {
      console.error('❌ Erreur:', error);
      return new Response('Erreur interne du serveur', { status: 500 });
    }
  },
});

console.log('✅ Serveur démarré !');
console.log(`\n📍 Ouvrez votre navigateur sur :\n`);
console.log(`   🔗 http://localhost:${PORT}\n`);
console.log('⌨️  Appuyez sur Ctrl+C pour arrêter\n');
