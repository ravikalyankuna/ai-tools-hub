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

function HostFromLink([string]$link) {
    try { return ([System.Uri]$link).Host -replace '^www\.', '' } catch { return '' }
}

function ImageFromLink([string]$link) {
    $linkHost = HostFromLink $link
    if ($linkHost) { return "https://img.logo.dev/$linkHost" }
    return 'https://via.placeholder.com/96?text=AI'
}

function BuildDescription([string]$name, [string]$focus) {
    return "$name is an AI tool for $focus with a free or freemium access path that lets users test the workflow before upgrading."
}

$profiles = @{
    'General Purpose' = @{ focus='general prompting, summarization, and everyday assistant work'; users='general users and teams'; outputs=@('summaries','drafts','answers','plans') }
    'Writing' = @{ focus='drafting, rewriting, and editing content'; users='writers and marketers'; outputs=@('drafts','rewrites','headlines','polished copy') }
    'Coding' = @{ focus='software development and code assistance'; users='developers'; outputs=@('code suggestions','fixes','tests','implementation drafts') }
    'Design' = @{ focus='image creation, asset production, and visual design'; users='designers and marketers'; outputs=@('images','design concepts','assets','variations') }
    'Video' = @{ focus='video generation, editing, and content production'; users='creators and media teams'; outputs=@('video drafts','clips','avatars','edited outputs') }
    'Audio' = @{ focus='audio cleanup, voice generation, and speech workflows'; users='creators and operators'; outputs=@('cleaned audio','voice tracks','transcripts','enhanced recordings') }
    'Marketing' = @{ focus='campaign production, copy generation, and growth workflows'; users='marketing teams'; outputs=@('campaign drafts','variations','content assets','messaging') }
    'Research' = @{ focus='paper discovery, document review, and research acceleration'; users='students and analysts'; outputs=@('summaries','source lists','paper notes','insight briefs') }
    'Productivity' = @{ focus='planning, notes, and work organization'; users='knowledge workers'; outputs=@('task plans','notes','project docs','meeting summaries') }
    'Automation' = @{ focus='workflow automation and repeated operational tasks'; users='operators and teams'; outputs=@('automations','task flows','app actions','connected workflows') }
    'Customer Support' = @{ focus='support automation and service workflows'; users='support teams'; outputs=@('support replies','routing flows','agent help','service automation') }
    'Business / App Builder' = @{ focus='website, app, and prototype creation'; users='founders and builders'; outputs=@('app drafts','landing pages','internal tools','prototypes') }
}

function BuildUseCases([string]$name, [string]$category) {
    $p = $profiles[$category]
    return @(
        "Use $name to speed up $($p.focus)",
        "Create first-pass $($p.outputs[0]) with $name",
        "Generate $($p.outputs[1]) faster using $name",
        "Use $name for repeated $category workflows",
        "Reduce manual effort in $($p.focus) with $name",
        "Use $name to evaluate new workflow ideas before upgrading",
        "Build production-ready $($p.outputs[2]) with $name",
        "Use $name to improve day-to-day output consistency",
        "Test $name on real tasks before committing budget",
        "Use $name to improve speed for deadline-driven work",
        "Create reusable patterns around $name",
        "Use $name as a low-cost way to validate tooling decisions",
        "Support solo work and team experiments with $name",
        "Use $name to compare free access against paid alternatives",
        "Create review-ready work using $name",
        "Use $name to shorten research and testing time",
        "Start a workflow in $name before moving to higher-tier tools",
        "Use $name to build confidence in the category",
        "Handle recurring tasks in $category with $name",
        "Use $name to validate practical fit before buying"
    )
}

function BuildHowTo([string]$name, [string]$link) {
    $linkHost = HostFromLink $link
    return @(
        "Open $linkHost and create an account for $name",
        "Start with the free or freemium plan if available",
        "Create a new project, session, or workflow in $name",
        "Define the exact task you want to test",
        "Upload source material or enter a prompt if the tool supports it",
        "Run the first output or workflow inside $name",
        "Review the quality and note any access limits",
        "Refine the result with edits or follow-up instructions",
        "Export or save the finished output",
        "Compare the free experience with your shortlist before upgrading"
    )
}

