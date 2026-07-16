// ============================================================
// GITLOG GOURMET — Asset Preloader & Loading Screen
// ============================================================
// Preloads all images and assets before showing the page,
// ensuring smooth transitions between pages.
// ============================================================

(function () {
    "use strict";

    // ============================================================
    // ALL ASSETS TO PRELOAD
    // ============================================================
    const assets = [
        // --- Backgrounds ---
        "assets/images/home-screen-background-curtain.png", 
        "assets/images/game-screen-background-darker.png",
        "assets/images/game2-screen-background_darker.png",
        "assets/images/leaderboard-bg.png",

        // --- UI Elements ---
        "assets/images/game-logo.png",
        "assets/images/Gitlog Horizontal.png",
        "assets/images/GITLOG New Title.png",
        "assets/images/tile.png",
        "assets/images/arrow_firstStyle.png",
        "assets/images/trophyIcon.png",
        "assets/images/homeIcon.png",
        "assets/images/restartIcon.png",
        "assets/images/reset.png",
        "assets/images/submit.png",
        "assets/images/hourglassGif.gif",
        "assets/images/Random foods.png",
        "assets/images/Chicken Character.png",

        // --- Houses ---
        "assets/images/leaderboard-house-flag-v2.png",
        "assets/images/Shadow Checkout Resto.png",
        "assets/images/game2-house_platform.png",

        // --- Tutorials ---
        "assets/images/Matching Game Tutorial.png",
        "assets/images/Updated Instructions.png",

        // --- Game 2 takeout ---
        "assets/images/Takeout box closed.png",

        // --- Cabinet (Game 2 food) ---
        "assets/cabinet/fruit-0.png",
        "assets/cabinet/fruit-1.png",
        "assets/cabinet/fruit-2.png",
        "assets/cabinet/fruit-3.png",
        "assets/cabinet/fruit-4.png",
        "assets/cabinet/main-0.png",
        "assets/cabinet/main-1.png",
        "assets/cabinet/main-2.png",
        "assets/cabinet/main-3.png",
        "assets/cabinet/main-4.png",
        "assets/cabinet/drink-0.png",
        "assets/cabinet/drink-1.png",
        "assets/cabinet/drink-2.png",
        "assets/cabinet/drink-3.png",
        "assets/cabinet/drink-4.png",
        "assets/cabinet/dessert-0.png",
        "assets/cabinet/dessert-1.png",
        "assets/cabinet/dessert-2.png",
        "assets/cabinet/dessert-3.png",
        "assets/cabinet/dessert-4.png",

        // --- Tile entities (Game 1) ---
        "assets/tile-entity/0.png",
        "assets/tile-entity/1.png",
        "assets/tile-entity/2.png",
        "assets/tile-entity/3.png",
        "assets/tile-entity/4.png",
        "assets/tile-entity/5.png",
        "assets/tile-entity/6.png",
        "assets/tile-entity/7.png",
        "assets/tile-entity/8.png",
        "assets/tile-entity/9.png",
        "assets/tile-entity/10.png",
        "assets/tile-entity/11.png",
        "assets/tile-entity/12.png",
        "assets/tile-entity/13.png",
        "assets/tile-entity/14.png",
        "assets/tile-entity/15.png",
        "assets/tile-entity/16.png",
        "assets/tile-entity/17.png",
        "assets/tile-entity/18.png",
        "assets/tile-entity/19.png",
        "assets/tile-entity/20.png",
        "assets/tile-entity/21.png",
        "assets/tile-entity/22.png",
        "assets/tile-entity/23.png",
        "assets/tile-entity/24.png",
        "assets/tile-entity/25.png",
        "assets/tile-entity/26.png",
        "assets/tile-entity/27.png",
        "assets/tile-entity/28.png",
        "assets/tile-entity/29.png",
        "assets/tile-entity/30.png",
        "assets/tile-entity/31.png",
        "assets/tile-entity/32.png",
        "assets/tile-entity/33.png",
        "assets/tile-entity/34.png",
        "assets/tile-entity/35.png",
        "assets/tile-entity/36.png",
        "assets/tile-entity/37.png",
        "assets/tile-entity/38.png",
        "assets/tile-entity/39.png",
        "assets/tile-entity/40.png",
        "assets/tile-entity/41.png",
        "assets/tile-entity/42.png",
        "assets/tile-entity/43.png",
        "assets/tile-entity/44.png",
        "assets/tile-entity/45.png",
        "assets/tile-entity/46.png",
        "assets/tile-entity/47.png",
        "assets/tile-entity/48.png",
        "assets/tile-entity/49.png"
    ];

    // ============================================================
    // PRELOADER LOGIC
    // ============================================================
    const preloader = document.getElementById("preloader");
    const barFill = document.querySelector(".pl-bar-fill");
    const percentText = document.querySelector(".pl-percent");
    const statusText = document.querySelector(".pl-status");
    const startBtn = document.getElementById("pl-start-btn");

    if (sessionStorage.getItem("gitlog_preloaded") === "true") {
        if (preloader && preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
        }

        if (typeof AudioManager !== "undefined") {
            AudioManager.playBGM('homepage');
            if (AudioManager.bgm.current) {
                AudioManager.bgm.current.muted = true;
            }

            document.addEventListener('click', function unmuteOnReturn() {
                if (AudioManager.bgm.current) {
                    AudioManager.bgm.current.muted = false;
                }
                document.removeEventListener('click', unmuteOnReturn);
            }, { once: true });
        }
        return;
    }

    let loadedCount = 0;
    const total = assets.length;

    function updateProgress(final) {
        if (final) {
            loadedCount = total;
        } else {
            loadedCount++;
        }
        const pct = Math.min(Math.round((loadedCount / total) * 100), 100);
        if (barFill) barFill.style.width = pct + "%";
        if (percentText) percentText.textContent = pct + "%";

        // Update status message
        if (statusText) {
            if (pct < 30) statusText.textContent = "Preparing the kitchen...";
            else if (pct < 50) statusText.textContent = "Gathering ingredients...";
            else if (pct < 70) statusText.textContent = "Cooking up the games...";
            else if (pct < 90) statusText.textContent = "Almost ready...";
            else statusText.textContent = "Plating...";
        }

        if (loadedCount >= total) {
            // All done — hide progress elements, show the "Let's Go!" button
            const barTrack = document.querySelector(".pl-bar-track");
            if (barTrack) barTrack.style.display = "none";
            if (percentText) percentText.style.display = "none";
            if (statusText) statusText.textContent = "Ready! Tap to begin your feast!";
            const subtitle = document.querySelector(".pl-subtitle");
            if (subtitle) subtitle.style.display = "none";

            if (startBtn) {
                startBtn.style.display = "inline-block";
                startBtn.focus();
            }
        }
    }

    function loadImage(src) {
        return new Promise(function (resolve) {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve; // Don't block on error
            img.src = src;
        });
    }

    async function startPreload() {
        // Load in batches to avoid overwhelming the browser
        const batchSize = 20;
        for (let i = 0; i < total; i += batchSize) {
            const batch = assets.slice(i, i + batchSize);
            await Promise.all(batch.map(loadImage));
            // Update progress after each batch
            loadedCount = Math.min(i + batchSize, total);
            const pct = Math.round((loadedCount / total) * 100);
            if (barFill) barFill.style.width = pct + "%";
            if (percentText) percentText.textContent = pct + "%";
        }

        // Final update
        updateProgress(true);
    }

    // Start preloading immediately (don't wait for window.load)
    startPreload();

    // "Let's Go!" button click handler — starts BGM, title animation, and hides preloader
     if (startBtn) {
        startBtn.addEventListener("click", function letsGo() {
            AudioManager.playBGM('homepage');
            if (AudioManager.bgm.homepage) {
                AudioManager.bgm.homepage.currentTime = 0;
            }

            // Start the title card bounce animation
            const titleCard = document.getElementById('title-card');
            if (titleCard) {
                titleCard.classList.add('animate');
            }

            preloader.classList.add("hidden");
            setTimeout(function () {
                if (preloader && preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 700);
        });
    }
})();
