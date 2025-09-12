/**
 * Achievement System - Ultra Performance Edition
 * Sistema de conquistas otimizado para máxima performance
 */
class AchievementSystem {
    constructor() {
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.progress = new Map();
        this.notifications = [];
        this.notificationQueue = [];
        this.isProcessing = false;
        
        this.initializeAchievements();
        this.loadProgress();
        this.startNotificationProcessor();
    }

    initializeAchievements() {
        // Score-based achievements
        this.addAchievement('first_steps', {
            id: 'first_steps',
            name: 'Primeiros Passos',
            description: 'Alcance 100 pontos',
            icon: '👶',
            category: 'score',
            requirement: 100,
            reward: { coins: 10, xp: 50 }
        });

        this.addAchievement('century', {
            id: 'century',
            name: 'Centenário',
            description: 'Alcance 1.000 pontos',
            icon: '💯',
            category: 'score',
            requirement: 1000,
            reward: { coins: 50, xp: 200 }
        });

        this.addAchievement('millennium', {
            id: 'millennium',
            name: 'Milênio',
            description: 'Alcance 10.000 pontos',
            icon: '🏆',
            category: 'score',
            requirement: 10000,
            reward: { coins: 200, xp: 1000 }
        });

        // Streak achievements
        this.addAchievement('hot_streak', {
            id: 'hot_streak',
            name: 'Sequência Quente',
            description: 'Alcance uma sequência de 10 acertos',
            icon: '🔥',
            category: 'streak',
            requirement: 10,
            reward: { coins: 25, xp: 100 }
        });

        this.addAchievement('unstoppable', {
            id: 'unstoppable',
            name: 'Imparável',
            description: 'Alcance uma sequência de 25 acertos',
            icon: '⚡',
            category: 'streak',
            requirement: 25,
            reward: { coins: 75, xp: 300 }
        });

        this.addAchievement('legendary', {
            id: 'legendary',
            name: 'Lendário',
            description: 'Alcance uma sequência de 50 acertos',
            icon: '👑',
            category: 'streak',
            requirement: 50,
            reward: { coins: 200, xp: 1000 }
        });

        // Level achievements
        this.addAchievement('ten_levels', {
            id: 'ten_levels',
            name: 'Dez Níveis',
            description: 'Complete 10 níveis',
            icon: '🔟',
            category: 'level',
            requirement: 10,
            reward: { coins: 30, xp: 150 }
        });

        this.addAchievement('twenty_five_levels', {
            id: 'twenty_five_levels',
            name: 'Vinte e Cinco',
            description: 'Complete 25 níveis',
            icon: '2️⃣5️⃣',
            category: 'level',
            requirement: 25,
            reward: { coins: 100, xp: 500 }
        });

        this.addAchievement('fifty_levels', {
            id: 'fifty_levels',
            name: 'Meio Século',
            description: 'Complete 50 níveis',
            icon: '5️⃣0️⃣',
            category: 'level',
            requirement: 50,
            reward: { coins: 300, xp: 1500 }
        });

        // Game mode achievements
        this.addAchievement('classic_master', {
            id: 'classic_master',
            name: 'Mestre Clássico',
            description: 'Complete 10 jogos no modo Clássico',
            icon: '🎮',
            category: 'mode',
            requirement: 10,
            reward: { coins: 50, xp: 250 }
        });

        this.addAchievement('survival_expert', {
            id: 'survival_expert',
            name: 'Especialista em Sobrevivência',
            description: 'Complete 5 jogos no modo Sobrevivência',
            icon: '⚡',
            category: 'mode',
            requirement: 5,
            reward: { coins: 75, xp: 350 }
        });

        this.addAchievement('zen_master', {
            id: 'zen_master',
            name: 'Mestre Zen',
            description: 'Complete 20 jogos no modo Zen',
            icon: '🧘',
            category: 'mode',
            requirement: 20,
            reward: { coins: 100, xp: 500 }
        });

        this.addAchievement('challenge_champion', {
            id: 'challenge_champion',
            name: 'Campeão do Desafio',
            description: 'Complete 3 jogos no modo Desafio',
            icon: '🏆',
            category: 'mode',
            requirement: 3,
            reward: { coins: 150, xp: 750 }
        });

        // Speed achievements
        this.addAchievement('speed_demon', {
            id: 'speed_demon',
            name: 'Demônio da Velocidade',
            description: 'Complete uma rodada em menos de 3 segundos',
            icon: '💨',
            category: 'speed',
            requirement: 3,
            reward: { coins: 40, xp: 200 }
        });

        this.addAchievement('lightning', {
            id: 'lightning',
            name: 'Raio',
            description: 'Complete uma rodada em menos de 1 segundo',
            icon: '⚡',
            category: 'speed',
            requirement: 1,
            reward: { coins: 100, xp: 500 }
        });

        // Special achievements
        this.addAchievement('perfect_game', {
            id: 'perfect_game',
            name: 'Jogo Perfeito',
            description: 'Complete um jogo sem erros',
            icon: '✨',
            category: 'special',
            requirement: 1,
            reward: { coins: 200, xp: 1000 }
        });

        this.addAchievement('night_owl', {
            id: 'night_owl',
            name: 'Coruja Noturna',
            description: 'Jogue entre 22h e 6h',
            icon: '🦉',
            category: 'special',
            requirement: 1,
            reward: { coins: 50, xp: 250 }
        });

        this.addAchievement('early_bird', {
            id: 'early_bird',
            name: 'Madrugador',
            description: 'Jogue entre 5h e 8h',
            icon: '🐦',
            category: 'special',
            requirement: 1,
            reward: { coins: 50, xp: 250 }
        });

        // Collection achievements
        this.addAchievement('collector', {
            id: 'collector',
            name: 'Colecionador',
            description: 'Desbloqueie 10 conquistas',
            icon: '📚',
            category: 'collection',
            requirement: 10,
            reward: { coins: 100, xp: 500 }
        });

        this.addAchievement('achievement_hunter', {
            id: 'achievement_hunter',
            name: 'Caçador de Conquistas',
            description: 'Desbloqueie 20 conquistas',
            icon: '🎯',
            category: 'collection',
            requirement: 20,
            reward: { coins: 250, xp: 1250 }
        });

        this.addAchievement('completionist', {
            id: 'completionist',
            name: 'Completista',
            description: 'Desbloqueie todas as conquistas',
            icon: '🏅',
            category: 'collection',
            requirement: this.achievements.size,
            reward: { coins: 500, xp: 2500 }
        });
    }

