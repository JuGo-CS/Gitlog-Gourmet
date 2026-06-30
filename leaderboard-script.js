// ============================================================
// SUPABASE CONFIGURATION
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

    loadLeaderboardGame1();
    loadLeaderboardGame2();
}

function selectBoard(boardNum) {
    const radio = document.getElementById(`game${boardNum}-radio`);
    if (radio) {
        radio.checked = true;
    }
}

async function loadLeaderboardGame1() {
    try {
        const { data, error } = await supabaseClient
            .from('leaderboard_game1')
            .select('*')
            .order('score', { ascending: false })
            .limit(50);

        if (error) throw error;

        const tbody = document.getElementById("leaderboard-game1-body");
        tbody.innerHTML = "";

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td align='center' colspan='4'>No leaders yet... Play your way to the top!</td></tr>`;
            return;
        }

        data.forEach((row, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td align='center'>${index + 1}</td>
                <td align='center'>${escapeHtml(row.player_name || row.user_name || "Unknown")}</td>
                <td align='center'>${row.rating ?? "---"}</td>
                <td align='center'>${row.score}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading Game 1 leaderboard:", error);
        document.getElementById("leaderboard-game1-body").innerHTML =
            `<tr><td align='center' colspan='4'>⚠️ Failed to load leaderboard</td></tr>`;
    }
}

async function loadLeaderboardGame2() {
    try {
        const { data, error } = await supabaseClient
            .from('leaderboard_game2')
            .select('*')
            .order('score', { ascending: false })
            .limit(50);

        if (error) throw error;

        const tbody = document.getElementById("leaderboard-game2-body");
        tbody.innerHTML = "";

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td align='center' colspan='4'>No leaders yet... Play your way to the top!</td></tr>`;
            return;
        }

        data.forEach((row, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td align='center'>${index + 1}</td>
                <td align='center'>${escapeHtml(row.player_name || row.user_name || "Unknown")}</td>
                <td align='center'>${row.rating ?? "---"}</td>
                <td align='center'>${row.score}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading Game 2 leaderboard:", error);
        document.getElementById("leaderboard-game2-body").innerHTML =
            `<tr><td align='center' colspan='4'>Failed to load leaderboard</td></tr>`;
    }
}

// Helper: escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}