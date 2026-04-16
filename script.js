let activeSearch = "";
let activeCategory = "";
let activePricing = "";
let currentPage = 1;
const pageSize = 30;
let premiumSearch = "";
let premiumCategory = "";
let premiumPage = 1;
const premiumPageSize = 24;

const chatbotQuickPrompts = [
    "Show free writing tools",
    "Best premium coding tools",
    "Guide me to research tools",
    "Compare design tools",
    "Student tools for note-taking"
];

const chatbotSuggestionSets = {
    default: [
        "Show free tools",
        "Best premium tools",
        "Guide me to marketing tools",
        "Compare coding tools"
    ],
    free: [
        "Show free research tools",
        "Best free writing tools",
        "Free tools for students"
    ],
    premium: [
        "Premium coding tools",
        "Best premium design tools",
        "Premium tools for teams"
    ],
    guide: [
        "Guide me to writing tools",
        "Guide me to automation tools",
        "Student-friendly guides"
    ],
    compare: [
        "Compare premium video tools",
        "Compare free coding tools",
        "Best tools to compare for students"
    ],
    tool: [
        "Show alternatives",
        "Open the guide",
        "Find similar tools"
    ],
    student: [
        "Student-friendly research tools",
        "Free productivity tools",
        "Best tools for assignments"
    ]
};

const chatbotState = {
    lastQuery: "",
    lastCategory: "",
    lastPricing: "",
    lastResults: []
};

