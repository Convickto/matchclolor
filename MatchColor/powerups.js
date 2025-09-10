// Power-ups and Boosters System for Match Colors Pro
class PowerUpSystem {
    constructor() {
        this.activePowerUps = new Map();
        this.availablePowerUps = new Map();
        this.coins = 0;
        this.powerUpQueue = [];
        
        this.initializePowerUps();
        this.loadCoins();
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
            description: 'Aumenta o multiplicador de combo',
            icon: '🔥',
            cost: 200,
            duration: 45,
            effect: 'boostCombo',
            value: 1.5,
            rarity: 'epic'
        });

        // Life power-ups
        this.addPowerUp('extra_life', {
            id: 'extra_life',
            name: 'Vida Extra',
            description: 'Adiciona uma vida extra',
            icon: '❤️',
            cost: 75,
            duration: 0, // Instant effect
            effect: 'addLife',
            value: 1,
            rarity: 'common'
        });

        this.addPowerUp('shield', {
            id: 'shield',
            name: 'Escudo',
            description: 'Protege contra 3 erros',
            icon: '🛡️',
            cost: 120,
            duration: 0, // Until used
            effect: 'shield',
            value: 3,
            rarity: 'rare'
        });

        // Visual power-ups
        this.addPowerUp('color_highlight', {
            id: 'color_highlight',
            name: 'Destaque de Cores',
            description: 'Destaca as cores diferentes por 20 segundos',
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
            description: 'Reduz a velocidade do jogo por 15 segundos',
            icon: '🐌',
            cost: 100,
            duration: 15,
            effect: 'slowMotion',
            value: 0.5,
            rarity: 'rare'
        });

        // Special power-ups
        this.addPowerUp('rainbow_vision', {
            id: 'rainbow_vision',
            name: 'Visão Arco-íris',
            description: 'Mostra todas as cores diferentes por 10 segundos',
            icon: '🌈',
            cost: 300,
            duration: 10,
            effect: 'revealAll',
            value: 1,
            rarity: 'legendary'
        });

        this.addPowerUp('auto_click', {
            id: 'auto_click',
            name: 'Clique Automático',
            description: 'Clica automaticamente nas cores corretas por 8 segundos',
            icon: '🤖',
            cost: 250,
            duration: 8,
            effect: 'autoClick',
            value: 1,
            rarity: 'epic'
        });

        // Luck power-ups
        this.addPowerUp('lucky_streak', {
            id: 'lucky_streak',
            name: 'Sequência da Sorte',
            description: 'Próximos 5 cliques corretos dão pontos extras',
            icon: '🍀',
            cost: 180,
            duration: 0, // Until used
            effect: 'luckyStreak',
            value: 5,
            rarity: 'rare'
        });

        this.addPowerUp('second_chance', {
            id: 'second_chance',
            name: 'Segunda Chance',
            description: 'Permite um erro sem perder vida',
            icon: '🔄',
            cost: 90,
            duration: 0, // Until used
            effect: 'secondChance',
            value: 1,
            rarity: 'common'
        });
    }

    addPowerUp(id, powerUp) {
        this.availablePowerUps.set(id, powerUp);
    }

    activatePowerUp(powerUpId, gameInstance) {
        const powerUp = this.availablePowerUps.get(powerUpId);
        if (!powerUp) return false;

        if (this.coins < powerUp.cost) {
            this.showMessage('Moedas insuficientes!', 'error');
            return false;
        }

        this.coins -= powerUp.cost;
        this.saveCoins();

        // Apply power-up effect
        const result = this.applyPowerUpEffect(powerUp, gameInstance);
        
        if (result) {
            this.showMessage(`${powerUp.name} ativado!`, 'success');
            this.playPowerUpSound(powerUp.rarity);
        }

        return result;
    }

    applyPowerUpEffect(powerUp, gameInstance) {
        switch (powerUp.effect) {
            case 'addTime':
                gameInstance.state.timeLeft += powerUp.value;
                gameInstance.updateUI();
                break;

            case 'freezeTime':
                this.activePowerUps.set(powerUp.id, {
                    ...powerUp,
                    startTime: Date.now(),
                    gameInstance: gameInstance
                });
                gameInstance.freezeTimer = true;
                break;

            case 'multiplyScore':
                this.activePowerUps.set(powerUp.id, {
                    ...powerUp,
                    startTime: Date.now(),
                    gameInstance: gameInstance
                });
                gameInstance.scoreMultiplier = powerUp.value;
                break;

            case 'boostCombo':
                this.activePowerUps.set(powerUp.id, {
                    ...powerUp,
                    startTime: Date.now(),
                    gameInstance: gameInstance
                });
                gameInstance.comboMultiplier = powerUp.value;
                break;

            case 'addLife':
                gameInstance.state.lives += powerUp.value;
                gameInstance.updateUI();
                break;

            case 'shield':
                this.activePowerUps.set(powerUp.id, {
                    ...powerUp,
                    startTime: Date.now(),
                    gameInstance: gameInstance,
                    uses: powerUp.value
                });
                gameInstance.shieldActive = true;
                break;

            case 'highlightColors':
                this.activePowerUps.set(powerUp.id, {
                    ...powerUp,
                    startTime: Date.now(),
                    gameInstance: gameInstance
                });
                this.highlightDifferentColors(gameInstance);
                break;

            case 'slowMotion':
                this.activePowerUps.set(powerUp.id, {
                    ...powerUp,
                    startTime: Date.now(),
                    gameInstance: gameInstance
                });
                gameInstance.gameSpeed = powerUp.value;
                break;

            case 'revealAll':
                this.activePowerUps.set(powerUp.id, {
                    ...powerUp,
                    startTime: Date.now(),
                    gameInstance: gameInstance
                });
                this.revealAllColors(gameInstance);
                break;

            case 'autoClick':
                this.activePowerUps.set(powerUp.id, {
                    ...powerUp,
                    startTime: Date.now(),
                    gameInstance: gameInstance
                });
                this.startAutoClick(gameInstance);
                break;

            case 'luckyStreak':
                this.activePowerUps.set(powerUp.id, {
                    ...powerUp,
                    startTime: Date.now(),
                    gameInstance: gameInstance,
                    uses: powerUp.value
                });
                gameInstance.luckyStreakActive = true;
                break;

            case 'secondChance':
                this.activePowerUps.set(powerUp.id, {
                    ...powerUp,
                    startTime: Date.now(),
                    gameInstance: gameInstance,
                    uses: powerUp.value
                });
                gameInstance.secondChanceActive = true;
                break;

            default:
                return false;
        }

        return true;
    }

    updatePowerUps() {
        const now = Date.now();
        const expiredPowerUps = [];

        this.activePowerUps.forEach((powerUp, id) => {
            const elapsed = (now - powerUp.startTime) / 1000;
            
            if (powerUp.duration > 0 && elapsed >= powerUp.duration) {
                expiredPowerUps.push(id);
            }
        });

        expiredPowerUps.forEach(id => {
            this.deactivatePowerUp(id);
        });
    }

    deactivatePowerUp(powerUpId) {
        const powerUp = this.activePowerUps.get(powerUpId);
        if (!powerUp) return;

        const gameInstance = powerUp.gameInstance;

        switch (powerUp.effect) {
            case 'freezeTime':
                gameInstance.freezeTimer = false;
                break;

            case 'multiplyScore':
                gameInstance.scoreMultiplier = 1;
                break;

            case 'boostCombo':
                gameInstance.comboMultiplier = 1;
                break;

            case 'shield':
                gameInstance.shieldActive = false;
                break;

            case 'highlightColors':
                this.removeColorHighlights(gameInstance);
                break;

            case 'slowMotion':
                gameInstance.gameSpeed = 1;
                break;

            case 'revealAll':
                this.hideRevealedColors(gameInstance);
                break;

            case 'autoClick':
                this.stopAutoClick(gameInstance);
                break;

            case 'luckyStreak':
                gameInstance.luckyStreakActive = false;
                break;

            case 'secondChance':
                gameInstance.secondChanceActive = false;
                break;
        }

        this.activePowerUps.delete(powerUpId);
        this.showMessage(`${powerUp.name} expirou!`, 'info');
    }

    highlightDifferentColors(gameInstance) {
        const squares = gameInstance.elements.gameGrid.querySelectorAll('.game-square');
        squares.forEach(square => {
            if (square.dataset.isDifferent === 'true') {
                square.style.boxShadow = '0 0 30px #f59e0b, 0 0 60px #f59e0b';
                square.style.animation = 'pulse 1s infinite';
            }
        });
    }

    removeColorHighlights(gameInstance) {
        const squares = gameInstance.elements.gameGrid.querySelectorAll('.game-square');
        squares.forEach(square => {
            square.style.boxShadow = '';
            square.style.animation = '';
        });
    }

    revealAllColors(gameInstance) {
        const squares = gameInstance.elements.gameGrid.querySelectorAll('.game-square');
        squares.forEach(square => {
            if (square.dataset.isDifferent === 'true') {
                square.style.opacity = '0.7';
                square.style.border = '3px solid #f59e0b';
            }
        });
    }

    hideRevealedColors(gameInstance) {
        const squares = gameInstance.elements.gameGrid.querySelectorAll('.game-square');
        squares.forEach(square => {
            square.style.opacity = '';
            square.style.border = '';
        });
    }

    startAutoClick(gameInstance) {
        gameInstance.autoClickInterval = setInterval(() => {
            const correctSquares = gameInstance.elements.gameGrid.querySelectorAll('.game-square[data-is-different="true"]');
            if (correctSquares.length > 0) {
                const randomSquare = correctSquares[Math.floor(Math.random() * correctSquares.length)];
                gameInstance.handleSquareClick(randomSquare);
            }
        }, 500);
    }

    stopAutoClick(gameInstance) {
        if (gameInstance.autoClickInterval) {
            clearInterval(gameInstance.autoClickInterval);
            gameInstance.autoClickInterval = null;
        }
    }

    useShield(gameInstance) {
        const shieldPowerUp = Array.from(this.activePowerUps.values())
            .find(p => p.effect === 'shield');
        
        if (shieldPowerUp && shieldPowerUp.uses > 0) {
            shieldPowerUp.uses--;
            if (shieldPowerUp.uses <= 0) {
                this.deactivatePowerUp(shieldPowerUp.id);
            }
            return true;
        }
        return false;
    }

    useSecondChance(gameInstance) {
        const secondChancePowerUp = Array.from(this.activePowerUps.values())
            .find(p => p.effect === 'secondChance');
        
        if (secondChancePowerUp && secondChancePowerUp.uses > 0) {
            secondChancePowerUp.uses--;
            if (secondChancePowerUp.uses <= 0) {
                this.deactivatePowerUp(secondChancePowerUp.id);
            }
            return true;
        }
        return false;
    }

    useLuckyStreak(gameInstance) {
        const luckyStreakPowerUp = Array.from(this.activePowerUps.values())
            .find(p => p.effect === 'luckyStreak');
        
        if (luckyStreakPowerUp && luckyStreakPowerUp.uses > 0) {
            luckyStreakPowerUp.uses--;
            if (luckyStreakPowerUp.uses <= 0) {
                this.deactivatePowerUp(luckyStreakPowerUp.id);
            }
            return true;
        }
        return false;
    }

    addCoins(amount) {
        this.coins += amount;
        this.saveCoins();
        this.showMessage(`+${amount} moedas!`, 'success');
    }

    getCoins() {
        return this.coins;
    }

    getPowerUpsByRarity(rarity) {
        return Array.from(this.availablePowerUps.values())
            .filter(p => p.rarity === rarity);
    }

    getActivePowerUps() {
        return Array.from(this.activePowerUps.values());
    }

    showMessage(text, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `powerup-message ${type}`;
        messageEl.textContent = text;
        
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
            z-index: 1000;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            animation: messageSlide 3s ease-in-out forwards;
        `;
        
        // Add animation keyframes
        if (!document.querySelector('#message-animations')) {
            const style = document.createElement('style');
            style.id = 'message-animations';
            style.textContent = `
                @keyframes messageSlide {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }

    playPowerUpSound(rarity) {
        // Different sounds for different rarities
        const sounds = {
            common: () => console.log('Common power-up sound'),
            rare: () => console.log('Rare power-up sound'),
            epic: () => console.log('Epic power-up sound'),
            legendary: () => console.log('Legendary power-up sound')
        };
        
        if (sounds[rarity]) {
            sounds[rarity]();
        }
    }

    saveCoins() {
        localStorage.setItem('matchColors_coins', this.coins.toString());
    }

    loadCoins() {
        const saved = localStorage.getItem('matchColors_coins');
        if (saved) {
            this.coins = parseInt(saved) || 0;
        }
    }

    reset() {
        this.activePowerUps.clear();
        this.coins = 0;
        this.saveCoins();
    }
}

// Export for use in main game
window.PowerUpSystem = PowerUpSystem;
