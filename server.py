#!/usr/bin/env python3
"""
Simple HTTP Server for ClippyJS demos
Alternative to Bun server for systems without Bun installed
"""

import http.server
import socketserver
import os
from urllib.parse import unquote

PORT = 3000

class ClippyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # URL routing
        path = unquote(self.path)

        # Root - show menu
        if path == '/':
            self.send_menu()
            return

        # Demo routing
        routes = {
            '/minimal': './minimal-demo.html',
            '/simple': './simple-demo.html',
            '/local': './local-demo.html',
            '/original': './demo/index.html',
            '/example/typescript': './examples/typescript/index.html',
            '/example/vue3': './examples/vue3/index.html',
            '/example/vanilla': './examples/vanilla/index.html',
        }

        if path in routes:
            self.serve_file(routes[path])
            return

        # Default behavior (serve static files)
        super().do_GET()

    def send_menu(self):
        html = """<!DOCTYPE html>
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
        .badge {
            display: inline-block;
            padding: 4px 8px;
            background: #ff9800;
            color: white;
            border-radius: 4px;
            font-size: 12px;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 ClippyJS Dev Server <span class="badge">Python</span></h1>

        <div class="info">
            🐍 Serveur Python actif sur <code>http://localhost:""" + str(PORT) + """</code>
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
            <a href="/example/typescript">
                <strong>Plugin TypeScript Simple</strong>
                <div class="desc">Utilisation du ClippyPlugin sans framework</div>
            </a>

            <a href="/example/vue3">
                <strong>Vue 3 Composable</strong>
                <div class="desc">Exemple complet avec Vue 3</div>
            </a>

            <a href="/example/vanilla">
                <strong>Vanilla JavaScript Avancé</strong>
                <div class="desc">Exemple avec tous les contrôles</div>
            </a>
        </div>

        <h2>📚 Documentation</h2>
        <p>Pour la documentation complète :</p>
        <ul>
            <li><code>LAUNCH_DEMOS.md</code> - Guide de lancement</li>
            <li><code>QUICKSTART.md</code> - Quick start</li>
            <li><code>BUN_GUIDE.md</code> - Guide Bun</li>
            <li><code>TYPESCRIPT_README.md</code> - Guide TypeScript</li>
            <li><code>DEMOS_README.md</code> - Guide des démos</li>
        </ul>
    </div>
</body>
</html>"""

        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

    def serve_file(self, filepath):
        try:
            with open(filepath, 'rb') as f:
                content = f.read()
                self.send_response(200)
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.end_headers()
                self.wfile.write(content)
        except FileNotFoundError:
            self.send_error(404, f'File not found: {filepath}')

    def log_message(self, format, *args):
        # Custom log format
        print(f"📄 {args[0]}")

# Change to script directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

print("🚀 Starting ClippyJS Dev Server (Python)...\n")

with socketserver.TCPServer(("", PORT), ClippyHTTPRequestHandler) as httpd:
    print("✅ Serveur démarré !")
    print(f"\n📍 Ouvrez votre navigateur sur :\n")
    print(f"   🔗 http://localhost:{PORT}\n")
    print("⌨️  Appuyez sur Ctrl+C pour arrêter\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Serveur arrêté.")
