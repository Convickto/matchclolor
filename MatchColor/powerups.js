/**
 * Power-ups and Boosters System - Ultra Performance Edition
 * Sistema de power-ups otimizado para máxima performance
 */
class PowerUpSystem {
    constructor() {
        this.activePowerUps = new Map();
        this.availablePowerUps = new Map();
        this.coins = 0;
        this.powerUpQueue = [];
        this.isProcessing = false;
        
        this.initializePowerUps();
        this.loadCoins();
        this.startPowerUpProcessor();
    }

    initializePowerUps() {
        // Time-based power-ups
        this.addPowerUp('time_boost', {
            id: 'time_boost',
            name: 'Boost de Tempo',
            description: 'Adiciona 15 segundos ao timer',
            icon: '⏰',
            cost: 50,
            duration: 0, // Instant effect
            effect: 'addTime',
            value: 15,
            rarity: 'common'
        });

        this.addPowerUp('time_freeze', {
            id: 'time_freeze',
            name: 'Congelar Tempo',
            description: 'Pausa o timer por 10 segundos',
            icon: '❄️',
            cost: 100,
            duration: 10,
            effect: 'freezeTime',
            value: 10,
            rarity: 'rare'
        });

        // Score power-ups
        this.addPowerUp('score_multiplier', {
            id: 'score_multiplier',
            name: 'Multiplicador de Pontos',
            description: 'Dobra os pontos por 30 segundos',
            icon: '💎',
            cost: 150,
            duration: 30,
            effect: 'multiplyScore',
            value: 2,
            rarity: 'rare'
        });

        this.addPowerUp('combo_boost', {
            id: 'combo_boost',
            name: 'Boost de Combo',
            description: 'Aumenta multiplicador de combo por 20 segundos',
            icon: '🔥',
            cost: 120,
            duration: 20,
            effect: 'boostCombo',
            value: 1.5,
            rarity: 'rare'
        });

        // Visual power-ups
        this.addPowerUp('color_highlight', {
            id: 'color_highlight',
            name: 'Destaque de Cores',
            description: 'Destaca cores diferentes por 20 segundos',
            icon: '✨',
            cost: 80,
            duration: 20,
            effect: 'highlightColors',
            value: 1,
            rarity: 'common'
        });

        this.addPowerUp('slow_motion', {
            id: 'slow_motion',
            name: 'Câmera Lenta',
            description: 'Reduz velocidade do jogo por 15 segundos',
            icon: '🐌',
            cost: 100,
            duration: 15,
            effect: 'slowMotion',
            value: 0.5,
            rarity: 'rare'
        });

        // Life power-ups
        this.addPowerUp('extra_life', {
            id: 'extra_life',
            name: 'Vida Extra',
            description: 'Adiciona 1 vida',
            icon: '❤️',
            cost: 200,
            duration: 0, // Instant effect
            effect: 'addLife',
            value: 1,
            rarity: 'epic'
        });

        this.addPowerUp('second_chance', {
            id: 'second_chance',
            name: 'Segunda Chance',
            description: 'Protege contra 1 erro',
            icon: '🔄',
            cost: 150,
            duration: 0, // Until used
            effect: 'secondChance',
            value: 1,
            rarity: 'rare'
        });

        this.addPowerUp('shield', {
            id: 'shield',
            name: 'Escudo',
            description: 'Protege contra 3 erros',
            icon: '🛡️',
            cost: 300,
            duration: 0, // Until used
            effect: 'shield',
            value: 3,
            rarity: 'epic'
        });

        // Special power-ups
        this.addPowerUp('rainbow_vision', {
            id: 'rainbow_vision',
            name: 'Visão Arco-íris',
            description: 'Mostra todas as cores por 10 segundos',
            icon: '🌈',
            cost: 250,
            duration: 10,
            effect: 'rainbowVision',
            value: 1,
            rarity: 'legendary'
        });

        this.addPowerUp('auto_click', {
            id: 'auto_click',
            name: 'Clique Automático',
            description: 'Clica automaticamente por 8 segundos',
            icon: '🤖',
            cost: 200,
            duration: 8,
            effect: 'autoClick',
            value: 1,
            rarity: 'epic'
        });

        this.addPowerUp('lucky_streak', {
            id: 'lucky_streak',
            name: 'Sequência da Sorte',
            description: 'Próximos 5 cliques dão pontos extras',
            icon: '🍀',
            cost: 180,
            duration: 0, // Until used
            effect: 'luckyStreak',
            value: 5,
            rarity: 'rare'
        });
    }

    addPowerUp(id, powerUp) {
        this.availablePowerUps.set(id, powerUp);
    }

    getAvailablePowerUps() {
        return Array.from(this.availablePowerUps.values());
    }

    canAfford(powerUpId) {
        const powerUp = this.availablePowerUps.get(powerUpId);
        return powerUp && this.coins >= powerUp.cost;
    }

    buyPowerUp(powerUpId) {
        const powerUp = this.availablePowerUps.get(powerUpId);
        if (!powerUp || !this.canAfford(powerUpId)) {
            return false;
        }

        this.coins -= powerUp.cost;
        this.saveCoins();
        return true;
    }

    activatePowerUp(powerUpId, gameEngine) {
        const powerUp = this.availablePowerUps.get(powerUpId);
        if (!powerUp) return false;

        // Check if already active
        if (this.activePowerUps.has(powerUpId)) {
            return false;
        }

        // Apply effect
        const success = this.applyEffect(powerUp, gameEngine);
        if (success) {
            this.activePowerUps.set(powerUpId, {
                ...powerUp,
                startTime: Date.now(),
                endTime: powerUp.duration > 0 ? Date.now() + (powerUp.duration * 1000) : null
            });
        }

        return success;
    }

