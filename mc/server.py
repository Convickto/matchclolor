#!/usr/bin/env python3
"""
Servidor HTTP simples para testar o jogo Match Colors Pro
Porta: 8080
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import threading
import time
from pathlib import Path

class GameHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler customizado para servir arquivos do jogo"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # Adicionar headers para permitir CORS e melhor performance
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def log_message(self, format, *args):
        """Log customizado para mostrar requisições"""
        print(f"🌐 {self.address_string()} - {format % args}")

def start_server(port=8080):
    """Inicia o servidor HTTP"""
    try:
        with socketserver.TCPServer(("", port), GameHTTPRequestHandler) as httpd:
            print(f"🚀 Servidor iniciado na porta {port}")
            print(f"📁 Servindo arquivos de: {os.getcwd()}")
            print(f"🎮 Acesse o jogo em: http://localhost:{port}")
            print(f"🔧 Painel de testes: http://localhost:{port}/test-panel.html")
            print("=" * 50)
            print("Pressione Ctrl+C para parar o servidor")
            print("=" * 50)
            
            # Abrir navegador automaticamente
            def open_browser():
                time.sleep(1)
                webbrowser.open(f'http://localhost:{port}')
            
            browser_thread = threading.Thread(target=open_browser)
            browser_thread.daemon = True
            browser_thread.start()
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Servidor parado pelo usuário")
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ Erro: Porta {port} já está em uso")
            print(f"💡 Tente uma porta diferente: python server.py {port + 1}")
        else:
            print(f"❌ Erro ao iniciar servidor: {e}")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")

if __name__ == "__main__":
    port = 8080
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("❌ Porta inválida. Usando porta padrão 8080")
    
    start_server(port)
