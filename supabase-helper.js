// ============================================================
// GITLOG GOURMET - Supabase Helper
// ============================================================
// Shared Supabase client and score submission functions.
// Include this BEFORE game scripts on game pages.
// ============================================================

// ============================================================
// SUPABASE CONFIGURATION
// ============================================================
const SUPABASE_URL = "https://jfvhcgloqrpjfdzuxusd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdmhjZ2xvcXJwamZkenV4dXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NzEyMDAsImV4cCI6MjA5ODM0NzIwMH0.YUem8NqBAySlw5tOKba_LoEvyatPw9mjr2PxO3HVFfY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// GET CURRENT PLAYER NAME
// ============================================================
function getPlayerName() {
    return localStorage.getItem("gitlog_active_username") || "Anonymous";
}

// ============================================================
// SUBMIT SCORE — Game 1 (Matching Pairs)
// ============================================================
async function submitScoreGame1(playerName, score, difficulty) {
    try {
        const { data, error } = await supabaseClient
            .from('leaderboard_game1')
            .insert([
                {
                    player_name: playerName,
                    score: score,
                    rating: difficulty
                }
            ]);

        if (error) {
            console.error("Failed to submit Game 1 score:", error);
            return false;
        }

        console.log("Game 1 score submitted successfully!", data);
        return true;
    } catch (error) {
        console.error("Error submitting Game 1 score:", error);
        return false;
    }
}

// ============================================================
// SUBMIT SCORE — Game 2 (Code Breaker)
// ============================================================
async function submitScoreGame2(playerName, score, difficulty) {
    try {
        const { data, error } = await supabaseClient
            .from('leaderboard_game2')
            .insert([
                {
                    player_name: playerName,
                    score: score,
                    rating: difficulty
                }
            ]);

        if (error) {
            console.error("Failed to submit Game 2 score:", error);
            return false;
        }

        console.log("Game 2 score submitted successfully!", data);
        return true;
    } catch (error) {
        console.error("Error submitting Game 2 score:", error);
        return false;
    }
}