const categoryGuides = {
    "General Purpose": {
        summary: "General-purpose assistants are useful when one tool needs to handle drafting, summarization, brainstorming, planning, and follow-up questions across many different tasks.",
        bestFor: "Generalists, founders, solo operators, and teams that want one flexible assistant before moving into specialized tools.",
        checklist: [
            "Test multi-step instructions, not just one-line prompts.",
            "Compare how much refinement the output needs across summaries, planning, and drafting.",
            "Check privacy, file handling, and collaboration if the tool will be used for work."
        ],
        mistakes: [
            "Using a general assistant when the real need is specialized research, design, or coding.",
            "Choosing based on one impressive demo instead of repeated everyday performance.",
            "Ignoring governance and data-handling expectations for team usage."
        ],
        faq: [
            "A general assistant is a strong starting point, but often not the strongest specialist in any one workflow.",
            "The best evaluation is to run your own recurring tasks through two or three assistants and compare cleanup effort."
        ]
    },
    "Writing": {
        summary: "Writing tools should save editing time, improve clarity, and help turn rough notes into usable drafts without flattening tone or accuracy.",
        bestFor: "Writers, marketers, students, consultants, and teams producing repeated written output under time pressure.",
        checklist: [
            "Test the tool on a real brief or document, not a generic prompt.",
            "Compare rewrite quality, tone control, and structural clarity.",
            "Check whether the tool is stronger at drafting, editing, or both."
        ],
        mistakes: [
            "Confusing longer output with better output.",
            "Skipping checks for factual accuracy and originality.",
            "Evaluating only on short-form copy when the real need is long-form writing."
        ],
        faq: [
            "A strong writing tool reduces revision time. If cleanup still takes too long, value is limited.",
            "Different writing tools are optimized for drafting, editing, conversion copy, or academic support, so testing should match the workflow."
        ]
    },
    "Coding": {
        summary: "Coding tools create value when they improve development speed inside real repositories, not just when they generate attractive demo snippets.",
        bestFor: "Developers, technical founders, engineering teams, and learners working inside active projects.",
        checklist: [
            "Test in a real codebase with existing files and context.",
            "Compare debugging help, explanation quality, and repo awareness.",
            "Check whether the tool reduces context switching and speeds up implementation."
        ],
        mistakes: [
            "Choosing based on autocomplete alone when the real need is code understanding or debugging.",
            "Trusting generated code without review and testing.",
            "Ignoring editor integration and actual day-to-day usability."
        ],
        faq: [
            "The best coding assistant usually fits the existing repository and editor better, not just the benchmark demo.",
            "The strongest tools improve navigation, explanation, and iteration as much as code generation."
        ]
    },
    "Design": {
        summary: "Design tools should expand creative throughput while preserving enough control over style, editing, and consistency for real publishing work.",
        bestFor: "Designers, marketers, ecommerce teams, and creators producing visual assets repeatedly.",
        checklist: [
            "Test prompt quality, editing control, export quality, and style consistency.",
            "Decide whether the tool is for ideation, production assets, or both.",
            "Compare whether the output reduces design time or creates more cleanup."
        ],
        mistakes: [
            "Treating every image or design tool as interchangeable.",
            "Ignoring commercial-use constraints and brand consistency.",
            "Choosing a style-heavy tool when predictable output matters more."
        ],
        faq: [
            "Some design tools are excellent for exploration but weak for repeatable production work.",
            "A useful design tool should fit the current asset workflow instead of adding avoidable cleanup."
        ]
    },
    "Video": {
        summary: "Video tools vary between editing, clip extraction, avatar generation, and full video generation, so category fit matters more than novelty.",
        bestFor: "Creators, course builders, marketing teams, agencies, and businesses publishing repeated video content.",
        checklist: [
            "Decide whether the need is editing, clipping, avatars, or generation before comparing products.",
            "Test export quality, caption handling, and end-to-end production speed.",
            "Compare whether the tool shortens the real workflow, not just one isolated step."
        ],
        mistakes: [
            "Comparing avatar tools and editing tools as if they solve the same problem.",
            "Ignoring human review time after generation.",
            "Choosing for novelty instead of repeatable production quality."
        ],
        faq: [
            "Video AI is most valuable when it removes a real production bottleneck such as editing, captioning, or script-to-video conversion.",
            "The best test is recreating a recent real project and measuring time saved."
        ]
    },
    "Audio": {
        summary: "Audio tools matter when they improve listenability, reduce editing friction, or speed up production for speech-heavy workflows.",
        bestFor: "Podcasters, educators, support teams, video creators, and businesses producing spoken content.",
        checklist: [
            "Test on the noisy or weak recordings you actually need to publish.",
            "Compare cleanup quality, realism, and export options.",
            "Check whether the tool eliminates manual post-production steps."
        ],
        mistakes: [
            "Evaluating voice quality only on ideal samples.",
            "Ignoring long-form workflow reliability.",
            "Using synthetic voice where authenticity matters more than speed."
        ],
        faq: [
            "Good audio tools either improve quality meaningfully or cut production time noticeably.",
            "Creators should focus on whether the tool saves work without making the final content sound artificial."
        ]
    },
    "Marketing": {
        summary: "Marketing tools should improve campaign throughput, variation quality, or testing speed, not just generate generic content at scale.",
        bestFor: "Growth teams, content marketers, sales teams, agencies, and founders running campaigns directly.",
        checklist: [
            "Test with real offers, channels, and audience segments.",
            "Compare copy quality, variation usefulness, and publishing readiness.",
            "Check whether the tool helps strategy, production, optimization, or a narrower layer."
        ],
        mistakes: [
            "Buying for output volume when the actual problem is weak messaging strategy.",
            "Comparing SEO tools and outbound tools as if they serve the same job.",
            "Ignoring how much editorial cleanup campaign output still needs."
        ],
        faq: [
            "The strongest marketing tools usually fit one layer of the workflow very well instead of trying to replace the whole stack.",
            "High-volume output is not useful if the quality is too generic to publish or send."
        ]
    },
    "Research": {
        summary: "Research tools create value when they reduce reading time, improve source discovery, and help users understand dense material more quickly.",
        bestFor: "Students, academics, consultants, analysts, and knowledge workers reviewing many documents or papers.",
        checklist: [
            "Test on your real PDFs, papers, or research questions.",
            "Compare source quality, summary usefulness, and follow-up exploration support.",
            "Check whether the tool is strongest at discovery, comprehension, or note creation."
        ],
        mistakes: [
            "Treating a research assistant as a replacement for source verification.",
            "Evaluating only on a short document or simple query.",
            "Ignoring traceability back to the source material."
        ],
        faq: [
            "The best research tool reduces time-to-understanding without weakening source confidence.",
            "Research tools work best when paired with a real note-taking and verification process."
        ]
    },
    "Productivity": {
        summary: "Productivity tools matter when they help organize work, preserve context, and reduce friction between planning and execution.",
        bestFor: "Knowledge workers, managers, operators, students, and teams juggling notes, tasks, and projects.",
        checklist: [
            "Check how well the tool connects notes, tasks, documents, and follow-up actions.",
            "Compare collaboration, templates, and long-term context handling.",
            "Test whether it reduces switching between tools or simply adds another workspace."
        ],
        mistakes: [
            "Choosing for appearance rather than workflow fit.",
            "Ignoring whether a team will actually adopt the system.",
            "Using AI summaries as a substitute for maintaining clean project structure."
        ],
        faq: [
            "A productivity tool creates value when it lowers coordination cost. If it adds more maintenance, it is not helping enough.",
            "The strongest test is whether the tool still feels useful after two weeks of real planning and follow-through."
        ]
    },
    "Automation": {
        summary: "Automation tools are valuable when they remove repetitive manual work reliably and can be maintained without constant repairs.",
        bestFor: "Operators, support teams, growth teams, solo business owners, and teams connecting apps or repeated processes.",
        checklist: [
            "Identify one repetitive workflow and test the tool against that before expanding.",
            "Compare reliability, monitoring, and ease of editing.",
            "Check how much human oversight the finished automation still needs."
        ],
        mistakes: [
            "Automating broad processes too early.",
            "Choosing a workflow builder that is hard to debug or monitor.",
            "Ignoring who will maintain the automation later."
        ],
        faq: [
            "Good automation is stable, visible, and easy to update.",
            "The strongest automation tools make both setup and maintenance manageable for the actual owner of the workflow."
        ]
    },
    "Customer Support": {
        summary: "Support tools should improve service quality, response speed, and routing efficiency without damaging trust or escalation quality.",
        bestFor: "Support leaders, CX teams, ecommerce brands, SaaS teams, and operations groups handling repeated inbound questions.",
        checklist: [
            "Test with real support intents, edge cases, and escalation scenarios.",
            "Compare answer quality, routing, knowledge integration, and handoff quality.",
            "Check whether the tool helps agents as well as customers."
        ],
        mistakes: [
            "Automating too much before the knowledge base and routing logic are ready.",
            "Optimizing only for ticket deflection while hurting customer trust.",
            "Ignoring the quality of human handoff."
        ],
        faq: [
            "Support AI is strongest when it improves both customer experience and operator efficiency.",
            "Fast but inaccurate support automation usually creates more cost later."
        ]
    },
    "Business / App Builder": {
        summary: "AI app builders are useful when they help teams move from idea to working page, prototype, or internal tool quickly enough to validate or ship faster.",
        bestFor: "Founders, agencies, product teams, operators, and non-developers building prototypes, websites, and internal tools.",
        checklist: [
            "Test how quickly the tool gets from prompt to editable output.",
            "Compare flexibility after generation, deployment options, and maintainability.",
            "Check whether the tool is stronger for prototypes, sites, or usable internal apps."
        ],
        mistakes: [
            "Expecting one-shot prompts to replace product decisions.",
            "Choosing for demo speed while ignoring maintainability.",
            "Skipping checks for integrations, structure, and handoff quality."
        ],
        faq: [
            "The best builder depends on whether the main need is a marketing site, internal tool, or product prototype.",
            "Strong builders accelerate early delivery, but teams still need review before shipping."
        ]
    }
};

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

function getPricingLabel(tool) {
    return tool?.pricingAccess || "";
}

function getToolByName(name) {
    return tools.find((tool) => tool.name === name);
}

function getToolByNameLoose(query) {
    const lower = query.toLowerCase();
    return tools.find((tool) => tool.name.toLowerCase() === lower)
        || tools.find((tool) => lower.includes(tool.name.toLowerCase()));
}

function getCategoryGuide(category) {
    return categoryGuides[category] || null;
}

