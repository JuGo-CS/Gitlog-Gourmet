// ============================================================
// GITLOG GOURMET - Username Manager
// ============================================================
// Handles username creation, switching, and persistence via
// localStorage. Usernames persist across refreshes and browser
// closes. Multiple accounts can be saved and switched between.
// ============================================================

const STORAGE_KEY = "gitlog_usernames";
const ACTIVE_KEY = "gitlog_active_username";

// ============================================================
// GET / SET SAVED USERNAMES
// ============================================================
function getSavedUsernames() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveUsernames(usernames) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usernames));
}

function getActiveUsername() {
    return localStorage.getItem(ACTIVE_KEY) || "";
}

function setActiveUsername(name) {
    if (name) {
        localStorage.setItem(ACTIVE_KEY, name);
    } else {
        localStorage.removeItem(ACTIVE_KEY);
    }
}

// ============================================================
// USERNAME VALIDATION
// ============================================================
function isValidUsername(name) {
    if (!name || typeof name !== "string") return false;
    const trimmed = name.trim();
    return trimmed.length >= 2 && trimmed.length <= 20;
}

// ============================================================
// ADD / SWITCH / DELETE USERNAMES
// ============================================================
function addUsername(name) {
    const trimmed = name.trim();
    if (!isValidUsername(trimmed)) return false;

    let usernames = getSavedUsernames();

    // Check if already exists (case-insensitive)
    const exists = usernames.some(u => u.toLowerCase() === trimmed.toLowerCase());
    if (exists) return false;

    usernames.push(trimmed);
    saveUsernames(usernames);
    return true;
}

function switchToUsername(name) {
    const trimmed = name.trim();
    const usernames = getSavedUsernames();
    const exists = usernames.some(u => u.toLowerCase() === trimmed.toLowerCase());

    if (exists) {
        setActiveUsername(trimmed);
        updateUserBadge(trimmed);
        closeUsernameModal();
        return true;
    }
    return false;
}

function deleteUsername(name) {
    let usernames = getSavedUsernames();
    const filtered = usernames.filter(u => u.toLowerCase() !== name.toLowerCase());

    if (filtered.length === usernames.length) return false;

    saveUsernames(filtered);

    // If the deleted user was active, clear active or switch to first available
    const active = getActiveUsername();
    if (active.toLowerCase() === name.toLowerCase()) {
        if (filtered.length > 0) {
            setActiveUsername(filtered[0]);
            updateUserBadge(filtered[0]);
        } else {
            setActiveUsername("");
            updateUserBadge("");
        }
    }

    renderSavedAccounts();
    return true;
}

// ============================================================
// MODAL UI
// ============================================================
function openUsernameModal() {
    const overlay = document.getElementById("username-overlay");
    if (overlay) {
        overlay.classList.add("active");
        renderSavedAccounts();
        // Focus the input
        const input = document.getElementById("username-input");
        if (input) input.focus();
    }
}

function closeUsernameModal() {
    const overlay = document.getElementById("username-overlay");
    if (overlay) {
        overlay.classList.remove("active");
    }
}

function renderSavedAccounts() {
    const list = document.getElementById("saved-accounts-list");
    if (!list) return;

    const usernames = getSavedUsernames();
    const active = getActiveUsername();

    if (usernames.length === 0) {
        list.innerHTML = `<div style="color: rgba(255,255,255,0.5); font-size: 0.9vw; padding: 0.5vw;">No saved accounts yet</div>`;
        return;
    }

    list.innerHTML = usernames
        .map(
            (u) => `
            <div class="saved-account-item" data-username="${u.replace(/"/g, "&quot;")}">
                <span class="account-name">${escapeHtml(u)}${u.toLowerCase() === active.toLowerCase() ? ' <span style="color:#FFD700;font-size:0.8vw;">(active)</span>' : ""}</span>
                <button class="account-delete" data-username="${u.replace(/"/g, "&quot;")}" title="Remove this account">&times;</button>
            </div>
        `
        )
        .join("");

    // Click on item to switch
    list.querySelectorAll(".saved-account-item").forEach((item) => {
        item.addEventListener("click", function (e) {
            // Don't switch if clicking the delete button
            if (e.target.classList.contains("account-delete")) return;
            const name = this.dataset.username;
            switchToUsername(name);
        });
    });

    // Click on delete button
    list.querySelectorAll(".account-delete").forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            const name = this.dataset.username;
            if (confirm(`Remove "${name}" from saved accounts?`)) {
                deleteUsername(name);
            }
        });
    });
}

