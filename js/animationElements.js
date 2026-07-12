// Initialize audio on first user interaction
let audioInitialized = false;
function initAudio() {
    if (audioInitialized) return;
    audioInitialized = true;
    AudioManager.init();
    AudioManager.playBGM('homepage');
}

// Listen for first click/touch to init audio (autoplay policy)
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });

document.querySelectorAll('.game-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault(); 

    // Ensure audio is initialized
    if (!audioInitialized) initAudio();

    // Play transition SFX
    AudioManager.playTransition();

    const titleCard = document.getElementById('title-card');
    const blackBackground =  document.getElementById('blackBackground');
    const whiteFadeIn = document.getElementById('whiteFadeIn');
    const home_leaderboard_transition = document.getElementById('home_leaderboard_transition');

    // Reset animation
    titleCard.style.animation = 'none';
    void titleCard.offsetWidth;
    blackBackground.style.animation = 'none';
    void blackBackground.offsetWidth;
    whiteFadeIn.style.animation = 'none';
    void whiteFadeIn.offsetWidth;
    home_leaderboard_transition.style.animation = 'none';
    void home_leaderboard_transition.offsetWidth;

    titleCard.style.animationName = 'gitlogZoomIn';
    titleCard.style.animationDuration = '1.55s';
    titleCard.style.animationFillMode = 'forwards';
    titleCard.style.animationTimingFunction = 'ease-in-out';

    blackBackground.style.animationName = 'blackBackgroundFadeIn';
    blackBackground.style.animationDuration = '1s';
    blackBackground.style.animationTimingFunction = 'ease-in-out';
    blackBackground.style.animationFillMode = 'forwards';
    
    whiteFadeIn.style.animationName = 'whiteFadeIn_Expand';
    whiteFadeIn.style.animationDuration = '1.55s';
    whiteFadeIn.style.animationTimingFunction = 'ease-in-out';
    whiteFadeIn.style.animationFillMode = 'forwards';

    setTimeout(() => {
      window.location.href = this.getAttribute('href');
    }, 1500);
  });
});