function getCategoryLink(category) {
    return `category.html?category=${encodeURIComponent(category)}`;
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
        const matchesPricing = !activePricing || tool.pricingAccess === activePricing;
        return matchesSearch && matchesCategory && matchesPricing;
    });
}

function getTopToolsByCategory(category, count = 6) {
    return tools
        .filter((tool) => tool.category === category)
        .sort((a, b) => Number(b.rating) - Number(a.rating))
        .slice(0, count);
}

function getPremiumTools() {
    return tools.filter((tool) => tool.pricingAccess === "Premium");
}

function getFreeLikeTools() {
    return tools.filter((tool) => tool.pricingAccess === "Free" || tool.pricingAccess === "Freemium");
}

function getCategoryFromText(text) {
    const lower = text.toLowerCase();
    const categories = [...new Set(tools.map((tool) => tool.category))];
    return categories.find((category) => lower.includes(category.toLowerCase())) || "";
}

function toolLinkMarkup(tool) {
    return `<a href="tool.html?name=${encodeToolName(tool.name)}">${escapeHtml(tool.name)}</a>`;
}

function buildToolListMarkup(list) {
    return list.map((tool) => toolLinkMarkup(tool)).join(", ");
}

function normalizeChatText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^\w\s/+.-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function tokenizeChatQuery(value) {
    return normalizeChatText(value)
        .split(" ")
        .map((token) => token.trim())
        .filter((token) => token && token.length > 1);
}

function getToolSearchText(tool) {
    return normalizeChatText([
        tool.name,
        tool.category,
        tool.description,
        getPricingLabel(tool),
        ...(tool.useCases || []).slice(0, 12),
        ...(tool.features || []).slice(0, 12)
    ].join(" "));
}

function inferChatbotIntent(query) {
    const normalized = normalizeChatText(query);
    const tokens = tokenizeChatQuery(query);
    const category = getCategoryFromText(normalized);
    const matchedTool = getToolByNameLoose(normalized);
    const wantsGuide = /\bguide|learn|start|student|how to choose|where to start\b/.test(normalized);
    const wantsCompare = /\bcompare|comparison|versus|vs|difference|better than\b/.test(normalized);
    const wantsBest = /\bbest|top|recommend|shortlist|favorite\b/.test(normalized);
    const wantsFree = /\bfree|freemium|no cost|without paying|budget\b/.test(normalized);
    const wantsPremium = /\bpremium|paid|pro|enterprise|team plan|business plan\b/.test(normalized);
    const wantsStudent = /\bstudent|assignment|study|college|school|research paper|notes\b/.test(normalized);
    const wantsCategoryList = /\bcategory|categories\b/.test(normalized);
    const wantsAlternatives = /\balternative|alternatives|similar\b/.test(normalized);
    const wantsMore = /\bmore|more like this|next|show more\b/.test(normalized);

    return {
        normalized,
        tokens,
        category,
        matchedTool,
        wantsGuide,
        wantsCompare,
        wantsBest,
        wantsFree,
        wantsPremium,
        wantsStudent,
        wantsCategoryList,
        wantsAlternatives,
        wantsMore
    };
}

function scoreToolForChat(tool, intent) {
    const corpus = getToolSearchText(tool);
    const nameText = normalizeChatText(tool.name);
    const categoryText = normalizeChatText(tool.category);
    let score = 0;

    if (intent.category && tool.category === intent.category) score += 35;
    if (intent.wantsFree && (tool.pricingAccess === "Free" || tool.pricingAccess === "Freemium")) score += 30;
    if (intent.wantsPremium && tool.pricingAccess === "Premium") score += 30;
    if (intent.wantsStudent && ["Research", "Writing", "Productivity", "Coding", "General Purpose"].includes(tool.category)) score += 14;
    if (intent.wantsBest) score += Number(tool.rating || 0) * 6;
    if (intent.wantsCompare) score += Number(tool.rating || 0) * 3;

    if (intent.matchedTool && tool.name === intent.matchedTool.name) score += 150;

    intent.tokens.forEach((token) => {
        if (nameText === token) score += 35;
        if (nameText.includes(token)) score += 18;
        if (categoryText.includes(token)) score += 10;
        if (corpus.includes(token)) score += 6;
    });

    if (!intent.wantsPremium && tool.pricingAccess === "Premium" && intent.wantsFree) score -= 16;
    if (!intent.wantsFree && (tool.pricingAccess === "Free" || tool.pricingAccess === "Freemium") && intent.wantsPremium) score -= 16;

    return score;
}

function getChatbotRankedTools(intent, limit = 4) {
    let pool = tools.slice();

    if (intent.wantsAlternatives && intent.matchedTool) {
        pool = pool.filter((tool) => tool.name !== intent.matchedTool.name && tool.category === intent.matchedTool.category);
    }
    if (intent.category) {
        pool = pool.filter((tool) => tool.category === intent.category);
    }
    if (intent.wantsFree) {
        pool = pool.filter((tool) => tool.pricingAccess === "Free" || tool.pricingAccess === "Freemium");
    }
    if (intent.wantsPremium) {
        pool = pool.filter((tool) => tool.pricingAccess === "Premium");
    }

    return pool
        .map((tool) => ({ tool, score: scoreToolForChat(tool, intent) }))
        .filter((entry) => entry.score > 0 || intent.category || intent.wantsFree || intent.wantsPremium || intent.matchedTool)
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return Number(b.tool.rating || 0) - Number(a.tool.rating || 0);
        })
        .slice(0, limit);
}

function getChatPricingClass(tool) {
    if (tool.pricingAccess === "Premium") return "is-premium";
    if (tool.pricingAccess === "Free") return "is-free";
    if (tool.pricingAccess === "Freemium") return "is-freemium";
    return "";
}

