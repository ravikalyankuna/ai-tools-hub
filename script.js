function renderTools(list) {
    const el = document.getElementById('tools');
    if (!el) return;

    el.innerHTML = '';

    list.forEach(t => {
        el.innerHTML += `
        <div class="col-md-4">
            <div class="card p-3 m-2 shadow">

                <!-- Checkbox for compare -->
                <input type="checkbox" class="compare-checkbox mb-2" value="${t.name}">

                <img src="${t.image}"
                     style="height:60px;width:60px;object-fit:contain"
                     onerror="this.onerror=null;this.src='https://via.placeholder.com/60';">

                <h5>${t.name}</h5>
                <p>${t.description}</p>

                <span class="tag">${t.category}</span>
                <p>⭐ ${t.rating}</p>

                <a href="tool.html?name=${t.name}" class="btn btn-dark btn-sm">Details</a>
                <a href="${t.link}" target="_blank" class="btn btn-primary btn-sm mt-2">Visit</a>

            </div>
        </div>`;
    });
}

function init() {
    const catSet = [...new Set(tools.map(t => t.category))];
    const sel = document.getElementById('categoryFilter');

    if (sel) {
        catSet.forEach(c => {
            sel.innerHTML += `<option value="${c}">${c}</option>`;
        });

        sel.onchange = () => {
            renderTools(sel.value ? tools.filter(t => t.category == sel.value) : tools);
        };
    }

    const s = document.getElementById('search');
    if (s) {
        s.oninput = (e) => {
            renderTools(
                tools.filter(t =>
                    t.name.toLowerCase().includes(e.target.value.toLowerCase())
                )
            );
        };
    }

    renderTools(tools);
}

function toolDetail() {
    const url = new URL(window.location.href);
    const name = url.searchParams.get("name");

    const t = tools.find(x => x.name === name);

    const el = document.getElementById('toolDetail');
    if (!el) return;

    if (!t) {
        el.innerHTML = "<p>Tool not found</p>";
        return;
    }

    el.innerHTML = `
    <div class="card p-4 shadow">

        <img src="${t.image}" 
             style="height:80px;width:80px;object-fit:contain"
             onerror="this.onerror=null;this.src='https://via.placeholder.com/80';">

        <h2 class="mt-3">${t.name}</h2>

        <span class="badge bg-secondary mb-2">${t.category}</span>

        <p><strong>Description:</strong><br>${t.description}</p>

        <p><strong>Rating:</strong> ⭐ ${t.rating}</p>

        <h5 class="mt-3">🧠 Use Cases:</h5>
        <ul>
            ${(t.useCases || []).map(u => `<li>${u}</li>`).join('')}
        </ul>

        <h5 class="mt-3">🚀 Features:</h5>
        <ul>
            ${(t.features || []).map(f => `<li>${f}</li>`).join('')}
        </ul>

        <h5 class="mt-3">📘 How to Use:</h5>
        <ol>
            ${(t.howToUse || []).map(step => `<li>${step}</li>`).join('')}
        </ol>

        <a href="${t.link}" target="_blank" class="btn btn-primary mt-3">
            Visit Tool
        </a>
    </div>
    `;
}

function compareSelected() {
    const selectedNames = Array.from(document.querySelectorAll('.compare-checkbox:checked'))
        .map(cb => cb.value);

    if (selectedNames.length < 2) {
        alert("Select at least 2 tools to compare");
        return;
    }

    // Get full tool objects
    const selectedTools = tools.filter(t => selectedNames.includes(t.name));

    // 🔥 ADD THIS BLOCK HERE (SAME CATEGORY CHECK)
    const categories = selectedTools.map(t => t.category);
    const uniqueCategories = [...new Set(categories)];

    if (uniqueCategories.length > 1) {
        alert("Please select tools from the SAME category");
        return;
    }

    // Save to localStorage
    localStorage.setItem("compareTools", JSON.stringify(selectedNames));

    // Redirect
    window.location.href = "compare.html";
}

function compare() {
    const selectedNames = JSON.parse(localStorage.getItem("compareTools")) || [];
    const selectedTools = tools.filter(t => selectedNames.includes(t.name));

    const el = document.getElementById('compareTable');
    if (!el) return;

    if (selectedTools.length === 0) {
        el.innerHTML = "<tr><td>No tools selected</td></tr>";
        return;
    }

    el.innerHTML = `
    <tr>
        <th>Feature</th>
        ${selectedTools.map(t => `<th>${t.name}</th>`).join('')}
    </tr>

    <tr>
        <td>Category</td>
        ${selectedTools.map(t => `<td>${t.category}</td>`).join('')}
    </tr>

    <tr>
        <td>Rating</td>
        ${selectedTools.map(t => `<td>⭐ ${t.rating}</td>`).join('')}
    </tr>

    <tr>
        <td>Use Cases</td>
        ${selectedTools.map(t => `
            <td>
                <ul>
                    ${(t.useCases || []).map(u => `<li>${u}</li>`).join('')}
                </ul>
            </td>
        `).join('')}
    </tr>

    <tr>
        <td>Features</td>
        ${selectedTools.map(t => `
            <td>
                <ul>
                    ${(t.features || []).map(f => `<li>${f}</li>`).join('')}
                </ul>
            </td>
        `).join('')}
    </tr>

    <tr>
        <td>Visit</td>
        ${selectedTools.map(t => `
            <td>
                <a href="${t.link}" target="_blank" class="btn btn-sm btn-primary">Open</a>
            </td>
        `).join('')}
    </tr>
    `;
}

/* INIT ALL */
init();
toolDetail();
compare();