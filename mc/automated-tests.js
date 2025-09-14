/**
 * 🎮 Sistema de Testes Automatizados - Match Colors Pro
 * 
 * Este arquivo contém todos os testes automatizados para o jogo,
 * incluindo testes de performance, funcionalidade e integração.
 */

class GameTestSuite {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            total: 0,
            startTime: null,
            endTime: null
        };
        this.gameWindow = null;
        this.testLog = [];
    }

    /**
     * Inicializa o sistema de testes
     */
    async initialize() {
        this.log('🚀 Inicializando sistema de testes...');
        this.results.startTime = performance.now();
        
        // Abrir jogo em nova janela para testes
        this.gameWindow = window.open('/', '_blank');
        
        // Aguardar carregamento do jogo
        await this.waitForGameLoad();
        
        this.log('✅ Sistema de testes inicializado');
    }

    /**
     * Aguarda o carregamento completo do jogo
     */
    async waitForGameLoad() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (this.gameWindow && this.gameWindow.document.readyState === 'complete') {
                    clearInterval(checkInterval);
                    setTimeout(resolve, 1000); // Aguardar 1s adicional para garantir carregamento
                }
            }, 100);
        });
    }

    /**
     * Executa todos os testes
     */
    async runAllTests() {
        this.log('🎯 Iniciando execução de todos os testes...');
        
        try {
            // Testes básicos
            await this.testGameInitialization();
            await this.testGameModes();
            await this.testAudioSystem();
            await this.testAchievements();
            await this.testPowerUps();
            
            // Testes de performance
            await this.testClickPerformance();
            await this.testSimultaneousClicks();
            await this.testMemoryUsage();
            
            // Testes de integração
            await this.testGameFlow();
            await this.testScoreSystem();
            await this.testLevelProgression();
            
            // Testes de stress
            await this.testHighFrequencyClicks();
            await this.testLongSession();
            
            // Testes de responsividade
            await this.testResponsiveDesign();
            await this.testTouchEvents();
            
            this.generateReport();
            
        } catch (error) {
            this.log(`❌ Erro durante execução dos testes: ${error.message}`, 'error');
        }
    }

    /**
     * Testa inicialização do jogo
     */
    async testGameInitialization() {
        this.log('🔧 Testando inicialização do jogo...');
        
        try {
            const gameDocument = this.gameWindow.document;
            
            // Verificar se elementos principais existem
            const requiredElements = [
                'game-grid',
                'game-overlay',
                'timer',
                'lives',
                'score',
                'color-target'
            ];
            
            for (const elementId of requiredElements) {
                const element = gameDocument.getElementById(elementId);
                if (!element) {
                    throw new Error(`Elemento ${elementId} não encontrado`);
                }
            }
            
            this.passTest('Inicialização do jogo');
            
        } catch (error) {
            this.failTest('Inicialização do jogo', error.message);
        }
    }

    /**
     * Testa modos de jogo
     */
    async testGameModes() {
        this.log('🎮 Testando modos de jogo...');
        
        const modes = ['classic', 'survival', 'zen', 'challenge'];
        
        for (const mode of modes) {
            try {
                await this.testGameMode(mode);
                this.passTest(`Modo ${mode}`);
            } catch (error) {
                this.failTest(`Modo ${mode}`, error.message);
            }
        }
    }

    /**
     * Testa um modo específico
     */
    async testGameMode(mode) {
        const gameDocument = this.gameWindow.document;
        
        // Simular clique no modo
        const modeCard = gameDocument.querySelector(`[data-mode="${mode}"]`);
        if (!modeCard) {
            throw new Error(`Card do modo ${mode} não encontrado`);
        }
        
        // Simular clique
        modeCard.click();
        
        // Aguardar mudança de estado
        await this.sleep(500);
        
        // Verificar se modo foi selecionado
        if (!modeCard.classList.contains('active')) {
            throw new Error(`Modo ${mode} não foi ativado`);
        }
    }

    /**
     * Testa sistema de áudio
     */
    async testAudioSystem() {
        this.log('🔊 Testando sistema de áudio...');
        
        try {
            const gameDocument = this.gameWindow.document;
            
            // Verificar botões de áudio
            const musicToggle = gameDocument.getElementById('music-toggle');
            const sfxToggle = gameDocument.getElementById('sfx-toggle');
            
            if (!musicToggle || !sfxToggle) {
                throw new Error('Botões de áudio não encontrados');
            }
            
            // Testar toggle de música
            musicToggle.click();
            await this.sleep(100);
            
            // Testar toggle de efeitos
            sfxToggle.click();
            await this.sleep(100);
            
            this.passTest('Sistema de áudio');
            
        } catch (error) {
            this.failTest('Sistema de áudio', error.message);
        }
    }

    /**
     * Testa sistema de conquistas
     */
    async testAchievements() {
        this.log('🏆 Testando sistema de conquistas...');
        
        try {
            // Verificar se sistema de conquistas está disponível
            const gameWindow = this.gameWindow;
            if (!gameWindow.achievementSystem) {
                throw new Error('Sistema de conquistas não encontrado');
            }
            
            // Testar funcionalidades básicas
            const achievements = gameWindow.achievementSystem.getAchievements();
            if (!Array.isArray(achievements)) {
                throw new Error('Lista de conquistas inválida');
            }
            
            this.passTest('Sistema de conquistas');
            
        } catch (error) {
            this.failTest('Sistema de conquistas', error.message);
        }
    }

    /**
     * Testa sistema de power-ups
     */
    async testPowerUps() {
        this.log('⚡ Testando sistema de power-ups...');
        
        try {
            const gameWindow = this.gameWindow;
            if (!gameWindow.powerUpSystem) {
                throw new Error('Sistema de power-ups não encontrado');
            }
            
            // Testar funcionalidades básicas
            const powerUps = gameWindow.powerUpSystem.getAvailablePowerUps();
            if (!Array.isArray(powerUps)) {
                throw new Error('Lista de power-ups inválida');
            }
            
            this.passTest('Sistema de power-ups');
            
        } catch (error) {
            this.failTest('Sistema de power-ups', error.message);
        }
    }

    /**
     * Testa performance de cliques
     */
    async testClickPerformance() {
        this.log('⚡ Testando performance de cliques...');
        
        try {
            const clickCount = 100;
            const startTime = performance.now();
            
            // Simular cliques rápidos
            for (let i = 0; i < clickCount; i++) {
                await this.simulateClick();
                await this.sleep(10); // 10ms delay como especificado
            }
            
            const endTime = performance.now();
            const totalTime = endTime - startTime;
            const avgLatency = totalTime / clickCount;
            
            if (avgLatency > 50) { // Máximo 50ms por clique
                throw new Error(`Latência muito alta: ${avgLatency.toFixed(2)}ms`);
            }
            
            this.passTest(`Performance de cliques (${avgLatency.toFixed(2)}ms média)`);
            
        } catch (error) {
            this.failTest('Performance de cliques', error.message);
        }
    }

    /**
     * Testa cliques simultâneos
     */
    async testSimultaneousClicks() {
        this.log('🎯 Testando cliques simultâneos...');
        
        try {
            const gameDocument = this.gameWindow.document;
            const gameGrid = gameDocument.getElementById('game-grid');
            
            if (!gameGrid) {
                throw new Error('Grid do jogo não encontrado');
            }
            
            // Iniciar jogo se necessário
            await this.startGame();
            
            // Encontrar quadrados corretos
            const correctSquares = gameGrid.querySelectorAll('[data-correct="true"]');
            
            if (correctSquares.length === 0) {
                throw new Error('Nenhum quadrado correto encontrado');
            }
            
            // Simular cliques simultâneos
            const clickPromises = Array.from(correctSquares).slice(0, 3).map(square => 
                this.simulateSquareClick(square)
            );
            
            const startTime = performance.now();
            await Promise.all(clickPromises);
            const endTime = performance.now();
            
            const simultaneousTime = endTime - startTime;
            
            if (simultaneousTime > 50) { // Máximo 50ms para cliques simultâneos
                throw new Error(`Cliques simultâneos muito lentos: ${simultaneousTime.toFixed(2)}ms`);
            }
            
            this.passTest(`Cliques simultâneos (${simultaneousTime.toFixed(2)}ms)`);
            
        } catch (error) {
            this.failTest('Cliques simultâneos', error.message);
        }
    }

    /**
     * Testa uso de memória
     */
    async testMemoryUsage() {
        this.log('💾 Testando uso de memória...');
        
        try {
            if (!performance.memory) {
                this.log('⚠️ performance.memory não disponível neste navegador');
                this.passTest('Uso de memória (não disponível)');
                return;
            }
            
            const initialMemory = performance.memory.usedJSHeapSize;
            
            // Executar operações que consomem memória
            for (let i = 0; i < 1000; i++) {
                await this.simulateClick();
                await this.sleep(1);
            }
            
            const finalMemory = performance.memory.usedJSHeapSize;
            const memoryIncrease = finalMemory - initialMemory;
            const memoryIncreaseMB = memoryIncrease / 1024 / 1024;
            
            if (memoryIncreaseMB > 10) { // Máximo 10MB de aumento
                throw new Error(`Uso excessivo de memória: +${memoryIncreaseMB.toFixed(2)}MB`);
            }
            
            this.passTest(`Uso de memória (+${memoryIncreaseMB.toFixed(2)}MB)`);
            
        } catch (error) {
            this.failTest('Uso de memória', error.message);
        }
    }

    /**
     * Testa fluxo do jogo
     */
    async testGameFlow() {
        this.log('🔄 Testando fluxo do jogo...');
        
        try {
            // Iniciar jogo
            await this.startGame();
            
            // Simular algumas jogadas
            for (let i = 0; i < 5; i++) {
                await this.simulateCorrectClick();
                await this.sleep(100);
            }
            
            // Verificar se pontuação aumentou
            const gameDocument = this.gameWindow.document;
            const scoreElement = gameDocument.getElementById('score');
            const score = parseInt(scoreElement.textContent);
            
            if (score === 0) {
                throw new Error('Pontuação não aumentou');
            }
            
            this.passTest('Fluxo do jogo');
            
        } catch (error) {
            this.failTest('Fluxo do jogo', error.message);
        }
    }

    /**
     * Testa sistema de pontuação
     */
    async testScoreSystem() {
        this.log('📊 Testando sistema de pontuação...');
        
        try {
            const gameDocument = this.gameWindow.document;
            const scoreElement = gameDocument.getElementById('score');
            const initialScore = parseInt(scoreElement.textContent);
            
            // Fazer clique correto
            await this.simulateCorrectClick();
            await this.sleep(100);
            
            const finalScore = parseInt(scoreElement.textContent);
            
            if (finalScore <= initialScore) {
                throw new Error('Pontuação não aumentou após clique correto');
            }
            
            this.passTest('Sistema de pontuação');
            
        } catch (error) {
            this.failTest('Sistema de pontuação', error.message);
        }
    }

    /**
     * Testa progressão de níveis
     */
    async testLevelProgression() {
        this.log('📈 Testando progressão de níveis...');
        
        try {
            const gameDocument = this.gameWindow.document;
            const levelElement = gameDocument.getElementById('level');
            const initialLevel = parseInt(levelElement.textContent);
            
            // Completar várias rodadas
            for (let i = 0; i < 3; i++) {
                await this.completeRound();
                await this.sleep(200);
            }
            
            const finalLevel = parseInt(levelElement.textContent);
            
            if (finalLevel <= initialLevel) {
                throw new Error('Nível não progrediu');
            }
            
            this.passTest('Progressão de níveis');
            
        } catch (error) {
            this.failTest('Progressão de níveis', error.message);
        }
    }

    /**
     * Testa cliques de alta frequência
     */
    async testHighFrequencyClicks() {
        this.log('🚀 Testando cliques de alta frequência...');
        
        try {
            const clickCount = 200;
            const startTime = performance.now();
            
            // Cliques muito rápidos (5ms entre cliques)
            for (let i = 0; i < clickCount; i++) {
                await this.simulateClick();
                await this.sleep(5);
            }
            
            const endTime = performance.now();
            const totalTime = endTime - startTime;
            const clicksPerSecond = (clickCount * 1000) / totalTime;
            
            if (clicksPerSecond < 50) { // Mínimo 50 cliques por segundo
                throw new Error(`Frequência muito baixa: ${clicksPerSecond.toFixed(2)} cliques/s`);
            }
            
            this.passTest(`Alta frequência (${clicksPerSecond.toFixed(2)} cliques/s)`);
            
        } catch (error) {
            this.failTest('Alta frequência', error.message);
        }
    }

    /**
     * Testa sessão longa
     */
    async testLongSession() {
        this.log('⏰ Testando sessão longa...');
        
        try {
            const duration = 10000; // 10 segundos
            const startTime = performance.now();
            let clickCount = 0;
            
            while (performance.now() - startTime < duration) {
                await this.simulateClick();
                await this.sleep(50);
                clickCount++;
            }
            
            this.passTest(`Sessão longa (${clickCount} cliques em 10s)`);
            
        } catch (error) {
            this.failTest('Sessão longa', error.message);
        }
    }

    /**
     * Testa design responsivo
     */
    async testResponsiveDesign() {
        this.log('📱 Testando design responsivo...');
        
        try {
            const gameWindow = this.gameWindow;
            const originalWidth = gameWindow.innerWidth;
            const originalHeight = gameWindow.innerHeight;
            
            // Testar diferentes tamanhos de tela
            const testSizes = [
                { width: 320, height: 568 },   // iPhone SE
                { width: 375, height: 667 },   // iPhone 8
                { width: 768, height: 1024 },  // iPad
                { width: 1920, height: 1080 }  // Desktop
            ];
            
            for (const size of testSizes) {
                gameWindow.resizeTo(size.width, size.height);
                await this.sleep(500);
                
                // Verificar se elementos ainda são visíveis
                const gameGrid = gameWindow.document.getElementById('game-grid');
                if (!gameGrid || gameGrid.offsetWidth === 0) {
                    throw new Error(`Grid não visível em ${size.width}x${size.height}`);
                }
            }
            
            // Restaurar tamanho original
            gameWindow.resizeTo(originalWidth, originalHeight);
            
            this.passTest('Design responsivo');
            
        } catch (error) {
            this.failTest('Design responsivo', error.message);
        }
    }

    /**
     * Testa eventos touch
     */
    async testTouchEvents() {
        this.log('👆 Testando eventos touch...');
        
        try {
            const gameDocument = this.gameWindow.document;
            const gameGrid = gameDocument.getElementById('game-grid');
            
            if (!gameGrid) {
                throw new Error('Grid do jogo não encontrado');
            }
            
            // Simular evento touch
            const touchEvent = new TouchEvent('touchstart', {
                touches: [{
                    clientX: 100,
                    clientY: 100,
                    target: gameGrid
                }]
            });
            
            gameGrid.dispatchEvent(touchEvent);
            
            this.passTest('Eventos touch');
            
        } catch (error) {
            this.failTest('Eventos touch', error.message);
        }
    }

    /**
     * Utilitários para simulação
     */
    async startGame() {
        const gameDocument = this.gameWindow.document;
        const startBtn = gameDocument.getElementById('start-btn');
        
        if (startBtn && startBtn.offsetParent !== null) {
            startBtn.click();
            await this.sleep(500);
        }
    }

    async simulateClick() {
        const gameDocument = this.gameWindow.document;
        const gameGrid = gameDocument.getElementById('game-grid');
        
        if (gameGrid) {
            const squares = gameGrid.querySelectorAll('.game-square');
            if (squares.length > 0) {
                const randomSquare = squares[Math.floor(Math.random() * squares.length)];
                randomSquare.click();
            }
        }
    }

    async simulateCorrectClick() {
        const gameDocument = this.gameWindow.document;
        const gameGrid = gameDocument.getElementById('game-grid');
        
        if (gameGrid) {
            const correctSquares = gameGrid.querySelectorAll('[data-correct="true"]');
            if (correctSquares.length > 0) {
                const randomSquare = correctSquares[Math.floor(Math.random() * correctSquares.length)];
                randomSquare.click();
            }
        }
    }

    async simulateSquareClick(square) {
        if (square) {
            square.click();
        }
    }

    async completeRound() {
        const gameDocument = this.gameWindow.document;
        const gameGrid = gameDocument.getElementById('game-grid');
        
        if (gameGrid) {
            const correctSquares = gameGrid.querySelectorAll('[data-correct="true"]');
            for (const square of correctSquares) {
                square.click();
                await this.sleep(50);
            }
        }
    }

    /**
     * Utilitários de teste
     */
    passTest(testName) {
        this.results.passed++;
        this.results.total++;
        this.log(`✅ ${testName}: PASSOU`);
    }

    failTest(testName, error) {
        this.results.failed++;
        this.results.total++;
        this.log(`❌ ${testName}: FALHOU - ${error}`, 'error');
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;
        this.testLog.push(logEntry);
        console.log(logEntry);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Gera relatório final
     */
    generateReport() {
        this.results.endTime = performance.now();
        const totalTime = this.results.endTime - this.results.startTime;
        
        this.log('='.repeat(50));
        this.log('📊 RELATÓRIO FINAL DOS TESTES');
        this.log('='.repeat(50));
        this.log(`⏱️  Tempo total: ${(totalTime / 1000).toFixed(2)}s`);
        this.log(`✅ Testes passou: ${this.results.passed}`);
        this.log(`❌ Testes falhou: ${this.results.failed}`);
        this.log(`📈 Total de testes: ${this.results.total}`);
        this.log(`🎯 Taxa de sucesso: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
        this.log('='.repeat(50));
        
        // Salvar relatório
        this.saveReport();
    }

    /**
     * Salva relatório em arquivo
     */
    saveReport() {
        const report = {
            timestamp: new Date().toISOString(),
            results: this.results,
            log: this.testLog
        };
        
        const reportJson = JSON.stringify(report, null, 2);
        const blob = new Blob([reportJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `test-report-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Exportar para uso global
window.GameTestSuite = GameTestSuite;

// Auto-executar se chamado diretamente
if (typeof window !== 'undefined' && window.location.pathname.includes('test-panel')) {
    document.addEventListener('DOMContentLoaded', () => {
        const testSuite = new GameTestSuite();
        
        // Adicionar botão para executar todos os testes
        const runAllButton = document.createElement('button');
        runAllButton.textContent = '🚀 Executar Todos os Testes';
        runAllButton.className = 'btn btn-success';
        runAllButton.style.marginTop = '20px';
        runAllButton.onclick = async () => {
            await testSuite.initialize();
            await testSuite.runAllTests();
        };
        
        document.querySelector('.container').appendChild(runAllButton);
    });
}
