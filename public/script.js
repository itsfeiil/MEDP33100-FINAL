document.addEventListener('DOMContentLoaded', () => {
    // Navigation buttons
    const addTimeBtn = document.getElementById('add-time-btn');
    const backBtn = document.getElementById('back-btn');
    
    // Setup navigation if buttons exist
    if (addTimeBtn) {
        addTimeBtn.addEventListener('click', () => {
            window.location.href = 'form.html';
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    const lostTimeForm = document.getElementById('lostTimeForm');
    const entriesContainer = document.getElementById('entries-container');
    let emotionButtons, hiddenEmotionInput, submitButton, editingEntryId;
    
    // Only setup form if it exists on the page
    if (lostTimeForm) {
        emotionButtons = document.querySelectorAll('.emoji-btn');
        hiddenEmotionInput = document.getElementById('emotion');
        submitButton = lostTimeForm.querySelector('button[type="submit"]');
        editingEntryId = null; // To store the ID of the entry being edited

        // Handle emotion button selection
        emotionButtons.forEach(button => {
            button.addEventListener('click', () => {
                emotionButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                hiddenEmotionInput.value = button.getAttribute('data-emoji');
            });
        });

        lostTimeForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(lostTimeForm);
            const data = {
                description: formData.get('description'),
                duration: formData.get('duration'),
                emotion: hiddenEmotionInput.value, 
                wouldDoAgain: formData.get('wouldDoAgain'),
                tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            if (!data.emotion) {
                alert('Please select an emotion.');
                return;
            }

            console.log('Submitting:', data);

            try {
                let response;
                if (editingEntryId) {
                    // Update existing entry
                    response = await fetch(`/api/entries/${editingEntryId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
                } else {
                    // Create new entry
                    response = await fetch('/api/entries', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
                }

                if (response.ok) {
                    const result = await response.json();
                    // Navigate back to index after successful submission
                    window.location.href = 'index.html';
                } else {
                    const errorData = await response.json();
                    alert(`Failed to ${editingEntryId ? 'update' : 'submit'} entry: ` + (errorData.message || response.statusText));
                }
            } catch (error) {
                console.error(`Error ${editingEntryId ? 'updating' : 'submitting'} entry:`, error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    function resetForm() {
        if (!lostTimeForm) return;
        
        lostTimeForm.reset();
        emotionButtons.forEach(btn => btn.classList.remove('selected'));
        hiddenEmotionInput.value = '';
        editingEntryId = null;
        submitButton.textContent = 'Add to the Archive';
        document.getElementById('description').focus();
    }

    function createEntryElement(entry) {
        const entryElement = document.createElement('div');
        entryElement.classList.add('entry', 'time-droplet');
        entryElement.setAttribute('data-id', entry._id);
        entryElement.setAttribute('data-emotion', entry.emotion);
        entryElement.setAttribute('data-duration', entry.duration);
        if (entry.tags && entry.tags.length) {
            entryElement.setAttribute('data-tags', entry.tags.join(','));
        }

        // Create content container
        const dropletContent = document.createElement('div');
        dropletContent.className = 'droplet-content';
        entryElement.appendChild(dropletContent);
        
        // Create title
        const title = document.createElement('h3');
        title.textContent = entry.description;
        dropletContent.appendChild(title);
        
        // Create details area
        const details = document.createElement('div');
        details.className = 'entry-details';
        dropletContent.appendChild(details);
        
        // Add duration
        const duration = document.createElement('p');
        duration.className = 'duration';
        duration.innerHTML = '<strong>Duration: </strong>' + entry.duration;
        details.appendChild(duration);
        
        // Add emotion
        const emotion = document.createElement('p');
        emotion.className = 'emotion';
        emotion.innerHTML = '<strong>Feeling: </strong>' + entry.emotion;
        details.appendChild(emotion);
        
        // Add would do again
        const again = document.createElement('p');
        again.innerHTML = '<strong>Would do again: </strong>' + entry.wouldDoAgain;
        details.appendChild(again);
        
        // Add tags
        if (entry.tags && entry.tags.length) {
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'tags';
            tagsDiv.innerHTML = '<strong>Tags: </strong>';
            
            entry.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag';
                tagSpan.textContent = tag;
                tagsDiv.appendChild(tagSpan);
            });
            
            details.appendChild(tagsDiv);
        }
        
        // Add timestamp
        const timestamp = document.createElement('p');
        timestamp.className = 'timestamp';
        timestamp.textContent = new Date(entry.createdAt).toLocaleString();
        details.appendChild(timestamp);
        
        // Create action buttons area
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'entry-actions';
        dropletContent.appendChild(actionsDiv);
        
        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.setAttribute('data-id', entry._id);
        editBtn.setAttribute('style', 'z-index: 9999 !important; position: relative; visibility: visible !important;');
        actionsDiv.appendChild(editBtn);
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('data-id', entry._id);
        deleteBtn.setAttribute('style', 'z-index: 9999 !important; position: relative; visibility: visible !important;');
        actionsDiv.appendChild(deleteBtn);
        
        console.log('Created entry:', entry._id, 'Edit button:', editBtn, 'Delete button:', deleteBtn);
        
        // Add edit button event
        editBtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('Edit button clicked for entry:', entry._id);
            // Redirect to form page with entry ID
            window.location.href = `form.html?id=${entry._id}`;
        });
        
        // Add delete button event
        deleteBtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('Delete button clicked for entry:', entry._id);
            handleDelete(entry._id);
        });
        
        return entryElement;
    }

    function addEntryToDOM(entry) {
        if (!entriesContainer) return;
        const entryElement = createEntryElement(entry);
        entriesContainer.prepend(entryElement);
    }

    async function handleDelete(entryId) {
        if (confirm('Are you sure you want to delete this entry?')) {
            try {
                const response = await fetch(`/api/entries/${entryId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    // Reload all entries to refresh the view
                    fetchEntries();
                } else {
                    const errorData = await response.json();
                    alert('Failed to delete entry: ' + (errorData.message || response.statusText));
                }
            } catch (error) {
                console.error('Error deleting entry:', error);
                alert('An error occurred while deleting. Please try again.');
            }
        }
    }

    async function fetchEntries() {
        if (!entriesContainer) return;
        
        try {
            const response = await fetch('/api/entries');
            if (response.ok) {
                const entries = await response.json();
                entriesContainer.innerHTML = '';
                console.log('Retrieved entries count:', entries.length); // Debug info
                
                entries.forEach(entry => {
                    addEntryToDOM(entry);
                });
                
                if (entries.length === 0) {
                    entriesContainer.innerHTML = '<p class="no-entries">No lost time has been archived yet. Be the first to contribute!</p>';
                    console.log('No entries found'); // Debug info
                } else {
                    // Debug: Check button rendering
                    setTimeout(() => {
                        console.log('Edit buttons in DOM:', document.querySelectorAll('.edit-btn').length);
                        console.log('Delete buttons in DOM:', document.querySelectorAll('.delete-btn').length);
                    }, 500);
                }
                
                // Add event listeners
                setupFilters();
            } else {
                console.error('Failed to fetch entries');
                entriesContainer.innerHTML = '<p class="error">Failed to load the archive. Please try again later.</p>';
            }
        } catch (error) {
            console.error('Error fetching entries:', error);
            entriesContainer.innerHTML = '<p class="error">Error connecting to the archive. Please check your connection.</p>';
        }
    }

    function setupFilters() {
        const filtersContainer = document.getElementById('filters');
        if (!filtersContainer) return;
        
        filtersContainer.innerHTML = `
            <div class="filter-group">
                <label>Filter by emotion:</label>
                <div class="emotion-filters">
                    <button class="filter-btn emotion-filter" data-emotion="😡">😡</button>
                    <button class="filter-btn emotion-filter" data-emotion="😅">😅</button>
                    <button class="filter-btn emotion-filter" data-emotion="😢">😢</button>
                    <button class="filter-btn emotion-filter" data-emotion="😴">😴</button>
                    <button class="filter-btn emotion-filter" data-emotion="🤷">🤷</button>
                    <button class="filter-btn emotion-filter active" data-emotion="all">All</button>
                </div>
            </div>
            <div class="filter-group">
                <label>Sort by:</label>
                <select id="sort-by">
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="shortest">Shortest time</option>
                    <option value="longest">Longest time</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Search by tag:</label>
                <input type="text" id="tag-search" placeholder="Type a tag...">
            </div>
        `;
        
        const emotionFilters = document.querySelectorAll('.emotion-filter');
        emotionFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                emotionFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                const emotion = filter.getAttribute('data-emotion');
                const entries = document.querySelectorAll('.entry');
                
                entries.forEach(entry => {
                    if (emotion === 'all' || entry.getAttribute('data-emotion') === emotion) {
                        entry.style.display = 'block';
                    } else {
                        entry.style.display = 'none';
                    }
                });
            });
        });
        
        const sortSelect = document.getElementById('sort-by');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                const entries = Array.from(document.querySelectorAll('.entry'));
                const sortValue = sortSelect.value;
                
                entries.sort((a, b) => {
                    if (sortValue === 'newest' || sortValue === 'oldest') {
                        const aTime = new Date(a.querySelector('.timestamp')?.textContent || Date.now());
                        const bTime = new Date(b.querySelector('.timestamp')?.textContent || Date.now());
                        return sortValue === 'newest' ? bTime - aTime : aTime - bTime;
                    } else if (sortValue === 'shortest' || sortValue === 'longest') {
                        const aDuration = a.getAttribute('data-duration') || '';
                        const bDuration = b.getAttribute('data-duration') || '';
                        // Simplified sorting logic
                        return sortValue === 'shortest' ? 
                            aDuration.localeCompare(bDuration) : 
                            bDuration.localeCompare(aDuration);
                    }
                    return 0;
                });
                
                // Remove all entries and re-add in the sorted order
                entries.forEach(entry => entriesContainer.appendChild(entry));
            });
        }
        
        const tagSearch = document.getElementById('tag-search');
        if (tagSearch) {
            tagSearch.addEventListener('input', () => {
                const searchTerm = tagSearch.value.trim().toLowerCase();
                const entries = document.querySelectorAll('.entry');
                
                entries.forEach(entry => {
                    const tags = entry.getAttribute('data-tags');
                    if (!searchTerm || !tags) {
                        entry.style.display = searchTerm && !tags ? 'none' : 'block';
                    } else {
                        const entryTags = tags.toLowerCase().split(',');
                        const show = entryTags.some(tag => tag.includes(searchTerm));
                        entry.style.display = show ? 'block' : 'none';
                    }
                });
            });
        }
    }

    // Check URL for edit mode
    async function checkForEditMode() {
        if (!lostTimeForm) return;
        
        const urlParams = new URLSearchParams(window.location.search);
        const entryId = urlParams.get('id');
        
        if (entryId) {
            try {
                const response = await fetch(`/api/entries/${entryId}`);
                if (response.ok) {
                    const entry = await response.json();
                    editingEntryId = entry._id;
                    
                    // Fill the form
                    document.getElementById('description').value = entry.description;
                    document.getElementById('duration').value = entry.duration;
                    document.getElementById('tags').value = entry.tags ? entry.tags.join(', ') : '';
                    
                    // Set emotion
                    emotionButtons.forEach(btn => {
                        if (btn.getAttribute('data-emoji') === entry.emotion) {
                            btn.click();
                        }
                    });
                    
                    // Set "would do again"
                    const wouldDoAgainRadios = document.getElementsByName('wouldDoAgain');
                    wouldDoAgainRadios.forEach(radio => {
                        if (radio.value === entry.wouldDoAgain) {
                            radio.checked = true;
                        }
                    });
                    
                    submitButton.textContent = 'Update Entry';
                } else {
                    console.error('Failed to fetch entry for editing');
                    alert('Could not load the entry for editing. Redirecting to home page.');
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Error fetching entry for editing:', error);
                alert('An error occurred while loading the entry. Redirecting to home page.');
                window.location.href = 'index.html';
            }
        }
    }

    // Initialize based on current page
    if (lostTimeForm) {
        // We're on the form page
        checkForEditMode();
    } else if (entriesContainer) {
        // We're on the main page
        fetchEntries();
    }
}); 