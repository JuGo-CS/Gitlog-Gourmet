// ============================================================
// SUPABASE CONFIGURATION
// ============================================================
// INSTRUCTIONS:
//   1. Go to https://supabase.com -> Project Settings -> API
//   2. Copy your "Project URL" and "anon public" key
//   3. Paste them below
// ============================================================
const SUPABASE_URL = "https://jfvhcgloqrpjfdzuxusd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdmhjZ2xvcXJwamZkenV4dXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NzEyMDAsImV4cCI6MjA5ODM0NzIwMH0.YUem8NqBAySlw5tOKba_LoEvyatPw9mjr2PxO3HVFfY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// LEADERBOARD LOGIC
// ============================================================

document.addEventListener("DOMContentLoaded", initializePage);

function initializePage(){
    document.querySelectorAll('#leaderboard-table-container table').forEach(table =>{
        table.classList.add('inactive-board');
    });

    // Set initial active button (Game 1 is checked by default)
    const defaultBtn = document.getElementById('leaderboard-game1-switch');
    if (defaultBtn) defaultBtn.classList.add('active-btn');

    loadLeaderboardGame1();
    loadLeaderboardGame2();
}

function selectBoard(boardNum) {
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
}

async function loadLeaderboardGame1() {
    try {
        console.log("Fetching Game 1 leaderboard from Supabase...");
        console.log("URL:", SUPABASE_URL);
        
        const { data, error } = await supabaseClient
            .from('leaderboard_game1')
            .select('*')
            .order('score', { ascending: false })
            .limit(50);

        if (error) {
            console.error("Supabase error details:", error);
            // Try alternative column name
            console.log("Trying with alternative column name 'MG_highest_score'...");
            const { data: altData, error: altError } = await supabaseClient
                .from('leaderboard_game1')
                .select('*')
                .order('MG_highest_score', { ascending: false })
                .limit(50);
                
            if (!altError && altData) {
                return renderLeaderboard('leaderboard-game1-body', altData, 'MG_highest_score');
            }
            throw error;
        }

        console.log("Game 1 data received:", data);
        renderLeaderboard('leaderboard-game1-body', data, 'score');
    } catch (error) {
        console.error("Error loading Game 1 leaderboard:", error);
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        document.getElementById("leaderboard-game1-body").innerHTML =
            `<tr><td colspan='3' class='error-message'>⚠️ Failed to load leaderboard (${error.message || "connection error"})</td></tr>`;
    }
}

async function loadLeaderboardGame2() {
    try {
        console.log("Fetching Game 2 leaderboard from Supabase...");
        const { data, error } = await supabaseClient
            .from('leaderboard_game2')
            .select('*')
            .order('score', { ascending: false })
            .limit(50);

        if (error) {
            console.error("Supabase error details:", error);
            // Try alternative column name
            console.log("Trying with alternative column name 'CB_highest_score'...");
            const { data: altData, error: altError } = await supabaseClient
                .from('leaderboard_game2')
                .select('*')
                .order('CB_highest_score', { ascending: false })
                .limit(50);
                
            if (!altError && altData) {
                return renderLeaderboard('leaderboard-game2-body', altData, 'CB_highest_score');
            }
            throw error;
        }

        console.log("Game 2 data received:", data);
        renderLeaderboard('leaderboard-game2-body', data, 'score');
    } catch (error) {
        console.error("Error loading Game 2 leaderboard:", error);
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
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