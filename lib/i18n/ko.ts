import type { Dict } from "./index";

/**
 * Korean dictionary. Key shape must match `en` exactly (enforced by `Dict`).
 * Glossary (aligned with the preserved report + PR #9):
 * - evidence state codes stay English (OBSERVED / INFERRED / ATTRIBUTED /
 *   UNVERIFIED); state *words* in prose are translated.
 * - VASP, CARF, KYT, Reactor, Chainalysis, TRM, Blockscout stay as-is.
 * - 믹서 / 브리지 / 필 체인 / 패스스루 follow the report's usage.
 * - Command (home) → 지휘. The other nav labels are 2–3 character nouns
 *   (조사 / 증거 / 탐색기 / 브리지 / 사건 / 아카데미 / 보고서); 지휘 matches
 *   that pattern and the intel command-centre theme. "홈" was rejected as
 *   too generic, "사령부" as too long and too militaristic.
 */
export const ko: Dict = {
  meta: {
    title: "NTS // 가상자산 인텔리전스 워크벤치",
    description: "증거 기반 가상자산 조사·학습 워크벤치",
  },
  shell: {
    brandTagline: "증거 기반 체인 인텔리전스",
    brandTitle: "독립 연구 프로토타입이며, 공식 정부 서비스가 아닙니다",
    labTitle: "독립 연구 프로토타입",
    lab: "LAB",
    languageAria: "언어",
    navAria: "주요 탐색",
    nav: {
      command: {
        label: "지휘",
        detail: "관찰 또는 조사 워크플로 선택",
      },
      investigate: {
        label: "조사",
        detail: "대화형 그래프와 증거 인스펙터",
      },
      evidence: {
        label: "증거",
        detail: "증거 등록부와 검토 이력",
      },
      explore: {
        label: "탐색기",
        detail: "공개 이더리움 주소 조회",
      },
      bridge: {
        label: "브리지",
        detail: "브리지 상관관계 학습 랩",
      },
      cases: {
        label: "사건",
        detail: "선별된 사건 재구성",
      },
      academy: {
        label: "아카데미",
        detail: "증거 분류 연습",
      },
      research: {
        label: "보고서",
        detail: "보존된 원본 기술 보고서",
      },
      calculator: {
        label: "세액 계산기",
        detail: "시나리오별 가상자산 세액 추정치",
      },
    },
    search: {
      buttonAria: "워크벤치 페이지 검색 (Control 또는 Command K)",
      buttonLabel: "워크벤치 검색…",
      dialogTitle: "워크벤치 찾기",
      closeAria: "워크벤치 검색 닫기",
      inputAria: "워크벤치 페이지 필터",
      inputPlaceholder: "조사, 탐색기, 보고서…",
      noMatch: "일치하는 워크벤치가 없습니다. “보고서”나 “탐색기”를 입력해 보세요.",
      mobileMenuAria: "모든 워크벤치 페이지",
    },
  },
  command: {
    eyebrow: "가상자산 인텔리전스 워크벤치",
    titleA: "돈의 흐름을 따라가세요.",
    titleB: "불확실성은 남겨두세요.",
    intro:
      "주소, 실체, 자연인을 하나의 주장으로 뭉개지 않고 공개 블록체인 흐름을 탐색하세요.",
    startAddress: "주소부터 시작하기",
    readBrief: "기술 보고서 읽기",
    proofFacts: "사실은 사실대로",
    proofHypotheses: "가설은 명시적으로",
    proofAttribution: "귀속에는 출처가 필요합니다",
    scene: {
      seed: "시드",
      flow: "흐름",
      bridge: "브리지",
      vasp: "VASP",
      observedCaption: "관찰됨",
      observedWord: "트랜잭션",
      inferredCaption: "추론됨",
      inferredWord: "관계",
    },
    startHere: "여기서 시작",
    oneJob: "한 번에 한 가지 일씩.",
    oneJobBody:
      "이제 인터페이스는 모든 도구를 한 번에 보여주지 않고 관찰, 조사, 재구성을 나눕니다.",
    launchers: {
      observe: {
        eyebrow: "관찰",
        title: "주소부터 시작하기",
        body: "먼저 공개 이더리움 트랜잭션을 불러오세요. 관찰이 보인 뒤에야 가설을 세우세요.",
        action: "탐색기 열기",
      },
      investigate: {
        eyebrow: "조사",
        title: "워크벤치 열기",
        body: "흐름을 추적하고, 증거 상태를 살펴보고, 가설 초안을 쓰고, 무결성 해시가 담긴 증거 패킷을 내보내세요.",
        action: "조사 열기",
      },
      reconstruct: {
        eyebrow: "재구성",
        title: "공개 사건 다시 보기",
        body: "결론부터 읽지 말고, 선별된 사건을 증거 전이 하나씩 따라가며 살펴보세요.",
        action: "사건 선택하기",
      },
    },
    status: {
      eyebrow: "샌드박스 스냅샷",
      evidence: "증거",
      evidenceUnit: "유형별 항목",
      completeness: "완전성",
      completenessUnit: "증거 품질 맥락",
      cases: "사건",
      casesUnit: "재구성 팩",
    },
  },
  research: {
    eyebrow: "보존된 원문",
    title: "원본 기술 인텔리전스 보고서 · 한/영",
    openStandalone: "별도 창으로 열기",
    langAria: "보고서 언어",
  },
  investigate: {
    loadingTitle: "관찰 불러오는 중…",
    unavailableTitle: "관찰을 불러올 수 없습니다",
    loadingBody: "신원 주장을 더하지 않고 그래프를 준비하고 있습니다.",
    openExplorer: "탐색기 열기",
    backToCases: "사건 목록으로",
    seedAddress: "시드 주소",
    network: "네트워크",
    mode: "모드",
    publicObservation: "공개 관찰",
    syntheticDemo: "합성 데모",
    publicMode: "공개 관찰",
    syntheticMode: "합성 학습",
    hideDetails: "세부정보 숨기기",
    inspector: "인스펙터",
    export: "내보내기",
    exporting: "내보내는 중…",
    exportAria: "증거 패킷 내보내기",
    graphAriaPublic: "가져온 공개 관찰",
    graphAriaSynthetic: "합성 학습 그래프",
    prevStepAria: "이전 단계",
    playAria: "재구성 재생",
    pauseAria: "재생 일시정지",
    nextStepAria: "다음 단계",
    playbackLabel: "추적 재생",
    importedSnapshot: "가져온 스냅샷",
    trainingSnapshot: "학습 스냅샷",
    fullscreenAria: "전체 화면 전환",
    noticeExported:
      "증거 패킷을 내보냈습니다. 체크섬은 전자서명이 아닙니다.",
    noticeExportFailed: "내보내기에 실패했습니다. 다시 시도해 주세요.",
    noticeFullscreen:
      "이 브라우저에서는 전체 화면을 사용할 수 없습니다. 그래프 이동과 확대는 계속할 수 있습니다.",
    noticeHypothesis: "가설이 이 세션과 다음 내보내기에 추가되었습니다.",
    logImportTitle: "공개 관찰을 열었습니다",
    logImportDetail: "세션 범위 데이터셋입니다. 신원 귀속은 추가되지 않았습니다.",
    logExportTitle: "증거 패킷 내보냄",
    logExportDetail:
      "그래프, 가설, 세션 활동이 포함되었습니다. SHA-256 체크섬이며 전자서명이 아닙니다.",
    logNodeTitle: "노드를 살펴봄",
    logStepTitle: "재생 위치 이동",
    logStepDetail: "{value}단계 / 전체 {max}단계",
    logPlayTitle: "재생 시작",
    logPlayDetail: "사용자가 제어하는 재구성이며, 실시간 체인 스트리밍이 아닙니다.",
    logHypothesisTitle: "분석가 초안 작성됨",
    errorNoImport:
      "이 브라우저 탭에 가져온 관찰이 없습니다. 탐색기에서 시작하세요.",
    errorInvalidImport: "가져온 관찰이 유효하지 않습니다.",
    errorInvalidDraft: "가져온 초안에 유효한 이더리움 관찰이 없습니다.",
    errorLoadObservation: "이 관찰을 불러올 수 없습니다.",
    packetNoticePublic:
      "공개 탐색기 관찰입니다. 신원 귀속이나 법적 증명이 아닙니다.",
    packetNoticeSynthetic:
      "합성 학습 데이터입니다. 실제 수사 증거가 아닙니다.",
    packetIntegrityNote:
      "해시는 이 내보낸 패킷의 위변조를 감지합니다. 전자서명이나 법적 증명이 아닙니다.",
  },
  inspector: {
    title: "인스펙터",
    subtitle: "노드 세부정보, 증거, 인텔리전스",
    closeAria: "인스펙터 닫기",
    tabsAria: "인스펙터 섹션",
    tabNode: "노드",
    tabEvidence: "증거",
    tabAnalysis: "분석",
    tabActivity: "활동",
    copyAria: "노드 식별자 복사",
    copied: "노드 식별자를 복사했습니다",
    copyUnavailable: "클립보드를 사용할 수 없습니다. 아래 식별자를 선택해서 복사하세요.",
    trainingFixture: "학습용 픽스처",
    importedObservation: "가져온 관찰",
    demoSupport: "데모 근거",
    sourceSupport: "출처 근거",
    notCalibrated: "보정된 신원 또는 유죄 확률이 아닙니다.",
    incomingLinks: "들어오는 연결",
    outgoingLinks: "나가는 연결",
    caseEvidence: "사건 증거",
    description: "설명",
    tags: "태그",
    noTags: "태그 없음",
    activeHypothesis: "활성 가설",
    alternativeExplanations: "대안 설명 ({count}개)",
    viewCaseEvidence: "사건 증거 보기",
    evidenceNote:
      "사건 수준 증거입니다. 이 항목들이 선택한 노드에 대한 증명이 자동으로 되는 것은 아닙니다.",
    openSource: "출처 열기",
    noEvidence: "이 관찰에 등록된 증거가 없습니다.",
    analysisNote: "규칙 기반 보조입니다. 외부 언어 모델은 연결되어 있지 않습니다.",
    qualityBreakdown: "증거 품질 분석",
    activityNote: "세션 활동만 표시합니다. 영구 감사 로그가 아닙니다.",
    kindWallet: "지갑",
    kindExchange: "거래소",
    kindBridge: "브리지",
    kindMixer: "믹서",
    kindContract: "컨트랙트",
  },
  topology: {
    title: "트랜잭션 토폴로지",
    nodesRelationships: "노드 {nodes}개 · 보이는 관계 {edges}개",
    controlsAria: "그래프 컨트롤",
    zoomInTitle: "확대 (+)",
    zoomInAria: "확대",
    zoomOutTitle: "축소 (-)",
    zoomOutAria: "축소",
    resetTitle: "보기 초기화 (0)",
    resetAria: "그래프 보기 초기화",
    depthTitle: "공간 배경 전환",
    depthAria: "공간 배경",
    graphAria: "대화형 트랜잭션 그래프",
    nodeAria: "{label}, {state}. 노드 살펴보기.",
    seedAddress: "시드 주소",
    identityAttribution: "신원 귀속",
    notEstablished: "확립되지 않음",
    signature: "추적. 연결. 검증.",
    signatureNote: "관계가 곧 신원은 아닙니다.",
    zoomHint: "드래그해서 이동 · + / − 로 확대/축소",
  },
  evidence: {
    eyebrow: "증거실",
    title: "불확실성을 뭉개지 않고 사건을 구축하세요.",
    intro: "모든 주장은 출처, 신뢰도, 명시적인 증거 상태를 갖습니다.",
    case: "사건",
    completeness: "완전성",
    hypotheses: "가설",
    detailEyebrow: "증거 상세",
    closeDetailAria: "증거 상세 닫기",
    detailNote:
      "신뢰도는 이 합성 데이터셋에 대한 분석가의 판단이며, 실제 진실을 측정한 값이 아닙니다. 상태 {state}는 이 항목이 {stateWord}로 취급된다는 뜻입니다. 이것만으로 사건의 나머지 부분이 격상되지는 않습니다.",
    stateWordObserved: "직접 관찰된 것",
    stateWordInferred: "패턴에서 추론된 것",
    stateWordAttributed: "공개 출처에서 귀속된 것",
    stateWordUnverified: "아직 검증되지 않은 것",
    hypothesisRegister: "가설 등록부",
    quality: {
      eyebrow: "증거 품질",
      reproducibility: "재현 가능성",
      sourceDiversity: "출처 다양성",
      attributionSupport: "귀속 근거",
      counterEvidence: "반증",
      gapBurden: "미해결 공백 부담",
      note: "이 점수는 증거 완전성과 검토 규율을 측정합니다. 유죄, 신원, 집행 점수가 아닙니다.",
    },
    audit: {
      eyebrow: "전이 장부",
      title: "증거 상태 변경은 명시적인 사건입니다.",
      recorded: "{count}건 기록됨",
    },
    activity: {
      eyebrow: "활동 타임라인",
      events: "{count}개 사건",
      empty: "이 세션에 기록된 활동이 없습니다.",
    },
    builder: {
      eyebrow: "가설 빌더",
      subtitle: "증거 연결 분석가 초안",
      close: "닫기",
      newHypothesis: "새 가설 +",
      claim: "주장",
      claimPlaceholder: "어떤 관계나 설명을 검증하고 있나요?",
      method: "방법",
      methodPlaceholder: "예: 시간 + 수렴 휴리스틱",
      supportingEvidence: "지지 증거",
      counterEvidence: "반증 / 대안 설명",
      counterPlaceholder: "같은 패턴을 달리 설명할 수 있는 것은 무엇인가요?",
      draftConfidence: "초안 신뢰도",
      saveDraft: "분석가 초안 저장",
      unspecifiedHypothesis: "지정되지 않은 가설",
      methodNotDocumented: "방법이 기록되지 않음",
      noCounterEvidence: "기록된 반증이 아직 없습니다",
    },
    copilot: {
      eyebrow: "수사관 코파일럿",
      subtitle: "결정적 인용 컨텍스트 MVP · 외부 모델 없음",
      status: "로컬",
      promptExplainNode: "이 노드 설명하기",
      promptConfidence: "왜 이 신뢰도인가요?",
      promptMissing: "어떤 증거가 부족한가요?",
      promptNext: "다음에 무엇을 살펴봐야 하나요?",
      analyzing: "분석 중…",
      citedContext: "인용된 컨텍스트",
      sourceLink: "출처",
      requestFailed: "수사관 요청에 실패했습니다",
      genericFailed: "요청에 실패했습니다",
      answers: {
        explainNode:
          "{label}은(는) 현재 {confidence}% 신뢰도로 {state}(으)로 분류되어 있습니다. {description} 현재 가설: “{claim}”",
        explainConfidence:
          "신뢰도는 신원 확실성이 아니라 증거 종류와 현재 분석 근거를 반영합니다. 이 컨텍스트에는 관찰된 항목 {observed}개, 귀속된 항목 {attributed}개가 있고, 활성 가설은 {confidence}%입니다. 신뢰도는 독립적인 증거가 그럴듯한 대안을 줄일 때만 올라가야 합니다.",
        missingWithGaps:
          "가장 큰 명시적 공백은 {titles}입니다. 필요한 증거 종류를 독립적으로 확보할 때까지 UNVERIFIED로 유지하세요.",
        missingNone:
          "명시적으로 UNVERIFIED인 증거 항목이 등록되어 있지 않습니다. 주장을 격상하기 전에 반증, 출처 다양성, 독립적인 증거 종류가 여전히 부족한지 검토하세요.",
        nextExchange:
          "다음으로 유용한 단계가 자동으로 또 하나의 그래프 이동이 되는 것은 아닙니다. 서비스 귀속에서 계정 귀속으로 넘어가기 전에 독립적으로 얻을 수 있는 계정 수준 증거가 무엇인지 먼저 파악하세요.",
        nextObserved:
          "다음 단계도 관찰 우선으로 유지하세요. 다음 공개 체인 이동을 살펴보고, 출처를 보존한 뒤, 재현 가능한 분석 신호가 나타날 때만 별도의 가설을 세우세요.",
        nextDefault:
          "현재 추론을 독립적인 출처와 비교하고, 증거 상태를 바꾸기 전에 최소 하나의 경쟁 설명을 기록하세요.",
        cautionIdentity: "트랜잭션 관계가 자연인의 신원을 확립하지는 않습니다.",
        cautionConfidence: "신뢰도는 분석적 근거 수준이지, 유죄 확률이 아닙니다.",
      },
    },
  },
  imported: {
    seedLabel: "가져온 시드",
    seedDescription:
      "그래프 탐색기에서 가져온 공개 이더리움 주소입니다. 주소 소유권은 추론하지 않습니다.",
    counterpartyDescription:
      "가져온 공개 트랜잭션 집합에서 직접 관찰된 상대방 주소입니다. 실체나 개인 귀속은 붙어 있지 않습니다.",
    txTitle: "관찰된 트랜잭션 {hash}",
    txDetail: "{provider}가 정규화한 공개 체인 트랜잭션. {from}에서 {to}로.",
    unknown: "알 수 없음",
    contractCreation: "컨트랙트 생성/알 수 없음",
    hypothesisClaim: "이 가져온 데이터셋에는 소유권이나 실체 가설이 아직 없습니다.",
    hypothesisMethod: "관찰 전용 가져오기",
    counter1:
      "상대방 관계는 서비스, 컨트랙트, 라우터, 무관한 통제자일 수 있습니다.",
    counter2: "공개 트랜잭션만으로는 자연인 신원을 확립할 수 없습니다.",
  },
  explorer: {
    eyebrow: "그래프 탐색기 · 공개 데이터",
    title: "먼저 관찰하고, 나중에 추론하세요.",
    intro:
      "정규화된 체인 어댑터를 통해 공개 이더리움 트랜잭션 사실을 불러오세요. 이 화면은 실체나 자연인 귀속 앞에서 의도적으로 멈춥니다.",
    searchEyebrow: "공개 체인 관찰",
    searchTitle: "이더리움 주소",
    inputAria: "이더리움 주소",
    load: "트랜잭션 불러오기",
    loading: "불러오는 중…",
    note: "이 화면은 공개 원장 데이터만 읽습니다. 트랜잭션 근접성이 공동 소유나 자연인 신원을 확립하지는 않습니다.",
    errorInvalidAddress: "유효한 0x 접두사 이더리움 주소를 입력하세요.",
    errorLoad: "공개 트랜잭션을 불러올 수 없습니다.",
    errorGeneric: "요청에 실패했습니다.",
    resultsEyebrow: "정규화된 트랜잭션",
    transactionsLoaded: "트랜잭션 {count}건 불러옴",
    promote: "조사로 가져가기",
    empty: "이 주소에 대한 트랜잭션이 없습니다.",
    provenance: "제공자 출처:",
    provenanceSource: "Blockscout API 출처",
    methodFallback: "트랜잭션",
    colFrom: "보낸 주소",
    colTo: "받는 주소",
    colValue: "금액",
    colBlock: "블록",
    colTime: "시간",
    draftTitle: "공개 이더리움 관찰",
  },
  bridge: {
    eyebrow: "브리지 인텔리전스 랩",
    title: "메시지 키 증거와 휴리스틱 상관관계는 같은 것이 아닙니다.",
    intro:
      "결정적인 프로토콜 메시지 대응과 시간/금액만으로 한 후보 매칭을 비교하세요. 둘 다 유용할 수 있지만, 증거 모델에는 다르게 들어가야 합니다.",
    tabDeterministic: "결정적 메시지 키",
    tabHeuristic: "시간 / 금액 휴리스틱",
    protocol: "프로토콜",
    tx: "트랜잭션",
    asset: "자산",
    messageKey: "메시지 키",
    notExposed: "노출되지 않음",
    whyMatch: "왜 이 매칭인가",
    notProve: "이것이 증명하지 않는 것",
    modeDeterministic: "결정적 키",
    modeHeuristic: "휴리스틱",
    modeNoMatch: "매칭 없음",
    directionSource: "출발지",
    directionDestination: "목적지",
  },
  cases: {
    eyebrow: "사건 파일",
    title: "결과만이 아니라 수사 자체를 재구성하세요.",
    intro:
      "선별된 공개 사건은 체인 사실과 귀속 증거의 차이를 보존하는 재생 가능한 시퀀스가 됩니다.",
    start: "재구성 시작",
    player: {
      back: "사건 파일",
      eyebrow: "사건 재구성",
      sourceBoundary: "출처 경계",
      stepLabel: "{step}단계 · {phase}",
      caseVisual: "사건",
      summary: "요약",
      supports: "이것이 뒷받침하는 것",
      limitation: "한계",
      stepConfidence: "단계 신뢰도",
      previous: "이전",
      pause: "일시정지",
      replay: "다시 보기",
      autoPlay: "자동 재생",
      nextEvidence: "다음 증거",
      artifacts: "증거 아티팩트",
      rule: "규칙",
      ruleBody: "증거 상태는 근거의 종류를 설명합니다. 유죄나 신원의 확률이 아닙니다.",
    },
  },
  academy: {
    eyebrow: "아카데미",
    title: "도구만이 아니라 경계를 배우세요.",
    intro:
      "한 번에 하나의 짧은 현장 연습. 워크벤치와 같은 증거 모델을 사용합니다.",
    tracks: {
      foundation: { title: "기초", body: "사실, 출처, 증거 상태" },
      tracing: { title: "추적", body: "UTXO, EVM, 흐름 재구성" },
      privacy: { title: "프라이버시", body: "믹서, 프라이버시 시스템, 불확실성" },
      crosschain: { title: "크로스체인", body: "브리지 이벤트와 상관관계" },
    },
    challenge: {
      exercise: "현장 연습",
      whyMatters: "왜 중요한가",
      classifyTitle: "행동하기 전에 주장을 분류하세요.",
      classifyBody: "이 학습 루프는 조사 워크벤치와 같은 증거 상태를 사용합니다.",
      correct: "정답",
      review: "검토",
      correctTitle: "증거 경계를 잘 지켰습니다.",
      reviewTitle: "주장이 증거 단계를 뛰어넘었습니다.",
      sessionScore: "세션 점수",
      restart: "세션 다시 시작",
      next: "다음 연습",
    },
  },
  calculator: {
    eyebrow: "세액 계산기",
    title: "법이 정해지기 전에 세액을 가늠해보세요.",
    intro:
      "현행법 기준 추정치에 유예·손실 이월공제를 시나리오로 얹었습니다. 입력하면 추정치가 바로 바뀝니다.",
    gainsLabel: "연간 양도차익 (원)",
    gainsPlaceholder: "예: 30000000",
    gainsHint: "≈ {amount}",
    carryLossLabel: "이월할 손실 (원)",
    carryLossHint: "이월공제 시나리오를 켰을 때만 적용됩니다",
    carryLossDisabled: "손실을 입력하려면 이월공제 시나리오를 켜세요",
    scenarioTitle: "시나리오",
    effectiveLabel: "과세 시작",
    effective2027: "2027년 — 현행법",
    effective2029: "2029년 — 유예 추진안",
    carryforwardLabel: "손실 이월공제 (제안, 3년)",
    carryforwardOn: "적용",
    carryforwardOff: "미적용",
    resultsTitle: "추정 결과",
    baseLabel: "과세표준 (양도차익 − 250만 원 공제)",
    nationalLabel: "국세 (20%)",
    localLabel: "지방세 (2%)",
    totalLabel: "세액 합계 (22%)",
    afterTaxLabel: "세후 금액",
    filingLabel: "첫 신고",
    filing2028: "2028년 5월",
    filing2030: "2030년 5월",
    disclaimer:
      "추정치이며 세무 조언이 아닙니다. 2026-11-18 기준 현행법 기준이며, 2029년 유예와 손실 이월공제는 제안일 뿐 법이 아닙니다.",
    note50m:
      "제안된 기본공제 5,000만 원 상향은 이 계산에 반영하지 않았습니다.",
  },
  capability: {
    eyebrow: "기능 등록부",
    title: "시스템이 무엇을 할 수 있고 무엇을 할 수 없는지 정확히 아세요.",
    active: "활성",
    limited: "제한됨",
    disabled: "비활성",
  },
  notFound: {
    title: "페이지를 찾을 수 없습니다",
    body: "요청하신 페이지가 이 워크벤치에 없습니다.",
    back: "지휘로 돌아가기",
  },
  api: {
    chain: {
      unsupported: "지원되지 않는 체인입니다",
      invalidAddress: "유효하지 않은 EVM 주소입니다",
      adapterFailed: "체인 어댑터에 실패했습니다",
      baseUrlMissing: "Blockscout 기본 URL이 설정되지 않았습니다",
    },
    investigator: {
      questionRequired: "지원되는 질문이 필요합니다",
      contextRequired: "유효한 수사관 컨텍스트가 필요합니다",
    },
  },
};