function getChatReason(tool, intent) {
    if (intent.matchedTool && tool.name === intent.matchedTool.name) {
        return `Direct match in ${escapeHtml(tool.category)} with ${escapeHtml(tool.rating)}/5 rating.`;
    }
    if (intent.wantsAlternatives && intent.matchedTool) {
        return `Alternative to ${escapeHtml(intent.matchedTool.name)} in ${escapeHtml(tool.category)}.`;
    }
    if (intent.wantsGuide && intent.category) {
        return `Strong starting point for the ${escapeHtml(intent.category)} guide path.`;
    }
    if (intent.wantsStudent) {
        return `Useful for student workflows like note-making, research, writing, or assignment prep.`;
    }
    if (intent.wantsFree && (tool.pricingAccess === "Free" || tool.pricingAccess === "Freemium")) {
        return `${escapeHtml(tool.pricingAccess)} access with a practical starting path.`;
    }
    if (intent.wantsPremium && tool.pricingAccess === "Premium") {
        return `Premium option for teams or higher-output workflows.`;
    }
    return `Fits ${escapeHtml(tool.category)} workflows with ${escapeHtml(tool.rating)}/5 rating.`;
}

function buildChatToolCard(tool, intent) {
    const pricing = getPricingLabel(tool) || "Unlabeled";
    const guideLink = getCategoryLink(tool.category);
    const feature = (tool.features || [])[0] || tool.description;

    return `
        <article class="chatbot-tool-card">
            <div class="chatbot-tool-head">
                <div>
                    <h4>${escapeHtml(tool.name)}</h4>
                    <p>${escapeHtml(getChatReason(tool, intent))}</p>
                </div>
                <img
                    class="chatbot-tool-logo"
                    src="${escapeHtml(getToolImage(tool))}"
                    data-fallback="${escapeHtml(getImageFallback(tool))}"
                    alt="${escapeHtml(tool.name)} logo"
                    onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){this.src=this.dataset.fallback;}else{this.onerror=null;this.src='https://via.placeholder.com/48?text=AI';}">
            </div>
            <div class="chatbot-tool-meta">
                <span class="chatbot-mini-pill">${escapeHtml(tool.category)}</span>
                <span class="chatbot-mini-pill ${getChatPricingClass(tool)}">${escapeHtml(pricing)}</span>
                <span class="chatbot-mini-pill">Rating ${escapeHtml(tool.rating)}/5</span>
            </div>
            <p class="chatbot-tool-copy">${escapeHtml(tool.description)}</p>
            <p class="chatbot-tool-feature"><strong>Why it stands out:</strong> ${escapeHtml(feature)}</p>
            <div class="chatbot-tool-actions">
                <a href="tool.html?name=${encodeToolName(tool.name)}">Open tool</a>
                <a href="${escapeHtml(guideLink)}">Category guide</a>
                <a href="${escapeHtml(tool.link)}" target="_blank" rel="noopener noreferrer">Official site</a>
            </div>
        </article>
    `;
}

function buildChatbotSuggestions(intent) {
    if (intent.matchedTool || intent.wantsAlternatives) return chatbotSuggestionSets.tool;
    if (intent.wantsCompare) return chatbotSuggestionSets.compare;
    if (intent.wantsGuide) return chatbotSuggestionSets.guide;
    if (intent.wantsStudent) return chatbotSuggestionSets.student;
    if (intent.wantsFree) return chatbotSuggestionSets.free;
    if (intent.wantsPremium) return chatbotSuggestionSets.premium;
    return chatbotSuggestionSets.default;
}

function buildChatbotSuggestionMarkup(intent) {
    return `
        <div class="chatbot-suggestion-row">
            ${buildChatbotSuggestions(intent).map((item) => `
                <button type="button" class="chatbot-chip" data-chat-prompt="${escapeHtml(item)}">${escapeHtml(item)}</button>
            `).join("")}
        </div>
    `;
}

function buildChatCategorySummary(category) {
    const allInCategory = tools.filter((tool) => tool.category === category);
    const freeCount = allInCategory.filter((tool) => tool.pricingAccess === "Free" || tool.pricingAccess === "Freemium").length;
    const premiumCount = allInCategory.filter((tool) => tool.pricingAccess === "Premium").length;
    const guide = getCategoryGuide(category);
    return `
        <div class="chatbot-analysis">
            <span class="chatbot-section-label">Category Brief</span>
            <p><strong>${escapeHtml(category)}</strong> has ${allInCategory.length} tools in the directory. Free/Freemium: <strong>${freeCount}</strong>. Premium: <strong>${premiumCount}</strong>.</p>
            ${guide ? `<p>${escapeHtml(guide.summary)}</p>` : ""}
            <div class="chatbot-inline-actions">
                <a href="${getCategoryLink(category)}">Open ${escapeHtml(category)} guide</a>
                <a href="index.html#toolExplorer">Browse category on homepage</a>
            </div>
        </div>
    `;
}

function buildChatToolFocus(tool) {
    const useCases = (tool.useCases || []).slice(0, 3);
    const features = (tool.features || []).slice(0, 3);
    return `
        <div class="chatbot-analysis">
            <span class="chatbot-section-label">Tool Analysis</span>
            <p><strong>${escapeHtml(tool.name)}</strong> is positioned in <strong>${escapeHtml(tool.category)}</strong> and tagged as <strong>${escapeHtml(getPricingLabel(tool) || "Unlabeled")}</strong>.</p>
            <p>${escapeHtml(tool.description)}</p>
            ${useCases.length ? `<p><strong>Good fit for:</strong> ${escapeHtml(useCases.join(" | "))}</p>` : ""}
            ${features.length ? `<p><strong>Key strengths:</strong> ${escapeHtml(features.join(" | "))}</p>` : ""}
            <div class="chatbot-inline-actions">
                <a href="tool.html?name=${encodeToolName(tool.name)}">Open tool details</a>
                <a href="${escapeHtml(getGuideUrl(tool))}">Open guide</a>
                <a href="${escapeHtml(tool.link)}" target="_blank" rel="noopener noreferrer">Official site</a>
            </div>
        </div>
    `;
}

