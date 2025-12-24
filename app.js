// Configuration
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/promptslab/Awesome-Prompt-Engineering/main/README.md';
const CACHE_KEY = 'awesome_prompt_cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    setupSmoothScroll();
});

// Setup smooth scrolling for navigation
function setupSmoothScroll() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = 100; // Account for navbar
                const targetPosition = targetElement.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active state on scroll
    window.addEventListener('scroll', updateActiveLink);
}

// Update active link based on scroll position
function updateActiveLink() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.category-section');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentSection = section.getAttribute('id');
        }
    });
    
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Load content from GitHub or cache
async function loadContent() {
    try {
        // Check cache first
        const cached = getCache();
        if (cached) {
            displayContent(cached);
            return;
        }

        let markdown = '';
        
        // Try local file first (for development)
        try {
            const localResponse = await fetch('data.md');
            if (localResponse.ok) {
                markdown = await localResponse.text();
            }
        } catch (e) {
            console.log('Local file not found, fetching from GitHub...');
        }
        
        // Fallback to GitHub
        if (!markdown) {
            const response = await fetch(GITHUB_RAW_URL);
            if (!response.ok) throw new Error('Failed to fetch README');
            markdown = await response.text();
        }
        
        const parsedContent = parseMarkdown(markdown);
        
        // Cache the results
        setCache(parsedContent);
        
        displayContent(parsedContent);
    } catch (error) {
        console.error('Error loading content:', error);
        showError();
    }
}

// Parse markdown content - comprehensive parser
function parseMarkdown(markdown) {
    const sections = {};
    const lines = markdown.split('\n');
    let currentSection = null;
    let currentSubsection = null;
    let currentContent = [];
    let inTable = false;
    let tableHeaders = [];
    let tableRows = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Skip header/badges area and emoji-only lines
        if (i < 50 && (trimmed.startsWith('<') || trimmed.startsWith('```') || !trimmed)) {
            continue;
        }
        
        // Skip emoji-only lines (emoji can be 1-4 bytes)
        if (trimmed.length <= 4 && /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u.test(trimmed)) {
            continue;
        }
        
        // Main section headers (## Papers, ## Tools, etc.)
        if (trimmed.startsWith('## ') && 
            !trimmed.includes('Table of Contents') && 
            !trimmed.includes('How to Contribute')) {
            // Save previous section
            if (currentSection) {
                saveSectionContent(sections, currentSection, currentSubsection, currentContent, inTable, tableHeaders, tableRows);
            }
            
            // Remove ## and clean up emoji and extra whitespace
            currentSection = trimmed
                .replace('## ', '')
                .replace(/[📄🛠️🔌📊🤖🔍👩‍🏫📚🎥🤝💬🔧💻💾🧠]/g, '')
                .trim();
            
            currentSubsection = null;
            currentContent = [];
            inTable = false;
            tableHeaders = [];
            tableRows = [];
            sections[currentSection] = { type: 'section', subsections: {}, content: [] };
            continue;
        }
        
        // Subsection headers (- **Something**:)
        if (currentSection && trimmed.match(/^-\s*\*\*(.+?)\*\*:?\s*$/)) {
            // Save previous subsection
            if (currentSubsection) {
                saveSectionContent(sections, currentSection, currentSubsection, currentContent, inTable, tableHeaders, tableRows);
            }
            
            const match = trimmed.match(/^-\s*\*\*(.+?)\*\*:?\s*$/);
            currentSubsection = match[1];
            currentContent = [];
            inTable = false;
            tableHeaders = [];
            tableRows = [];
            continue;
        }
        
        // Table detection
        if (currentSection && trimmed.startsWith('|')) {
            if (!inTable) {
                inTable = true;
                tableHeaders = trimmed.split('|').map(h => h.trim()).filter(h => h);
            } else if (trimmed.includes('---')) {
                // Separator line, skip
                continue;
            } else {
                // Table row
                const cells = trimmed.split('|').map(c => c.trim()).filter(c => c);
                tableRows.push(cells);
            }
            continue;
        } else if (inTable && !trimmed.startsWith('|')) {
            // End of table - save it immediately
            if (tableHeaders.length > 0 && tableRows.length > 0) {
                if (!currentSubsection) {
                    sections[currentSection].table = { headers: tableHeaders, rows: tableRows };
                    console.log('Saved table for section:', currentSection, 'with', tableRows.length, 'rows');
                }
            }
            inTable = false;
            tableHeaders = [];
            tableRows = [];
        }
        
        // Regular content (links, text, etc.)
        if (currentSection && trimmed && !trimmed.startsWith('#')) {
            currentContent.push(trimmed);
        }
    }
    
    // Save last section
    if (currentSection) {
        saveSectionContent(sections, currentSection, currentSubsection, currentContent, inTable, tableHeaders, tableRows);
    }
    
    return sections;
}