// ============================================================
// USER BADGE (shown in header when logged in)
// ============================================================
function updateUserBadge(username) {
    const badge = document.getElementById("user-badge");
    const display = document.getElementById("username-display-text");
    const avatar = document.querySelector("#user-badge .avatar");
    const menuBtn = document.getElementById("home-menu-button");

    if (!badge || !display) return;

    if (username) {
        badge.style.display = "flex";
        display.textContent = username;
        if (avatar) {
            avatar.textContent = username.charAt(0).toUpperCase();
        }
        if (menuBtn) menuBtn.style.display = "none";
    } else {
        badge.style.display = "none";
        if (menuBtn) menuBtn.style.display = "block";
    }

    // Close dropdown on badge update
    closeUserDropdown();
}

function toggleUserDropdown() {
    const dropdown = document.getElementById("user-dropdown");
    if (dropdown) {
        const isActive = dropdown.classList.contains("active");
        // Close all other open dropdowns first
        closeUserDropdown();
        // Toggle this one
        if (!isActive) {
            dropdown.classList.add("active");
        }
    }
}

function closeUserDropdown() {
    document.querySelectorAll("#user-dropdown.active").forEach(d => {
        d.classList.remove("active");
    });
}

// ============================================================
// HANDLE "LOG OUT" / SWITCH USER
// ============================================================
function logoutUser() {
    // Clear the active username so the modal shows fresh
    setActiveUsername("");
    updateUserBadge("");
    closeUserDropdown();
    openUsernameModal();
}

// ============================================================
// HANDLE FORM SUBMISSION
// ============================================================
async function handleUsernameSubmit() {
    const input = document.getElementById("username-input");
    const error = document.getElementById("username-error");
    const submitBtn = document.querySelector("#username-modal .btn-primary");
    if (!input || !error) return;

    const name = input.value.trim();
    error.textContent = "";

    if (!isValidUsername(name)) {
        error.textContent = "Username must be 2-20 characters.";
        return;
    }

    // Check if already exists in localStorage
    const usernames = getSavedUsernames();
    const localExists = usernames.some(u => u.toLowerCase() === name.toLowerCase());

    if (localExists) {
        // Just switch to it
        switchToUsername(name);
        input.value = "";
        return;
    }

    // Check if username exists in the database (across all devices)
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Checking...";
        error.textContent = "";

        const existsInDB = await checkUsernameExistsInDB(name);

        if (existsInDB) {
            error.textContent = 'This username is already taken! Please choose another one.';
            submitBtn.disabled = false;
            submitBtn.textContent = "Let's Go!";
            return;
        }
    } catch (dbError) {
        console.error("DB check failed, proceeding:", dbError);
        // Fail open — allow if DB is unreachable
    }

    // Add new and switch
    addUsername(name);
    setActiveUsername(name);
    updateUserBadge(name);
    input.value = "";
    submitBtn.disabled = false;
    submitBtn.textContent = "Let's Go!";
    closeUsernameModal();
}