/**
 * Content translations: data strings that live in lib data modules
 * (mock-data, capabilities, case-playback-data, evidence-audit-data,
 * academy-data, bridge-matching, evidence-quality). Keyed by the exact
 * English string; `tc()` falls back to the key itself when missing.
 */
export const contentKo: Record<string, string> = {
  // lib/mock-data.ts — investigation, nodes, edges, evidence, hypotheses
  "Synthetic VASP Attribution": "합성 VASP 귀속",
  "Seed Wallet": "시드 지갑",
  "Investigation seed loaded from a synthetic public-chain transaction.":
    "합성 공개 체인 트랜잭션에서 불러온 조사 시드입니다.",
  "Pass-through": "패스스루",
  "Short holding time and near-total balance depletion suggest pass-through behavior.":
    "짧은 보유 시간과 거의 전액에 가까운 잔액 소진이 패스스루 행위를 시사합니다.",
  "Bridge Router": "브리지 라우터",
  "Publicly attributable bridge contract used as a cross-chain leverage point.":
    "크로스체인 지렛대로 사용된 공개 귀속 가능 브리지 컨트랙트입니다.",
  "Cluster Candidate": "클러스터 후보",
  "Behavioral overlap indicates a candidate relationship, not common ownership.":
    "행동 겹침은 공동 소유가 아니라 후보 관계를 나타냅니다.",
  "VASP Deposit": "VASP 입금",
  "Synthetic VASP deposit cluster. Natural-person attribution requires off-chain legal process.":
    "합성 VASP 입금 클러스터입니다. 자연인 귀속에는 오프체인 법적 절차가 필요합니다.",
  "message match": "메시지 일치",
  "Seed transaction": "시드 트랜잭션",
  "Transaction hash, timestamp and transfer values are directly reproducible on-chain.":
    "트랜잭션 해시, 타임스탬프, 이체 금액은 온체인에서 직접 재현할 수 있습니다.",
  "Pass-through behavior": "패스스루 행위",
  "98.7% balance depletion within a short holding window supports a pass-through hypothesis.":
    "짧은 보유 기간 내 98.7% 잔액 소진은 패스스루 가설을 뒷받침합니다.",
  "Bridge contract attribution": "브리지 컨트랙트 귀속",
  "Contract identity is attributable from public protocol documentation and known deployment records.":
    "컨트랙트 신원은 공개 프로토콜 문서와 알려진 배포 기록에서 귀속할 수 있습니다.",
  "Natural-person identity": "자연인 신원",
  "No KYC, server, device or legally obtained account records are present in this synthetic dataset.":
    "이 합성 데이터셋에는 KYC, 서버, 기기, 합법적으로 확보한 계정 기록이 없습니다.",
  "Pass-through and cluster candidate may share control.":
    "패스스루와 클러스터 후보가 통제권을 공유할 수 있습니다.",
  "temporal + depletion + convergence heuristic": "시간 + 소진 + 수렴 휴리스틱",
  "No independent off-chain corroboration": "독립적인 오프체인 확증 없음",
  "Service routing may produce similar behavior": "서비스 라우팅도 비슷한 행위를 만들 수 있음",
  // lib/mock-data.ts — case files
  "Mixer Investigation": "믹서 수사",
  Mixer: "믹서",
  "Peel chain": "필 체인",
  "Cross-validation": "교차 검증",
  "Court evidence": "법정 증거",
  "Reconstruct how on-chain tracing was combined with independent evidence and contested methodology.":
    "온체인 추적이 독립적인 증거 및 논쟁적인 방법론과 어떻게 결합되었는지 재구성하세요.",
  "Sanctions & Mixer": "제재 및 믹서",
  "Mixer boundary": "믹서 경계",
  Sanctions: "제재",
  Infrastructure: "인프라",
  Attribution: "귀속",
  "Separate observable mixer boundary flows from operator and actor attribution evidence.":
    "관찰 가능한 믹서 경계 흐름을 운영자 및 행위자 귀속 증거와 분리하세요.",
  "Infrastructure Takedown": "인프라 압수",
  "Server seizure": "서버 압수",
  Domain: "도메인",
  "Operational evidence": "운영 증거",
  "Study how blockchain intelligence connects to operational infrastructure and enforcement.":
    "블록체인 인텔리전스가 운영 인프라 및 집행과 어떻게 연결되는지 살펴보세요.",
  "Wallet & Server Evidence": "지갑 및 서버 증거",
  Wallet: "지갑",
  Server: "서버",
  Device: "기기",
  "Private key": "개인키",
  "Explore why direct wallet flows become stronger when paired with seized-device evidence.":
    "직접적인 지갑 흐름이 압수된 기기 증거와 결합될 때 왜 더 강해지는지 살펴보세요.",
  // lib/capabilities.ts
  "Public chain observation": "공개 체인 관찰",
  "Ethereum address transactions through normalized Blockscout adapter.":
    "정규화된 Blockscout 어댑터를 통한 이더리움 주소 트랜잭션.",
  "Investigation persistence": "조사 저장",
  "Ephemeral repository contract is active; durable PostgreSQL storage is not provisioned.":
    "임시 저장소 계약이 활성화되어 있습니다. 영구 PostgreSQL 저장소는 프로비저닝되지 않았습니다.",
  "Investigator Copilot": "수사관 코파일럿",
  "Deterministic cited-context adapter; no external model or API key.":
    "결정적 인용 컨텍스트 어댑터. 외부 모델이나 API 키가 없습니다.",
  "Bridge correlation": "브리지 상관관계",
  "Deterministic message-key and heuristic matching are separated by evidence state.":
    "결정적 메시지 키 매칭과 휴리스틱 매칭은 증거 상태로 구분됩니다.",
  "External AI provider": "외부 AI 제공자",
  "No OpenAI or third-party model connection is enabled.":
    "OpenAI나 서드파티 모델 연결이 활성화되어 있지 않습니다.",
  "Natural-person attribution": "자연인 귀속",
  "Public product does not automate natural-person identity attribution.":
    "공개 제품은 자연인 신원 귀속을 자동화하지 않습니다.",
  // lib/case-playback-data.ts — subtitles + source boundaries
  "Mixer tracing, cross-validation and evidence limits":
    "믹서 추적, 교차 검증, 증거의 한계",
  "Boundary observation versus actor attribution": "경계 관찰 대 행위자 귀속",
  "Blockchain intelligence to operational infrastructure":
    "블록체인 인텔리전스에서 운영 인프라로",
  "Wallet flow strengthened by server and device evidence":
    "서버와 기기 증거로 강화된 지갑 흐름",
  "Public-case reconstruction. Methodological claims remain separated from natural-person attribution.":
    "공개 사건 재구성입니다. 방법론적 주장은 자연인 귀속과 분리되어 있습니다.",
  "Public sanctions and government-source reconstruction. Mixer internals are not presented as directly observable links.":
    "공개 제재 및 정부 출처 재구성입니다. 믹서 내부는 직접 관찰 가능한 연결로 제시되지 않습니다.",
  "Public government-source reconstruction focused on the transition from chain analysis to infrastructure evidence.":
    "체인 분석에서 인프라 증거로의 전환에 초점을 맞춘 공개 정부 출처 재구성입니다.",
  "Educational reconstruction using the evidence categories described in the preserved research. Some details remain source-limited.":
    "보존된 보고서에 설명된 증거 범주를 사용한 교육용 재구성입니다. 일부 세부사항은 출처가 제한되어 있습니다.",
  // lib/case-playback-data.ts — phases
  SEED: "시드",
  TRACE: "추적",
  "CROSS-VALIDATE": "교차 검증",
  CORROBORATE: "확증",
  REVIEW: "검토",
  BOUNDARY: "경계",
  CANDIDATES: "후보",
  EXPOSURE: "노출",
  FLOW: "흐름",
  ENTITY: "실체",
  SEIZURE: "압수",
  CHAIN: "체인",
  DEVICE: "기기",
  // lib/case-playback-data.ts — bitcoin-fog steps
  "Anchor the known transactions": "알려진 트랜잭션 고정하기",
  "Start from transactions and addresses already identified in the public case record.":
    "공개 사건 기록에서 이미 확인된 트랜잭션과 주소부터 시작하세요.",
  "Transaction existence, amounts, timestamps and direct blockchain relationships can be reproduced from the public ledger.":
    "트랜잭션 존재, 금액, 타임스탬프, 직접적인 블록체인 관계는 공개 원장에서 재현할 수 있습니다.",
  "A transaction path does not by itself establish who controlled the wallet.":
    "트랜잭션 경로만으로는 누가 지갑을 통제했는지 확립할 수 없습니다.",
  "transaction hash": "트랜잭션 해시",
  "block time": "블록 시간",
  "input/output set": "입출력 집합",
  "Construct candidate flows": "후보 흐름 구성하기",
  "Apply tracing methodology to follow candidate paths through mixer-related activity.":
    "추적 방법론을 적용해 믹서 관련 활동을 통한 후보 경로를 따라가세요.",
  "A candidate flow can be scored from transaction structure, temporal behavior and other reproducible signals.":
    "후보 흐름은 트랜잭션 구조, 시간적 행동, 기타 재현 가능한 신호로 점수를 매길 수 있습니다.",
  "Mixer-related heuristics may produce competing explanations and require explicit false-positive analysis.":
    "믹서 관련 휴리스틱은 경쟁 설명을 만들 수 있으며 명시적인 오탐 분석이 필요합니다.",
  "candidate path": "후보 경로",
  "heuristic result": "휴리스틱 결과",
  "alternative path": "대안 경로",
  "Compare independent analysis": "독립적인 분석 비교하기",
  "Compare tool outputs and manually inspect a subset instead of treating one system as authoritative.":
    "하나의 시스템을 권위자로 삼지 말고 도구 출력을 비교하고 일부를 직접 살펴보세요.",
  "Agreement across independent methods increases confidence in a transaction-level interpretation.":
    "독립적인 방법들 간의 일치는 트랜잭션 수준 해석에 대한 신뢰도를 높입니다.",
  "Cross-tool agreement is not the same as independent off-chain identity evidence.":
    "도구 간 일치가 독립적인 오프체인 신원 증거와 같은 것은 아닙니다.",
  "tool A result": "도구 A 결과",
  "tool B result": "도구 B 결과",
  "manual check": "직접 확인",
  "Combine non-chain evidence": "비체인 증거 결합하기",
  "Evaluate blockchain analysis together with other evidence described in the public case record.":
    "공개 사건 기록에 설명된 다른 증거와 함께 블록체인 분석을 평가하세요.",
  "Attribution becomes materially stronger when transaction analysis is corroborated by independent operational or device evidence.":
    "트랜잭션 분석이 독립적인 운영 또는 기기 증거로 확증되면 귀속이 실질적으로 강해집니다.",
  "This reconstruction does not expose private case data and does not recreate the evidentiary record in full.":
    "이 재구성은 비공개 사건 데이터를 노출하지 않으며 증거 기록을 전부 재현하지도 않습니다.",
  "public court record": "공개 법정 기록",
  "device/operational evidence class": "기기/운영 증거 종류",
  "corroboration map": "확증 지도",
  "Preserve methodological dispute": "방법론 논쟁 보존하기",
  "Keep contested assumptions and known methodological criticisms visible in the final case view.":
    "논쟁 중인 가정과 알려진 방법론적 비판을 최종 사건 화면에 보이게 유지하세요.",
  "A defensible investigation records both supporting evidence and the limits of the tracing methodology.":
    "방어 가능한 수사는 지지 증거와 추적 방법론의 한계를 함께 기록합니다.",
  "The workbench does not convert a disputed heuristic into a verified identity claim.":
    "워크벤치는 논쟁 중인 휴리스틱을 검증된 신원 주장으로 바꾸지 않습니다.",
  "counter-evidence": "반증",
  "method caveat": "방법론 주의사항",
  "review note": "검토 메모",
  // lib/case-playback-data.ts — tornado-cash steps
  "Observe the deposit boundary": "입금 경계 관찰하기",
  "Record the public-chain deposit event and the address that reached the mixer boundary.":
    "공개 체인 입금 이벤트와 믹서 경계에 도달한 주소를 기록하세요.",
  "Deposit address, transaction, time and amount are directly observable.":
    "입금 주소, 트랜잭션, 시간, 금액은 직접 관찰할 수 있습니다.",
  "The encrypted/private mixer relationship inside the anonymity set is not reconstructed as a direct edge.":
    "익명성 집합 안의 암호화된/비공개 믹서 관계는 직접 간선으로 재구성되지 않습니다.",
  "deposit tx": "입금 트랜잭션",
  "mixer contract": "믹서 컨트랙트",
  timestamp: "타임스탬프",
  "Model withdrawal candidates": "출금 후보 모델링하기",
  "Represent possible post-mixer candidates without claiming a deterministic deposit-withdrawal link.":
    "결정적인 입금-출금 연결을 주장하지 않고 믹서 이후 가능한 후보를 표현하세요.",
  "Timing, value and downstream behavior can narrow an analytical candidate set.":
    "시간, 금액, 하류 행동으로 분석 후보 집합을 좁힐 수 있습니다.",
  "Candidate reduction is not cryptographic deanonymization.":
    "후보 축소는 암호학적 비익명화가 아닙니다.",
  "candidate set": "후보 집합",
  "timing signal": "시간 신호",
  "value signal": "금액 신호",
  "Follow observable downstream flow": "관찰 가능한 하류 흐름 따라가기",
  "Once a candidate leaves the mixer boundary, subsequent public-chain transfers can again be directly observed.":
    "후보가 믹서 경계를 벗어나면 이후 공개 체인 이체는 다시 직접 관찰할 수 있습니다.",
  "Post-withdrawal transaction paths are reproducible on-chain.":
    "출금 후 트랜잭션 경로는 온체인에서 재현할 수 있습니다.",
  "The identity of the controller remains separate from the transaction path.":
    "통제자의 신원은 트랜잭션 경로와 별개로 남아 있습니다.",
  "withdrawal-side tx": "출금 측 트랜잭션",
  "downstream transfer": "하류 이체",
  destination: "목적지",
  "Attach external attribution evidence": "외부 귀속 증거 붙이기",
  "Add public sanctions designations and other government-source attribution as a distinct evidence class.":
    "공개 제재 지정과 기타 정부 출처 귀속을 별개의 증거 종류로 추가하세요.",
  "External attribution can identify known entities or designated actors independently of mixer heuristics.":
    "외부 귀속은 믹서 휴리스틱과 무관하게 알려진 실체나 지정된 행위자를 식별할 수 있습니다.",
  "The workbench shows the attribution source; it does not infer motive or identity beyond the cited public material.":
    "워크벤치는 귀속 출처를 보여줄 뿐, 인용된 공개 자료를 넘어 동기나 신원을 추론하지 않습니다.",
  "designation source": "지정 출처",
  "public attribution": "공개 귀속",
  "entity link": "실체 연결",
  // lib/case-playback-data.ts — chipmixer steps
  "Map service-related flows": "서비스 관련 흐름 지도 그리기",
  "Reconstruct public-chain flows associated with the service and known counterparties.":
    "서비스 및 알려진 상대방과 관련된 공개 체인 흐름을 재구성하세요.",
  "Transactions and service-facing addresses can be represented as observed graph objects.":
    "트랜잭션과 서비스 대면 주소는 관찰된 그래프 객체로 표현할 수 있습니다.",
  "Service-level attribution does not automatically identify a human operator.":
    "서비스 수준 귀속이 사람의 운영자를 자동으로 식별하지는 않습니다.",
  "service-facing address": "서비스 대면 주소",
  "flow graph": "흐름 그래프",
  counterparty: "상대방",
  "Separate service from operator": "서비스와 운영자 분리하기",
  "Model operational relationships as hypotheses until external evidence supports attribution.":
    "외부 증거가 귀속을 뒷받침할 때까지 운영 관계는 가설로 모델링하세요.",
  "Infrastructure reuse and operational patterns can motivate an investigative hypothesis.":
    "인프라 재사용과 운영 패턴은 수사 가설의 동기가 될 수 있습니다.",
  "Operational similarity alone is insufficient for natural-person attribution.":
    "운영상의 유사성만으로는 자연인 귀속에 충분하지 않습니다.",
  "infrastructure hypothesis": "인프라 가설",
  "domain relationship": "도메인 관계",
  "account relationship": "계정 관계",
  "Corroborate with seized infrastructure": "압수된 인프라로 확증하기",
  "Represent public reports of domain, account and backend-server seizure as independent evidence.":
    "도메인, 계정, 백엔드 서버 압수에 대한 공개 보고를 독립적인 증거로 표현하세요.",
  "Operational infrastructure evidence can connect a service graph to a legal enforcement action.":
    "운영 인프라 증거는 서비스 그래프를 법적 집행 조치와 연결할 수 있습니다.",
  "Private forensic contents remain outside this public reconstruction.":
    "비공개 포렌식 내용은 이 공개 재구성의 밖에 있습니다.",
  "domain seizure": "도메인 압수",
  "backend server": "백엔드 서버",
  "public enforcement record": "공개 집행 기록",
  // lib/case-playback-data.ts — silk-road steps
  "Anchor server-side wallet material": "서버 측 지갑 자료 고정하기",
  "Treat wallet information recovered from operational infrastructure as a separate attribution source.":
    "운영 인프라에서 회수한 지갑 정보를 별개의 귀속 출처로 취급하세요.",
  "Server-side wallet artifacts can connect infrastructure to identifiable blockchain addresses.":
    "서버 측 지갑 아티팩트는 인프라를 식별 가능한 블록체인 주소와 연결할 수 있습니다.",
  "This public reconstruction does not contain the original forensic image.":
    "이 공개 재구성에는 원본 포렌식 이미지가 없습니다.",
  "server wallet record": "서버 지갑 기록",
  "address list": "주소 목록",
  "public case source": "공개 사건 출처",
  "Reproduce direct wallet flow": "직접 지갑 흐름 재현하기",
  "Compare server-associated addresses with public blockchain transfers.":
    "서버 관련 주소를 공개 블록체인 이체와 비교하세요.",
  "Direct address-to-address movement can be independently reproduced from the ledger.":
    "주소 간 직접 이동은 원장에서 독립적으로 재현할 수 있습니다.",
  "Control of an address still requires corroboration beyond the ledger.":
    "주소의 통제권은 여전히 원장을 넘어서는 확증이 필요합니다.",
  "wallet address": "지갑 주소",
  "direct transaction": "직접 트랜잭션",
  "block record": "블록 기록",
  "Corroborate with seized-device evidence": "압수된 기기 증거로 확증하기",
  "Represent device-held wallet evidence as the attribution layer that strengthens the chain relationship.":
    "기기가 보유한 지갑 증거를 체인 관계를 강화하는 귀속 층위로 표현하세요.",
  "Possession of relevant wallet material on a seized device is a materially different evidence class from graph proximity.":
    "압수된 기기에 관련 지갑 자료가 있다는 것은 그래프 근접성과는 실질적으로 다른 증거 종류입니다.",
  "The app does not reproduce or infer private keys.":
    "이 앱은 개인키를 재현하거나 추론하지 않습니다.",
  "device evidence class": "기기 증거 종류",
  "wallet association": "지갑 연결",
  "cross-check": "교차 확인",
  "Mark remaining source limitations": "남은 출처 한계 표시하기",
  "Keep source-limited details explicitly unverified instead of filling them with assumptions.":
    "출처가 제한된 세부사항은 가정으로 채우지 말고 명시적으로 미확인 상태로 두세요.",
  "The reconstruction remains useful even when some legal-record detail is unavailable.":
    "일부 법적 기록 세부사항이 없어도 재구성은 여전히 유용합니다.",
  "Missing primary-source material should remain missing, not be completed by inference.":
    "없는 1차 출처 자료는 없는 그대로 두어야 하며, 추론으로 채워서는 안 됩니다.",
  "source gap": "출처 공백",
  "verification note": "검증 메모",
  "open question": "열린 질문",
  // lib/evidence-audit-data.ts
  "protocol deployment record cross-check": "프로토콜 배포 기록 교차 확인",
  "The bridge contract identity is supported by public protocol documentation and a matching deployment record.":
    "브리지 컨트랙트 신원은 공개 프로토콜 문서와 일치하는 배포 기록으로 뒷받침됩니다.",
  "temporal + balance depletion heuristic": "시간 + 잔액 소진 휴리스틱",
  "Observed timing and near-total balance movement support a pass-through hypothesis while preserving alternative explanations.":
    "관찰된 타이밍과 거의 전액에 가까운 잔액 이동은 대안 설명을 유지하면서 패스스루 가설을 뒷받침합니다.",
  // lib/evidence-quality.ts summaries
  "Strongest as an observation set; attribution remains limited.":
    "관찰 집합으로서는 가장 강하지만, 귀속은 여전히 제한적입니다.",
  "Useful evidence exists, but unresolved corroboration gaps remain material.":
    "유용한 증거는 있지만, 미해결 확증 공백이 여전히 큽니다.",
  "Evidence is comparatively balanced across observation, provenance, and review discipline.":
    "관찰, 출처, 검토 규율 측면에서 증거가 비교적 균형 잡혀 있습니다.",
  // lib/bridge-matching.ts reasons + limitations
  "Both observations expose the same protocol message key.":
    "두 관찰 모두 같은 프로토콜 메시지 키를 노출합니다.",
  "Source and destination observations belong to the same protocol.":
    "출발지와 목적지 관찰이 같은 프로토콜에 속합니다.",
  "The link is represented as a protocol-event correspondence, not a person attribution.":
    "이 연결은 개인 귀속이 아니라 프로토콜 이벤트 대응으로 표현됩니다.",
  "A deterministic bridge-message link does not establish who controlled either wallet.":
    "결정적인 브리지 메시지 연결이 어느 지갑을 누가 통제했는지 확립하지는 않습니다.",
  "Entity attribution still requires a separate evidence transition.":
    "실체 귀속에는 여전히 별도의 증거 전이가 필요합니다.",
  "same protocol": "같은 프로토콜",
  "same asset": "같은 자산",
  "amount difference <= 0.10%": "금액 차이 ≤ 0.10%",
  "amount difference <= 1%": "금액 차이 ≤ 1%",
  "time delta <= 10 minutes": "시간 차이 ≤ 10분",
  "time delta <= 60 minutes": "시간 차이 ≤ 60분",
  "same public account identifier": "같은 공개 계정 식별자",
  "No strong deterministic or heuristic signals overlap.":
    "강한 결정적·휴리스틱 신호가 겹치지 않습니다.",
  "No protocol message key is available.": "프로토콜 메시지 키가 없습니다.",
  "Time and value similarity alone are insufficient to assert a bridge correspondence.":
    "시간과 금액의 유사성만으로는 브리지 대응을 단정할 수 없습니다.",
  "No deterministic protocol message key was matched.":
    "결정적인 프로토콜 메시지 키가 매칭되지 않았습니다.",
  "Time/value correlation can collide across unrelated users and routes.":
    "시간/금액 상관관계는 무관한 사용자와 경로에서도 겹칠 수 있습니다.",
  "This result must not be promoted to ATTRIBUTED without independent provenance.":
    "이 결과는 독립적인 출처 없이 ATTRIBUTED로 격상해서는 안 됩니다.",
  // lib/academy-data.ts — challenges
  "Address A paid Address B.": "주소 A가 주소 B에 지불했습니다.",
  "Address ≠ person": "주소 ≠ 사람",
  "What is the strongest statement the evidence currently supports?":
    "증거가 현재 뒷받침하는 가장 강한 진술은 무엇인가요?",
  "A and B are controlled by the same person.": "A와 B는 같은 사람이 통제합니다.",
  "A direct transfer shows a transaction relationship, not common control.":
    "직접 이체는 트랜잭션 관계를 보여줄 뿐, 공동 통제를 보여주지 않습니다.",
  "A sent value to B on-chain.": "A는 온체인에서 B에게 가치를 보냈습니다.",
  "This is directly reproducible from the ledger and does not overstate identity.":
    "원장에서 직접 재현할 수 있으며, 신원을 과장하지 않습니다.",
  "A and B probably belong to the same entity.":
    "A와 B는 아마 같은 실체에 속합니다.",
  "That inference needs additional signals and a documented method.":
    "그 추론에는 추가 신호와 문서화된 방법이 필요합니다.",
  "A bridge message key matches on both chains.":
    "브리지 메시지 키가 양쪽 체인에서 일치합니다.",
  "Deterministic bridge correspondence": "결정적 브리지 대응",
  "How should the cross-chain relationship be represented?":
    "크로스체인 관계는 어떻게 표현해야 하나요?",
  "Observed protocol correspondence.": "관찰된 프로토콜 대응.",
  "The matching protocol message identifier supports the bridge-event link itself.":
    "일치하는 프로토콜 메시지 식별자는 브리지 이벤트 연결 자체를 뒷받침합니다.",
  "Attributed wallet ownership.": "귀속된 지갑 소유권.",
  "A message correspondence does not identify the wallet controller.":
    "메시지 대응이 지갑 통제자를 식별하지는 않습니다.",
  "Unverified coincidence.": "미확인 우연.",
  "A deterministic message identifier is stronger than a time/value-only coincidence.":
    "결정적인 메시지 식별자는 시간/금액만의 우연보다 강합니다.",
  "Timing and value reduce 120 mixer outputs to 6 candidates.":
    "시간과 금액으로 믹서 출력 120개를 6개 후보로 좁혔습니다.",
  "Candidate reduction ≠ deanonymization": "후보 축소 ≠ 비익명화",
  "What is the appropriate evidence state?": "적절한 증거 상태는 무엇인가요?",
  Attributed: "귀속됨",
  Inferred: "추론됨",
  Observed: "관찰됨",
  "Candidate reduction does not prove a deposit-withdrawal identity.":
    "후보 축소는 입금-출금 동일성을 증명하지 않습니다.",
  "The analytical signals narrow possibilities but remain heuristic.":
    "분석 신호는 가능성을 좁히지만 여전히 휴리스틱입니다.",
  "The candidate link itself is not directly visible on-chain.":
    "후보 연결 자체는 온체인에서 직접 보이지 않습니다.",
};
