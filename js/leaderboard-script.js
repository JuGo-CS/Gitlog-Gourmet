// ============================================================
// LEADERBOARD LOGIC
// Note: Supabase client is loaded from supabase-helper.js
// ============================================================

let currentBoard = 1;
let currentDifficulty = "ALL";

document.addEventListener("DOMContentLoaded", initializePage);

function initializePage(){
    document.querySelectorAll('#leaderboard-table-container table').forEach(table =>{
        table.classList.add('inactive-board');
    });

    // Set initial active button (Game 1 is checked by default)
    const defaultBtn = document.getElementById('leaderboard-game1-switch');
    if (defaultBtn) defaultBtn.classList.add('active-btn');

    // Start homepage/leaderboard BGM
    AudioManager.playBGM('homepage');

    // Add hover + click SFX to leaderboard buttons
    document.querySelectorAll('#leaderboard-switch-button-container button').forEach(btn => {
        btn.addEventListener('mouseenter', () => AudioManager.playHover());
    });
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => AudioManager.playHover());
    });

    loadLeaderboardGame1();
    loadLeaderboardGame2();
}

function selectBoard(boardNum) {
    currentBoard = boardNum;
    const radio = document.getElementById(`game${boardNum}-radio`);
    if (radio) {
        radio.checked = true;
    }

    // Highlight the active button
    document.querySelectorAll('#leaderboard-switch-button-container button').forEach(btn => {
        btn.classList.remove('active-btn');
    });
    const activeBtn = document.getElementById(`leaderboard-game${boardNum}-switch`);
    if (activeBtn) {
        activeBtn.classList.add('active-btn');
    }

    AudioManager.playButtonPress();
}

function selectDifficulty(diff) {
    currentDifficulty = diff;
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.classList.remove('active-diff');
    });
    const activeDiff = document.querySelector(`.diff-btn[data-diff="${diff}"]`);
    if (activeDiff) activeDiff.classList.add('active-diff');

    AudioManager.playButtonPress();

    // Reload the current board
    if (currentBoard === 1) loadLeaderboardGame1();
    else loadLeaderboardGame2();
}

async function loadLeaderboardGame1() {
    try {
        let query = supabaseClient
            .from('leaderboard_game1')
            .select('*');

        if (currentDifficulty !== "ALL") {
            query = query.eq('rating', currentDifficulty);
        }

        const { data, error } = await query
            .order('score', { ascending: false })
            .limit(50);

        if (error) throw error;

        renderLeaderboard('leaderboard-game1-body', data, 'score');
    } catch (error) {
        document.getElementById("leaderboard-game1-body").innerHTML =
            `<tr><td colspan='3' class='error-message'>⚠️ Failed to load leaderboard (${error.message || "connection error"})</td></tr>`;
    }
}

async function loadLeaderboardGame2() {
    try {
        let query = supabaseClient
            .from('leaderboard_game2')
            .select('*');

        if (currentDifficulty !== "ALL") {
            query = query.eq('rating', currentDifficulty);
        }

        const { data, error } = await query
            .order('score', { ascending: false })
            .limit(50);

        if (error) throw error;

        renderLeaderboard('leaderboard-game2-body', data, 'score');
    } catch (error) {
        document.getElementById("leaderboard-game2-body").innerHTML =
            `<tr><td colspan='3' class='error-message'>⚠️ Failed to load leaderboard (${error.message || "connection error"})</td></tr>`;
    }
}

function renderLeaderboard(tbodyId, data, scoreField) {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan='3' class='empty-message'>No leaders yet... Play your way to the top!</td></tr>`;
        return;
    }

    data.forEach((row, index) => {
        const tr = document.createElement("tr");
        const rank = index + 1;
        let rankClass = "";
        if (rank === 1) rankClass = "rank-gold";
        else if (rank === 2) rankClass = "rank-silver";
        else if (rank === 3) rankClass = "rank-bronze";

        const score = row[scoreField] ?? row.score ?? row.MG_highest_score ?? row.CB_highest_score ?? 0;
        const name = row.player_name || row.user_name || "Unknown";

        tr.innerHTML = `
            <td class="rank-cell ${rankClass}">${rank}</td>
            <td class="name-cell">${escapeHtml(name)}</td>
            <td class="score-cell">${score}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Helper: escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}