function buildChatCompareSummary(entries, intent) {
    const categoryLabel = intent.category || entries[0]?.tool.category || "selected";
    return `
        <div class="chatbot-analysis">
            <span class="chatbot-section-label">Comparison View</span>
            <p>I ranked these for <strong>${escapeHtml(categoryLabel)}</strong> based on your request, pricing fit, dataset match, and rating strength.</p>
            <p>Use the cards below to open details, then move shortlisted tools into the compare page for a direct side-by-side review.</p>
            <div class="chatbot-inline-actions">
                <a href="compare.html">Open compare page</a>
                ${intent.category ? `<a href="${getCategoryLink(intent.category)}">Read ${escapeHtml(intent.category)} guide</a>` : `<a href="guides.html">Browse guides</a>`}
            </div>
        </div>
    `;
}

function buildChatbotResponse(message) {
    const text = message.trim();
    const intent = inferChatbotIntent(text);

    if (!text) {
        return {
            html: `<p>Ask for a category, pricing level, guide, comparison, or a specific tool name.</p>${buildChatbotSuggestionMarkup(intent)}`,
            results: []
        };
    }

    if (intent.wantsCategoryList) {
        const categories = [...new Set(tools.map((tool) => tool.category))].sort();
        return {
            html: `
                <div class="chatbot-analysis">
                    <span class="chatbot-section-label">Available Categories</span>
                    <p>${categories.map((item) => escapeHtml(item)).join(" | ")}</p>
                    <div class="chatbot-inline-actions">
                        <a href="guides.html">Browse all guides</a>
                        <a href="index.html#toolExplorer">Open the main explorer</a>
                    </div>
                </div>
                ${buildChatbotSuggestionMarkup(intent)}
            `,
            results: []
        };
    }

    if (intent.wantsMore && chatbotState.lastResults.length) {
        const moreResults = chatbotState.lastResults.slice(4, 8);
        return {
            html: moreResults.length
                ? `
                    <div class="chatbot-analysis">
                        <span class="chatbot-section-label">More Matches</span>
                        <p>Here are more tools from the previous shortlist.</p>
                    </div>
                    <div class="chatbot-tool-grid">${moreResults.map((tool) => buildChatToolCard(tool, intent)).join("")}</div>
                    ${buildChatbotSuggestionMarkup(intent)}
                `
                : `<p>I already showed the strongest matches from the previous query. Try narrowing by category, pricing, or use case.</p>${buildChatbotSuggestionMarkup(intent)}`,
            results: moreResults
        };
    }

    if (intent.wantsGuide && !intent.category && !intent.matchedTool) {
        return {
            html: `
                <div class="chatbot-analysis">
                    <span class="chatbot-section-label">Guide Paths</span>
                    <p>Start with the student-friendly guide if you want a lighter entry point, or open the full guide library if you already know the category.</p>
                    <div class="chatbot-inline-actions">
                        <a href="best-ai-tools-for-students.html">Student-friendly guide</a>
                        <a href="guides.html">All category guides</a>
                        <a href="methodology.html">Evaluation methodology</a>
                    </div>
                </div>
                ${buildChatbotSuggestionMarkup(intent)}
            `,
            results: []
        };
    }

    if (intent.matchedTool && !intent.wantsAlternatives) {
        const alternativesIntent = { ...intent, wantsAlternatives: true };
        const alternatives = getChatbotRankedTools(alternativesIntent, 3).map((entry) => entry.tool);
        return {
            html: `
                ${buildChatToolFocus(intent.matchedTool)}
                ${alternatives.length ? `
                    <div class="chatbot-analysis">
                        <span class="chatbot-section-label">Similar Options</span>
                        <p>If you want alternatives in the same workflow, start with these.</p>
                    </div>
                    <div class="chatbot-tool-grid">${alternatives.map((tool) => buildChatToolCard(tool, alternativesIntent)).join("")}</div>
                ` : ""}
                ${buildChatbotSuggestionMarkup(intent)}
            `,
            results: [intent.matchedTool, ...alternatives]
        };
    }

    if (intent.category && !intent.wantsBest && !intent.wantsCompare && !intent.wantsFree && !intent.wantsPremium && !intent.tokens.some((token) => token.length > 3)) {
        const picks = getTopToolsByCategory(intent.category, 4);
        return {
            html: `
                ${buildChatCategorySummary(intent.category)}
                <div class="chatbot-tool-grid">${picks.map((tool) => buildChatToolCard(tool, intent)).join("")}</div>
                ${buildChatbotSuggestionMarkup(intent)}
            `,
            results: picks
        };
    }

    const ranked = getChatbotRankedTools(intent, intent.wantsCompare ? 3 : 4);
    const rankedTools = ranked.map((entry) => entry.tool);

    if (!rankedTools.length) {
        return {
            html: `
                <div class="chatbot-analysis">
                    <span class="chatbot-section-label">No Strong Match</span>
                    <p>I could not find a strong match for that exact request in the current directory. Try adding a category, or specify free, freemium, or premium.</p>
                    <div class="chatbot-inline-actions">
                        <a href="index.html#toolExplorer">Open full explorer</a>
                        <a href="guides.html">Browse guides</a>
                    </div>
                </div>
                ${buildChatbotSuggestionMarkup(intent)}
            `,
            results: []
        };
    }

    const intro = intent.wantsCompare
        ? buildChatCompareSummary(ranked, intent)
        : `
            <div class="chatbot-analysis">
                <span class="chatbot-section-label">Recommended Match</span>
                <p>${intent.category ? `I filtered for <strong>${escapeHtml(intent.category)}</strong>. ` : ""}${intent.wantsFree ? `I prioritized <strong>Free/Freemium</strong> options. ` : ""}${intent.wantsPremium ? `I prioritized <strong>Premium</strong> options. ` : ""}${intent.wantsStudent ? `I weighted student-friendly research, writing, and productivity workflows. ` : ""}These are the strongest matches from your site data.</p>
                <div class="chatbot-inline-actions">
                    ${intent.wantsPremium ? `<a href="premium-tools.html">Open premium catalog</a>` : ""}
                    ${intent.wantsFree ? `<a href="free-tools.html">Open free tools page</a>` : ""}
                    ${intent.category ? `<a href="${getCategoryLink(intent.category)}">Open ${escapeHtml(intent.category)} guide</a>` : `<a href="guides.html">Browse guides</a>`}
                </div>
            </div>
        `;

    return {
        html: `
            ${intro}
            <div class="chatbot-tool-grid">${rankedTools.map((tool) => buildChatToolCard(tool, intent)).join("")}</div>
            ${buildChatbotSuggestionMarkup(intent)}
        `,
        results: rankedTools
    };
}

