// Audio System for Match Colors Pro
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicVolume = 0.3;
        this.sfxVolume = 0.7;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.currentMusic = null;
        
        this.init();
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
            this.createMusic();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    createSounds() {
        // Success sound - pleasant chime
        this.sounds.success = this.createTone([523.25, 659.25, 783.99], [0.1, 0.1, 0.1], 'sine');
        
        // Error sound - low buzz
        this.sounds.error = this.createTone([220, 196], [0.2, 0.2], 'sawtooth');
        
        // Click sound - soft pop
        this.sounds.click = this.createTone([800], [0.05], 'square');
        
        // Level up sound - ascending arpeggio
        this.sounds.levelUp = this.createTone([261.63, 329.63, 392, 523.25], [0.15, 0.15, 0.15, 0.2], 'sine');
        
        // Game over sound - descending tone
        this.sounds.gameOver = this.createTone([523.25, 392, 261.63], [0.3, 0.3, 0.4], 'triangle');
        
        // Power up sound - magical sparkle
        this.sounds.powerUp = this.createTone([1046.5, 1318.5, 1568], [0.1, 0.1, 0.15], 'sine');
        
        // Combo sound - building excitement
        this.sounds.combo = this.createTone([440, 554.37, 659.25], [0.1, 0.1, 0.15], 'sine');
    }

    createTone(frequencies, durations, waveType = 'sine') {
        return () => {
            if (!this.sfxEnabled || !this.audioContext) return;
            
            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                oscillator.type = waveType;
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.1, this.audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + durations[index]);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + durations[index]);
            });
        };
    }

    createMusic() {
        // Create ambient background music using Web Audio API
        this.musicTracks = {
            menu: this.createAmbientTrack([261.63, 329.63, 392, 523.25], 0.1),
            gameplay: this.createAmbientTrack([220, 277.18, 329.63, 440], 0.15),
            zen: this.createAmbientTrack([174.61, 220, 261.63, 329.63], 0.08)
        };
    }

    createAmbientTrack(notes, volume) {
        return () => {
            if (!this.musicEnabled || !this.audioContext) return;
            
            const oscillators = [];
            const gainNodes = [];
            
            notes.forEach((note, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                const filter = this.audioContext.createBiquadFilter();
                
                oscillator.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(note, this.audioContext.currentTime);
                oscillator.type = 'sine';
                
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(volume * this.musicVolume, this.audioContext.currentTime + 2);
                
                // Add subtle vibrato
                const lfo = this.audioContext.createOscillator();
                const lfoGain = this.audioContext.createGain();
                lfo.frequency.setValueAtTime(0.5 + Math.random() * 0.5, this.audioContext.currentTime);
                lfoGain.gain.setValueAtTime(2, this.audioContext.currentTime);
                lfo.connect(lfoGain);
                lfoGain.connect(oscillator.frequency);
                
                oscillators.push(oscillator);
                gainNodes.push(gainNode);
                
                oscillator.start(this.audioContext.currentTime);
                lfo.start(this.audioContext.currentTime);
            });
            
            return { oscillators, gainNodes };
        };
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    playMusic(trackName) {
        this.stopMusic();
        if (this.musicTracks[trackName]) {
            this.currentMusic = this.musicTracks[trackName]();
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.oscillators.forEach(osc => osc.stop());
            this.currentMusic = null;
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.stopMusic();
        }
        return this.musicEnabled;
    }

    toggleSfx() {
        this.sfxEnabled = !this.sfxEnabled;
        return this.sfxEnabled;
    }

    // Create dynamic sound effects based on game events
    createDynamicSound(baseFreq, intensity = 1) {
        return () => {
            if (!this.sfxEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(baseFreq * intensity, this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000 * intensity, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.1 * intensity, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        };
    }

    // Create particle sound effect
    createParticleSound() {
        return () => {
            if (!this.sfxEnabled || !this.audioContext) return;
            
            for (let i = 0; i < 5; i++) {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                const freq = 800 + Math.random() * 400;
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + i * 0.05);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + i * 0.05);
                gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.05, this.audioContext.currentTime + i * 0.05 + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + i * 0.05 + 0.2);
                
                oscillator.start(this.audioContext.currentTime + i * 0.05);
                oscillator.stop(this.audioContext.currentTime + i * 0.05 + 0.2);
            }
        };
    }
}

// Export for use in main game
window.AudioSystem = AudioSystem;
