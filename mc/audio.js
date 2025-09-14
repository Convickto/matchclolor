/**
 * Audio System - Ultra Performance Edition
 * Sistema de áudio otimizado para máxima performance
 */
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicVolume = 0.3;
        this.sfxVolume = 0.7;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.currentMusic = null;
        this.soundCache = new Map(); // Cache para sons pré-processados
        
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
        
        // Warning sound - attention-grabbing
        this.sounds.warning = this.createTone([880, 1108.73], [0.2, 0.3], 'square');
        
        // Select sound - gentle chime
        this.sounds.select = this.createTone([440, 554.37], [0.1, 0.1], 'sine');
        
        // Correct sound - success chime
        this.sounds.correct = this.createTone([523.25, 659.25], [0.1, 0.1], 'sine');
        
        // Incorrect sound - error buzz
        this.sounds.incorrect = this.createTone([220, 196], [0.15, 0.15], 'sawtooth');
    }

    createTone(frequencies, durations, waveType = 'sine') {
        return () => {
            if (!this.sfxEnabled || !this.audioContext) return;
            
            // Use cached sound if available
            const cacheKey = `${frequencies.join(',')}-${durations.join(',')}-${waveType}`;
            if (this.soundCache.has(cacheKey)) {
                this.playCachedSound(cacheKey);
                return;
            }
            
            // Create new sound
            const sound = this.generateSound(frequencies, durations, waveType);
            this.soundCache.set(cacheKey, sound);
            this.playCachedSound(cacheKey);
        };
    }

    generateSound(frequencies, durations, waveType) {
        const sampleRate = this.audioContext.sampleRate;
        const totalDuration = durations.reduce((sum, dur) => sum + dur, 0);
        const bufferLength = Math.floor(sampleRate * totalDuration);
        const buffer = this.audioContext.createBuffer(1, bufferLength, sampleRate);
        const data = buffer.getChannelData(0);
        
        let currentSample = 0;
        
        for (let i = 0; i < frequencies.length; i++) {
            const frequency = frequencies[i];
            const duration = durations[i];
            const durationSamples = Math.floor(sampleRate * duration);
            
            for (let j = 0; j < durationSamples; j++) {
                const t = j / sampleRate;
                let sample = 0;
                
                switch (waveType) {
                    case 'sine':
                        sample = Math.sin(2 * Math.PI * frequency * t);
                        break;
                    case 'square':
                        sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
                        break;
                    case 'sawtooth':
                        sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
                        break;
                    case 'triangle':
                        sample = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
                        break;
                }
                
                // Apply envelope
                const envelope = Math.exp(-t * 3);
                sample *= envelope * this.sfxVolume;
                
                data[currentSample + j] = sample;
            }
            
            currentSample += durationSamples;
        }
        
        return buffer;
    }

    playCachedSound(cacheKey) {
        const buffer = this.soundCache.get(cacheKey);
        if (!buffer) return;
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        gainNode.gain.value = this.sfxVolume;
        
        source.start();
    }

    createMusic() {
        // Background music - ambient loop
        this.music = {
            game: this.createAmbientMusic(),
            menu: this.createMenuMusic()
        };
    }

    createAmbientMusic() {
        return () => {
            if (!this.musicEnabled || !this.audioContext) return;
            
            const frequencies = [261.63, 329.63, 392, 523.25]; // C major chord
            const duration = 4; // 4 seconds loop
            
            const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < data.length; i++) {
                const t = i / this.audioContext.sampleRate;
                let sample = 0;
                
                frequencies.forEach(freq => {
                    sample += Math.sin(2 * Math.PI * freq * t) * 0.1;
                });
                
                // Apply gentle envelope
                const envelope = 0.5 + 0.5 * Math.sin(2 * Math.PI * t * 0.5);
                sample *= envelope * this.musicVolume;
                
                data[i] = sample;
            }
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = buffer;
            source.loop = true;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            gainNode.gain.value = this.musicVolume;
            
            source.start();
            this.currentMusic = source;
        };
    }

    createMenuMusic() {
        return () => {
            if (!this.musicEnabled || !this.audioContext) return;
            
            const frequencies = [220, 277.18, 329.63, 440]; // A minor chord
            const duration = 6; // 6 seconds loop
            
            const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < data.length; i++) {
                const t = i / this.audioContext.sampleRate;
                let sample = 0;
                
                frequencies.forEach(freq => {
                    sample += Math.sin(2 * Math.PI * freq * t) * 0.08;
                });
                
                // Apply gentle envelope
                const envelope = 0.3 + 0.3 * Math.sin(2 * Math.PI * t * 0.3);
                sample *= envelope * this.musicVolume;
                
                data[i] = sample;
            }
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = buffer;
            source.loop = true;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            gainNode.gain.value = this.musicVolume;
            
            source.start();
            this.currentMusic = source;
        };
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    playMusic(musicName) {
        this.stopMusic();
        if (this.music[musicName]) {
            this.music[musicName]();
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.stopMusic();
        }
        return this.musicEnabled;
    }

    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
        return this.sfxEnabled;
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    // Cleanup method
    destroy() {
        this.stopMusic();
        this.soundCache.clear();
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioSystem;
}