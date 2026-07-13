// ============================================================
// GITLOG GOURMET — Audio Manager
// ============================================================
// Centralized audio system for BGM and SFX.
// Handles preloading, volume, and playback.
// ============================================================

const AudioManager = {
    // BGM tracks
    bgm: {
        homepage: null,
        game1: null,
        game2: null,
        current: null,
        currentName: null
    },
    _initialized: false,
    _pendingQueue: [],

    // Settings — persisted in localStorage
    settings: {
        bgmEnabled: true,
        sfxEnabled: true,
        bgmVolume: 0.5,
        sfxVolume: 0.6
    },

    // Preload all audio files
    init() {
        if (this._initialized) return;
        this._initialized = true;

        // Load saved settings
        this._loadSettings();

        this.bgm.homepage = this._createAudio('assets/music/homepage_leaderboards_bgm.mp3', true);

        const loadRest = () => {
            this.bgm.game1 = this._createAudio('assets/music/game1_bgm.MP3', true);
            this.bgm.game2 = this._createAudio('assets/music/game2_bgm.MP3', true);

            this._preloadSFX('buttonPress', 'assets/music/button_press_sfx.MP3');
            this._preloadSFX('correct', 'assets/music/correct_sfx.MP3');
            this._preloadSFX('wrong', 'assets/music/wrong_sfx.MP3');
            this._preloadSFX('finish', 'assets/music/finish_sfx.MP3');
            this._preloadSFX('top10', 'assets/music/finish_entering_top_10_sfx.MP3');
            this._preloadSFX('loss', 'assets/music/loss_sfx.MP3');
            this._preloadSFX('game1Intro', 'assets/music/game1_intro_sfx.MP3');
            this._preloadSFX('game2Intro', 'assets/music/game2_intro_sfx.MP3');

            // Process any queued commands
            while (this._pendingQueue.length) {
                const cmd = this._pendingQueue.shift();
                this[cmd.method](...cmd.args);
            }
        };

        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadRest);
        } else {
            setTimeout(loadRest, 0);
        }
    },

    _ensureInit(method, args) {
        if (!this._initialized) {
            this._pendingQueue.push({ method, args });
            return false;
        }
        return true;
    },

    _createAudio(src, loop) {
        const audio = new Audio(src);
        audio.loop = loop;
        audio.volume = this.settings.bgmVolume;
        audio.muted = !this.settings.bgmEnabled;
        return audio;
    },

    _preloadSFX(name, src) {
        const audio = new Audio(src);
        audio.volume = this.settings.sfxVolume;
        audio.muted = !this.settings.sfxEnabled;
        audio.preload = 'auto';
        // Store in a cache
        if (!this._sfxCache) this._sfxCache = {};
        this._sfxCache[name] = audio;
    },

    // ============================================================
    // Settings Persistence
    // ============================================================
    _loadSettings() {
        try {
            const saved = localStorage.getItem('gitlog_audio_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(this.settings, parsed);
            }
        } catch (e) { /* ignore */ }
    },

    _saveSettings() {
        try {
            localStorage.setItem('gitlog_audio_settings', JSON.stringify(this.settings));
        } catch (e) { /* ignore */ }
    },

    // ============================================================
    // Volume / Mute Controls
    // ============================================================
    setBGMVolume(vol) {
        this.settings.bgmVolume = Math.max(0, Math.min(1, vol));
        [this.bgm.homepage, this.bgm.game1, this.bgm.game2].forEach(t => {
            if (t) t.volume = this.settings.bgmVolume;
        });
        this._saveSettings();
    },

    setSFXVolume(vol) {
        this.settings.sfxVolume = Math.max(0, Math.min(1, vol));
        if (this._sfxCache) {
            Object.values(this._sfxCache).forEach(a => { a.volume = this.settings.sfxVolume; });
        }
        this._saveSettings();
    },

    toggleBGM() {
        this.settings.bgmEnabled = !this.settings.bgmEnabled;
        const muted = !this.settings.bgmEnabled;
        [this.bgm.homepage, this.bgm.game1, this.bgm.game2].forEach(t => {
            if (t) t.muted = muted;
        });
        // If re-enabling and we have a current track, restart it
        if (this.settings.bgmEnabled && this.bgm.current && this.bgm.current.paused) {
            this.bgm.current.play().catch(() => {});
        }
        this._saveSettings();
        return this.settings.bgmEnabled;
    },

    toggleSFX() {
        this.settings.sfxEnabled = !this.settings.sfxEnabled;
        const muted = !this.settings.sfxEnabled;
        if (this._sfxCache) {
            Object.values(this._sfxCache).forEach(a => { a.muted = muted; });
        }
        this._saveSettings();
        return this.settings.sfxEnabled;
    },

    isBGMEnabled() { return this.settings.bgmEnabled; },
    isSFXEnabled() { return this.settings.sfxEnabled; },
    getBGMVolume() { return this.settings.bgmVolume; },
    getSFXVolume() { return this.settings.sfxVolume; },

    // ============================================================
    // BGM Control
    // ============================================================
    playBGM(name) {
        if (!this._ensureInit('playBGM', [name])) return;
        // Don't restart if already playing
        if (this.bgm.currentName === name && this.bgm.current && !this.bgm.current.paused) return;

        // Stop current BGM
        this.stopBGM();

        let track;
        switch (name) {
            case 'homepage': track = this.bgm.homepage; break;
            case 'game1': track = this.bgm.game1; break;
            case 'game2': track = this.bgm.game2; break;
            default: return;
        }

        if (track) {
            track.currentTime = 0;
            track.muted = false;
            this.bgm.current = track;
            this.bgm.currentName = name;

            const playPromise = track.play();

            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    track.muted = true;
                    track.play().catch(() => {});

                    const unmuteOnInteract = () => {
                        track.muted = false;
                        document.removeEventListener('click', unmuteOnInteract);
                    };
                    document.addEventListener('click', unmuteOnInteract, { once: true });
                });
            }
        }
    },

    stopBGM() {
        if (!this._ensureInit('stopBGM', [])) return;
        if (this.bgm.current) {
            this.bgm.current.pause();
            this.bgm.current.currentTime = 0;
            this.bgm.current = null;
            this.bgm.currentName = null;
        }
    },

    pauseBGM() {
        if (this.bgm.current) {
            this.bgm.current.pause();
        }
    },

    resumeBGM() {
        if (this.bgm.current && this.bgm.current.paused) {
            this.bgm.current.play().catch(() => {});
        }
    },

    // ============================================================
    // SFX Control
    // ============================================================
    playSFX(name) {
        if (!this._ensureInit('playSFX', [name])) return;
        if (!this._sfxCache || !this._sfxCache[name]) return;
        // Don't play if SFX is disabled
        if (!this.settings.sfxEnabled) return;
        // Clone to allow overlapping sounds
        const clone = this._sfxCache[name].cloneNode();
        clone.volume = this.settings.sfxVolume;
        clone.muted = !this.settings.sfxEnabled;
        clone.play().catch(() => {});
    },

    playButtonPress() {
        this.playSFX('buttonPress');
    },

    playCorrect() {
        this.playSFX('correct');
    },

    playWrong() {
        this.playSFX('wrong');
    },

    playFinish(rank) {
        this.playSFX('finish');
        // Play top 10 fanfare if ranked
        if (rank !== null && rank <= 10) {
            setTimeout(() => {
                this.playSFX('top10');
            }, 600);
        }
    },

    playLoss() {
        this.playSFX('loss');
    },

    playIntro(game) {
        if (game === 1) this.playSFX('game1Intro');
        else if (game === 2) this.playSFX('game2Intro');
    },

    playTransition() {
        // Removed — transition SFX sounded bad
    },

    playHover() {
        this.playSFX('correct');
    }
};

AudioManager.init();