    applyEffect(powerUp, gameEngine) {
        switch (powerUp.effect) {
            case 'addTime':
                gameEngine.state.timeLeft += powerUp.value;
                return true;

            case 'freezeTime':
                gameEngine.freezeTimer = true;
                setTimeout(() => {
                    gameEngine.freezeTimer = false;
                }, powerUp.duration * 1000);
                return true;

            case 'multiplyScore':
                gameEngine.scoreMultiplier *= powerUp.value;
                setTimeout(() => {
                    gameEngine.scoreMultiplier /= powerUp.value;
                }, powerUp.duration * 1000);
                return true;

            case 'boostCombo':
                gameEngine.comboMultiplier *= powerUp.value;
                setTimeout(() => {
                    gameEngine.comboMultiplier /= powerUp.value;
                }, powerUp.duration * 1000);
                return true;

            case 'highlightColors':
                this.highlightColors(gameEngine);
                return true;

            case 'slowMotion':
                gameEngine.gameSpeed = powerUp.value;
                setTimeout(() => {
                    gameEngine.gameSpeed = 1;
                }, powerUp.duration * 1000);
                return true;

            case 'addLife':
                gameEngine.state.lives += powerUp.value;
                return true;

            case 'secondChance':
                gameEngine.secondChanceActive = true;
                gameEngine.secondChanceCount = powerUp.value;
                return true;

            case 'shield':
                gameEngine.shieldActive = true;
                gameEngine.shieldCount = powerUp.value;
                return true;

            case 'rainbowVision':
                this.rainbowVision(gameEngine);
                return true;

            case 'autoClick':
                this.autoClick(gameEngine);
                return true;

            case 'luckyStreak':
                gameEngine.luckyStreakActive = true;
                gameEngine.luckyStreakCount = powerUp.value;
                return true;

            default:
                return false;
        }
    }

    highlightColors(gameEngine) {
        const squares = gameEngine.elements.gameGrid.querySelectorAll('.game-square');
        squares.forEach(square => {
            if (square.dataset.correct === 'true') {
                square.style.boxShadow = '0 0 20px #f59e0b';
                square.style.animation = 'pulse 1s infinite';
            }
        });

        setTimeout(() => {
            squares.forEach(square => {
                square.style.boxShadow = '';
                square.style.animation = '';
            });
        }, 20000);
    }

    rainbowVision(gameEngine) {
        const squares = gameEngine.elements.gameGrid.querySelectorAll('.game-square');
        squares.forEach(square => {
            if (square.dataset.correct === 'true') {
                square.style.animation = 'rainbow 1s infinite';
            }
        });

        setTimeout(() => {
            squares.forEach(square => {
                square.style.animation = '';
            });
        }, 10000);
    }

    autoClick(gameEngine) {
        const squares = gameEngine.elements.gameGrid.querySelectorAll('.game-square[data-correct="true"]');
        let clickCount = 0;
        const maxClicks = Math.min(squares.length, 5);

        const clickInterval = setInterval(() => {
            if (clickCount >= maxClicks) {
                clearInterval(clickInterval);
                return;
            }

            const square = squares[clickCount];
            if (square && square.dataset.correct === 'true') {
                square.click();
                clickCount++;
            }
        }, 200);
    }

    useSecondChance(gameEngine) {
        if (gameEngine.secondChanceActive && gameEngine.secondChanceCount > 0) {
            gameEngine.secondChanceCount--;
            if (gameEngine.secondChanceCount <= 0) {
                gameEngine.secondChanceActive = false;
            }
            return true;
        }
        return false;
    }

    useShield(gameEngine) {
        if (gameEngine.shieldActive && gameEngine.shieldCount > 0) {
            gameEngine.shieldCount--;
            if (gameEngine.shieldCount <= 0) {
                gameEngine.shieldActive = false;
            }
            return true;
        }
        return false;
    }

    useLuckyStreak(gameEngine) {
        if (gameEngine.luckyStreakActive && gameEngine.luckyStreakCount > 0) {
            gameEngine.luckyStreakCount--;
            if (gameEngine.luckyStreakCount <= 0) {
                gameEngine.luckyStreakActive = false;
            }
            return true;
        }
        return false;
    }

    startPowerUpProcessor() {
        setInterval(() => {
            if (this.activePowerUps.size > 0 && !this.isProcessing) {
                this.processPowerUps();
            }
        }, 100);
    }

    processPowerUps() {
        this.isProcessing = true;
        const now = Date.now();
        const expiredPowerUps = [];

        this.activePowerUps.forEach((powerUp, id) => {
            if (powerUp.endTime && now >= powerUp.endTime) {
                expiredPowerUps.push(id);
            }
        });

        expiredPowerUps.forEach(id => {
            this.activePowerUps.delete(id);
        });

        this.isProcessing = false;
    }

    addCoins(amount) {
        this.coins += amount;
        this.saveCoins();
    }

    getCoins() {
        return this.coins;
    }

    saveCoins() {
        localStorage.setItem('matchColors_coins', this.coins.toString());
    }

    loadCoins() {
        try {
            const saved = localStorage.getItem('matchColors_coins');
            if (saved) {
                this.coins = parseInt(saved, 10) || 0;
            }
        } catch (error) {
            console.warn('Failed to load coins:', error);
            this.coins = 0;
        }
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `powerup-message ${type}`;
        messageEl.textContent = message;
        
        messageEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: fadeInOut 2s ease;
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
            style.remove();
        }, 2000);
    }

    reset() {
        this.activePowerUps.clear();
        this.coins = 0;
        this.saveCoins();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PowerUpSystem;
}