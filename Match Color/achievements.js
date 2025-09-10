// Achievement System for Match Colors Pro
class AchievementSystem {
    constructor() {
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.progress = new Map();
        this.notifications = [];
        
        this.initializeAchievements();
        this.loadProgress();
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
            reward: { coins: 150, xp: 750 }
        });

        // Level achievements
        this.addAchievement('level_10', {
            id: 'level_10',
            name: 'Dez Níveis',
            description: 'Alcance o nível 10',
            icon: '🔟',
            category: 'level',
            requirement: 10,
            reward: { coins: 30, xp: 150 }
        });

        this.addAchievement('level_25', {
            id: 'level_25',
            name: 'Vinte e Cinco',
            description: 'Alcance o nível 25',
            icon: '🎯',
            category: 'level',
            requirement: 25,
            reward: { coins: 100, xp: 500 }
        });

        this.addAchievement('level_50', {
            id: 'level_50',
            name: 'Meio Século',
            description: 'Alcance o nível 50',
            icon: '🌟',
            category: 'level',
            requirement: 50,
            reward: { coins: 250, xp: 1250 }
        });

        // Game mode achievements
        this.addAchievement('classic_master', {
            id: 'classic_master',
            name: 'Mestre Clássico',
            description: 'Jogue 10 partidas no modo Clássico',
            icon: '🎮',
            category: 'games',
            requirement: 10,
            reward: { coins: 40, xp: 200 }
        });

        this.addAchievement('survival_expert', {
            id: 'survival_expert',
            name: 'Especialista em Sobrevivência',
            description: 'Jogue 5 partidas no modo Sobrevivência',
            icon: '⚔️',
            category: 'games',
            requirement: 5,
            reward: { coins: 60, xp: 300 }
        });

        this.addAchievement('zen_master', {
            id: 'zen_master',
            name: 'Mestre Zen',
            description: 'Jogue 20 partidas no modo Zen',
            icon: '🧘',
            category: 'games',
            requirement: 20,
            reward: { coins: 80, xp: 400 }
        });

        // Speed achievements
        this.addAchievement('speed_demon', {
            id: 'speed_demon',
            name: 'Demônio da Velocidade',
            description: 'Complete uma rodada em menos de 5 segundos',
            icon: '💨',
            category: 'speed',
            requirement: 5,
            reward: { coins: 35, xp: 175 }
        });

        this.addAchievement('lightning', {
            id: 'lightning',
            name: 'Raio',
            description: 'Complete uma rodada em menos de 3 segundos',
            icon: '⚡',
            category: 'speed',
            requirement: 3,
            reward: { coins: 70, xp: 350 }
        });

        // Special achievements
        this.addAchievement('perfect_game', {
            id: 'perfect_game',
            name: 'Jogo Perfeito',
            description: 'Complete um jogo sem erros',
            icon: '💎',
            category: 'special',
            requirement: 1,
            reward: { coins: 100, xp: 500 }
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
            icon: '🏅',
            category: 'collection',
            requirement: 10,
            reward: { coins: 100, xp: 500 }
        });

        this.addAchievement('achievement_hunter', {
            id: 'achievement_hunter',
            name: 'Caçador de Conquistas',
            description: 'Desbloqueie 25 conquistas',
            icon: '🎖️',
            category: 'collection',
            requirement: 25,
            reward: { coins: 250, xp: 1250 }
        });

        this.addAchievement('completionist', {
            id: 'completionist',
            name: 'Completista',
            description: 'Desbloqueie todas as conquistas',
            icon: '🏆',
            category: 'collection',
            requirement: this.achievements.size,
            reward: { coins: 500, xp: 2500 }
        });
    }

    addAchievement(id, achievement) {
        this.achievements.set(id, achievement);
        this.progress.set(id, 0);
    }

    updateProgress(achievementId, value) {
        if (!this.achievements.has(achievementId)) return;
        
        const achievement = this.achievements.get(achievementId);
        const currentProgress = this.progress.get(achievementId) || 0;
        
        if (achievement.category === 'score' || achievement.category === 'level') {
            this.progress.set(achievementId, Math.max(currentProgress, value));
        } else {
            this.progress.set(achievementId, currentProgress + value);
        }
        
        this.checkUnlock(achievementId);
    }

    checkUnlock(achievementId) {
        const achievement = this.achievements.get(achievementId);
        const currentProgress = this.progress.get(achievementId) || 0;
        
        if (!this.unlockedAchievements.has(achievementId) && currentProgress >= achievement.requirement) {
            this.unlockAchievement(achievementId);
        }
    }

    unlockAchievement(achievementId) {
        if (this.unlockedAchievements.has(achievementId)) return;
        
        const achievement = this.achievements.get(achievementId);
        this.unlockedAchievements.add(achievementId);
        
        // Create notification
        this.createNotification(achievement);
        
        // Save progress
        this.saveProgress();
        
        return achievement;
    }

    createNotification(achievement) {
        const notification = {
            id: Date.now(),
            achievement: achievement,
            timestamp: new Date(),
            shown: false
        };
        
        this.notifications.push(notification);
        this.showNotification(notification);
    }

    showNotification(notification) {
        // Create notification element
        const notificationEl = document.createElement('div');
        notificationEl.className = 'achievement-notification';
        notificationEl.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${notification.achievement.icon}</div>
                <div class="notification-text">
                    <div class="notification-title">Conquista Desbloqueada!</div>
                    <div class="notification-name">${notification.achievement.name}</div>
                    <div class="notification-description">${notification.achievement.description}</div>
                    <div class="notification-reward">
                        +${notification.achievement.reward.coins} moedas • +${notification.achievement.reward.xp} XP
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        notificationEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            max-width: 350px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        // Add to page
        document.body.appendChild(notificationEl);
        
        // Animate in
        setTimeout(() => {
            notificationEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notificationEl.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notificationEl.parentNode) {
                    notificationEl.parentNode.removeChild(notificationEl);
                }
            }, 500);
        }, 5000);
        
        notification.shown = true;
    }

    getAchievementsByCategory(category) {
        return Array.from(this.achievements.values()).filter(a => a.category === category);
    }

    getUnlockedAchievements() {
        return Array.from(this.unlockedAchievements).map(id => this.achievements.get(id));
    }

    getProgressPercentage(achievementId) {
        const achievement = this.achievements.get(achievementId);
        const currentProgress = this.progress.get(achievementId) || 0;
        return Math.min(100, (currentProgress / achievement.requirement) * 100);
    }

    getTotalProgress() {
        const total = this.achievements.size;
        const unlocked = this.unlockedAchievements.size;
        return {
            unlocked,
            total,
            percentage: (unlocked / total) * 100
        };
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
        this.notifications = [];
        localStorage.removeItem('matchColors_achievements');
    }

    // Game event handlers
    onScoreUpdate(score) {
        this.updateProgress('first_steps', score);
        this.updateProgress('century', score);
        this.updateProgress('millennium', score);
    }

    onStreakUpdate(streak) {
        this.updateProgress('hot_streak', streak);
        this.updateProgress('unstoppable', streak);
        this.updateProgress('legendary', streak);
    }

    onLevelUpdate(level) {
        this.updateProgress('level_10', level);
        this.updateProgress('level_25', level);
        this.updateProgress('level_50', level);
    }

    onGameComplete(mode, perfect = false) {
        this.updateProgress(`${mode}_master`, 1);
        
        if (perfect) {
            this.updateProgress('perfect_game', 1);
        }
        
        // Check time-based achievements
        const hour = new Date().getHours();
        if (hour >= 22 || hour <= 6) {
            this.updateProgress('night_owl', 1);
        } else if (hour >= 5 && hour <= 8) {
            this.updateProgress('early_bird', 1);
        }
        
        // Update collection achievements
        const totalUnlocked = this.unlockedAchievements.size;
        this.updateProgress('collector', totalUnlocked);
        this.updateProgress('achievement_hunter', totalUnlocked);
        this.updateProgress('completionist', totalUnlocked);
    }

    onRoundComplete(time) {
        if (time <= 3) {
            this.updateProgress('lightning', 1);
        } else if (time <= 5) {
            this.updateProgress('speed_demon', 1);
        }
    }
}

// Export for use in main game
window.AchievementSystem = AchievementSystem;