function BuildFeatures([string]$name, [string]$category, [string]$link, [string]$pricing) {
    $p = $profiles[$category]
    $linkHost = HostFromLink $link
    return @(
        "$name supports $($p.focus)",
        "$name has a $pricing access path",
        "$name is useful for $($p.users)",
        "$name can produce $($p.outputs[0]) quickly",
        "$name helps generate $($p.outputs[1]) faster",
        "$name can assist with $($p.outputs[2])",
        "$name supports browser-based usage through $linkHost",
        "$name can be tested before a paid commitment",
        "$name helps evaluate workflow fit at low cost",
        "$name supports iterative refinement after the first output",
        "$name can reduce manual time in $category workflows",
        "$name is relevant for shortlist comparison in the $category category",
        "$name is suited to early workflow validation",
        "$name can be used for repeated experiments and trials",
        "$name helps teams learn the category without immediate spend",
        "$name supports practical output creation rather than only demos",
        "$name can fit into personal or small-team workflows",
        "$name adds AI assistance to everyday $category work",
        "$name offers a starting point before deeper tool adoption",
        "$name can help users compare free access against paid value"
    )
}

$seeds = @(
    @{name='GroqChat'; category='General Purpose'; pricing='Free'; link='https://groq.com/'; focus='general prompting, fast answers, and model testing'},
    @{name='Kimi'; category='General Purpose'; pricing='Free'; link='https://kimi.ai/'; focus='general prompting, long-context chat, and question answering'},
    @{name='HIX Chat'; category='General Purpose'; pricing='Freemium'; link='https://hix.ai/chat'; focus='general chat, drafting, and summarization'},
    @{name='Monica'; category='General Purpose'; pricing='Freemium'; link='https://monica.im/'; focus='cross-site assistance, reading, and writing help'},
    @{name='Merlin'; category='General Purpose'; pricing='Freemium'; link='https://www.getmerlin.in/'; focus='assistant workflows across websites and documents'},
    @{name='Duck.ai'; category='General Purpose'; pricing='Free'; link='https://duck.ai/'; focus='privacy-friendly AI chat and everyday questions'},
    @{name='Andi Search'; category='General Purpose'; pricing='Free'; link='https://andisearch.com/'; focus='assistant-style search and web answers'},
    @{name='You.com'; category='General Purpose'; pricing='Freemium'; link='https://you.com/'; focus='AI search, writing, and general assistance'},
    @{name='Pi'; category='General Purpose'; pricing='Free'; link='https://pi.ai/'; focus='natural conversational support and general assistance'},
    @{name='Poe'; category='General Purpose'; pricing='Freemium'; link='https://poe.com/'; focus='multi-model chat and general assistant workflows'},

    @{name='Hemingway Editor'; category='Writing'; pricing='Free'; link='https://hemingwayapp.com/'; focus='readability improvement and editing'},
    @{name='LanguageTool'; category='Writing'; pricing='Freemium'; link='https://languagetool.org/'; focus='grammar, style, and rewrite support'},
    @{name='Paperpal'; category='Writing'; pricing='Freemium'; link='https://paperpal.com/'; focus='academic writing and manuscript improvement'},
    @{name='TextCortex'; category='Writing'; pricing='Freemium'; link='https://textcortex.com/'; focus='writing assistance and rewrite workflows'},
    @{name='Yomu AI'; category='Writing'; pricing='Freemium'; link='https://www.yomu.ai/'; focus='essay drafting and academic writing support'},
    @{name='Smodin'; category='Writing'; pricing='Freemium'; link='https://smodin.io/'; focus='rewriting, summarization, and writing help'},
    @{name='Wordvice AI'; category='Writing'; pricing='Freemium'; link='https://wordvice.ai/'; focus='editing, paraphrasing, and grammar improvement'},
    @{name='ParagraphAI'; category='Writing'; pricing='Freemium'; link='https://paragraphai.com/'; focus='mobile and browser writing support'},
    @{name='HIX Writer'; category='Writing'; pricing='Freemium'; link='https://hix.ai/writer'; focus='copy generation and content writing'},
    @{name='INK Editor'; category='Writing'; pricing='Freemium'; link='https://inkforall.com/'; focus='SEO-aware writing and content optimization'},

    @{name='Aider'; category='Coding'; pricing='Free'; link='https://aider.chat/'; focus='terminal-based coding assistance'},
    @{name='Cline'; category='Coding'; pricing='Free'; link='https://cline.bot/'; focus='IDE coding agent workflows'},
    @{name='Roo Code'; category='Coding'; pricing='Free'; link='https://roocode.com/'; focus='AI coding inside the editor'},
    @{name='Zed AI'; category='Coding'; pricing='Freemium'; link='https://zed.dev/ai'; focus='editor-native coding assistance'},
    @{name='Bito'; category='Coding'; pricing='Freemium'; link='https://bito.ai/'; focus='code explanation, generation, and review'},
    @{name='CodeGeeX'; category='Coding'; pricing='Free'; link='https://codegeex.cn/en-US'; focus='AI code generation and completion'},
    @{name='MarsCode'; category='Coding'; pricing='Free'; link='https://www.marscode.com/'; focus='coding assistance and development acceleration'},
    @{name='TabbyML'; category='Coding'; pricing='Free'; link='https://tabby.tabbyml.com/'; focus='self-hostable code completion'},
    @{name='Refact.ai'; category='Coding'; pricing='Freemium'; link='https://refact.ai/'; focus='code generation and assistant workflows'},
    @{name='Supermaven'; category='Coding'; pricing='Freemium'; link='https://supermaven.com/'; focus='fast code completion and IDE support'},

    @{name='Recraft'; category='Design'; pricing='Freemium'; link='https://www.recraft.ai/'; focus='vector, image, and design generation'},
    @{name='Playground AI'; category='Design'; pricing='Freemium'; link='https://playground.com/'; focus='image generation and editing'},
    @{name='Microsoft Designer'; category='Design'; pricing='Free'; link='https://designer.microsoft.com/'; focus='quick social and marketing design'},
    @{name='Fotor AI'; category='Design'; pricing='Freemium'; link='https://www.fotor.com/features/ai-image-generator/'; focus='image generation and quick visual edits'},
    @{name='Pixlr AI'; category='Design'; pricing='Freemium'; link='https://pixlr.com/'; focus='image editing and AI-assisted design'},
    @{name='BlueWillow'; category='Design'; pricing='Free'; link='https://www.bluewillow.ai/'; focus='free image generation'},
    @{name='Dzine'; category='Design'; pricing='Freemium'; link='https://dzine.ai/'; focus='design generation and visual refinement'},
    @{name='Magnific AI'; category='Design'; pricing='Freemium'; link='https://magnific.ai/'; focus='image enhancement and upscale workflows'},

    @{name='Fliki'; category='Video'; pricing='Freemium'; link='https://fliki.ai/'; focus='text-to-video and voice-driven video creation'},
    @{name='Animaker AI'; category='Video'; pricing='Freemium'; link='https://www.animaker.com/ai'; focus='animated video generation'},
    @{name='Visla'; category='Video'; pricing='Freemium'; link='https://www.visla.us/'; focus='AI-assisted business video creation'},
    @{name='PixVerse'; category='Video'; pricing='Freemium'; link='https://app.pixverse.ai/'; focus='AI video generation'},
    @{name='Kling AI'; category='Video'; pricing='Freemium'; link='https://klingai.com/'; focus='prompt-based video generation'},
    @{name='Vidu'; category='Video'; pricing='Freemium'; link='https://www.vidu.com/'; focus='AI video generation and creative production'},
    @{name='Vidnoz AI'; category='Video'; pricing='Freemium'; link='https://www.vidnoz.com/'; focus='avatar and video generation'},
    @{name='Capsule'; category='Video'; pricing='Freemium'; link='https://capsule.video/'; focus='AI-assisted video editing for teams'},
    @{name='Haiper'; category='Video'; pricing='Freemium'; link='https://haiper.ai/'; focus='creative video generation'},
    @{name='Pollo AI'; category='Video'; pricing='Freemium'; link='https://pollo.ai/'; focus='AI video generation and remixing'},

    @{name='Adobe Podcast'; category='Audio'; pricing='Freemium'; link='https://podcast.adobe.com/'; focus='audio cleanup and voice enhancement'},
    @{name='Auphonic'; category='Audio'; pricing='Freemium'; link='https://auphonic.com/'; focus='audio post-production and leveling'},
    @{name='Podcastle'; category='Audio'; pricing='Freemium'; link='https://podcastle.ai/'; focus='podcast recording and AI audio editing'},
    @{name='Riverside'; category='Audio'; pricing='Freemium'; link='https://riverside.fm/'; focus='recording, transcription, and audio-video capture'},
    @{name='Voicemod AI'; category='Audio'; pricing='Freemium'; link='https://www.voicemod.net/ai-voices/'; focus='voice generation and transformation'},
    @{name='FineVoice'; category='Audio'; pricing='Freemium'; link='https://finevoice.wondershare.com/'; focus='voiceover and AI voice workflows'},
    @{name='AudioPen'; category='Audio'; pricing='Freemium'; link='https://audiopen.ai/'; focus='voice notes to structured text'},
    @{name='WhisperTranscribe'; category='Audio'; pricing='Freemium'; link='https://whispertranscribe.com/'; focus='transcription and speech processing'},
    @{name='Lalamu Studio'; category='Audio'; pricing='Freemium'; link='https://lalamu.studio/'; focus='voice generation and lip-sync support'},
    @{name='MacWhisper'; category='Audio'; pricing='Freemium'; link='https://goodsnooze.gumroad.com/l/macwhisper'; focus='local transcription workflows on Mac'},

    @{name='Mailchimp AI'; category='Marketing'; pricing='Freemium'; link='https://mailchimp.com/'; focus='email and campaign assistance'},
    @{name='OwlyWriter AI'; category='Marketing'; pricing='Freemium'; link='https://www.hootsuite.com/products/owlywriter-ai'; focus='social copy and campaign drafting'},
    @{name='ContentShake AI'; category='Marketing'; pricing='Freemium'; link='https://www.semrush.com/apps/contentshake/'; focus='SEO content ideation and drafting'},
    @{name='Headlime'; category='Marketing'; pricing='Freemium'; link='https://headlime.com/'; focus='marketing copy generation'},
    @{name='CopyMonkey'; category='Marketing'; pricing='Freemium'; link='https://copymonkey.ai/'; focus='ecommerce listing and marketplace copy'},
    @{name='Easy-Peasy.AI'; category='Marketing'; pricing='Freemium'; link='https://easy-peasy.ai/'; focus='marketing copy and content generation'},
    @{name='GetResponse AI'; category='Marketing'; pricing='Freemium'; link='https://www.getresponse.com/ai'; focus='email marketing and campaign setup'},
    @{name='MailerLite AI'; category='Marketing'; pricing='Freemium'; link='https://www.mailerlite.com/ai'; focus='email content and campaign support'},
    @{name='Contents.ai'; category='Marketing'; pricing='Freemium'; link='https://contents.ai/'; focus='content marketing production'},
    @{name='Narrato'; category='Marketing'; pricing='Freemium'; link='https://narrato.io/'; focus='content workflows and marketing production'},

    @{name='Connected Papers'; category='Research'; pricing='Freemium'; link='https://www.connectedpapers.com/'; focus='paper discovery and citation exploration'},
    @{name='Research Rabbit'; category='Research'; pricing='Free'; link='https://www.researchrabbit.ai/'; focus='literature discovery and author mapping'},
    @{name='Unriddle'; category='Research'; pricing='Freemium'; link='https://www.unriddle.ai/'; focus='document reading and research support'},
    @{name='Explainpaper'; category='Research'; pricing='Freemium'; link='https://www.explainpaper.com/'; focus='understanding dense academic papers'},
    @{name='Sharly AI'; category='Research'; pricing='Freemium'; link='https://sharly.ai/'; focus='document Q&A and summarization'},
    @{name='OpenRead'; category='Research'; pricing='Freemium'; link='https://www.openread.academy/'; focus='paper reading and academic workflows'},
    @{name='Litmaps'; category='Research'; pricing='Freemium'; link='https://www.litmaps.com/'; focus='research tracking and paper discovery'},
    @{name='Inciteful'; category='Research'; pricing='Free'; link='https://inciteful.xyz/'; focus='citation graph exploration'},
    @{name='Paperguide'; category='Research'; pricing='Freemium'; link='https://paperguide.ai/'; focus='literature review and research organization'},
    @{name='Keenious'; category='Research'; pricing='Freemium'; link='https://keenious.com/'; focus='academic search and relevant-source discovery'},

    @{name='Taskade'; category='Productivity'; pricing='Freemium'; link='https://www.taskade.com/'; focus='task planning, notes, and agent-assisted workflows'},
    @{name='Reflect'; category='Productivity'; pricing='Freemium'; link='https://reflect.app/'; focus='thinking, note capture, and personal knowledge'},
    @{name='Slite AI'; category='Productivity'; pricing='Freemium'; link='https://slite.com/ai'; focus='team docs and knowledge organization'},
    @{name='Fellow AI'; category='Productivity'; pricing='Freemium'; link='https://fellow.app/ai/'; focus='meeting workflows and action tracking'},
    @{name='Capacities'; category='Productivity'; pricing='Freemium'; link='https://capacities.io/'; focus='knowledge organization and connected notes'},
    @{name='Tana'; category='Productivity'; pricing='Freemium'; link='https://tana.inc/'; focus='structured notes and knowledge workflows'},
    @{name='Upword'; category='Productivity'; pricing='Freemium'; link='https://www.upword.ai/'; focus='reading, summarization, and note reduction'},
    @{name='Read AI'; category='Productivity'; pricing='Freemium'; link='https://www.read.ai/'; focus='meeting summaries and work insights'},
    @{name='BeforeSunset AI'; category='Productivity'; pricing='Freemium'; link='https://www.beforesunset.ai/'; focus='day planning and task organization'},
    @{name='Saga AI'; category='Productivity'; pricing='Freemium'; link='https://saga.so/ai'; focus='docs, notes, and AI-assisted workspace workflows'},

    @{name='Pipedream'; category='Automation'; pricing='Freemium'; link='https://pipedream.com/'; focus='workflow automation and API connections'},
    @{name='Activepieces'; category='Automation'; pricing='Free'; link='https://www.activepieces.com/'; focus='open-source workflow automation'},
    @{name='Flowise'; category='Automation'; pricing='Free'; link='https://flowiseai.com/'; focus='visual AI workflow building'},
    @{name='Langflow'; category='Automation'; pricing='Free'; link='https://www.langflow.org/'; focus='agent and flow creation'},
    @{name='Dify'; category='Automation'; pricing='Free'; link='https://dify.ai/'; focus='AI app and workflow orchestration'},
    @{name='CrewAI'; category='Automation'; pricing='Free'; link='https://www.crewai.com/'; focus='multi-agent workflow building'},
    @{name='AutoGen'; category='Automation'; pricing='Free'; link='https://microsoft.github.io/autogen/'; focus='agent automation and orchestration'},
    @{name='AgentGPT'; category='Automation'; pricing='Freemium'; link='https://agentgpt.reworkd.ai/'; focus='goal-driven agent workflows'},
    @{name='Windmill'; category='Automation'; pricing='Freemium'; link='https://www.windmill.dev/'; focus='scripted workflow automation'},
    @{name='SuperAGI'; category='Automation'; pricing='Free'; link='https://superagi.com/'; focus='agent automation and orchestration'},

    @{name='Ada CX'; category='Customer Support'; pricing='Freemium'; link='https://www.ada.cx/'; focus='customer service automation'},
    @{name='Kustomer AI'; category='Customer Support'; pricing='Freemium'; link='https://www.kustomer.com/'; focus='customer service and agent assistance'},
    @{name='Talkdesk AI'; category='Customer Support'; pricing='Freemium'; link='https://www.talkdesk.com/'; focus='contact center automation'},
    @{name='LivePerson'; category='Customer Support'; pricing='Freemium'; link='https://www.liveperson.com/'; focus='messaging and support automation'},
    @{name='Cresta'; category='Customer Support'; pricing='Freemium'; link='https://cresta.com/'; focus='contact center intelligence'},
    @{name='Cognigy'; category='Customer Support'; pricing='Freemium'; link='https://www.cognigy.com/'; focus='enterprise conversational automation'},
    @{name='Certainly'; category='Customer Support'; pricing='Freemium'; link='https://www.certainly.io/'; focus='support and sales chatbots'},
    @{name='Kommunicate'; category='Customer Support'; pricing='Freemium'; link='https://www.kommunicate.io/'; focus='support messaging and chatbot flows'},
    @{name='Gorgias AI'; category='Customer Support'; pricing='Freemium'; link='https://www.gorgias.com/'; focus='ecommerce support automation'},
    @{name='Gladly AI'; category='Customer Support'; pricing='Freemium'; link='https://www.gladly.ai/'; focus='customer service workflows'},

    @{name='Wix AI Website Builder'; category='Business / App Builder'; pricing='Freemium'; link='https://www.wix.com/ai-website-builder'; focus='AI-assisted site creation'},
    @{name='Dora AI'; category='Business / App Builder'; pricing='Freemium'; link='https://www.dora.run/ai'; focus='creative site and landing-page generation'},
    @{name='Relume'; category='Business / App Builder'; pricing='Freemium'; link='https://www.relume.io/'; focus='site planning and component generation'},
    @{name='Create'; category='Business / App Builder'; pricing='Freemium'; link='https://www.create.xyz/'; focus='AI-assisted app and site building'},
    @{name='Unicorn Platform AI'; category='Business / App Builder'; pricing='Freemium'; link='https://unicornplatform.com/'; focus='startup landing-page generation'},
    @{name='Studio AI'; category='Business / App Builder'; pricing='Freemium'; link='https://studio.design/ai'; focus='site design and visual building'},
    @{name='Pineapple Builder'; category='Business / App Builder'; pricing='Freemium'; link='https://pineapplebuilder.com/'; focus='small-business website building'},
    @{name='SITE123 AI Website Builder'; category='Business / App Builder'; pricing='Freemium'; link='https://www.site123.com/'; focus='website creation and publishing'},
    @{name='Base44'; category='Business / App Builder'; pricing='Freemium'; link='https://base44.com/'; focus='AI-assisted business app building'},
    @{name='Mixo'; category='Business / App Builder'; pricing='Freemium'; link='https://www.mixo.io/'; focus='startup landing-page and idea validation'},

    @{name='Audyo'; category='Audio'; pricing='Freemium'; link='https://www.audyo.ai/'; focus='voice creation and spoken-content production'},
    @{name='TurboScribe'; category='Audio'; pricing='Freemium'; link='https://turboscribe.ai/'; focus='audio transcription and speech-to-text workflows'},

    @{name='Chatbase'; category='Customer Support'; pricing='Freemium'; link='https://www.chatbase.co/'; focus='support chatbot creation and website assistance'},
    @{name='Botsonic'; category='Customer Support'; pricing='Freemium'; link='https://writesonic.com/botsonic'; focus='custom support chatbot workflows'},
    @{name='Voiceflow'; category='Customer Support'; pricing='Freemium'; link='https://www.voiceflow.com/'; focus='chatbot and support conversation building'},
    @{name='Landbot AI'; category='Customer Support'; pricing='Freemium'; link='https://landbot.io/ai-chatbot'; focus='AI chat automation for support and lead capture'},
    @{name='Manychat AI'; category='Customer Support'; pricing='Freemium'; link='https://manychat.com/'; focus='messaging automation and AI conversation flows'},
    @{name='Crisp AI'; category='Customer Support'; pricing='Freemium'; link='https://crisp.chat/en/ai/'; focus='website support chat and AI assistance'},
    @{name='Netomi'; category='Customer Support'; pricing='Freemium'; link='https://www.netomi.com/'; focus='customer service automation and ticket reduction'},
    @{name='Mindsay'; category='Customer Support'; pricing='Freemium'; link='https://www.mindsay.com/'; focus='conversational customer support automation'},
    @{name='Rep AI'; category='Customer Support'; pricing='Freemium'; link='https://www.hellorep.ai/'; focus='AI shopping assistant and support chat'},

    @{name='Venice AI'; category='General Purpose'; pricing='Freemium'; link='https://venice.ai/'; focus='general AI chat and assistant workflows'},
    @{name='Genspark'; category='General Purpose'; pricing='Freemium'; link='https://www.genspark.ai/'; focus='general AI assistance and search-like answers'},
    @{name='ChatLLM'; category='General Purpose'; pricing='Freemium'; link='https://chatllm.abacus.ai/'; focus='multi-model general chat assistance'},
    @{name='Jan'; category='General Purpose'; pricing='Free'; link='https://jan.ai/'; focus='desktop AI chat and local assistant usage'},
    @{name='LibreChat'; category='General Purpose'; pricing='Free'; link='https://www.librechat.ai/'; focus='open-source general AI chat workflows'},
    @{name='ChatHub'; category='General Purpose'; pricing='Freemium'; link='https://chathub.gg/'; focus='multi-model AI chat aggregation'},

    @{name='Notta'; category='Productivity'; pricing='Freemium'; link='https://www.notta.ai/'; focus='meeting capture, notes, and follow-up organization'},

    @{name='Afforai'; category='Research'; pricing='Freemium'; link='https://afforai.com/'; focus='research management and document understanding'},
    @{name='Petal'; category='Research'; pricing='Freemium'; link='https://www.petal.org/'; focus='document understanding and research reading'},
    @{name='Scinapse'; category='Research'; pricing='Free'; link='https://www.scinapse.io/'; focus='academic paper discovery and search'},
    @{name='R Discovery'; category='Research'; pricing='Freemium'; link='https://www.rdiscovery.com/'; focus='research paper discovery and reading'},
    @{name='Genei'; category='Research'; pricing='Freemium'; link='https://www.genei.io/'; focus='research summarization and reading acceleration'},
    @{name='Avidnote'; category='Research'; pricing='Freemium'; link='https://avidnote.com/'; focus='research writing and literature workflows'},
    @{name='SciSummary'; category='Research'; pricing='Freemium'; link='https://scisummary.com/'; focus='paper summarization and scientific reading'},
    @{name='Undermind'; category='Research'; pricing='Freemium'; link='https://www.undermind.ai/'; focus='AI research search and paper discovery'}
)

$existing = @{}
foreach ($tool in $tools) {
    if ($tool -and $tool.name) { $existing[$tool.name.ToLowerInvariant()] = $true }
}

$generated = @()
foreach ($seed in $seeds) {
    if ($existing.ContainsKey($seed.name.ToLowerInvariant())) { continue }
    $generated += [PSCustomObject]@{
        name = $seed.name
        category = $seed.category
        description = BuildDescription $seed.name $seed.focus
        useCases = BuildUseCases $seed.name $seed.category
        howToUse = BuildHowTo $seed.name $seed.link
        features = BuildFeatures $seed.name $seed.category $seed.link $seed.pricing
        rating = 4.4
        link = $seed.link
        image = ImageFromLink $seed.link
        guideurl = 'best-ai-tools-for-students.html'
        pricingAccess = $seed.pricing
    }
}

$allTools = @($tools + $generated)
$out = 'const tools = ' + ($allTools | ConvertTo-Json -Depth 8) + ';'
Set-Content -Path $dataPath -Value $out -Encoding UTF8
$allTools | Group-Object category | Sort-Object Name | Select-Object Name,Count | Format-Table -AutoSize
"TOTAL=$($allTools.Count)"
"GENERATED=$($generated.Count)"
