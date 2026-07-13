// ============================================================
// GITLOG GOURMET — Settings UI
// ============================================================
// Bridges the settings modal to AudioManager.
// Must be loaded AFTER audio-manager.js.
// ============================================================

function toggleSettings() {
    const overlay = document.getElementById('settings-overlay');
    if (!overlay) return;
    overlay.classList.toggle('active');

    if (overlay.classList.contains('active')) {
        // Sync UI with current settings
        syncSettingsUI();
    }
}

function syncSettingsUI() {
    const bgmToggle = document.getElementById('bgm-toggle');
    const sfxToggle = document.getElementById('sfx-toggle');
    const bgmVol = document.getElementById('bgm-volume');
    const sfxVol = document.getElementById('sfx-volume');
    const bgmPct = document.getElementById('bgm-vol-pct');
    const sfxPct = document.getElementById('sfx-vol-pct');

    if (bgmToggle) bgmToggle.checked = AudioManager.isBGMEnabled();
    if (sfxToggle) sfxToggle.checked = AudioManager.isSFXEnabled();
    if (bgmVol) {
        bgmVol.value = AudioManager.getBGMVolume();
        if (bgmPct) bgmPct.textContent = Math.round(AudioManager.getBGMVolume() * 100) + '%';
    }
    if (sfxVol) {
        sfxVol.value = AudioManager.getSFXVolume();
        if (sfxPct) sfxPct.textContent = Math.round(AudioManager.getSFXVolume() * 100) + '%';
    }
}

function toggleBGM() {
    const enabled = AudioManager.toggleBGM();
    const toggle = document.getElementById('bgm-toggle');
    if (toggle) toggle.checked = enabled;
}

function toggleSFX() {
    const enabled = AudioManager.toggleSFX();
    const toggle = document.getElementById('sfx-toggle');
    if (toggle) toggle.checked = enabled;
}

function setBGMVolume(val) {
    AudioManager.setBGMVolume(parseFloat(val));
    const pct = document.getElementById('bgm-vol-pct');
    if (pct) pct.textContent = Math.round(parseFloat(val) * 100) + '%';
}

function setSFXVolume(val) {
    AudioManager.setSFXVolume(parseFloat(val));
    const pct = document.getElementById('sfx-vol-pct');
    if (pct) pct.textContent = Math.round(parseFloat(val) * 100) + '%';
}

// Close settings when clicking overlay background
document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('settings-overlay');
    if (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    }
});
