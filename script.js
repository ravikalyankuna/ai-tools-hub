let activeSearch = "";
let activeCategory = "";
let currentPage = 1;
const pageSize = 30;

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function encodeToolName(name) {
    return encodeURIComponent(name);
}

function getGuideUrl(tool) {
    return tool?.guideurl || "best-ai-tools-for-students.html";
}

function getToolByName(name) {
    return tools.find((tool) => tool.name === name);
}

function getHostname(value) {
    try {
        return new URL(value).hostname.replace(/^www\./, "");
    } catch {
        return "";
    }
}

function getToolImage(tool) {
    const host = getHostname(tool.link);
    if (tool.image) return tool.image;
    if (host) return `https://img.logo.dev/${host}`;
    return "https://via.placeholder.com/96?text=AI";
}

function getImageFallback(tool) {
    const host = getHostname(tool.link);
    if (host) {
        return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
    }
    return "https://via.placeholder.com/96?text=AI";
}

function createActionButtons(tool, options = {}) {
    const { includeGuide = true, detailLabel = "Details", visitLabel = "Visit Tool" } = options;
    const guideButton = includeGuide
        ? `<a href="${escapeHtml(getGuideUrl(tool))}" class="btn btn-ghost rounded-pill tool-link-guide">Guide</a>`
        : "";

    return `
        <div class="tool-actions">
            <a href="tool.html?name=${encodeToolName(tool.name)}" class="btn btn-ghost rounded-pill">${detailLabel}</a>
            <a href="${escapeHtml(tool.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-accent rounded-pill">${visitLabel}</a>
            ${guideButton}
        </div>
    `;
}

function getFilteredTools() {
    return tools.filter((tool) => {
        const haystack = `${tool.name} ${tool.description} ${tool.category}`.toLowerCase();
        const matchesSearch = !activeSearch || haystack.includes(activeSearch.toLowerCase());
        const matchesCategory = !activeCategory || tool.category === activeCategory;
        return matchesSearch && matchesCategory;
    });
}

function clampCurrentPage(totalItems) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);
    return totalPages;
}

function updateResultsSummary(totalCount, pageCount, totalPages) {
    const summary = document.getElementById("resultsSummary");
    if (!summary) return;

    const categoryText = activeCategory ? ` in ${activeCategory}` : "";
    summary.textContent = `Showing ${pageCount} of ${totalCount} tools${categoryText} | Page ${currentPage} of ${totalPages}`;
}