// Helper to save section content
function saveSectionContent(sections, section, subsection, content, inTable, tableHeaders, tableRows) {
    // Save table at section level if no subsection
    if (!subsection && inTable && tableHeaders.length > 0) {
        sections[section].table = { headers: tableHeaders, rows: tableRows };
        console.log('Saved table for section:', section, 'with', tableRows.length, 'rows');
    }
    
    // Save to appropriate target
    const target = subsection 
        ? (sections[section].subsections[subsection] = sections[section].subsections[subsection] || { content: [], table: null })
        : sections[section];
    
    // Save subsection table
    if (subsection && inTable && tableHeaders.length > 0) {
        target.table = { headers: tableHeaders, rows: tableRows };
    }
    
    // Save content
    if (content.length > 0) {
        if (!target.content) target.content = [];
        target.content = target.content.concat(content);
    }
}

// Display all content
function displayContent(sections) {
    const container = document.getElementById('contentContainer');
    if (!container) return;
    
    console.log('Sections found:', Object.keys(sections)); // Debug
    
    let html = '';
    
    // Define section order and icons  
    const sectionConfig = {
        'Papers': { id: 'papers', icon: '📄' },
        'Tools & Code': { id: 'tools', icon: '🛠️' },
        'Apis': { id: 'apis', icon: '🔌' },
        'Datasets': { id: 'datasets', icon: '📊' },
        'Models': { id: 'models', icon: '🤖' },
        'AI Content Detectors': { id: 'detectors', icon: '🔍' },
        'Educational': { id: 'educational', icon: '📚' },
        'Courses': { id: 'courses', icon: '👩‍🏫' },
        'Tutorials': { id: 'tutorials', icon: '📚' },
        'Videos': { id: 'videos', icon: '🎥' },
        'Books': { id: 'books', icon: '📖' },
        'Communities': { id: 'communities', icon: '🤝' }
    };
    
    Object.entries(sections).forEach(([sectionName, sectionData]) => {
        console.log('Processing section:', sectionName); // Debug
        const config = sectionConfig[sectionName];
        if (!config) {
            console.log('Skipping section (not in config):', sectionName);
            return; // Skip sections not in our config
        }
        
        html += `
            <div class="category-section" id="${config.id}">
                <div class="category-header">
                    <span class="category-icon">${config.icon}</span>
                    <h2>${sectionName}</h2>
                </div>
        `;
        
        // Check if this section has a table
        if (sectionData.table) {
            html += renderTable(sectionData.table);
        }
        
        // Check if section has subsections
        if (Object.keys(sectionData.subsections).length > 0) {
            html += '<div class="resource-grid">';
            Object.entries(sectionData.subsections).forEach(([subName, subData]) => {
                html += `<h3 style="grid-column: 1/-1; color: var(--text-secondary); font-size: 1.25rem; margin: 1.5rem 0 1rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.75rem;">${subName}</h3>`;
                const subContent = renderContent(subData.content || []);
                if (subContent) {
                    html += subContent;
                } else {
                    console.log('No content for subsection:', subName);
                }
            });
            html += '</div>';
        } else if (sectionData.content && sectionData.content.length > 0) {
            // No subsections, render content directly only if there's content
            html += '<div class="resource-grid">';
            const mainContent = renderContent(sectionData.content || []);
            if (mainContent) {
                html += mainContent;
            } else {
                console.log('No content for section:', sectionName);
            }
            html += '</div>';
        }
        // If section only has a table and no content, that's fine - table already rendered above
        
        html += '</div>';
    });
    
    container.innerHTML = html;
}

