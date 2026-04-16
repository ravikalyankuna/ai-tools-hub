$dataPath = Join-Path $PSScriptRoot '..\data.js'
$raw = Get-Content -Raw $dataPath
$json = $raw -replace '^\s*const\s+tools\s*=\s*', '' -replace ';\s*$', ''
$parsedRaw = $json | ConvertFrom-Json
$parsed = @($parsedRaw)
if ($parsed.Count -eq 1 -and $parsed[0] -is [System.Array]) {
    $parsed = @($parsed[0])
}
if ($parsed.Count -gt 0 -and ($parsed[0].PSObject.Properties.Name -contains 'value')) {
    $tools = @($parsed[0].value)
}
else {
    $tools = @($parsed)
}

function Normalize-Category([string]$category) {
    if ($category -match 'General Purpose') { return 'General Purpose' }
    if ($category -match '^Writing') { return 'Writing' }
    if ($category -match '^Coding') { return 'Coding' }
    if ($category -match '^Video') { return 'Video' }
    if ($category -match '^(Audio|Music)') { return 'Audio' }
    if ($category -match '^(Design|Image)') { return 'Design' }
    if ($category -match '^Marketing') { return 'Marketing' }
    if ($category -match '^Productivity') { return 'Productivity' }
    if ($category -match '^(Research|Search)') { return 'Research' }
    if ($category -match '^Automation') { return 'Automation' }
    if ($category -match '^Customer Support') { return 'Customer Support' }
    if ($category -match '^Business') { return 'Business / App Builder' }
    return $category
}

function Get-LinkHost([string]$link) {
    try { return ([uri]$link).Host.Replace('www.', '') } catch { return '' }
}

function Get-Image([string]$link) {
    $linkHost = Get-LinkHost $link
    if ($linkHost) { return "https://img.logo.dev/$linkHost" }
    return 'https://via.placeholder.com/96?text=AI'
}

$profiles = @{
    'General Purpose' = @{ focus='general assistant work'; outputs=@('summaries','drafts','plans','answers'); users='individuals and teams' }
    'Business / App Builder' = @{ focus='app and website creation'; outputs=@('prototypes','interfaces','forms','workflows'); users='founders and business teams' }
    'Customer Support' = @{ focus='customer service automation'; outputs=@('replies','ticket triage','chat flows','handoffs'); users='support teams' }
    'Research' = @{ focus='research and literature review'; outputs=@('paper summaries','source maps','reading lists','notes'); users='students and researchers' }
    'Audio' = @{ focus='audio cleanup and production'; outputs=@('clean recordings','voice tracks','podcast audio','enhanced speech'); users='creators and media teams' }
    'Marketing' = @{ focus='marketing execution and messaging'; outputs=@('campaign copy','email sequences','SEO briefs','ad variants'); users='growth and content teams' }
    'Automation' = @{ focus='workflow automation'; outputs=@('automations','integrations','browser tasks','data flows'); users='operators and business teams' }
    'Coding' = @{ focus='software development'; outputs=@('code drafts','fixes','tests','refactors'); users='developers' }
    'Productivity' = @{ focus='planning and work management'; outputs=@('task plans','meeting notes','project docs','workspaces'); users='individual contributors and teams' }
    'Writing' = @{ focus='writing and editing'; outputs=@('articles','emails','reports','rewrites'); users='writers and marketers' }
    'Design' = @{ focus='design creation'; outputs=@('images','mockups','assets','layouts'); users='designers and marketers' }
    'Video' = @{ focus='video production'; outputs=@('clips','avatars','edits','generated video'); users='creators and media teams' }
}