    addAchievement(id, achievement) {
        this.achievements.set(id, achievement);
        this.progress.set(id, 0);
    }

    checkAchievements(gameState) {
        // Check score achievements
        this.checkScoreAchievements(gameState.score);
        
        // Check streak achievements
        this.checkStreakAchievements(gameState.streak);
        
        // Check level achievements
        this.checkLevelAchievements(gameState.level);
        
        // Check mode achievements
        this.checkModeAchievements(gameState.gameMode);
        
        // Check special achievements
        this.checkSpecialAchievements(gameState);
        
        // Check collection achievements
        this.checkCollectionAchievements();
    }

    checkScoreAchievements(score) {
        const scoreAchievements = ['first_steps', 'century', 'millennium'];
        scoreAchievements.forEach(id => {
            if (!this.unlockedAchievements.has(id)) {
                const achievement = this.achievements.get(id);
                if (score >= achievement.requirement) {
                    this.unlockAchievement(id);
                }
            }
        });
    }

    checkStreakAchievements(streak) {
        const streakAchievements = ['hot_streak', 'unstoppable', 'legendary'];
        streakAchievements.forEach(id => {
            if (!this.unlockedAchievements.has(id)) {
                const achievement = this.achievements.get(id);
                if (streak >= achievement.requirement) {
                    this.unlockAchievement(id);
                }
            }
        });
    }

