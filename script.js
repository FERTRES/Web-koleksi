// DATABASE PROMPT MAIN SCRIPT
// Thornex Digital Entity

let allPrompts = [];
let currentFilter = 'all';
let currentSearch = '';

// Load prompts from Supabase
async function loadPrompts() {
    try {
        const { data, error } = await supabaseClient
            .from('prompts')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        allPrompts = data || [];
        updateStats();
        renderPrompts();
    } catch (error) {
        console.error('Error loading prompts:', error);
        document.getElementById('promptGrid').innerHTML = `
            <div class="loading" style="color:#ff3366">
                Error loading database. Make sure table 'prompts' exists in Supabase.
            </div>
        `;
    }
}

// Update statistics
function updateStats() {
    const total = allPrompts.length;
    const jailbreak = allPrompts.filter(p => p.category === 'jailbreak').length;
    
    document.getElementById('statTotal').innerText = total;
    document.getElementById('statJailbreak').innerText = jailbreak;
    document.getElementById('totalPrompt').innerText = total;
}

// Filter and search prompts
function getFilteredPrompts() {
    let filtered = [...allPrompts];
    
    // Filter by category
    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilter);
    }
    
    // Filter by search
    if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(searchLower) ||
            p.content.toLowerCase().includes(searchLower) ||
            (p.author && p.author.toLowerCase().includes(searchLower))
        );
    }
    
    return filtered;
}

// Render prompts to grid
function renderPrompts() {
    const filtered = getFilteredPrompts();
    const grid = document.getElementById('promptGrid');
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="loading">Tidak ada prompt ditemukan.</div>';
        return;
    }
    
    grid.innerHTML = filtered.map(prompt => `
        <div class="prompt-card" data-id="${prompt.id}">
            <div class="prompt-header">
                <div>
                    <div class="prompt-title">${escapeHtml(prompt.title)}</div>
                    <div class="prompt-category">${prompt.category.toUpperCase()}</div>
                    ${prompt.author ? `<div class="prompt-author">Created By ${escapeHtml(prompt.author)}</div>` : ''}
                </div>
            </div>
            <div class="prompt-body">
                <div class="prompt-content">${escapeHtml(prompt.content)}</div>
            </div>
            <div class="prompt-footer">
                <div class="prompt-char">${prompt.content.length.toLocaleString()} karakter</div>
                <button class="copy-btn" onclick="copyPrompt('${prompt.id}')">Copy</button>
            </div>
        </div>
    `).join('');
}

// Copy prompt to clipboard
async function copyPrompt(id) {
    const prompt = allPrompts.find(p => p.id === id);
    if (prompt) {
        try {
            await navigator.clipboard.writeText(prompt.content);
            showToast('Prompt copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy');
        }
    }
}

// Show toast notification
function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderPrompts();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.category;
        renderPrompts();
    });
});

// Initialize
loadPrompts();