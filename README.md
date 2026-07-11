# 🍽️ Gitlog Gourmet — Where Food Meets Fun!

> A food-themed web game portal inspired by **Purble Place**.
> Built for **CMSC 126 — Web Programming**.
> *Not a commercial product — just a passion project by students.*

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

---

## 👨‍🍳 Team

| Name | Role |
|------|------|
| **Kenneth Moondejar** | Developer |
| **Kent Genilo** | Developer |
| **Jasmine Magadan** | Developer |
| **Mark Leonel Misola** | Developer |

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
| localStorage | Username persistence |
| GitHub Pages | Hosting |

---

## 🗺️ Pages

| Page | File | Description |
|------|------|-------------|
| 🏠 **Home** | `index.html` | Main hub — navigate to games or leaderboard |
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
4. Match = points. Miss = tiles flip back. Simple!
5. Clear all pairs to win 🎉

**Scoring:** 50 pts per match + 10 combo bonus for consecutive matches.

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

**Scoring (win only):** (1000 + 150 × unused attempts) × difficulty multiplier

| Difficulty | Attempts |
|-----------|----------|
| 🌱 Easy | 6 |
| ⚡ Medium | 5 |
| 🔥 Hard | 4 |

---

## 🏆 Leaderboard

- Top 50 scores per game, powered by Supabase
- Scores only save when you **win**
- Only your **highest score** is kept
- Gold / Silver / Bronze styling for top 3
- End card shows your rank after each game

---

## 👤 Username System

- Saved in your browser's **localStorage** — persists across sessions
- Multiple accounts can be saved on the same device
- New usernames are checked against the database to prevent duplicates
- Click the badge in the header to **Switch Account** or **Log Out**

---

## 🕹️ How to Play

1. Open `index.html`
2. Enter a username
3. Click a game house
4. Pick a difficulty
5. Play and try to top the leaderboard!

---

## 📁 File Structure

```
/
├── index.html                  # Homepage
├── game1.html                  # Matching Pairs
├── game2.html                  # Code Breaker
├── leaderboard.html            # Leaderboard
├── styles.css                  # Stylesheet
├── animationElements.js        # Page transitions
├── matching-game-script.js     # Game 1 logic
├── code-breaker-game-script.js # Game 2 logic
├── leaderboard-script.js       # Leaderboard fetching
├── username-manager.js         # Username system
├── supabase-helper.js          # Supabase client
├── universal-style-script.js   # Responsive scaling
├── README.md                   # This file
│
└── assets/
    ├── images/                 # UI elements & backgrounds
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