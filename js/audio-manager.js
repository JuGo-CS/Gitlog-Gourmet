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

    // Preload all audio files
    init() {
        if (this._initialized) return;
        this._initialized = true;

        // BGM
        this.bgm.homepage = this._createAudio('assets/music/homepage_leaderboards_bgm.mp3', true);
        this.bgm.game1 = this._createAudio('assets/music/game1_bgm.MP3', true);
        this.bgm.game2 = this._createAudio('assets/music/game2_bgm.MP3', true);

        // SFX
        this._preloadSFX('transition', 'assets/music/transition_between_pages_sfx.MP3');
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
        audio.volume = 0.5;
        return audio;
    },

    _preloadSFX(name, src) {
        const audio = new Audio(src);
        audio.volume = 0.6;
        audio.preload = 'auto';
        // Store in a cache
        if (!this._sfxCache) this._sfxCache = {};
        this._sfxCache[name] = audio;
    },

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
            track.play().catch(() => {}); // Ignore autoplay errors
            this.bgm.current = track;
            this.bgm.currentName = name;
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
        // Clone to allow overlapping sounds
        const clone = this._sfxCache[name].cloneNode();
        clone.volume = 0.6;
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
        this.playSFX('transition');
    }
};

// ============================================================
// AUTO-INIT on first user interaction (handles autoplay policy)
// ============================================================
(function() {
    function tryInit() {
        AudioManager.init();
    }
    document.addEventListener('click', tryInit, { once: true });
    document.addEventListener('touchstart', tryInit, { once: true });
    document.addEventListener('keydown', tryInit, { once: true });
})();