function appendChatMessage(container, role, content) {
    const item = document.createElement("div");
    item.className = `chatbot-message chatbot-${role}`;
    item.innerHTML = content;
    container.appendChild(item);
    container.scrollTop = container.scrollHeight;
}

function renderChatbot() {
    if (document.getElementById("siteChatbot")) return;

    const wrapper = document.createElement("div");
    wrapper.id = "siteChatbot";
    wrapper.className = "site-chatbot is-collapsed";
    wrapper.innerHTML = `
        <button id="chatbotToggle" class="chatbot-toggle" type="button">
            <span class="chatbot-toggle-orb" aria-hidden="true">
                <span class="chatbot-toggle-dot"></span>
            </span>
            <span class="chatbot-toggle-pulse" aria-hidden="true"></span>
            <span class="chatbot-toggle-tooltip">Ask AI Copilot</span>
        </button>
        <section class="chatbot-panel" aria-live="polite">
            <div class="chatbot-header">
                <div class="chatbot-header-copy">
                    <span class="chatbot-header-status">Live site data</span>
                    <strong>AI Buying Copilot</strong>
                    <span>Ask for categories, pricing, comparisons, guides, or specific tools.</span>
                </div>
                <button id="chatbotClose" class="chatbot-close" type="button" aria-label="Close chat">&times;</button>
            </div>
            <div class="chatbot-topics">
                <span>Free tools</span>
                <span>Premium tools</span>
                <span>Category guides</span>
                <span>Tool comparisons</span>
            </div>
            <div class="chatbot-messages-wrap">
                <div id="chatbotMessages" class="chatbot-messages"></div>
                <button id="chatbotScrollButton" class="chatbot-scroll-btn" type="button" aria-label="Scroll to latest messages">↓</button>
            </div>
            <div class="chatbot-prompts" id="chatbotPrompts">
                ${chatbotQuickPrompts.map((prompt) => `<button type="button" class="chatbot-chip" data-chat-prompt="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>`).join("")}
            </div>
            <form id="chatbotForm" class="chatbot-form">
                <input id="chatbotInput" class="site-input chatbot-input" type="text" placeholder="Ask for tools, guides, use cases, or comparisons">
                <button class="btn btn-accent rounded-pill chatbot-submit" type="submit">Analyze</button>
            </form>
        </section>
    `;

    document.body.appendChild(wrapper);

    const toggle = document.getElementById("chatbotToggle");
    const close = document.getElementById("chatbotClose");
    const messages = document.getElementById("chatbotMessages");
    const scrollButton = document.getElementById("chatbotScrollButton");
    const form = document.getElementById("chatbotForm");
    const input = document.getElementById("chatbotInput");

    function openChat() {
        wrapper.classList.remove("is-collapsed");
        input.focus();
        updateScrollButton();
    }

    function closeChat() {
        wrapper.classList.add("is-collapsed");
    }

    function updateScrollButton() {
        const hiddenDistance = messages.scrollHeight - messages.scrollTop - messages.clientHeight;
        scrollButton.classList.toggle("is-visible", hiddenDistance > 80);
    }

    function respond(prompt) {
        const intent = inferChatbotIntent(prompt);
        const reply = buildChatbotResponse(prompt);
        appendChatMessage(messages, "user", escapeHtml(prompt));
        appendChatMessage(messages, "bot", reply.html);
        chatbotState.lastQuery = prompt;
        chatbotState.lastCategory = intent.category || chatbotState.lastCategory;
        chatbotState.lastPricing = intent.wantsPremium ? "Premium" : (intent.wantsFree ? "Free/Freemium" : "");
        chatbotState.lastResults = reply.results || [];
        openChat();
    }

    toggle.addEventListener("click", () => {
        if (wrapper.classList.contains("is-collapsed")) {
            openChat();
        } else {
            closeChat();
        }
    });

    close.addEventListener("click", closeChat);

    messages.addEventListener("scroll", updateScrollButton);

    scrollButton.addEventListener("click", () => {
        messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
    });

    appendChatMessage(messages, "bot", `
        <div class="chatbot-analysis">
            <span class="chatbot-section-label">Ready</span>
            <p>I can rank tools from your site data, filter by free or premium access, point visitors to the right guide, and suggest alternatives by category.</p>
            <div class="chatbot-inline-actions">
                <a href="free-tools.html">Free tools</a>
                <a href="premium-tools.html">Premium tools</a>
                <a href="guides.html">Guides</a>
            </div>
        </div>
        ${buildChatbotSuggestionMarkup(inferChatbotIntent(""))}
    `);

    wrapper.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        const promptButton = target.closest("[data-chat-prompt]");
        if (promptButton instanceof HTMLElement) {
            const prompt = promptButton.dataset.chatPrompt || promptButton.textContent || "";
            if (prompt.trim()) respond(prompt.trim());
            return;
        }

        if (target instanceof HTMLAnchorElement) {
            closeChat();
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = input.value.trim();
        if (!value) return;
        respond(value);
        input.value = "";
    });

    updateScrollButton();
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
    const pricingText = activePricing ? ` | ${activePricing}` : "";
    summary.textContent = `Showing ${pageCount} of ${totalCount} tools${categoryText}${pricingText} | Page ${currentPage} of ${totalPages}`;
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
                    ${getPricingLabel(tool) ? `<span class="pricing-pill">${escapeHtml(getPricingLabel(tool))}</span>` : ""}
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
    const pricingSelect = document.getElementById("pricingFilter");
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

    if (pricingSelect) {
        pricingSelect.addEventListener("change", (event) => {
            activePricing = event.target.value;
            syncFilters();
        });
    }

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            activeSearch = "";
            activeCategory = "";
            activePricing = "";
            if (searchInput) searchInput.value = "";
            if (categorySelect) categorySelect.value = "";
            if (pricingSelect) pricingSelect.value = "";
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
    const guide = getCategoryGuide(tool.category);
    const strongestUseCases = (tool.useCases || []).slice(0, 5);
    const strongestFeatures = (tool.features || []).slice(0, 5);

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
                    ${getPricingLabel(tool) ? `<p class="mb-0"><span class="pricing-pill">${escapeHtml(getPricingLabel(tool))}</span></p>` : ""}
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

            <section class="detail-block mt-3">
                <h3>Editorial Take</h3>
                <p>${escapeHtml(tool.name)} sits in the ${escapeHtml(tool.category)} category. ${escapeHtml(guide ? guide.summary : "This tool should be evaluated against similar products in the same workflow category.")}</p>
                <p class="mb-0">Best fit indicators from this listing: ${escapeHtml(strongestUseCases.join(", "))}.</p>
            </section>

            <div class="detail-grid mt-3">
                <section class="detail-block">
                    <h3>What to test first</h3>
                    <ul>${(guide?.checklist || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
                </section>
                <section class="detail-block">
                    <h3>Potential risks</h3>
                    <ul>${(guide?.mistakes || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
                </section>
                <section class="detail-block">
                    <h3>Strongest signals</h3>
                    <ul>${strongestFeatures.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
                </section>
            </div>

            <div class="tool-actions mt-4">
                <a href="${getCategoryLink(tool.category)}" class="btn btn-ghost rounded-pill">Read ${escapeHtml(tool.category)} Guide</a>
                <a href="methodology.html" class="btn btn-ghost rounded-pill">How We Evaluate</a>
            </div>
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

function renderStandalonePagination(targetId, totalItems, current, size, onPageChange) {
    const el = document.getElementById(targetId);
    if (!el) return;

    const totalPages = Math.max(1, Math.ceil(totalItems / size));
    const safeCurrent = Math.min(Math.max(1, current), totalPages);

    if (totalPages <= 1) {
        el.innerHTML = "";
        return;
    }

    const pages = [];
    for (let page = 1; page <= totalPages; page += 1) {
        if (totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - safeCurrent) <= 1) {
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
        <button class="pagination-btn" data-page="${safeCurrent - 1}" ${safeCurrent === 1 ? "disabled" : ""}>Prev</button>
        ${compactPages.map((page) => {
            if (page === "ellipsis") {
                return `<button class="pagination-btn" disabled>...</button>`;
            }
            return `<button class="pagination-btn ${page === safeCurrent ? "is-active" : ""}" data-page="${page}">${page}</button>`;
        }).join("")}
        <button class="pagination-btn" data-page="${safeCurrent + 1}" ${safeCurrent === totalPages ? "disabled" : ""}>Next</button>
    `;

    el.querySelectorAll("[data-page]").forEach((button) => {
        button.addEventListener("click", () => onPageChange(Number(button.dataset.page)));
    });
}

