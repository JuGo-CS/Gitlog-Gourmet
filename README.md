# 🍽️ Gitlog Gourmet — Where Food Meets Fun!

> A food-themed web game portal inspired by **Purble Place**.
> Built for **CMSC 126 — Web Programming**.
> *Not a commercial product — just a passion school project by students.*

---

## 🚀 About

**Gitlog Gourmet** is a browser-based game portal with a restaurant/food theme. Whether you've got a memory like a steel trap or you're a code-cracking genius, there's a game waiting for you!

### At a Glance

| Feature | Description |
|---------|-------------|
| 🧠 **Two mini-games** | Matching Pairs + Code Breaker |
| 🏆 **Leaderboards** | Top scores saved to the cloud via Supabase |
| 👤 **Usernames** | Persistent profiles saved in your browser |
| ☁️ **Cloud saves** | Scores sync across devices |
| 🎵 **Audio system** | BGM + SFX with volume controls |
| 🎊 **Celebrations** | Confetti + rank reveal for Top 10 |

---

## 👨‍🍳 Team

| Name | Role |
|------|------|
| **Kenneth Mondejar** | Developer |
| **Kent Genilo** | Developer |
| **Mark Leonel Misola** | Developer |
| **Jasmine Magadan** | Developer |

**Course:** CMSC 126 — Web Programming  
**Instructor:** Sir Nikko Gabriel Hismana

---

## 🔧 Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure |
| CSS3 | Styling & animations |
| JavaScript (Vanilla) | Game logic & API calls |
| Supabase | Cloud database for leaderboards |
| localStorage | Username & settings persistence |
| Vercel | Hosting |

---

## 🗺️ Pages

| Page | File | Description |
|------|------|-------------|
| 🏠 **Home** | `index.html` | Main hub with preloader, username system, settings, personal best |
| 🃏 **Matching Pairs** | `game1.html` | Memory matching game |
| 🔐 **Code Breaker** | `game2.html` | Logic puzzle game |
| 🏆 **Leaderboard** | `leaderboard.html` | Top scores for both games |

Navigation uses a smooth white-sphere transition animation between pages.

---

## 🎮 Game 1: Matching Pairs

**Flip tiles, find pairs, clear the board!**

1. A grid of face-down tiles is shown
2. Click a tile to reveal the food image underneath
3. Click another to find its match
4. Match = points. Miss = tiles flip back with a wrong SFX!
5. Clear all pairs to win 🎉

**Scoring:** `(match_points + combo_bonus + time_bonus) × difficulty_multiplier`
- **Match:** 50 pts | **Combo:** +10 per streak | **Time bonus:** up to +2000 for speed
- **Multiplier:** Easy ×1, Medium ×1.5, Hard ×2

| Difficulty | Grid | Pairs | Varieties |
|-----------|------|-------|-----------|
| 🌱 Easy | 6×6 | 18 | 6 |
| ⚡ Medium | 8×8 | 32 | 8 |
| 🔥 Hard | 10×10 | 50 | 10 |

---

## 🎮 Game 2: Code Breaker

**Crack the secret 4-item food combo!**

1. A secret combo (Fruit + Main + Drink + Dessert) is hidden
2. Pick your guesses from the cabinet
3. Hit **Submit** to check
4. Feedback: 🟢 Correct item & position / 🟡 Correct item, wrong position
5. Win before you run out of attempts!
6. **Lose?** The correct combo is revealed so you learn for next time!

**Scoring (win only):** `(1000 + 150 × unused attempts) × difficulty_multiplier`

| Difficulty | Attempts |
|-----------|----------|
| 🌱 Easy | 6 |
| ⚡ Medium | 5 |
| 🔥 Hard | 4 |

---

## 🏆 Leaderboard

- Top 50 scores per game, powered by Supabase
- **Filter by difficulty** — ALL / EASY / MEDIUM / HARD tabs
- **Shared ranking** — same score = same rank (dense rank)
- Scores only save when you **win**
- Only your **highest score** is kept per difficulty
- Gold / Silver / Bronze styling for top 3
- End card shows your rank after each game

---

## 🎊 Celebrations

When you hit **Top 10**, get ready for:
- **Confetti rain** 🎉 — colorful particles fall continuously until you navigate away
- **Big rank reveal** 👑 — a dramatic full-screen animation shows your rank in massive text

---

## 👤 Username System

- Saved in your browser's **localStorage** — persists across sessions
- Multiple accounts can be saved on the same device
- New usernames are checked against the database to prevent duplicates
- Click the badge in the header to **Switch Account** or **Log Out**
- **Personal Best** button 🏆 shows your highest scores for both games

---

## 🎵 Audio System

- **BGM** plays on each page — homepage, game 1, game 2, and leaderboard
- **SFX** for hover, clicks, correct/wrong guesses, game finish, and top 10 fanfare
- **Settings modal** ⚙ — toggle BGM and SFX on/off, adjust volume with sliders
- Settings persist across sessions via localStorage
- Audio auto-initializes on first user interaction (browser policy compliant)

---

## ⏸️ Pause System

Both games feature a pause button (top-center) that:
- Pauses the timer and BGM
- Shows a modal with **Continue** and **Restart** options
- Resumes BGM when continuing

---

## 🕹️ How to Play

1. **Visit the game** → [gitlog-gourmet.vercel.app](https://gitlog-gourmet.vercel.app/) 🚀
2. **Wait for assets to load** — progress bar fills up, then click **"Let's Go!"**
3. **Enter a username** — Create or select a saved account
4. **Click a game house** — Choose Matching Pairs or Code Breaker
5. **Pick a difficulty** — Easy, Medium, or Hard
6. **Play!** — Try to top the leaderboard! 🏆

---

## 📁 File Structure

```
/
├── index.html                  # Homepage
├── game1.html                  # Matching Pairs
├── game2.html                  # Code Breaker
├── leaderboard.html            # Leaderboard
│
├── css/
│   └── styles.css              # Stylesheet
│
├── js/
│   ├── animationElements.js    # Page transitions + homepage SFX
│   ├── matching-game-script.js # Game 1 logic
│   ├── code-breaker-game-script.js # Game 2 logic
│   ├── leaderboard-script.js   # Leaderboard fetching
│   ├── username-manager.js     # Username system + personal best
│   ├── supabase-helper.js      # Supabase client + celebrations
│   ├── audio-manager.js        # BGM & SFX system
│   ├── settings-ui.js          # Audio settings UI
│   ├── preloader.js            # Asset preloader
│   └── universal-style-script.js # Responsive scaling
│
└── assets/
    ├── images/                 # UI elements & backgrounds
    ├── music/                  # BGM and SFX files
    ├── cabinet/                # Food images (Game 2)
    ├── tile-entity/            # Tile images (Game 1)
    └── leaderboard/            # Rank badges
```

---

## 💖 Acknowledgments

- Inspired by **Purble Place**
- **Sir Nikko Gabriel Hismana** — for guiding us through CMSC 126
- **Supabase** — for the cloud database
- **CMSC 126 Crew** — for the teamwork and late-night debugging sessions

---

*© 2025 Gitlog Gourmet — CMSC 126 Web Programming*