function Build-UseCases([string]$name, [string]$category) {
    $p = $profiles[$category]
    return @(
        "Use $name for faster $($p.focus)",
        "Create $($p.outputs[0]) with $name",
        "Generate first-pass $($p.outputs[1]) in $name",
        "Use $name to organize recurring $($p.focus) tasks",
        "Speed up team workflows with $name",
        "Use $name to reduce manual work in $($p.focus)",
        "Build production-ready $($p.outputs[2]) with $name",
        "Use $name to prepare review-ready $($p.outputs[3])",
        "Create a repeatable process around $name",
        "Use $name to handle deadline-driven work faster",
        "Improve output consistency with $name",
        "Use $name to draft work before final review",
        "Prepare stakeholder-ready deliverables using $name",
        "Use $name to shorten turnaround time",
        "Create reusable templates and workflows with $name",
        "Use $name to support solo and team execution",
        "Handle high-volume tasks with $name",
        "Use $name as part of a modern $category stack",
        "Reduce blank-page or blank-canvas time with $name",
        "Use $name to improve day-to-day $($p.focus) operations"
    )
}

function Build-Steps([string]$name, [string]$link) {
    $linkHost = Get-LinkHost $link
    return @(
        "Open $linkHost and sign in to $name",
        "Create a new workspace, project, or conversation in $name",
        "Define the outcome you want from $name",
        "Upload source material or connect the tools that $name supports",
        "Choose a template, mode, or workflow inside $name",
        "Enter a clear prompt or task configuration",
        "Review the first output from $name",
        "Refine the output with edits or follow-up instructions",
        "Save, export, or publish the result",
        "Reuse the workflow in $name to speed up future work"
    )
}

function Build-Features([string]$name, [string]$category, [string]$link) {
    $p = $profiles[$category]
    $linkHost = Get-LinkHost $link
    return @(
        "$name is built for $($p.focus)",
        "$name helps $($p.users) work faster",
        "$name can produce $($p.outputs[0]) on demand",
        "$name can support $($p.outputs[1]) workflows",
        "$name helps teams create $($p.outputs[2]) faster",
        "$name supports production of $($p.outputs[3])",
        "$name runs on the web through $linkHost",
        "$name supports prompt-based starting points",
        "$name enables faster first drafts or first outputs",
        "$name helps reduce repetitive manual effort",
        "$name is useful for both individual and team use",
        "$name can fit into existing software workflows",
        "$name supports iterative refinement after the first result",
        "$name helps increase throughput in $category work",
        "$name can shorten project turnaround time",
        "$name supports repeatable workflows instead of one-off use",
        "$name helps users move from idea to output quickly",
        "$name provides AI assistance inside a focused $category workflow",
        "$name is suited to modern digital production tasks",
        "$name adds an AI layer to practical $($p.focus) tasks"
    )
}

foreach ($tool in $tools) {
    if (-not $tool -or -not ($tool.PSObject.Properties.Name -contains 'category')) {
        continue
    }
    $tool.category = Normalize-Category $tool.category
    if (-not $tool.guideurl) {
        $tool | Add-Member -NotePropertyName guideurl -NotePropertyValue 'best-ai-tools-for-students.html'
    }
}