    checkLevelAchievements(level) {
        const levelAchievements = ['ten_levels', 'twenty_five_levels', 'fifty_levels'];
        levelAchievements.forEach(id => {
            if (!this.unlockedAchievements.has(id)) {
                const achievement = this.achievements.get(id);
                if (level >= achievement.requirement) {
                    this.unlockAchievement(id);
                }
            }
        });
    }

    checkModeAchievements(gameMode) {
        const modeAchievements = ['classic_master', 'survival_expert', 'zen_master', 'challenge_champion'];
        modeAchievements.forEach(id => {
            if (!this.unlockedAchievements.has(id)) {
                const achievement = this.achievements.get(id);
                const currentProgress = this.progress.get(id) || 0;
                this.progress.set(id, currentProgress + 1);
                
                if (currentProgress + 1 >= achievement.requirement) {
                    this.unlockAchievement(id);
                }
            }
        });
    }

    checkSpecialAchievements(gameState) {
        // Check perfect game
        if (!this.unlockedAchievements.has('perfect_game') && gameState.lives > 0) {
            this.unlockAchievement('perfect_game');
        }
        
        // Check time-based achievements
        const hour = new Date().getHours();
        if (hour >= 22 || hour <= 6) {
            if (!this.unlockedAchievements.has('night_owl')) {
                this.unlockAchievement('night_owl');
            }
        }
        
        if (hour >= 5 && hour <= 8) {
            if (!this.unlockedAchievements.has('early_bird')) {
                this.unlockAchievement('early_bird');
            }
        }
    }

    checkCollectionAchievements() {
        const unlockedCount = this.unlockedAchievements.size;
        const collectionAchievements = ['collector', 'achievement_hunter', 'completionist'];
        
        collectionAchievements.forEach(id => {
            if (!this.unlockedAchievements.has(id)) {
                const achievement = this.achievements.get(id);
                if (unlockedCount >= achievement.requirement) {
                    this.unlockAchievement(id);
                }
            }
        });
    }

    unlockAchievement(id) {
        if (this.unlockedAchievements.has(id)) return;
        
        const achievement = this.achievements.get(id);
        if (!achievement) return;
        
        this.unlockedAchievements.add(id);
        this.notificationQueue.push(achievement);
        this.saveProgress();
    }

    startNotificationProcessor() {
        setInterval(() => {
            if (this.notificationQueue.length > 0 && !this.isProcessing) {
                this.processNotification();
            }
        }, 100);
    }

    processNotification() {
        if (this.notificationQueue.length === 0) return;
        
        this.isProcessing = true;
        const achievement = this.notificationQueue.shift();
        this.showNotification(achievement);
        
        setTimeout(() => {
            this.isProcessing = false;
        }, 3000);
    }

    showNotification(achievement) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-text">
                    <div class="achievement-title">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        // Add content styles
        const style = document.createElement('style');
        style.textContent = `
            .achievement-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .achievement-icon {
                font-size: 2rem;
            }
            .achievement-title {
                font-weight: 700;
                font-size: 1.1rem;
                margin-bottom: 5px;
            }
            .achievement-description {
                font-size: 0.9rem;
                opacity: 0.9;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 2500);
    }

    getAchievements() {
        return Array.from(this.achievements.values());
    }

    getUnlockedAchievements() {
        return Array.from(this.unlockedAchievements);
    }

    getProgress() {
        return Object.fromEntries(this.progress);
    }

    saveProgress() {
        const data = {
            unlocked: Array.from(this.unlockedAchievements),
            progress: Object.fromEntries(this.progress)
        };
        localStorage.setItem('matchColors_achievements', JSON.stringify(data));
    }

    loadProgress() {
        try {
            const data = localStorage.getItem('matchColors_achievements');
            if (data) {
                const parsed = JSON.parse(data);
                this.unlockedAchievements = new Set(parsed.unlocked || []);
                this.progress = new Map(Object.entries(parsed.progress || {}));
            }
        } catch (error) {
            console.warn('Failed to load achievement progress:', error);
        }
    }

    resetProgress() {
        this.unlockedAchievements.clear();
        this.progress.clear();
        this.saveProgress();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementSystem;
}