// Render table
function renderTable(tableData) {
    let html = '<div class="table-container"><table class="content-table"><thead><tr>';
    
    tableData.headers.forEach(header => {
        html += `<th>${header}</th>`;
    });
    
    html += '</tr></thead><tbody>';
    
    tableData.rows.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            // Parse markdown formatting
            let parsedCell = cell
                // Remove bold markers
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                // Parse links with double brackets
                .replace(/\[\[(.+?)\]\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
                // Parse regular markdown links
                .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
            
            html += `<td>${parsedCell}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    return html;
}

// Render content items
function renderContent(items) {
    let html = '';
    
    if (!items || items.length === 0) {
        return html;
    }
    
    console.log('Rendering', items.length, 'items');
    
    items.forEach((item, index) => {
        const trimmed = item.trim();
        if (!trimmed) return;
        
        // Skip emoji-only items
        if (trimmed.length <= 4 && /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u.test(trimmed)) {
            return;
        }
        
        if (index < 3) {
            console.log('Sample item:', trimmed.substring(0, 100));
        }
        
        // Parse different types of content
        if (trimmed.startsWith('-')) {
            // Remove the leading dash and spaces
            const content = trimmed.replace(/^-\s*/, '');
            
            // Check if it's a link
            const linkMatch = content.match(/\[(.+?)\]\((.+?)\)(.*)$/);
            if (linkMatch) {
                const title = linkMatch[1];
                const url = linkMatch[2];
                let description = linkMatch[3] ? linkMatch[3].trim() : '';
                
                // Extract metadata
                let year = '';
                let source = '';
                const yearMatch = description.match(/\[(\d{4})\]/);
                const sourceMatch = description.match(/\(([^)]+)\)\s*$/);
                
                if (yearMatch) year = yearMatch[1];
                if (sourceMatch) source = sourceMatch[1];
                
                // Clean description
                description = description
                    .replace(/\[(\d{4})\]/g, '')
                    .replace(/\(([^)]+)\)\s*$/g, '')
                    .replace(/^[,\s-]+/, '')
                    .trim();
                
                html += createResourceCard({ title, url, description, year, source });
            } else {
                // Plain text item (no link)
                if (content) {
                    html += `<div class="resource-card"><p>${content}</p></div>`;
                }
            }
        } else {
            // Direct text (no dash), might be from courses/tutorials sections
            const linkMatch = trimmed.match(/\[(.+?)\]\((.+?)\)(.*)$/);
            if (linkMatch) {
                const title = linkMatch[1];
                const url = linkMatch[2];
                let description = linkMatch[3] ? linkMatch[3].trim() : '';
                
                // Clean description
                description = description
                    .replace(/^[,\s]+by\s+/, 'by ')
                    .trim();
                
                html += createResourceCard({ title, url, description });
            } else if (trimmed) {
                // Plain text
                html += `<div class="resource-card"><p>${trimmed}</p></div>`;
            }
        }
    });
    
    return html;
}

// Create resource card HTML
function createResourceCard(resource) {
    const metaInfo = [];
    if (resource.year) metaInfo.push(`📅 ${resource.year}`);
    if (resource.source) metaInfo.push(`📍 ${resource.source}`);
    
    return `
        <div class="resource-card">
            <h3><a href="${resource.url}" target="_blank" rel="noopener noreferrer">${resource.title}</a></h3>
            ${resource.description ? `<p>${resource.description}</p>` : ''}
            ${metaInfo.length > 0 ? `
                <div class="resource-meta">
                    ${metaInfo.join(' • ')}
                </div>
            ` : ''}
        </div>
    `;
}

// Show error state
function showError() {
    const container = document.getElementById('contentContainer');
    if (container) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Oops! Something went wrong</h3>
                <p>Unable to load resources. Please try again later.</p>
                <button onclick="location.reload()" style="
                    margin-top: 1rem;
                    padding: 0.75rem 1.5rem;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1rem;
                ">Retry</button>
            </div>
        `;
    }
}

// Cache management
function getCache() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;
        
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        
        if (now - timestamp > CACHE_DURATION) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('Cache error:', error);
        return null;
    }
}

function setCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('Cache error:', error);
    }
}
