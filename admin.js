// ADMIN PANEL SCRIPT
// Thornex Digital Entity

// Credentials
const ADMIN_CREDENTIALS = [
    { username: 'Derty', password: '52aj7wh2hw772@' },
    { username: 'Zaax', password: '52aj7wh2hw772@' }
];

let isLoggedIn = false;
let allPrompts = [];

// Login function
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    const valid = ADMIN_CREDENTIALS.some(cred => 
        cred.username === username && cred.password === password
    );
    
    if (valid) {
        isLoggedIn = true;
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadPromptList();
        showToast('Login berhasil!');
    } else {
        showToast('Username atau password salah!');
    }
}

// Logout function
function logout() {
    isLoggedIn = false;
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Add new prompt
async function addPrompt() {
    const title = document.getElementById('promptTitle').value.trim();
    const author = document.getElementById('promptAuthor').value.trim();
    const category = document.getElementById('promptCategory').value;
    const password = document.getElementById('promptPassword').value.trim();
    const content = document.getElementById('promptContent').value.trim();
    
    if (!title || !content) {
        showToast('Judul dan isi prompt wajib diisi!');
        return;
    }
    
    const newPrompt = {
        title: title,
        author: author || 'XSO',
        category: category,
        password: password || null,
        content: content,
        created_at: new Date().toISOString()
    };
    
    try {
        const { data, error } = await supabaseClient
            .from('prompts')
            .insert([newPrompt])
            .select();
        
        if (error) throw error;
        
        showToast('Prompt berhasil ditambahkan!');
        
        // Clear form
        document.getElementById('promptTitle').value = '';
        document.getElementById('promptAuthor').value = '';
        document.getElementById('promptPassword').value = '';
        document.getElementById('promptContent').value = '';
        
        loadPromptList();
    } catch (error) {
        console.error('Error adding prompt:', error);
        showToast('Gagal menambahkan prompt: ' + error.message);
    }
}

// Load prompt list for admin
async function loadPromptList() {
    try {
        const { data, error } = await supabaseClient
            .from('prompts')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        allPrompts = data || [];
        renderPromptList();
    } catch (error) {
        console.error('Error loading prompts:', error);
        document.getElementById('promptList').innerHTML = '<div style="color:#ff3366">Error loading data</div>';
    }
}

// Render prompt list
function renderPromptList() {
    const container = document.getElementById('promptList');
    
    if (allPrompts.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; color:#888">Belum ada prompt.</div>';
        return;
    }
    
    container.innerHTML = allPrompts.map(prompt => `
        <div class="list-item">
            <div>
                <strong style="color:#ff3366">${escapeHtml(prompt.title)}</strong><br>
                <small style="color:#888">${prompt.category} | ${prompt.content.length} karakter | By ${escapeHtml(prompt.author || 'XSO')}</small>
            </div>
            <button class="delete-btn" onclick="deletePrompt('${prompt.id}')">Hapus</button>
        </div>
    `).join('');
}

// Delete prompt
async function deletePrompt(id) {
    if (confirm('Yakin mau hapus prompt ini?')) {
        try {
            const { error } = await supabaseClient
                .from('prompts')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            showToast('Prompt berhasil dihapus!');
            loadPromptList();
        } catch (error) {
            console.error('Error deleting prompt:', error);
            showToast('Gagal menghapus prompt');
        }
    }
}

// Show toast
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

// Check login status on load
document.addEventListener('DOMContentLoaded', () => {
    // Sembunyikan admin panel initially
    document.getElementById('adminPanel').style.display = 'none';
});