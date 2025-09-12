#!/bin/bash

# 🎮 Script para iniciar servidor de testes - Match Colors Pro
# Autor: Sistema de Automação
# Data: $(date)

echo "🎮 Match Colors Pro - Servidor de Testes"
echo "========================================"
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 não encontrado. Instalando..."
    
    # Detectar sistema operacional
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y python3 python3-pip
        elif command -v yum &> /dev/null; then
            sudo yum install -y python3 python3-pip
        elif command -v pacman &> /dev/null; then
            sudo pacman -S python python-pip
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install python3
        else
            echo "❌ Homebrew não encontrado. Instale Python3 manualmente."
            exit 1
        fi
    else
        echo "❌ Sistema operacional não suportado automaticamente."
        echo "💡 Instale Python3 manualmente e execute: python3 server.py"
        exit 1
    fi
fi

# Verificar se estamos no diretório correto
if [ ! -f "index.html" ]; then
    echo "❌ Arquivo index.html não encontrado."
    echo "💡 Execute este script no diretório do jogo Match Colors Pro"
    exit 1
fi

# Tornar script executável
chmod +x server.py

# Verificar porta disponível
PORT=8080
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; do
    echo "⚠️  Porta $PORT já está em uso. Tentando porta $((PORT+1))..."
    PORT=$((PORT+1))
done

echo "🚀 Iniciando servidor na porta $PORT..."
echo "📁 Diretório: $(pwd)"
echo "🌐 URL: http://localhost:$PORT"
echo "🔧 Painel de testes: http://localhost:$PORT/test-panel.html"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo "========================================"

# Iniciar servidor
python3 server.py $PORT
