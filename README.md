# 🍽️ Gitlog Gourmet

> A food-themed web game portal inspired by **Purble Place**.
>
> Built as a final project for **CMSC 126 — Web Programming**.
>
> **Not a commercial product.** This is an educational project created for learning purposes only.

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Team Members](#team-members)
- [Tech Stack](#tech-stack)
- [Webpages & Navigation](#webpages--navigation)
- [Game 1: Matching Pairs](#-game-1-matching-pairs)
- [Game 2: Code Breaker](#-game-2-code-breaker)
- [Leaderboard System](#-leaderboard-system)
- [Username System](#-username-system)
- [How to Play](#-how-to-play)
- [File Structure](#-file-structure)
- [Acknowledgments](#-acknowledgments)

---

## About The Project

Gitlog Gourmet is a browser-based game portal with a restaurant/food theme. Players can:

- **Play two unique mini-games** — a memory matching game and a code-breaking puzzle
- **Compete on leaderboards** — scores are saved to a cloud database via Supabase
- **Create persistent profiles** — usernames are saved locally and checked globally

The entire front-end is built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools. It is designed to be deployed on **GitHub Pages** with Supabase as the only backend dependency.

---

## Team Members

| Name | Role |
|------|------|
| **Kenneth Moondejar** | Developer |
| **Kent Genilo** | Developer |
| **Jasmine Magadan** | Developer |
| **Mark Leonel Misola** | Developer |

**Course:** CMSC 126 — Web Programming  
**Instructor:** Sir Nikko Gabriel Hismana

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Page structure and content |
| **CSS3** | Styling, animations, responsive layout |
| **JavaScript (Vanilla)** | Game logic, DOM manipulation, API calls |
| **Supabase** | Cloud database for leaderboard storage |
| **localStorage** | Persistent username storage across sessions |
| **GitHub Pages** | Deployment and hosting |

---

## Webpages & Navigation

| Page | File | Description |
|------|------|-------------|
| **Home** | `index.html` | Main hub — navigate to games or leaderboard. Username entry modal appears on first visit. |
| **Game 1** | `game1.html` | Matching Pairs memory game |
| **Game 2** | `game2.html` | Code Breaker logic puzzle |
| **Leaderboard** | `leaderboard.html` | View top scores for both games |

Navigation uses CSS transition animations (a white "sphere" expands on the home page, then collapses on the destination page).

---

## 🎮 Game 1: Matching Pairs

### Objective
Flip tiles two at a time to find matching pairs. Match all pairs to win.

### Gameplay
1. A grid of face-down tiles is displayed
2. Click any tile to flip it and reveal the food image underneath
3. Click a second tile to find its match
4. If the two tiles match, they stay revealed and you earn points
5. If they don't match, both tiles flip back face-down
6. Match all pairs to complete the game

### Scoring
- **Base points:** 50 per match
- **Combo bonus:** +10 per consecutive match (resets on miss)
- **Final score:** Sum of all matches

### Difficulty Levels

| Difficulty | Grid Size | Pairs | Tile Varieties |
|-----------|-----------|-------|----------------|
| 🌱 Easy | 6 × 6 | 18 pairs | 6 varieties |
| ⚡ Medium | 8 × 8 | 32 pairs | 8 varieties |
| 🔥 Hard | 10 × 10 | 50 pairs | 10 varieties |

---

## 🎮 Game 2: Code Breaker

### Objective
Guess the correct 4-item food combination (Fruit, Main, Drink, Dessert) within a limited number of attempts.

### Gameplay
1. A secret combination of 4 food items is generated (one from each category)
2. Use the cabinet interface to select your guess for each category
3. Click **Submit** to check your guess
4. After each attempt, you receive feedback:
   - **Correct Guess (green):** Number of items in the correct position
   - **Correct Row (yellow):** Number of correct items in the wrong position
5. Use the feedback to narrow down the correct combination
6. Guess correctly to win, or run out of attempts to lose

### Scoring (Win Only)
- **Base score:** 1,000
- **Attempt bonus:** +150 per unused attempt
- **Difficulty multiplier:** Easy ×1, Medium ×2, Hard ×3
- **Example:** Win on Hard with 2 unused attempts = (1000 + 2×150) × 3 = 3,900 points

### Difficulty Levels

| Difficulty | Attempts |
|-----------|----------|
| 🌱 Easy | 6 attempts |
| ⚡ Medium | 5 attempts |
| 🔥 Hard | 4 attempts |

---

## 🏆 Leaderboard System

The leaderboard displays the top 50 scores for each game, fetched from Supabase.

### Score Submission Rules
- Scores are **only saved when you win** the game
- If a username already has a score in the database, the **higher score is kept** (old lower score is replaced)
- Each username appears only once per game on the leaderboard

### Leaderboard Features
- Toggle between **Matching Pairs** and **Code Breaker** boards
- **Gold / Silver / Bronze** styling for top 3 ranks
- After completing a game, the end card shows your current **rank** on the leaderboard

---

## 👤 Username System

### Local Persistence
- Usernames are saved in the browser's **localStorage**
- They persist across refreshes and browser restarts
- Multiple accounts can be saved on the same device

### Database Uniqueness
- When creating a new username, the system checks if it **already exists in the Supabase database**
- If taken, you'll be prompted to choose a different name
- This prevents different players from overwriting each other's scores

### Switching Accounts
- Click the username badge in the header to open the account menu
- **Switch Account** — pick from saved usernames
- **Log Out** — clears the active user and shows the login modal

---

## 🕹️ How to Play

1. **Open the app** — Start at `index.html`
2. **Enter a username** — Create or select a saved account
3. **Choose a game** — Click the Matching Pairs house or Code Breaker house
4. **Select difficulty** — Pick Easy, Medium, or Hard
5. **Play the game** — Follow the game-specific rules above
6. **View your score** — The end card shows your stats and leaderboard rank
7. **Check the leaderboard** — See how you compare with other players

---

## 📁 File Structure

```
/
├── index.html                  # Homepage
├── game1.html                 # Matching Pairs game
├── game2.html                 # Code Breaker game
├── leaderboard.html           # Leaderboard page
├── styles.css                 # Main stylesheet
├── animationElements.js       # Homepage transition animations
├── matching-game-script.js    # Game 1 logic
├── code-breaker-game-script.js# Game 2 logic
├── leaderboard-script.js      # Leaderboard data fetching
├── username-manager.js        # Username CRUD & persistence
├── supabase-helper.js         # Supabase client & score submission
├── universal-style-script.js  # Responsive scaling
├── README.md                  # This file
│
└── assets/
    ├── images/                # UI elements, backgrounds, icons
    ├── cabinet/               # Food category images (Game 2)
    ├── tile-entity/           # Tile face images (Game 1 & leaderboard BG)
    └── leaderboard/           # Rank badge images
```

---

## Acknowledgments

- Inspired by **Purble Place** — a classic Windows game collection
- Built with ❤️ by the CMSC 126 Group
- Special thanks to **Sir Nikko Gabriel Hismana** for guidance throughout the course
- Powered by **Supabase** for cloud database services