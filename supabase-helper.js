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
// Only saves if the player won. Updates only if new score is higher.
// ============================================================
async function submitScoreGame1(playerName, score, difficulty) {
    if (!playerName || score <= 0) return false;
    try {
        // Check existing score for this player
        const { data: existing } = await supabaseClient
            .from('leaderboard_game1')
            .select('score')
            .eq('player_name', playerName)
            .maybeSingle();

        if (existing && score <= existing.score) {
            console.log(`Score not submitted — ${playerName}'s existing score (${existing.score}) is higher or equal.`);
            return { submitted: false, reason: 'existing_higher' };
        }

        if (existing) {
            // Delete old lower score
            await supabaseClient
                .from('leaderboard_game1')
                .delete()
                .eq('player_name', playerName);
        }

        // Insert new score
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
            return { submitted: false, reason: 'error' };
        }

        console.log("Game 1 score submitted successfully!", score);
        return { submitted: true };
    } catch (error) {
        console.error("Error submitting Game 1 score:", error);
        return { submitted: false, reason: 'error' };
    }
}

// ============================================================
// SUBMIT SCORE — Game 2 (Code Breaker)
// Only saves if the player won. Updates only if new score is higher.
// ============================================================
async function submitScoreGame2(playerName, score, difficulty) {
    if (!playerName || score <= 0) return false;
    try {
        // Check existing score for this player
        const { data: existing } = await supabaseClient
            .from('leaderboard_game2')
            .select('score')
            .eq('player_name', playerName)
            .maybeSingle();

        if (existing && score <= existing.score) {
            console.log(`Score not submitted — ${playerName}'s existing score (${existing.score}) is higher or equal.`);
            return { submitted: false, reason: 'existing_higher' };
        }

        if (existing) {
            // Delete old lower score
            await supabaseClient
                .from('leaderboard_game2')
                .delete()
                .eq('player_name', playerName);
        }

        // Insert new score
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
            return { submitted: false, reason: 'error' };
        }

        console.log("Game 2 score submitted successfully!", score);
        return { submitted: true };
    } catch (error) {
        console.error("Error submitting Game 2 score:", error);
        return { submitted: false, reason: 'error' };
    }
}

// ============================================================
// CHECK LEADERBOARD RANK (for end-card display)
// ============================================================
async function getPlayerRank(tableName, playerName) {
    try {
        const { data, error } = await supabaseClient
            .from(tableName)
            .select('player_name, score')
            .order('score', { ascending: false })
            .limit(50);

        if (error || !data) return null;

        const index = data.findIndex(row =>
            row.player_name.toLowerCase() === playerName.toLowerCase()
        );

        if (index === -1) return null;
        return index + 1; // 1-based rank
    } catch {
        return null;
    }
}
