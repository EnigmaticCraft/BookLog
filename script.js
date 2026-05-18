let bookLogData = {
    "exported": "2026-05-18T03:04:48.532Z",
    "toRead": [],
    "haveRead": [],
    "notes": {}
};

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('book-log-2026-05-18.json');
        if (response.ok) {
            bookLogData = await response.json();
            renderAllTabs();
        } else {
            console.warn('Could not load book-log data, using default');
            renderAllTabs();
        }
    } catch (error) {
        console.warn('Error loading data:', error);
        renderAllTabs();
    }
}

// Switch between tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Render all tab content
function renderAllTabs() {
    renderToRead();
    renderHaveRead();
    renderNotes();
    updateExportedDate();
}

// Render "To Read" books
function renderToRead() {
    const container = document.getElementById('toReadList');
    const empty = document.getElementById('toReadEmpty');
    
    if (bookLogData.toRead && bookLogData.toRead.length > 0) {
        container.innerHTML = bookLogData.toRead.map(book => `
            <div class="book-item">
                <h3>${escapeHtml(book.title || 'Untitled')}</h3>
                <p><strong>Author:</strong> ${escapeHtml(book.author || 'Unknown')}</p>
                ${book.genre ? `<p><strong>Genre:</strong> ${escapeHtml(book.genre)}</p>` : ''}
                ${book.priority ? `<p><strong>Priority:</strong> ${escapeHtml(book.priority)}</p>` : ''}
            </div>
        `).join('');
        empty.style.display = 'none';
    } else {
        container.innerHTML = '';
        empty.style.display = 'block';
    }
}

// Render "Have Read" books
function renderHaveRead() {
    const container = document.getElementById('haveReadList');
    const empty = document.getElementById('haveReadEmpty');
    
    if (bookLogData.haveRead && bookLogData.haveRead.length > 0) {
        container.innerHTML = bookLogData.haveRead.map(book => `
            <div class="book-item">
                <h3>${escapeHtml(book.title || 'Untitled')}</h3>
                <p><strong>Author:</strong> ${escapeHtml(book.author || 'Unknown')}</p>
                ${book.genre ? `<p><strong>Genre:</strong> ${escapeHtml(book.genre)}</p>` : ''}
                ${book.rating ? `<p><strong>Rating:</strong> ${'⭐'.repeat(book.rating)}</p>` : ''}
                ${book.dateRead ? `<p><strong>Date Read:</strong> ${escapeHtml(book.dateRead)}</p>` : ''}
            </div>
        `).join('');
        empty.style.display = 'none';
    } else {
        container.innerHTML = '';
        empty.style.display = 'block';
    }
}

// Render Notes
function renderNotes() {
    const container = document.getElementById('notesList');
    const empty = document.getElementById('notesEmpty');
    
    if (bookLogData.notes && Object.keys(bookLogData.notes).length > 0) {
        container.innerHTML = Object.entries(bookLogData.notes).map(([title, content]) => `
            <div class="note-item">
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(content).replace(/\n/g, '<br>')}</p>
            </div>
        `).join('');
        empty.style.display = 'none';
    } else {
        container.innerHTML = '';
        empty.style.display = 'block';
    }
}

// Update exported date
function updateExportedDate() {
    const dateElement = document.getElementById('exportedDate');
    if (bookLogData.exported) {
        const date = new Date(bookLogData.exported);
        dateElement.textContent = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadData);