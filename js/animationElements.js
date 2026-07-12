// Add hover + click SFX to all interactive elements on homepage
function addHoverClickSFX(selector) {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('mouseenter', () => AudioManager.playHover());
        el.addEventListener('click', () => AudioManager.playButtonPress());
    });
}
addHoverClickSFX('.game-link');
addHoverClickSFX('#github-link');
addHoverClickSFX('#user-badge .badge-toggle');
addHoverClickSFX('#user-dropdown .dropdown-item');

document.querySelectorAll('.game-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault(); 

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
