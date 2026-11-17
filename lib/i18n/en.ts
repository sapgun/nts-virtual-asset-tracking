/**
 * English dictionary — the source language of the workbench UI.
 * `ko.ts` must keep the exact same key shape (enforced by `Dict`).
 * Evidence-state codes (OBSERVED / INFERRED / ATTRIBUTED / UNVERIFIED)
 * and capability states stay English in both locales, matching the
 * preserved Korean report's convention.
 */
export const en = {
  meta: {
    title: "NTS // Virtual Asset Intelligence Workbench",
    description:
      "Evidence-aware virtual asset investigation and learning workspace.",
  },
  shell: {
    brandTagline: "Evidence-aware chain intelligence",
    brandTitle:
      "Independent research prototype, not an official government service",
    labTitle: "Independent research prototype",
    lab: "LAB",
    languageAria: "Language",
    navAria: "Main navigation",
    nav: {
      command: {
        label: "Command",
        detail: "Choose an observation or investigation workflow",
      },
      investigate: {
        label: "Investigate",
        detail: "Interactive graph and evidence inspector",
      },
      evidence: {
        label: "Evidence",
        detail: "Evidence register and review history",
      },
      explore: {
        label: "Explorer",
        detail: "Public Ethereum address lookup",
      },
      bridge: {
        label: "Bridge",
        detail: "Bridge correlation learning lab",
      },
      cases: {
        label: "Cases",
        detail: "Curated case reconstructions",
      },
      academy: {
        label: "Academy",
        detail: "Evidence classification exercises",
      },
      research: {
        label: "Research",
        detail: "Preserved original technical report",
      },
    },
    search: {
      buttonAria: "Search workspace pages (Control or Command K)",
      buttonLabel: "Search workspace…",
      dialogTitle: "Find a workspace",
      closeAria: "Close workspace search",
      inputAria: "Filter workspace pages",
      inputPlaceholder: "Investigate, explorer, research…",
      noMatch: "No matching workspace. Try “research” or “explorer”.",
      mobileMenuAria: "All workspace pages",
    },
  },
  command: {
    eyebrow: "VIRTUAL ASSET INTELLIGENCE WORKBENCH",
    titleA: "Follow the money.",
    titleB: "Keep the uncertainty.",
    intro:
      "Explore public blockchain flows without collapsing an address, entity and natural person into the same claim.",
    startAddress: "Start with an address",
    readBrief: "Read the technical brief",
    proofFacts: "Facts remain facts",
    proofHypotheses: "Hypotheses stay explicit",
    proofAttribution: "Attribution needs provenance",
    scene: {
      seed: "SEED",
      flow: "FLOW",
      bridge: "BRIDGE",
      vasp: "VASP",
      observedCaption: "OBSERVED",
      observedWord: "transaction",
      inferredCaption: "INFERRED",
      inferredWord: "relationship",
    },
    startHere: "START HERE",
    oneJob: "One job at a time.",
    oneJobBody:
      "The interface now separates observation, investigation and reconstruction instead of exposing every tool at once.",
    launchers: {
      observe: {
        eyebrow: "OBSERVE",
        title: "Start from an address",
        body: "Load public Ethereum transactions first. Create hypotheses only after the observations are visible.",
        action: "Open explorer",
      },
      investigate: {
        eyebrow: "INVESTIGATE",
        title: "Open the workbench",
        body: "Trace a flow, inspect evidence state, draft hypotheses and export an integrity-hashed evidence packet.",
        action: "Open investigation",
      },
      reconstruct: {
        eyebrow: "RECONSTRUCT",
        title: "Replay a public case",
        body: "Walk through a curated case one evidence transition at a time instead of reading the conclusion first.",
        action: "Choose a case",
      },
    },
    status: {
      eyebrow: "SANDBOX SNAPSHOT",
      evidence: "EVIDENCE",
      evidenceUnit: "typed items",
      completeness: "COMPLETENESS",
      completenessUnit: "evidence quality context",
      cases: "CASES",
      casesUnit: "reconstruction packs",
    },
  },
  research: {
    eyebrow: "PRESERVED SOURCE",
    title: "Original technical intelligence brief · KR / EN",
    openStandalone: "Open standalone",
    langAria: "Report language",
  },
  investigate: {
    loadingTitle: "Loading observation…",
    unavailableTitle: "Observation unavailable",
    loadingBody: "Preparing the graph without adding identity claims.",
    openExplorer: "Open Explorer",
    backToCases: "Back to cases",
    seedAddress: "Seed address",
    network: "Network",
    mode: "Mode",
    publicObservation: "Public observation",
    syntheticDemo: "Synthetic demo",
    publicMode: "PUBLIC OBSERVATION",
    syntheticMode: "SYNTHETIC TRAINING",
    hideDetails: "Hide details",
    inspector: "Inspector",
    export: "Export",
    exporting: "Exporting…",
    exportAria: "Export evidence packet",
    graphAriaPublic: "Imported public observation",
    graphAriaSynthetic: "Synthetic training graph",
    prevStepAria: "Previous step",
    playAria: "Play reconstruction",
    pauseAria: "Pause playback",
    nextStepAria: "Next step",
    playbackLabel: "Trace playback",
    importedSnapshot: "Imported snapshot",
    trainingSnapshot: "Training snapshot",
    fullscreenAria: "Toggle fullscreen",
    noticeExported:
      "Evidence packet exported. The checksum is not a digital signature.",
    noticeExportFailed: "Export failed. Please retry.",
    noticeFullscreen:
      "Fullscreen is unavailable in this browser. The graph can still be panned and zoomed.",
    noticeHypothesis:
      "Hypothesis added to this session and the next export.",
    logImportTitle: "Public observation opened",
    logImportDetail:
      "Session-scoped dataset. No identity attribution was added.",
    logExportTitle: "Evidence packet exported",
    logExportDetail:
      "Graph, hypotheses and session activity included. SHA-256 checksum; not a digital signature.",
    logNodeTitle: "Node inspected",
    logStepTitle: "Playback moved",
    logStepDetail: "Step {value} of {max}",
    logPlayTitle: "Playback started",
    logPlayDetail:
      "User-controlled reconstruction, not live chain streaming.",
    logHypothesisTitle: "Analyst draft created",
    errorNoImport:
      "No imported observation is available in this browser tab. Start from Explorer.",
    errorInvalidImport: "Invalid imported observation.",
    errorInvalidDraft:
      "The imported draft does not contain a valid Ethereum observation.",
    errorLoadObservation: "Unable to load this observation.",
    packetNoticePublic:
      "Public explorer observations. Not an identity attribution or legal certification.",
    packetNoticeSynthetic:
      "Synthetic training data. Not real investigative evidence.",
    packetIntegrityNote:
      "Hash provides tamper detection for this exported packet. It is not a digital signature or legal certification.",
  },
  inspector: {
    title: "Inspector",
    subtitle: "Node details, evidence and intelligence",
    closeAria: "Close inspector",
    tabsAria: "Inspector sections",
    tabNode: "Node",
    tabEvidence: "Evidence",
    tabAnalysis: "Analysis",
    tabActivity: "Activity",
    copyAria: "Copy node identifier",
    copied: "Node identifier copied",
    copyUnavailable:
      "Clipboard unavailable. Select and copy the identifier below.",
    trainingFixture: "training fixture",
    importedObservation: "imported observation",
    demoSupport: "Demo support",
    sourceSupport: "Source support",
    notCalibrated: "Not a calibrated identity or guilt probability.",
    incomingLinks: "Incoming links",
    outgoingLinks: "Outgoing links",
    caseEvidence: "Case evidence",
    description: "Description",
    tags: "Tags",
    noTags: "No tags",
    activeHypothesis: "Active hypothesis",
    alternativeExplanations: "Alternative explanations ({count})",
    viewCaseEvidence: "View case evidence",
    evidenceNote:
      "Case-level evidence. These items are not automatically proof about the selected node.",
    openSource: "Open source",
    noEvidence: "No evidence registered for this observation.",
    analysisNote:
      "Rule-based assistance. No external language model is connected.",
    qualityBreakdown: "Evidence quality breakdown",
    activityNote: "Session activity only; not a durable audit log.",
    kindWallet: "wallet",
    kindExchange: "exchange",
    kindBridge: "bridge",
    kindMixer: "mixer",
    kindContract: "contract",
  },
  topology: {
    title: "Transaction Topology",
    nodesRelationships: "{nodes} nodes · {edges} visible relationships",
    controlsAria: "Graph controls",
    zoomInTitle: "Zoom in (+)",
    zoomInAria: "Zoom in",
    zoomOutTitle: "Zoom out (-)",
    zoomOutAria: "Zoom out",
    resetTitle: "Reset view (0)",
    resetAria: "Reset graph view",
    depthTitle: "Toggle spatial background",
    depthAria: "Spatial background",
    graphAria: "Interactive transaction graph",
    nodeAria: "{label}, {state}. Inspect node.",
    seedAddress: "Seed address",
    identityAttribution: "Identity attribution",
    notEstablished: "Not established",
    signature: "TRACE. CONNECT. VERIFY.",
    signatureNote: "Relationships are not identities.",
    zoomHint: "Drag to pan · + / − to zoom",
  },
  evidence: {
    eyebrow: "EVIDENCE ROOM",
    title: "Build the case without collapsing uncertainty.",
    intro:
      "Every claim carries provenance, confidence and an explicit evidence state.",
    case: "Case",
    completeness: "Completeness",
    hypotheses: "Hypotheses",
    detailEyebrow: "EVIDENCE DETAIL",
    closeDetailAria: "Close evidence detail",
    detailNote:
      "Confidence is an analyst judgment on this synthetic dataset, not a measurement of ground truth. State {state} means this item is treated as {stateWord} — it does not upgrade the rest of the case on its own.",
    stateWordObserved: "directly observed",
    stateWordInferred: "inferred from a pattern",
    stateWordAttributed: "attributed from a public source",
    stateWordUnverified: "not yet verified",
    hypothesisRegister: "HYPOTHESIS REGISTER",
    quality: {
      eyebrow: "EVIDENCE QUALITY",
      reproducibility: "Reproducibility",
      sourceDiversity: "Source diversity",
      attributionSupport: "Attribution support",
      counterEvidence: "Counter-evidence",
      gapBurden: "Unresolved gap burden",
      note: "This score measures evidence completeness and review discipline. It is not a guilt, identity, or enforcement score.",
    },
    audit: {
      eyebrow: "TRANSITION LEDGER",
      title: "Evidence state changes are explicit events.",
      recorded: "{count} recorded",
    },
    activity: {
      eyebrow: "ACTIVITY TIMELINE",
      events: "{count} events",
      empty: "No activity recorded in this session.",
    },
    builder: {
      eyebrow: "HYPOTHESIS BUILDER",
      subtitle: "Evidence-linked analyst draft",
      close: "Close",
      newHypothesis: "New hypothesis +",
      claim: "Claim",
      claimPlaceholder:
        "What relationship or explanation are you testing?",
      method: "Method",
      methodPlaceholder: "e.g. temporal + convergence heuristic",
      supportingEvidence: "Supporting evidence",
      counterEvidence: "Counter-evidence / alternative explanation",
      counterPlaceholder: "What else could explain the same pattern?",
      draftConfidence: "Draft confidence",
      saveDraft: "Save analyst draft",
      unspecifiedHypothesis: "Unspecified hypothesis",
      methodNotDocumented: "method not documented",
      noCounterEvidence: "No counter-evidence documented yet",
    },
    copilot: {
      eyebrow: "INVESTIGATOR COPILOT",
      subtitle: "Deterministic cited-context MVP · no external model",
      status: "LOCAL",
      promptExplainNode: "Explain this node",
      promptConfidence: "Why this confidence?",
      promptMissing: "What evidence is missing?",
      promptNext: "What should I inspect next?",
      analyzing: "Analyzing…",
      citedContext: "CITED CONTEXT",
      sourceLink: "source",
      requestFailed: "Investigator request failed",
      genericFailed: "Request failed",
      answers: {
        explainNode:
          "{label} is currently classified as {state} at {confidence}% confidence. {description} The current hypothesis is: “{claim}”",
        explainConfidence:
          "The confidence reflects the evidence class and current analytical support, not identity certainty. This context contains {observed} observed item(s), {attributed} attributed item(s), and the active hypothesis is at {confidence}%. Confidence should increase only when independent evidence reduces plausible alternatives.",
        missingWithGaps:
          "The largest explicit gap is represented by {titles}. Preserve it as UNVERIFIED until the required evidence class is independently obtained.",
        missingNone:
          "No explicit UNVERIFIED evidence item is registered. Review counter-evidence, provenance diversity, and whether an independent evidence class is still missing before promoting any claim.",
        nextExchange:
          "The next useful step is not automatically another graph hop. Identify what independently obtainable account-level evidence would be required before moving from service attribution toward account attribution.",
        nextObserved:
          "Keep the next step observation-first: inspect the next public-chain hop, preserve source provenance, then create a separate hypothesis only if a reproducible analytical signal appears.",
        nextDefault:
          "Compare the current inference against an independent source and record at least one competing explanation before changing the evidence state.",
        cautionIdentity:
          "Transaction relationships do not establish natural-person identity.",
        cautionConfidence:
          "Confidence is an analytical support level, not a probability of guilt.",
      },
    },
  },
  imported: {
    seedLabel: "Imported Seed",
    seedDescription:
      "Public Ethereum address imported from Graph Explorer. Address ownership is not inferred.",
    counterpartyDescription:
      "Counterparty address directly observed in the imported public transaction set. No entity or person attribution is attached.",
    txTitle: "Observed transaction {hash}",
    txDetail:
      "Public-chain transaction normalized by {provider}. From {from} to {to}.",
    unknown: "unknown",
    contractCreation: "contract creation/unknown",
    hypothesisClaim:
      "No ownership or entity hypothesis has been created for this imported dataset.",
    hypothesisMethod: "observation-only import",
    counter1:
      "Counterparty relationships may represent services, contracts, routers, or unrelated controllers.",
    counter2:
      "Public transactions alone do not establish natural-person identity.",
  },
  explorer: {
    eyebrow: "GRAPH EXPLORER · PUBLIC DATA",
    title: "Observe first. Infer later.",
    intro:
      "Load public Ethereum transaction facts through the normalized chain adapter. This surface intentionally stops before entity or natural-person attribution.",
    searchEyebrow: "PUBLIC CHAIN OBSERVATION",
    searchTitle: "Ethereum address",
    inputAria: "Ethereum address",
    load: "Load transactions",
    loading: "Loading…",
    note: "This view reads public ledger data only. Transaction proximity does not establish common ownership or a natural-person identity.",
    errorInvalidAddress: "Enter a valid 0x-prefixed Ethereum address.",
    errorLoad: "Unable to load public transactions.",
    errorGeneric: "Request failed.",
    resultsEyebrow: "NORMALIZED TRANSACTIONS",
    transactionsLoaded: "{count} transactions loaded",
    promote: "Promote to investigation",
    empty: "No transactions returned for this address.",
    provenance: "Provider provenance:",
    provenanceSource: "Blockscout API source",
    methodFallback: "transaction",
    colFrom: "FROM",
    colTo: "TO",
    colValue: "VALUE",
    colBlock: "BLOCK",
    colTime: "TIME",
    draftTitle: "Public Ethereum Observation",
  },
  bridge: {
    eyebrow: "BRIDGE INTELLIGENCE LAB",
    title:
      "Message-key evidence and heuristic correlation are not the same thing.",
    intro:
      "Compare a deterministic protocol-message correspondence with a time/value-only candidate match. Both can be useful, but they must enter the evidence model differently.",
    tabDeterministic: "Deterministic message key",
    tabHeuristic: "Time / value heuristic",
    protocol: "PROTOCOL",
    tx: "TX",
    asset: "ASSET",
    messageKey: "MESSAGE KEY",
    notExposed: "not exposed",
    whyMatch: "WHY THIS MATCH",
    notProve: "WHAT IT DOES NOT PROVE",
    modeDeterministic: "DETERMINISTIC KEY",
    modeHeuristic: "HEURISTIC",
    modeNoMatch: "NO MATCH",
    directionSource: "SOURCE",
    directionDestination: "DESTINATION",
  },
  cases: {
    eyebrow: "CASE FILES",
    title: "Reconstruct investigations, not just outcomes.",
    intro:
      "Curated public cases become playable sequences that preserve the difference between chain facts and attribution evidence.",
    start: "Start reconstruction",
    player: {
      back: "Case Files",
      eyebrow: "CASE RECONSTRUCTION",
      sourceBoundary: "SOURCE BOUNDARY",
      stepLabel: "STEP {step} · {phase}",
      caseVisual: "CASE",
      summary: "SUMMARY",
      supports: "WHAT THIS SUPPORTS",
      limitation: "LIMITATION",
      stepConfidence: "Step confidence",
      previous: "Previous",
      pause: "Pause",
      replay: "Replay",
      autoPlay: "Auto play",
      nextEvidence: "Next evidence",
      artifacts: "EVIDENCE ARTIFACTS",
      rule: "RULE",
      ruleBody:
        "An evidence state describes the support class. It is not a probability of guilt or identity.",
    },
  },
  academy: {
    eyebrow: "ACADEMY",
    title: "Learn the boundary, not just the tool.",
    intro:
      "One short field exercise at a time. The same evidence model used in the workbench is used here.",
    tracks: {
      foundation: {
        title: "Foundation",
        body: "Facts, provenance and evidence states",
      },
      tracing: {
        title: "Tracing",
        body: "UTXO, EVM and flow reconstruction",
      },
      privacy: {
        title: "Privacy",
        body: "Mixers, privacy systems and uncertainty",
      },
      crosschain: {
        title: "Cross-chain",
        body: "Bridge events and correlation",
      },
    },
    challenge: {
      exercise: "FIELD EXERCISE",
      whyMatters: "WHY THIS MATTERS",
      classifyTitle: "Classify the claim before acting on it.",
      classifyBody:
        "The training loop uses the same evidence states as the investigation workspace.",
      correct: "CORRECT",
      review: "REVIEW",
      correctTitle: "You kept the evidence boundary intact.",
      reviewTitle: "The claim jumped an evidence layer.",
      sessionScore: "Session score",
      restart: "Restart session",
      next: "Next exercise",
    },
  },
  capability: {
    eyebrow: "CAPABILITY REGISTRY",
    title: "Know exactly what the system can and cannot do.",
    active: "active",
    limited: "limited",
    disabled: "disabled",
  },
  notFound: {
    title: "Page not found",
    body: "The page you requested does not exist in this workbench.",
    back: "Back to Command",
  },
  api: {
    chain: {
      unsupported: "unsupported chain",
      invalidAddress: "invalid EVM address",
      adapterFailed: "chain adapter failed",
      baseUrlMissing: "Blockscout base URL is not configured",
    },
    investigator: {
      questionRequired: "a supported question is required",
      contextRequired: "valid investigator context is required",
    },
  },
};
