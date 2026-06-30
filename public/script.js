// API Configuration
const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Initialize app
if (authToken) {
    showMainSection();
    loadFeed();
} else {
    showAuthSection();
}

// ============ AUTH FUNCTIONS ============

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

async function register() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!username || !email || !password) {
        alert('Please fill all fields');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMainSection();
            loadFeed();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed');
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please fill all fields');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMainSection();
            loadFeed();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    showAuthSection();
}

// ============ UI FUNCTIONS ============

function showAuthSection() {
    document.getElementById('authSection').style.display = 'flex';
    document.getElementById('mainSection').style.display = 'none';
}

function showMainSection() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainSection').style.display = 'block';
    
    if (!currentUser) {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    
    updateSidebar();
}

function toggleMenu() {
    document.getElementById('navbarMenu').classList.toggle('active');
}

function updateSidebar() {
    if (!currentUser) return;
    
    document.getElementById('sidebarUsername').textContent = currentUser.username;
    document.getElementById('sidebarBio').textContent = currentUser.bio || 'No bio yet';
    document.getElementById('sidebarProfilePic').src = currentUser.profilePicture || 'https://via.placeholder.com/100';
    document.getElementById('creatorProfilePic').src = currentUser.profilePicture || 'https://via.placeholder.com/50';
}

// ============ POST FUNCTIONS ============

async function createPost() {
    const content = document.getElementById('postContent').value;
    const image = document.getElementById('postImage').value;

    if (!content) {
        alert('Please write something');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ content, image })
        });

        if (response.ok) {
            document.getElementById('postContent').value = '';
            document.getElementById('postImage').value = '';
            loadFeed();
        } else {
            alert('Failed to create post');
        }
    } catch (error) {
        console.error('Post creation error:', error);
    }
}

async function loadFeed() {
    try {
        const response = await fetch(`${API_URL}/posts/feed`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Feed loading error:', error);
        // Fallback to all posts
        loadAllPosts();
    }
}

async function loadAllPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Posts loading error:', error);
    }
}

function displayPosts(posts) {
    const feedContainer = document.getElementById('feedContainer');
    feedContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = createPostElement(post);
        feedContainer.appendChild(postElement);
    });
}

function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    
    const isLiked = post.likes.some(id => id === currentUser.id);
    const likesCount = post.likes.length;
    const commentsCount = post.comments.length;

    postDiv.innerHTML = `
        <div class="post-header">
            <img src="${post.author.profilePicture || 'https://via.placeholder.com/50'}" alt="Profile" class="profile-pic-sm">
            <div class="post-author">
                <div class="post-author-name">${post.author.username}</div>
                <div class="post-author-handle">@${post.author.username}</div>
            </div>
            <div class="post-time">${new Date(post.createdAt).toLocaleDateString()}</div>
        </div>
        
        <div class="post-content">${post.content}</div>
        
        ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
        
        <div class="post-stats">
            <span>${likesCount} Likes</span>
            <span>${commentsCount} Comments</span>
        </div>
        
        <div class="post-actions">
            <button class="post-action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${post._id}')"><i class="fas fa-heart"></i> Like</button>
            <button class="post-action-btn" onclick="toggleCommentSection('${post._id}')"><i class="fas fa-comment"></i> Comment</button>
            ${post.author._id === currentUser.id ? `<button class="post-action-btn" onclick="deletePost('${post._id}')"><i class="fas fa-trash"></i> Delete</button>` : ''}
        </div>
        
        <div id="comments-${post._id}" class="comments-section" style="display:none;">
            <div class="comment-input">
                <input type="text" id="commentInput-${post._id}" placeholder="Add a comment...">
                <button onclick="addComment('${post._id}')">Post</button>
            </div>
            <div id="commentsList-${post._id}"></div>
        </div>
    `;

    return postDiv;
}

async function toggleLike(postId) {
    try {
        const response = await fetch(`${API_URL}/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            loadFeed();
        }
    } catch (error) {
        console.error('Like error:', error);
    }
}

function toggleCommentSection(postId) {
    const section = document.getElementById(`comments-${postId}`);
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

async function addComment(postId) {
    const content = document.getElementById(`commentInput-${postId}`).value;
    
    if (!content) return;

    try {
        const response = await fetch(`${API_URL}/comments/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            document.getElementById(`commentInput-${postId}`).value = '';
            loadFeed();
        }
    } catch (error) {
        console.error('Comment error:', error);
    }
}

async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            loadFeed();
        }
    } catch (error) {
        console.error('Delete error:', error);
    }
}

// ============ EXPLORE & PROFILE ============

async function loadExplore() {
    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();
        
        const container = document.getElementById('suggestedUsersContainer');
        container.innerHTML = '';
        
        users.forEach(user => {
            if (user._id !== currentUser.id) {
                const userDiv = document.createElement('div');
                userDiv.className = 'user-item';
                userDiv.innerHTML = `
                    <div class="user-info">
                        <img src="${user.profilePicture || 'https://via.placeholder.com/40'}" alt="Profile" class="user-item-pic">
                        <div>
                            <div class="user-item-name">${user.username}</div>
                            <small>@${user.username}</small>
                        </div>
                    </div>
                    <button class="btn btn-primary follow-btn" onclick="followUser('${user._id}')">Follow</button>
                `;
                container.appendChild(userDiv);
            }
        });
    } catch (error) {
        console.error('Explore error:', error);
    }
}

async function followUser(userId) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/follow`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            loadExplore();
        }
    } catch (error) {
        console.error('Follow error:', error);
    }
}

function loadProfile() {
    alert(`Profile of ${currentUser.username}\nFollowers: ${currentUser.followers?.length || 0}\nFollowing: ${currentUser.following?.length || 0}`);
}

function editProfile() {
    document.getElementById('editProfileModal').style.display = 'block';
    document.getElementById('editBio').value = currentUser.bio || '';
    document.getElementById('editProfilePic').value = currentUser.profilePicture || '';
}

function closeModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

async function saveProfile() {
    const bio = document.getElementById('editBio').value;
    const profilePicture = document.getElementById('editProfilePic').value;

    try {
        const response = await fetch(`${API_URL}/users/${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ bio, profilePicture })
        });

        if (response.ok) {
            const updatedUser = await response.json();
            currentUser = updatedUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateSidebar();
            closeModal();
            alert('Profile updated!');
        }
    } catch (error) {
        console.error('Profile update error:', error);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editProfileModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
