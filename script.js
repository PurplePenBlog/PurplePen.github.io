document.addEventListener('DOMContentLoaded', () => {
    const blogPostsContainer = document.getElementById('blog-posts');
    const tagListContainer = document.getElementById('tag-list');
    const searchInput = document.getElementById('search-input');
    console.log('Search input element:', searchInput);

    // In a real application, these would be fetched from a backend or a JSON file
    const allPosts = [

    ];

    let activeTags = new Set();

    function renderPosts(postsToRender) {
        blogPostsContainer.innerHTML = ''; // Clear existing posts
        if (postsToRender.length === 0) {
            blogPostsContainer.innerHTML = '<p>No posts found for the selected tags or search query.</p>';
            return;
        }
        postsToRender.forEach(post => {
            const postElement = document.createElement('article');
            postElement.classList.add('post');
            postElement.setAttribute('data-tags', post.tags.join(','));
            
            postElement.innerHTML = `
                <h2 class="post-title"><a href="${post.contentFile}">${post.title}</a></h2>
                <p class="post-meta">${post.date} | Tags: <span class="post-tags">${post.tags.join(', ')}</span></p>
                <div class="post-content">
                    ${post.image ? `<img src="${post.image}" alt="${post.title} image" class="post-image">` : ''}
                    <p>${post.summary}</p>
                    <a href="${post.contentFile}" class="read-more">Read More</a>
                </div>
            `;
            blogPostsContainer.appendChild(postElement);
        });
    }

    function generateTags() {
        const allUniqueTags = new Set();
        allPosts.forEach(post => {
            post.tags.forEach(tag => allUniqueTags.add(tag.trim().toLowerCase()));
        });

        tagListContainer.innerHTML = ''; // Clear existing tags
        Array.from(allUniqueTags).sort().forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.classList.add('tag-button');
            tagButton.textContent = tag;
            tagButton.setAttribute('data-tag', tag);
            tagButton.addEventListener('click', () => toggleTag(tag, tagButton));
            tagListContainer.appendChild(tagButton);
        });
    }

    function toggleTag(tag, buttonElement) {
        if (activeTags.has(tag)) {
            activeTags.delete(tag);
            buttonElement.classList.remove('active');
        } else {
            activeTags.add(tag);
            buttonElement.classList.add('active');
        }
        filterAndSearchPosts();
    }

    function filterAndSearchPosts() {
        let postsToDisplay = allPosts;

        // 1. Filter by active tags
        if (activeTags.size > 0) {
            postsToDisplay = postsToDisplay.filter(post => {
                return Array.from(activeTags).every(activeTag => 
                    post.tags.map(t => t.toLowerCase()).includes(activeTag)
                );
            });
        }

        // 2. Search by title (from the already tag-filtered results)
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            postsToDisplay = postsToDisplay.filter(post => 
                post.title.toLowerCase().includes(searchTerm)
            );
        }
        
        renderPosts(postsToDisplay);
    }

    // Event listener for search input
    searchInput.addEventListener('input', () => {
        console.log('Search input event fired.');
        filterAndSearchPosts();
    });

    // Initial load
    generateTags();
    filterAndSearchPosts(); // Call this to render all posts initially

    // Set active class for current navigation link
    const navLinks = document.querySelectorAll('header nav a');
    const currentPath = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (currentPath === linkPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
});