function renderCategoryGuideCards() {
    const el = document.getElementById("categoryGuideGrid");
    if (!el) return;

    const categories = [...new Set(tools.map((tool) => tool.category))].sort();
    el.innerHTML = categories.map((category) => {
        const guide = getCategoryGuide(category);
        const previewTools = getTopToolsByCategory(category, 3).map((tool) => tool.name).join(", ");
        return `
            <div class="col-md-6 col-xl-4">
                <article class="guide-card category-guide-card">
                    <span class="guide-tag">${escapeHtml(category)}</span>
                    <h3 class="mt-3">${escapeHtml(category)} tools</h3>
                    <p>${escapeHtml(guide ? guide.summary : "Read a practical introduction to this category, what to compare, and which tools are worth shortlisting.")}</p>
                    <p class="mini-copy">Top examples: ${escapeHtml(previewTools)}</p>
                    <div class="tool-actions">
                        <a href="${getCategoryLink(category)}" class="btn btn-ghost rounded-pill">Open Guide</a>
                        <a href="index.html#toolExplorer" class="btn btn-accent rounded-pill">Explore Tools</a>
                    </div>
                </article>
            </div>
        `;
    }).join("");
}

function categoryGuidePage() {
    const el = document.getElementById("categoryGuidePage");
    if (!el) return;

    const url = new URL(window.location.href);
    const category = url.searchParams.get("category");
    const guide = getCategoryGuide(category);
    const categoryTools = tools
        .filter((tool) => tool.category === category)
        .sort((a, b) => Number(b.rating) - Number(a.rating));

    if (!category || !guide || !categoryTools.length) {
        el.innerHTML = `
            <div class="policy-card">
                <span class="eyebrow">Category Guide</span>
                <h1>Guide not found</h1>
                <p>This category guide is missing or the category name in the URL is invalid.</p>
                <div class="hero-actions">
                    <a href="guides.html" class="btn btn-accent rounded-pill">Browse All Guides</a>
                    <a href="index.html#toolExplorer" class="btn btn-ghost rounded-pill">Return to Explorer</a>
                </div>
            </div>
        `;
        return;
    }

    document.title = `${category} AI Tools Guide | AI Tools Hub`;

    el.innerHTML = `
        <div class="compare-card">
            <span class="eyebrow">${escapeHtml(category)}</span>
            <h1>${escapeHtml(category)} AI tools guide</h1>
            <p>${escapeHtml(guide.summary)}</p>
            <div class="hero-actions">
                <a href="index.html#toolExplorer" class="btn btn-accent rounded-pill">Explore ${escapeHtml(category)} Tools</a>
                <a href="compare.html" class="btn btn-ghost rounded-pill">Compare Shortlist</a>
            </div>
        </div>

        <div class="editorial-panel mt-4">
            <div class="row g-4">
                <div class="col-lg-6">
                    <h3>Best for</h3>
                    <p>${escapeHtml(guide.bestFor)}</p>
                </div>
                <div class="col-lg-6">
                    <h3>What to compare first</h3>
                    <ul class="editorial-list">
                        ${guide.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>

        <div class="editorial-panel mt-4">
            <div class="row g-4">
                <div class="col-lg-6">
                    <h3>Common mistakes</h3>
                    <ul class="editorial-list">
                        ${guide.mistakes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                    </ul>
                </div>
                <div class="col-lg-6">
                    <h3>Category FAQ</h3>
                    <ul class="editorial-list">
                        ${guide.faq.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>

        <div class="section-heading mt-5">
            <div>
                <span class="eyebrow">Top picks</span>
                <h2>Tools in this category</h2>
                <p>Start with the strongest shortlist, then open detail pages for features, use cases, and step-by-step usage notes.</p>
            </div>
            <a class="text-link" href="methodology.html">Read evaluation method</a>
        </div>
        <div class="row g-4">
            ${categoryTools.slice(0, 9).map((tool) => `
                <div class="col-md-6 col-xl-4">
                    <article class="guide-card">
                        <span class="guide-tag">${escapeHtml(tool.category)}</span>
                        <h3 class="mt-3">${escapeHtml(tool.name)}</h3>
                        <p>${escapeHtml(tool.description)}</p>
                        ${createActionButtons(tool, { detailLabel: "Review Tool", visitLabel: "Visit Site" })}
                    </article>
                </div>
            `).join("")}
        </div>
    `;
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

function freeToolsPage() {
    const el = document.getElementById("freeToolsGrid");
    if (!el) return;

    const list = tools
        .filter((tool) => tool.pricingAccess === "Free" || tool.pricingAccess === "Freemium")
        .sort((a, b) => {
            if (a.category === b.category) return Number(b.rating) - Number(a.rating);
            return a.category.localeCompare(b.category);
        });

    el.innerHTML = list.map((tool) => `
        <div class="col-md-6 col-xl-4">
            <article class="guide-card" data-tool-name="${escapeHtml(tool.name)}">
                <span class="guide-tag">${escapeHtml(tool.category)}</span>
                <h3 class="mt-3">${escapeHtml(tool.name)}</h3>
                <p>${escapeHtml(tool.description)}</p>
                <div class="tool-meta mt-3">
                    <span class="rating-pill">${escapeHtml(tool.rating)}/5</span>
                    <span class="pricing-pill">${escapeHtml(getPricingLabel(tool))}</span>
                </div>
                ${createActionButtons(tool, { detailLabel: "Details", visitLabel: "Try It" })}
            </article>
        </div>
    `).join("");

    applyCardInteractivity(el);
}

function premiumToolsPage() {
    const el = document.getElementById("premiumToolsGrid");
    if (!el) return;

    const categorySelect = document.getElementById("premiumCategoryFilter");
    const searchInput = document.getElementById("premiumSearch");
    const clearButton = document.getElementById("premiumClearFilters");
    const summary = document.getElementById("premiumResultsSummary");
    const premiumTools = getPremiumTools();

    if (categorySelect && !categorySelect.dataset.bound) {
        const categories = [...new Set(premiumTools.map((tool) => tool.category))].sort();
        categorySelect.innerHTML = `<option value="">All Categories</option>${categories.map((category) => `
            <option value="${escapeHtml(category)}">${escapeHtml(category)}</option>
        `).join("")}`;
        categorySelect.dataset.bound = "true";

        categorySelect.addEventListener("change", (event) => {
            premiumCategory = event.target.value;
            premiumPage = 1;
            premiumToolsPage();
        });
    }

    if (searchInput && !searchInput.dataset.bound) {
        searchInput.dataset.bound = "true";
        searchInput.addEventListener("input", (event) => {
            premiumSearch = event.target.value.trim().toLowerCase();
            premiumPage = 1;
            premiumToolsPage();
        });
    }

    if (clearButton && !clearButton.dataset.bound) {
        clearButton.dataset.bound = "true";
        clearButton.addEventListener("click", () => {
            premiumSearch = "";
            premiumCategory = "";
            premiumPage = 1;
            if (searchInput) searchInput.value = "";
            if (categorySelect) categorySelect.value = "";
            premiumToolsPage();
        });
    }

    const filtered = premiumTools.filter((tool) => {
        const haystack = `${tool.name} ${tool.description} ${tool.category}`.toLowerCase();
        const matchesSearch = !premiumSearch || haystack.includes(premiumSearch);
        const matchesCategory = !premiumCategory || tool.category === premiumCategory;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / premiumPageSize));
    premiumPage = Math.min(Math.max(1, premiumPage), totalPages);
    const startIndex = (premiumPage - 1) * premiumPageSize;
    const paged = filtered.slice(startIndex, startIndex + premiumPageSize);

    if (summary) {
        summary.textContent = `Showing ${paged.length} of ${filtered.length} premium tools | Page ${premiumPage} of ${totalPages}`;
    }

    if (!paged.length) {
        el.innerHTML = `<div class="col-12"><div class="empty-state">No premium tools matched your search. Try another keyword or reset the filters.</div></div>`;
        renderStandalonePagination("premiumPagination", 0, 1, premiumPageSize, () => {});
        return;
    }

    el.innerHTML = paged.map((tool) => `
        <div class="col-md-6 col-xl-4">
            <article class="tool-card premium-card d-flex flex-column" data-tool-name="${escapeHtml(tool.name)}">
                <div class="tool-card-top">
                    <span class="pricing-pill premium-pill">Premium</span>
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
                ${createActionButtons(tool, { detailLabel: "Review Tool", visitLabel: "Visit Site" })}
            </article>
        </div>
    `).join("");

    renderStandalonePagination("premiumPagination", filtered.length, premiumPage, premiumPageSize, (nextPage) => {
        premiumPage = nextPage;
        premiumToolsPage();
        const explorer = document.getElementById("premiumExplorer");
        if (explorer) explorer.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
                                <li><a href="guides.html">Browse category guides</a></li>
                                <li><a href="free-tools.html">Browse free AI tools</a></li>
                                <li><a href="premium-tools.html">Browse premium AI tools</a></li>
                                <li><a href="methodology.html">Read methodology</a></li>
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
renderCategoryGuideCards();
categoryGuidePage();
freeToolsPage();
premiumToolsPage();
renderFooter();
renderChatbot();