$newTools = @(
    @{name='Microsoft Copilot'; category='General Purpose'; link='https://copilot.microsoft.com/'; description='Microsoft''s AI assistant for web answers, drafting, and everyday productivity tasks.'},
    @{name='Poe'; category='General Purpose'; link='https://poe.com/'; description='Quora''s multi-model AI chat platform for writing, exploration, and everyday assistant workflows.'},
    @{name='Pi'; category='General Purpose'; link='https://pi.ai/'; description='Inflection''s conversational AI assistant designed for natural dialogue and personal help.'},
    @{name='You.com'; category='General Purpose'; link='https://you.com/'; description='AI search and assistant platform combining web results with chat-based answers.'},
    @{name='Le Chat'; category='General Purpose'; link='https://chat.mistral.ai/'; description='Mistral''s browser-based chat assistant for reasoning, drafting, and question answering.'},
    @{name='Character.AI'; category='General Purpose'; link='https://character.ai/'; description='Conversational AI platform for persona-driven chats and interactive assistant experiences.'},
    @{name='Meta AI'; category='General Purpose'; link='https://meta.ai/'; description='Meta''s AI assistant for search, conversation, and practical consumer use cases.'},
    @{name='Grok'; category='General Purpose'; link='https://x.ai/'; description='xAI''s assistant for conversational reasoning, summaries, and general tasks.'},
    @{name='Qwen Chat'; category='General Purpose'; link='https://chat.qwen.ai/'; description='Alibaba''s AI assistant for writing, reasoning, and broad everyday help.'},
    @{name='HuggingChat'; category='General Purpose'; link='https://huggingface.co/chat/'; description='Open conversational AI interface from Hugging Face for general prompting and drafting.'},
    @{name='DeepSeek'; category='General Purpose'; link='https://chat.deepseek.com/'; description='General AI assistant for reasoning, writing, and technical question answering.'},
    @{name='Duck.ai'; category='General Purpose'; link='https://duck.ai/'; description='DuckDuckGo''s privacy-first AI chat experience for everyday questions and summaries.'},
    @{name='Monica'; category='General Purpose'; link='https://monica.im/'; description='Browser-based AI assistant for chat, reading, writing, and page summaries.'},
    @{name='Sider'; category='General Purpose'; link='https://sider.ai/'; description='Sidebar AI assistant for summarization, drafting, and everyday web productivity.'},
    @{name='Merlin'; category='General Purpose'; link='https://www.getmerlin.in/'; description='AI assistant for research, summarization, and cross-site productivity tasks.'},
    @{name='Saner.AI'; category='General Purpose'; link='https://saner.ai/'; description='AI tool for organizing personal knowledge, notes, and conversational answers.'},
    @{name='Reka'; category='General Purpose'; link='https://reka.ai/'; description='General-purpose AI assistant and multimodal model platform for interactive workflows.'},
    @{name='Komo AI'; category='General Purpose'; link='https://komo.ai/'; description='AI-assisted search and discovery tool for asking questions and exploring topics.'},
    @{name='Bolt.new'; category='Business / App Builder'; link='https://bolt.new/'; description='AI-powered app builder for generating full-stack web app starting points from prompts.'},
    @{name='v0'; category='Business / App Builder'; link='https://v0.dev/'; description='Vercel''s UI generation tool for creating React interface code from natural-language input.'},
    @{name='Softr AI'; category='Business / App Builder'; link='https://www.softr.io/'; description='No-code app platform with AI-assisted creation for portals and internal tools.'},
    @{name='Bubble AI'; category='Business / App Builder'; link='https://bubble.io/'; description='AI-assisted no-code platform for building web apps and business workflows.'},
    @{name='FlutterFlow AI'; category='Business / App Builder'; link='https://flutterflow.io/'; description='Visual app builder with AI support for Flutter-based interfaces and workflows.'},
    @{name='Builder.ai'; category='Business / App Builder'; link='https://www.builder.ai/'; description='AI-supported software platform for creating business apps and digital products.'},
    @{name='Jotform AI App Generator'; category='Business / App Builder'; link='https://www.jotform.com/ai/app-generator/'; description='Prompt-based app generator for creating simple business apps and workflow tools.'},
    @{name='Glide AI'; category='Business / App Builder'; link='https://www.glideapps.com/'; description='No-code app builder for internal tools and lightweight business apps with AI help.'},
    @{name='Retool AI'; category='Business / App Builder'; link='https://retool.com/ai'; description='Retool''s AI features for generating internal app logic, queries, and interface helpers.'},
    @{name='Appy Pie AI'; category='Business / App Builder'; link='https://www.appypie.com/'; description='AI app and website builder aimed at small businesses and fast no-code delivery.'},
    @{name='TeleportHQ AI'; category='Business / App Builder'; link='https://teleporthq.io/'; description='AI-assisted front-end builder for creating layouts, components, and exportable code.'},
    @{name='Fronty'; category='Business / App Builder'; link='https://fronty.com/'; description='AI website builder that turns designs or images into editable site layouts.'},
    @{name='10Web AI Website Builder'; category='Business / App Builder'; link='https://10web.io/ai-website-builder/'; description='AI website generator focused on rapid WordPress site creation.'},
    @{name='Hostinger AI Website Builder'; category='Business / App Builder'; link='https://www.hostinger.com/ai-website-builder'; description='AI-driven website builder for small businesses, creators, and simple storefronts.'},
    @{name='Framer AI'; category='Business / App Builder'; link='https://www.framer.com/ai'; description='AI-assisted website builder for polished landing pages and product sites.'},
    @{name='Webflow AI'; category='Business / App Builder'; link='https://webflow.com/ai'; description='Webflow''s AI features for building, writing, and optimizing websites visually.'},
    @{name='Typedream AI'; category='Business / App Builder'; link='https://typedream.com/'; description='AI website builder for startup pages, profiles, and simple online products.'},
    @{name='B12 AI'; category='Business / App Builder'; link='https://www.b12.io/'; description='AI website builder aimed at service businesses that need lead-focused websites.'},
    @{name='Dorik AI'; category='Business / App Builder'; link='https://dorik.com/ai-website-builder'; description='AI-assisted website builder for creators, startups, and marketing sites.'},
    @{name='Ada CX'; category='Customer Support'; link='https://www.ada.cx/'; description='Customer support automation platform for chat-based self-service and ticket deflection.'},
    @{name='Kustomer AI'; category='Customer Support'; link='https://www.kustomer.com/'; description='AI-enhanced customer service platform for omnichannel support operations.'},
    @{name='Talkdesk AI'; category='Customer Support'; link='https://www.talkdesk.com/'; description='AI support and contact center platform for service automation and agent help.'},
    @{name='LivePerson'; category='Customer Support'; link='https://www.liveperson.com/'; description='Conversational AI and messaging platform for support and sales engagement.'},
    @{name='Cresta'; category='Customer Support'; link='https://cresta.com/'; description='AI platform for contact centers that guides agents during live conversations.'},
    @{name='Maven AGI'; category='Customer Support'; link='https://www.mavenagi.com/'; description='Support-focused AI platform for automating responses with company knowledge.'},
    @{name='Cognigy'; category='Customer Support'; link='https://www.cognigy.com/'; description='Enterprise conversational AI platform for support, voice, and chat automation.'},
    @{name='Certainly'; category='Customer Support'; link='https://www.certainly.io/'; description='AI chatbot platform for customer support and sales conversations.'},
    @{name='Kommunicate'; category='Customer Support'; link='https://www.kommunicate.io/'; description='Customer messaging platform with AI chat support for service and lead capture.'},
    @{name='Gorgias AI'; category='Customer Support'; link='https://www.gorgias.com/'; description='AI-enabled ecommerce support platform for customer conversations and automation.'},
    @{name='Connected Papers'; category='Research'; link='https://www.connectedpapers.com/'; description='Research discovery tool for exploring related academic papers visually.'},
    @{name='Research Rabbit'; category='Research'; link='https://www.researchrabbit.ai/'; description='Literature discovery platform for mapping papers, authors, and research areas.'},
    @{name='Unriddle'; category='Research'; link='https://www.unriddle.ai/'; description='AI research assistant for reading, summarizing, and querying documents.'},
    @{name='Explainpaper'; category='Research'; link='https://www.explainpaper.com/'; description='Tool for simplifying difficult academic papers and dense passages.'},
    @{name='Sharly AI'; category='Research'; link='https://sharly.ai/'; description='Document AI tool for summarizing and extracting insights from reports and PDFs.'},
    @{name='Paperguide'; category='Research'; link='https://paperguide.ai/'; description='Research workflow tool for discovery, note-taking, and literature reviews.'},
    @{name='Inciteful'; category='Research'; link='https://inciteful.xyz/'; description='Citation network exploration tool for finding connected papers and topics.'},
    @{name='Litmaps'; category='Research'; link='https://www.litmaps.com/'; description='Academic discovery tool for tracking and expanding paper collections.'},
    @{name='Auphonic'; category='Audio'; link='https://auphonic.com/'; description='AI-assisted audio post-production tool for leveling, cleanup, and speech optimization.'},
    @{name='Adobe Podcast'; category='Audio'; link='https://podcast.adobe.com/'; description='Adobe''s audio cleanup and voice enhancement tool for podcasts and spoken content.'},
    @{name='Reply.io'; category='Marketing'; link='https://reply.io/'; description='AI-assisted sales engagement platform for multichannel outreach workflows.'},
    @{name='Instantly'; category='Marketing'; link='https://instantly.ai/'; description='Outbound email platform with AI-assisted support for sales and lead generation.'},
    @{name='Persado'; category='Marketing'; link='https://www.persado.com/'; description='Enterprise marketing language platform for optimizing persuasive campaign messaging.'},
    @{name='Albert.ai'; category='Marketing'; link='https://albert.ai/'; description='AI marketing platform focused on campaign execution and media optimization.'},
    @{name='Typeface'; category='Marketing'; link='https://www.typeface.ai/'; description='Brand-aware AI content platform for marketing teams producing campaign assets.'},
    @{name='MarketMuse'; category='Marketing'; link='https://www.marketmuse.com/'; description='AI content planning tool for SEO strategy, briefs, and topic coverage.'},
    @{name='Mutiny'; category='Marketing'; link='https://www.mutinyhq.com/'; description='AI-assisted website personalization platform for improving B2B conversion.'},
    @{name='Make'; category='Automation'; link='https://www.make.com/'; description='Visual automation platform for connecting apps and orchestrating workflows.'},
    @{name='n8n'; category='Automation'; link='https://n8n.io/'; description='Workflow automation platform for integrations, automations, and AI-assisted processes.'},
    @{name='Gumloop'; category='Automation'; link='https://www.gumloop.com/'; description='AI automation builder for browser tasks, data flows, and business operations.'},
    @{name='Relay.app'; category='Automation'; link='https://www.relay.app/'; description='AI-enhanced automation platform for cross-app workflows and repeatable processes.'},
    @{name='Hexomatic'; category='Automation'; link='https://hexomatic.com/'; description='Automation tool for scraping, enrichment, and repetitive web tasks.'},
    @{name='Axiom.ai'; category='Automation'; link='https://axiom.ai/'; description='Browser automation platform for repetitive website actions and data entry.'},
    @{name='TaskMagic'; category='Automation'; link='https://www.taskmagic.com/'; description='Automation tool that records and repeats web workflows without scripting.'},
    @{name='Devin'; category='Coding'; link='https://devin.ai/'; description='AI software engineering assistant for implementation, debugging, and coding tasks.'},
    @{name='Coda AI'; category='Productivity'; link='https://coda.io/ai'; description='AI-powered workspace for docs, tasks, data, and collaborative workflows.'},
    @{name='Jenni AI'; category='Writing'; link='https://jenni.ai/'; description='AI writing assistant for essays, long-form drafting, and research-supported writing.'},
    @{name='ProWritingAid'; category='Writing'; link='https://prowritingaid.com/'; description='Writing improvement platform with AI-assisted editing and revision support.'}
)

$existing = @{}
foreach ($tool in $tools) {
    if (-not $tool -or -not $tool.name) { continue }
    $existing[$tool.name.ToLowerInvariant()] = $true
}
$generated = @()
foreach ($seed in $newTools) {
    $key = $seed.name.ToLowerInvariant()
    if ($existing.ContainsKey($key)) { continue }
    $generated += [PSCustomObject]@{
        name = $seed.name
        category = $seed.category
        description = $seed.description
        useCases = Build-UseCases $seed.name $seed.category
        howToUse = Build-Steps $seed.name $seed.link
        features = Build-Features $seed.name $seed.category $seed.link
        rating = 4.6
        link = $seed.link
        image = Get-Image $seed.link
        guideurl = 'best-ai-tools-for-students.html'
    }
}

$allTools = @($tools + $generated)
$out = 'const tools = ' + ($allTools | ConvertTo-Json -Depth 8) + ';'
Set-Content -Path $dataPath -Value $out -Encoding UTF8
$allTools | Group-Object category | Sort-Object Name | Select-Object Name,Count | Format-Table -AutoSize
Write-Output "TOTAL_TOOLS=$($allTools.Count)"