function applyCardInteractivity(root = document) {
    const cards = root.querySelectorAll("[data-tool-name]");
    cards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            if (window.innerWidth < 768) return;
            const rect = card.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
            const rotateY = ((offsetX / rect.width) - 0.5) * 10;
            const rotateX = ((offsetY / rect.height) - 0.5) * -10;
            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

function renderPagination(totalItems) {
    const el = document.getElementById("pagination");
    if (!el) return;

    const totalPages = clampCurrentPage(totalItems);
    if (totalPages <= 1) {
        el.innerHTML = "";
        return;
    }

    const pages = [];
    for (let page = 1; page <= totalPages; page += 1) {
        if (totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
            pages.push(page);
        }
    }

    const compactPages = [];
    let previous = 0;
    pages.forEach((page) => {
        if (previous && page - previous > 1) compactPages.push("ellipsis");
        compactPages.push(page);
        previous = page;
    });

    el.innerHTML = `
        <button class="pagination-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>Prev</button>
        ${compactPages.map((page) => {
            if (page === "ellipsis") {
                return `<button class="pagination-btn" disabled>...</button>`;
            }
            return `<button class="pagination-btn ${page === currentPage ? "is-active" : ""}" data-page="${page}">${page}</button>`;
        }).join("")}
        <button class="pagination-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>Next</button>
    `;

    el.querySelectorAll("[data-page]").forEach((button) => {
        button.addEventListener("click", () => {
            currentPage = Number(button.dataset.page);
            syncFilters(false);
            const explorer = document.getElementById("toolExplorer");
            if (explorer) explorer.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

function renderTools(list) {
    const el = document.getElementById("tools");
    if (!el) return;

    const totalPages = clampCurrentPage(list.length);
    const startIndex = (currentPage - 1) * pageSize;
    const pagedList = list.slice(startIndex, startIndex + pageSize);

    updateResultsSummary(list.length, pagedList.length, totalPages);
    const counter = document.getElementById("toolCount");
    if (counter) {
        counter.textContent = `${tools.length}+`;
    }

    if (!pagedList.length) {
        el.innerHTML = `<div class="col-12"><div class="empty-state">No tools matched your search. Try another keyword or reset the filters.</div></div>`;
        renderPagination(0);
        return;
    }

    el.innerHTML = pagedList.map((tool) => `
        <div class="col-md-6 col-xl-4">
            <article class="tool-card d-flex flex-column" data-tool-name="${escapeHtml(tool.name)}">
                <div class="tool-card-top">
                    <label class="compare-toggle">
                        <input type="checkbox" class="compare-checkbox" value="${escapeHtml(tool.name)}">
                        Compare
                    </label>
                    <img
                        class="tool-logo"
                        src="${escapeHtml(getToolImage(tool))}"
                        data-fallback="${escapeHtml(getImageFallback(tool))}"
                        alt="${escapeHtml(tool.name)} logo"
                        onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){this.src=this.dataset.fallback;}else{this.onerror=null;this.src='https://via.placeholder.com/68?text=AI';}">
                </div>

                <div class="tool-meta">
                    <span class="tool-tag">${escapeHtml(tool.category)}</span>
                    <span class="rating-pill">${escapeHtml(tool.rating)}/5</span>
                </div>

                <h3 class="tool-card-title">${escapeHtml(tool.name)}</h3>
                <p class="tool-card-copy">${escapeHtml(tool.description)}</p>

                ${createActionButtons(tool)}
            </article>
        </div>
    `).join("");

    renderPagination(list.length);
    applyCardInteractivity(el);
}

function syncFilters(resetPage = true) {
    if (resetPage) currentPage = 1;
    renderTools(getFilteredTools());
}

function init() {
    const toolRoot = document.getElementById("tools");
    if (!toolRoot) return;

    const categories = [...new Set(tools.map((tool) => tool.category))].sort();
    const categorySelect = document.getElementById("categoryFilter");
    const searchInput = document.getElementById("search");
    const clearButton = document.getElementById("clearFilters");

    if (categorySelect) {
        categorySelect.innerHTML = `<option value="">All Categories</option>${categories.map((category) => `
            <option value="${escapeHtml(category)}">${escapeHtml(category)}</option>
        `).join("")}`;

        categorySelect.addEventListener("change", (event) => {
            activeCategory = event.target.value;
            syncFilters();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            activeSearch = event.target.value.trim();
            syncFilters();
        });
    }

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            activeSearch = "";
            activeCategory = "";
            if (searchInput) searchInput.value = "";
            if (categorySelect) categorySelect.value = "";
            syncFilters();
        });
    }

    syncFilters();
}

function toolDetail() {
    const el = document.getElementById("toolDetail");
    if (!el) return;

    const url = new URL(window.location.href);
    const name = url.searchParams.get("name");
    const tool = getToolByName(name);

    if (!tool) {
        el.innerHTML = `<div class="detail-card"><p>Tool not found.</p></div>`;
        return;
    }

    document.title = `${tool.name} | AI Tools Hub`;

    el.innerHTML = `
        <article class="detail-card" data-tool-name="${escapeHtml(tool.name)}">
            <div class="detail-top">
                <img
                    class="detail-logo"
                    src="${escapeHtml(getToolImage(tool))}"
                    data-fallback="${escapeHtml(getImageFallback(tool))}"
                    alt="${escapeHtml(tool.name)} logo"
                    onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){this.src=this.dataset.fallback;}else{this.onerror=null;this.src='https://via.placeholder.com/96?text=AI';}">
                <div>
                    <span class="tool-tag">${escapeHtml(tool.category)}</span>
                    <h2 class="mt-3">${escapeHtml(tool.name)}</h2>
                    <p>${escapeHtml(tool.description)}</p>
                    <div class="hero-actions">
                        <a href="${escapeHtml(tool.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-accent rounded-pill">Visit Tool</a>
                        <a href="${escapeHtml(getGuideUrl(tool))}" class="btn btn-ghost rounded-pill">Open Guide</a>
                    </div>
                </div>
            </div>

            <div class="detail-grid">
                <section class="detail-block">
                    <h3>Rating</h3>
                    <p class="mb-0">${escapeHtml(tool.rating)}/5</p>
                </section>
                <section class="detail-block">
                    <h3>Use Cases</h3>
                    <ul>${(tool.useCases || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
                </section>
                <section class="detail-block">
                    <h3>Features</h3>
                    <ul>${(tool.features || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
                </section>
            </div>

            <section class="detail-block mt-3">
                <h3>How to Use</h3>
                <ol>${(tool.howToUse || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
            </section>
        </article>
    `;

    applyCardInteractivity(el);
}

function compareSelected() {
    const selectedNames = Array.from(document.querySelectorAll(".compare-checkbox:checked"))
        .map((checkbox) => checkbox.value);

    if (selectedNames.length < 2) {
        alert("Select at least 2 tools to compare.");
        return;
    }

    const selectedTools = tools.filter((tool) => selectedNames.includes(tool.name));
    const uniqueCategories = [...new Set(selectedTools.map((tool) => tool.category))];

    if (uniqueCategories.length > 1) {
        alert("Please select tools from the same category.");
        return;
    }

    localStorage.setItem("compareTools", JSON.stringify(selectedNames));
    window.location.href = "compare.html";
}

function compare() {
    const el = document.getElementById("compareTable");
    if (!el) return;

    const selectedNames = JSON.parse(localStorage.getItem("compareTools")) || [];
    const selectedTools = tools.filter((tool) => selectedNames.includes(tool.name));

    if (!selectedTools.length) {
        el.innerHTML = `<tr><td>No tools selected yet. Go back to the explorer and add at least two tools.</td></tr>`;
        return;
    }

    el.innerHTML = `
        <tr>
            <th>Feature</th>
            ${selectedTools.map((tool) => `<th>${escapeHtml(tool.name)}</th>`).join("")}
        </tr>
        <tr>
            <td>Category</td>
            ${selectedTools.map((tool) => `<td>${escapeHtml(tool.category)}</td>`).join("")}
        </tr>
        <tr>
            <td>Rating</td>
            ${selectedTools.map((tool) => `<td>${escapeHtml(tool.rating)}/5</td>`).join("")}
        </tr>
        <tr>
            <td>Guide</td>
            ${selectedTools.map((tool) => `<td><a href="${escapeHtml(getGuideUrl(tool))}" class="btn btn-ghost btn-sm rounded-pill">Guide</a></td>`).join("")}
        </tr>
        <tr>
            <td>Use Cases</td>
            ${selectedTools.map((tool) => `<td><ul>${(tool.useCases || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></td>`).join("")}
        </tr>
        <tr>
            <td>Features</td>
            ${selectedTools.map((tool) => `<td><ul>${(tool.features || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></td>`).join("")}
        </tr>
        <tr>
            <td>Action</td>
            ${selectedTools.map((tool) => `
                <td>
                    <a href="${escapeHtml(tool.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm rounded-pill">Open Tool</a>
                </td>
            `).join("")}
        </tr>
    `;
}

function renderGuideCards(list) {
    return list.map((tool) => `
        <div class="col-md-6 col-xl-4">
            <article class="guide-card" data-tool-name="${escapeHtml(tool.name)}">
                <span class="guide-tag">${escapeHtml(tool.category)}</span>
                <h3 class="mt-3">${escapeHtml(tool.name)}</h3>
                <p>${escapeHtml(tool.description)}</p>
                ${createActionButtons(tool, { detailLabel: "Details", visitLabel: "Try Now" })}
            </article>
        </div>
    `).join("");
}

function studentGuide() {
    const el = document.getElementById("studentGuideTools");
    if (!el) return;

    const studentKeywords = ["student", "writing", "productivity", "education", "research", "study", "note", "presentation"];
    const curatedTools = tools
        .filter((tool) => {
            const haystack = `${tool.name} ${tool.description} ${tool.category}`.toLowerCase();
            return studentKeywords.some((keyword) => haystack.includes(keyword));
        })
        .slice(0, 9);

    const fallback = tools.slice(0, 9);
    const guideList = curatedTools.length ? curatedTools : fallback;

    el.innerHTML = renderGuideCards(guideList);
    applyCardInteractivity(el);
}

function renderFooter() {
    const footerRoot = document.getElementById("siteFooter");
    if (!footerRoot) return;

    const categories = [...new Set(tools.map((tool) => tool.category))];
    const compareCount = (JSON.parse(localStorage.getItem("compareTools")) || []).length;
    const topRated = tools.filter((tool) => Number(tool.rating) >= 4.8).length;

    footerRoot.innerHTML = `
        <footer class="site-footer">
            <div class="container">
                <div class="site-footer-card">
                    <div class="footer-grid">
                        <section>
                            <span class="eyebrow">AI Tools Hub</span>
                            <h3 class="mt-3">Built to help users discover faster, compare better, and launch with confidence.</h3>
                            <p>This directory is now guide-aware, data-driven, and interactive. Every tool can route users into a guided path instead of forcing them to guess.</p>
                            <div class="footer-meta">
                                <div class="footer-stat">
                                    <strong>${tools.length}</strong>
                                    <span>Live tools indexed</span>
                                </div>
                                <div class="footer-stat">
                                    <strong>${categories.length}</strong>
                                    <span>Active categories</span>
                                </div>
                                <div class="footer-stat">
                                    <strong>${topRated}</strong>
                                    <span>Rated 4.8+</span>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h4>Quick Paths</h4>
                            <ul class="footer-links">
                                <li><a href="index.html#toolExplorer">Explore the full directory</a></li>
                                <li><a href="best-ai-tools-for-students.html">Open the student-friendly guide</a></li>
                                <li><a href="compare.html">Review compare view</a></li>
                                <li><a href="about.html">About this site</a></li>
                                <li><a href="contact.html">Contact the publisher</a></li>
                                <li><a href="privacy-policy.html">Privacy Policy</a></li>
                                <li><a href="terms.html">Terms of Use</a></li>
                                <li>Saved compare shortlist: ${compareCount}</li>
                            </ul>
                        </section>
                        <section>
                            <h4>Why This Works</h4>
                            <ul class="footer-highlights">
                                <li>Interactive filters reduce search friction.</li>
                                <li>Guide links create a beginner-friendly decision path.</li>
                                <li>Pagination keeps large collections usable.</li>
                                <li>Structured tool data keeps expansion simple.</li>
                                <li>Visible trust pages improve transparency.</li>
                            </ul>
                        </section>
                    </div>
                    <p class="footer-note">Focused on practical discovery across writing, coding, video, marketing, research, productivity, support, design, and automation tools. Ratings are editorial summaries and external links point to official third-party websites.</p>
                </div>
            </div>
        </footer>
    `;
}

init();
toolDetail();
compare();
studentGuide();
renderFooter();
