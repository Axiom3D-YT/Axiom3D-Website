const CONFIG_KEY = 'axiom3d_admin_config';
const TOKEN_KEY = 'axiom3d_admin_token';

// DOM Elements
const configSection = document.getElementById('config-section');
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const statusMsg = document.getElementById('status-msg');

// State
let config = JSON.parse(localStorage.getItem(CONFIG_KEY));
let token = localStorage.getItem(TOKEN_KEY);
let currentProjects = [];
let currentSha = ''; // Required for GitHub API updates

// Init
function init() {
    if (!config) {
        showSection(configSection);
    } else if (!token) {
        showSection(loginSection);
    } else {
        showSection(dashboardSection);
        loadProjects();
    }
}

function showSection(section) {
    configSection.style.display = 'none';
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    section.style.display = 'block';
}

function saveConfig() {
    const owner = document.getElementById('repo-owner').value.trim();
    const name = document.getElementById('repo-name').value.trim();
    
    if (owner && name) {
        config = { owner, name };
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        init();
    } else {
        alert('Please fill in all fields');
    }
}

function clearConfig() {
    localStorage.removeItem(CONFIG_KEY);
    localStorage.removeItem(TOKEN_KEY);
    location.reload();
}

function login() {
    const inputToken = document.getElementById('github-token').value.trim();
    if (inputToken) {
        token = inputToken;
        localStorage.setItem(TOKEN_KEY, token);
        init();
    }
}

function logout() {
    localStorage.removeItem(TOKEN_KEY);
    location.reload();
}

function showStatus(msg, type) {
    statusMsg.textContent = msg;
    statusMsg.className = `status-msg ${type}`;
    statusMsg.style.display = 'block';
    setTimeout(() => {
        statusMsg.style.display = 'none';
    }, 5000);
}

// GitHub API Interactions
async function loadProjects() {
    try {
        const url = `https://api.github.com/repos/${config.owner}/${config.name}/contents/projects.json`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch projects');

        const data = await response.json();
        currentSha = data.sha;
        // Decode Base64 content
        const content = atob(data.content);
        currentProjects = JSON.parse(content);
        
        renderProjects();
    } catch (error) {
        console.error(error);
        showStatus('Error loading projects. Check console.', 'error');
        if (error.message.includes('401')) logout(); // Invalid token
    }
}

async function saveProjects(newProjects) {
    try {
        const url = `https://api.github.com/repos/${config.owner}/${config.name}/contents/projects.json`;
        const content = btoa(JSON.stringify(newProjects, null, 4)); // Encode to Base64

        const body = {
            message: 'Update projects via Admin Panel',
            content: content,
            sha: currentSha
        };

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error('Failed to save projects');

        const data = await response.json();
        currentSha = data.content.sha; // Update SHA for next write
        currentProjects = newProjects;
        renderProjects();
        showStatus('Project saved successfully!', 'success');
        
        // Clear form
        document.getElementById('new-title').value = '';
        document.getElementById('new-link').value = '';
        document.getElementById('new-desc').value = '';

    } catch (error) {
        console.error(error);
        showStatus('Error saving projects. Check console.', 'error');
    }
}

function renderProjects() {
    const list = document.getElementById('project-list');
    list.innerHTML = '';

    currentProjects.forEach((project, index) => {
        const item = document.createElement('div');
        item.className = 'project-list-item';
        item.innerHTML = `
            <div>
                <strong>${project.title}</strong><br>
                <small>${project.link}</small>
            </div>
            <button class="delete-btn" onclick="deleteProject(${index})">Delete</button>
        `;
        list.appendChild(item);
    });
}

// Actions
window.addProject = function() {
    const title = document.getElementById('new-title').value.trim();
    const link = document.getElementById('new-link').value.trim();
    const description = document.getElementById('new-desc').value.trim();

    if (!title || !link) {
        showStatus('Title and Link are required', 'error');
        return;
    }

    const newProject = {
        id: Date.now().toString(), // Simple ID
        title,
        link,
        description,
        image: ''
    };

    const updatedProjects = [...currentProjects, newProject];
    saveProjects(updatedProjects);
};

window.deleteProject = function(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        const updatedProjects = currentProjects.filter((_, i) => i !== index);
        saveProjects(updatedProjects);
    }
};

// Start
init();