// ============================================================
// INITIALIZATION
// ============================================================
function initializeUsernameSystem() {
    const active = getActiveUsername();

    if (active) {
        // Ensure the active user is in the saved list
        const usernames = getSavedUsernames();
        const exists = usernames.some(u => u.toLowerCase() === active.toLowerCase());
        if (!exists) {
            usernames.push(active);
            saveUsernames(usernames);
        }
        updateUserBadge(active);
    } else {
        // No active user — show modal
        openUsernameModal();
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        const dropdown = document.getElementById("user-dropdown");
        if (dropdown && dropdown.classList.contains("active")) {
            // Check if click is outside the entire badge area
            const badge = document.getElementById("user-badge");
            if (badge && !badge.contains(e.target)) {
                dropdown.classList.remove("active");
            }
        }
    });

    // Prevent modal close when clicking inside the modal itself
    const modal = document.getElementById("username-modal");
    if (modal) {
        modal.addEventListener("click", function (e) {
            e.stopPropagation();
        });
    }

    // Close modal when clicking the overlay background (not the modal)
    const overlay = document.getElementById("username-overlay");
    if (overlay) {
        overlay.addEventListener("click", function () {
            // Only close if there's an active user (don't force if no user)
            if (getActiveUsername()) {
                closeUsernameModal();
            }
        });
    }

    // Attach click handler to the badge toggle area
    const badgeToggle = document.querySelector("#user-badge .badge-toggle");
    if (badgeToggle) {
        badgeToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleUserDropdown();
        });
    }

    // Attach click handlers to dropdown items via data-action
    document.querySelectorAll("#user-dropdown .dropdown-item").forEach(item => {
        item.addEventListener("click", function (e) {
            e.stopPropagation();
            const action = this.dataset.action;
            if (action === "switch") {
                closeUserDropdown();
                openUsernameModal();
            } else if (action === "logout") {
                logoutUser();
            }
        });
    });

    // Enter key in input
    const input = document.getElementById("username-input");
    if (input) {
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                handleUsernameSubmit();
            }
        });
    }

    // Personal Best overlay close on background click
    const pbOverlay = document.getElementById("pb-overlay");
    if (pbOverlay) {
        pbOverlay.addEventListener("click", function (e) {
            if (e.target === this) {
                this.classList.remove("active");
            }
        });
    }
}

// ============================================================
// PERSONAL BEST
// ============================================================
function togglePersonalBest() {
    const overlay = document.getElementById("pb-overlay");
    if (!overlay) return;
    overlay.classList.toggle("active");

    if (overlay.classList.contains("active")) {
        loadPersonalBest();
    }
}

async function loadPersonalBest() {
    const content = document.getElementById("pb-content");
    if (!content) return;

    const username = getActiveUsername();
    if (!username) {
        content.innerHTML = `<div class="pb-empty">&#128100; No active user. Please log in first.</div>`;
        return;
    }

    content.innerHTML = `<div class="pb-loading">&#9203; Fetching your records...</div>`;

    const records = await getPersonalBest(username);

    let html = `<div class="pb-user">&#128100; <span>${escapeHtml(username)}</span></div>`;

    // Game 1
    if (records.game1) {
        html += `
            <div class="pb-game-row">
                <div class="pb-game-icon">&#127918;</div>
                <div class="pb-game-info">
                    <div class="pb-game-name">Matching Pairs</div>
                    <div class="pb-game-diff">${records.game1.rating || '---'}</div>
                </div>
                <div class="pb-game-score">${records.game1.score}</div>
            </div>`;
    } else {
        html += `
            <div class="pb-game-row pb-no-score">
                <div class="pb-game-icon">&#127918;</div>
                <div class="pb-game-info">
                    <div class="pb-game-name">Matching Pairs</div>
                </div>
                <div class="pb-game-score">--</div>
            </div>`;
    }

    // Game 2
    if (records.game2) {
        html += `
            <div class="pb-game-row">
                <div class="pb-game-icon">&#128300;</div>
                <div class="pb-game-info">
                    <div class="pb-game-name">Code Breaker</div>
                    <div class="pb-game-diff">${records.game2.rating || '---'}</div>
                </div>
                <div class="pb-game-score">${records.game2.score}</div>
            </div>`;
    } else {
        html += `
            <div class="pb-game-row pb-no-score">
                <div class="pb-game-icon">&#128300;</div>
                <div class="pb-game-info">
                    <div class="pb-game-name">Code Breaker</div>
                </div>
                <div class="pb-game-score">--</div>
            </div>`;
    }

    content.innerHTML = html;
}

// ============================================================
// HELPER
// ============================================================
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Run on page load
document.addEventListener("DOMContentLoaded", initializeUsernameSystem);
