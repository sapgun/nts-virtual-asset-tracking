# 블록체인 포렌식 내부동작 심층 리서치 리포트

- 작성일: 2026-09-27
- 목적: 수사기관·컴플라이언스 관점에서 "분석이 어떻게 동작하는지"를 기술하는 리포트. "회피 방법"이 아님
- 근거: 공개 학술 논문, 업계 기술문서, 오픈소스 프로젝트
- 표기 규칙:
  - 【검증됨】 = 1차·학술·공식 문서에서 확인된 사실
  - 【업계 추론】 = 업계 표준 관행에 기반한 추론 (정확한 수치·공식은 공개되지 않음)
  - 【구현 예】 = 특정 오픈소스 구현 사례 (업계 표준 아님)
  - 각 주장 끝의 URL은 해당 주장의 근거. URL은 2026-09-27에 조회함

---

## 1. UTXO 클러스터링

### 1.1 Common-input-ownership 휴리스틱(CIOH / multi-input)

- 동일한 트랜잭션의 모든 입력 주소는 동일한 소유자(또는 그 대리인)가 통제한다는 가정 하에, 입력 주소들을 하나의 엔티티로 병합한다. 【검증됨】 http://arxiv.org/pdf/1706.00916v2
- 입력 집합이 겹치는 트랜잭션들을 union-find(서로소 집합 합치기) 또는 connected components로 전이적 확장하여 클러스터를 키운다. 오픈소스 구현들도 같은 병합 원리를 설명한다. 【검증됨】 http://arxiv.org/pdf/1706.00916v2 / https://github.com/graphsense/graphsense-transformation/blob/main/docs/transformation-concept.md
- CoinJoin·PayJoin 같은 의도적 공동 지출은 이 가정을 고의로 깨뜨리므로, 클러스터링 전 단계에서 CoinJoin 트랜잭션을 탐지해 병합을 억제하거나 별도 라벨 처리해야 한다. 【업계 추론】 https://arxiv.org/pdf/2105.09078 / https://github.com/graphsense/graphsense-transformation/blob/main/docs/transformation-concept.md

### 1.2 Change 주소 탐지 휴리스틱

- fresh/one-time 주소(이전에 등장하지 않은 주소)가 change일 가능성이 높다는 휴리스틱. 【검증됨】 https://en.Bitcoin.it/w/index.php?title=Privacy&diff=cur&oldid=56872
- 입력과 같은 스크립트 타입(P2WPKH→P2WPKH 등)을 가진 출력이 change일 가능성이 높다. 【검증됨】 https://en.Bitcoin.it/w/index.php?title=Privacy&diff=cur&oldid=56872
- round-number(정수에 가까운 값) payment 출력과 비정형 잔돈을 구분한다. 【검증됨】 https://en.Bitcoin.it/w/index.php?title=Privacy&diff=cur&oldid=56872
- 출력 위치 순서(지갑이 change를 고정 위치에 두는 관행), power-of-10, locktime, RBF 시 금액이 줄어든 출력 등도 change 후보 판단에 쓰인다. 【검증됨】 https://en.Bitcoin.it/w/index.php?title=Privacy&diff=cur&oldid=56872
- optimal/unnecessary-input 휴리스틱: 모든 입력보다 작은 "유일한" 출력을 change 후보로 본다. 【검증됨】 https://en.Bitcoin.it/w/index.php?title=Privacy&diff=cur&oldid=56872
- peeling-chain 연속성: 잔돈이 다음 거래의 입력으로 계속 이어지는 선형 사슬을 추적한다. 【검증됨】 https://en.Bitcoin.it/w/index.php?title=Privacy&diff=cur&oldid=56872

### 1.3 휴리스틱 오탐률(한계)

- 한 시뮬레이션 연구는 multi-input 단독 평균 오류율 63.46%, one-time change 단독 92.66%, 결합 시 57.47%를 보고했다. 【검증됨】 https://inria.hal.science/hal-05315736/file/526450_1_En_11_Chapter.pdf
- 이는 **시뮬레이션·정의 의존 수치**이며 실제 상용 시스템의 주소쌍 정밀도와 동일한 지표가 아니다. 단일 휴리스틱만 쓰면 오류가 크고, 다중 휴리스틱 교차·확률적 라벨링이 실무 전제다. 【업계 추론】 https://inria.hal.science/hal-05315736/file/526450_1_En_11_Chapter.pdf

### 1.4 CoinJoin 지문 탐지

- Whirlpool: 정확히 5-input/5-output, 전부 동일 금액 출력, 당시 풀 0.01/0.05/0.5 BTC 주변값. 【검증됨】 https://arxiv.org/pdf/2109.10229
- 초기 Wasabi(1.x): 정적 coordinator fee address + 3개 이상 동일 출력. 【검증됨】 https://arxiv.org/pdf/2109.10229
- 후기 Wasabi 1.x: 10개 이상 동일 출력, 최빈값 약 0.1±0.02 BTC, 입력 수·고유 change 조건을 함께 본다. 【검증됨】 https://arxiv.org/pdf/2109.10229
- Wasabi 2(WabiSabi)는 임의 액면(arbitrary denomination)이므로 단순 equal-output 규칙보다 참가자 수·출력 그룹·스크립트·수수료/구조를 결합한다. 【업계 추론】 https://arxiv.org/pdf/2109.10229
- GraphSense는 2026-04 릴리스에 UTXO용 CoinJoin/change 휴리스틱을 추가했다. 【검증됨】 https://github.com/graphsense/graphsense.github.io/blob/HEAD/news.md / https://github.com/graphsense/graphsense-lib/blob/HEAD/clients/python/README.md

### 1.5 Peel-chain 탐지

- 특징: 선형 그래프, 높은 forward 비율(입금 대부분을 다음 주소로), 낮은 hop 간 시간 지연, 수수료만큼 감소하는 잔액. 【업계 추론】 https://github.com/gl0bal01/intel-codex/blob/HEAD/Investigations/Techniques/sop-blockchain-investigation.md
- 한 오픈소스 구현은 "2-output 거래에서 작은/전체 비율 1–25%이고 3회 이상 연속이면 후보"로 잡는다. **이는 특정 구현의 예일 뿐 업계 표준 수치가 아니다.** 【구현 예】 https://github.com/abdulwahed-sweden/bitcoin-sentinel/blob/HEAD/THREAT_MODELS.md

### 1.6 클러스터 병합·분할 운영

- 고신뢰도 edge는 union-find로 병합, CoinJoin/PayJoin 감지 시 하드 병합 금지. 【업계 추론】 https://github.com/graphsense/graphsense-transformation/blob/main/docs/transformation-concept.md / https://arxiv.org/pdf/2105.09078
- 상충 라벨·약한 edge는 클러스터를 물리적으로 "분할"하기보다 provenance(출처 이력)가 있는 후보 관계·edge 억제로 유지하는 설명이 적절하다. 【업계 추론】

---

## 2. Tornado Cash 등 디믹싱 수학

### 2.1 Tornado Cash Classic 구조

- 고정 액면 입금 + Pedersen-hash commitment → Merkle tree leaf. 출금은 미사용 commitment 소유를 보이는 zk-SNARK와 수취인(recipient) 지정. 【검증됨】 https://arxiv.org/pdf/2510.09433v2
- relayer가 가스비를 내고 출금액에서 수수료를 취한다(예: 1 ETH 풀에서 0.02 ETH fee, 수취 0.98 ETH). 【검증됨】 https://arxiv.org/pdf/2510.09433v2
- 분석 범위: Ethereum, Polygon, BSC의 배포 시점부터 2024-08까지. Tornado 입출금 및 관련 주소의 native coin·USDT·WETH 전송 수집. 【검증됨】 https://arxiv.org/pdf/2510.09433v2
- **버전 주의**: arXiv 2510.09433은 abs 페이지에 "새 버전이 철회됨(withdrawn)" 표시가 있다. 결과는 확정적 사실이 아니라 학술 연구 수치로 취급한다. 【검증됨】 https://arxiv.org/abs/2510.09433v1

### 2.2 디믹싱 휴리스틱 H1·H2·H3 (arXiv 2510.09433)

- H1 주소 재사용: 입금 주소가 나중에 출금 주소로 나타나면 연결. 【검증됨】 https://arxiv.org/pdf/2510.09433v2
- H2 transactional linkage: 입금측·출금측 주소 사이의 직접 native/USDT/WETH 전송이 있으면 연결. 동일 규모 랜덤 주소집합 150회 샘플링으로 null 분포와 비교. 【검증됨】 https://arxiv.org/pdf/2510.09433v2
- H3 FIFO: H1/H2에서 식별된 주소를 제거한 뒤 입금을 바로 뒤의 가장 이른 출금과 매칭. 사용자가 빠르게 출금한다는 가정이라 **저신뢰·추론적 휴리스틱**. 【검증됨】 https://arxiv.org/pdf/2510.09433v2
- 논문 보고 수치: H1+H2로 출금의 5.1–12.6% 연결; FIFO 추가로 15–22 percentage points; 전체 매칭 Ethereum 34.7%, Polygon 34.7%, BSC 21.1%. 【검증됨】 https://arxiv.org/pdf/2510.09433v2
- 0.1 ETH 풀 FIFO: 11,474건(49%), 세 휴리스틱 합산 매칭률 60% 초과. 총 $2.3B 이상 연결 주장. 지연 분포는 heavy-tailed이며 짧은 지연에 질량 집중. 【검증됨】 https://arxiv.org/pdf/2510.09433v2

### 2.3 Tutela 확장

- 주소 재사용, 직접 전송 외에 가스 전략(gas usage patterns), wallet fee fingerprinting, 실질 anonymity set 축소를 분석한다. 【검증됨】 https://arxiv.org/pdf/2201.06811
- 지갑 소프트웨어별 수수료 알고리즘 차이(gas limit, legacy gasPrice, EIP-1559 maxFee/maxPriorityFee, 반올림 관행)를 행동 지문으로 묶는다. 【검증됨】 https://arxiv.org/pdf/2201.06811

### 2.4 Tornado Cash Nova의 차이

- Classic의 고정 액면과 달리 임의 금액(arbitrary amounts) 및 풀 내부 shielded transfer/잔액을 지원한다. 【검증됨】 https://hackmd.io/@ak36/tornado_cash_nova_demo / https://cryptobriefing.com/defi-project-spotlight-tornado-cash-ethereums-top-privacy-tool/?utm_source=main_feed&utm_medium=rss
- 외부 경계 금액 지문은 새로 생기지만 내부 transfer는 공개 그래프를 줄이며, 단순 고정액 FIFO 모델을 그대로 적용할 수 없다. 【업계 추론】

### 2.5 Privacy Pools

- 전체 입금집합이 아니라 ASP(association set provider)가 구성한 association set에 포함됨을 ZK로 증명한다. 【검증됨】 https://iacr.steepath.eu/2023/273-DerechoPrivacyPoolswithProofCarryingDisclosures.pdf / https://github.com/firoorg/firo-site/blob/HEAD/guide/privacy-technology-comparison.md
- 분석상 집합이 작거나 공개 제외목록에 의해 분할되면 anonymity set이 줄지만, 특정 입금을 직접 연결하는 증명은 아니다. 【업계 추론】

---

## 3. EVM 포렌식

### 3.1 주소 도출(CREATE / CREATE2)

- CREATE: `new_address = keccak256(rlp_encode([sender, nonce]))[12:]` — 마지막 20바이트. deployer nonce가 필요하므로 nonce 추적과 결합한다. 【검증됨】 https://github.com/foundry-rs/book/blob/HEAD/src/pages/guides/deterministic-deployments-using-create2.mdx
- CREATE2(EIP-1014): `address = keccak256(0xff ++ deployer ++ salt ++ keccak256(init_code))[12:]`. salt 선택으로 예측 가능, counterfactual 배포 가능. 【검증됨】 https://github.com/bengalcatbalu/eip-security-handbook/blob/HEAD/src/eips/opcodes/eip-1014.md / https://github.com/foundry-rs/book/blob/HEAD/src/pages/guides/deterministic-deployments-using-create2.mdx
- 수사 활용: 동일 deployer/factory에서 파생된 컨트랙트 군을 자동으로 묶어 attribution을 확장한다(예: 사기 토큰 공장). 【업계 추론】

### 3.2 트레이스와 내부 호출

- 분석은 트랜잭션 표면이 아니라 call trace(debug_traceTransaction/callTracer급)의 내부 호출·이벤트 로그를 기준으로 한다. delegatecall·내부 ETH 이동·ERC-20 Transfer 로그가 실제 자금흐름이다. 【업계 추론】 https://github.com/gl0bal01/intel-codex/blob/HEAD/Investigations/Techniques/sop-blockchain-investigation.md
- 브릿지 페어링 키(8장 참조)도 모두 이벤트 로그에서 추출된다. 【검증됨】 https://github.com/gl0bal01/intel-codex/blob/HEAD/Investigations/Techniques/sop-blockchain-investigation.md

### 3.3 Nonce·가스 지문

- nonce는 EOA별 순차 counter다. gap은 pending/replaced/dropped 거래가 있을 수 있어, **같은 운영 자동화의 보조 지문**이지 다른 주소 간 소유권 증명은 아니다. 【검증됨】 https://github.com/ethereumbook/ethereumbook/blob/HEAD/src/chapter_6.md
- gas limit, legacy gasPrice 또는 EIP-1559 maxFee/maxPriorityFee, 블록 median 대비 편차, 동일 반올림/알고리즘 패턴을 묶어 wallet/bot behavior fingerprint를 만든다. 【검증됨】 https://arxiv.org/pdf/2201.06811

### 3.4 EVM peel chain

- 입금액 대부분을 빠르게 다음 주소로 넘기고 소액을 분리하며 가스만큼 잔액이 감소한다. linear graph, high forwarding ratio, 낮은 inter-hop delay로 탐지. 【업계 추론】 https://github.com/gl0bal01/intel-codex/blob/HEAD/Investigations/Techniques/sop-blockchain-investigation.md

### 3.5 Approval / spender 그래프

- ERC-20 `Approval`/`ApprovalForAll` 이벤트는 spender→owner 권한 관계를 만든다. 피싱·드레이너(다량의 ApprovalForAll 수집) 탐지의 핵심 그래프다. 【업계 추론】 https://github.com/TrustlessCrypto/dai-intelligence/blob/main/docs/requirements/blockchain-analytics/KYT-AML-USE-CASES.md
- 토큰 승인을 준 뒤 실제 인출이 나중에 일어나는 구조이므로, 승인 그래프는 인출 전 선제 경보에 사용된다. 【업계 추론】

### 3.6 MEV bot·릴레이 라벨링

- searcher(탐색자)→builder(블록 구성)→relay(경매)→validator 흐름이 표준 구조다. Flashbots는 searcher가 public mempool 노출 없이 번들을 builder에게 보내도록 하는 private relay다. 【검증됨】 https://medium.com/@c.e.hirschauer/inside-the-dark-forest-the-maximal-extractable-value-playbook-8830f62f5511
- Etherscan 등은 "MEV Transaction", "Flashbots" 라벨을 표시한다. 예: DFX Finance 익스플로잇 트랜잭션이 "MEV Transaction"+"Flashbots"로 라벨됨. 【검증됨】 https://github.com/sunweb3sec/defihacklabs/blob/HEAD/academy/onchain_debug/06_write_your_own_poc/en/readme.md
- MEV bot(예: Yoink)이 익스플로잇을 프론트런해 자금을 가로채는 사례도 있다 — 이는 bot 주소가 자금 경로의 중간 노드가 되는 수사 단서가 된다. 【검증됨】 https://cointelegraph.com/news/mev-bot-intercepts-77m-in-rseth-from-ethereum-wallet-exploit
- 단, **private mempool/private RPC 사용은 public archive만으로 직접 증명 불가** — 가설과 신뢰도 등급(confidence tiers)으로 보고해야 한다. 【검증됨】 https://github.com/neversight/learn-skills.dev/blob/HEAD/data/skills-md/agentic-reserve/blockint-skills/mev-bot-infrastructure-analysis-agent/SKILL.md

---

## 4. 그래프 머신러닝

### 4.1 Feature engineering (Elliptic 데이터셋, Weber et al.)

- 노드=Bitcoin 거래, 엣지=자금흐름, 166 features(94 local + 72 one-hop aggregate), 라벨 licit/illicit/unknown. 【검증됨】 http://arxiv.org/abs/1908.02591
- labeled illicit가 약 2%라 accuracy는 부적절할 수 있고 AUPRC·precision/recall·시간 분할(time split)이 중요하다. 【검증됨】 https://escholarship.org/content/qt8rq2v0zz/qt8rq2v0zz.pdf

### 4.2 모델 보고 성능 (데이터셋·split이 다른 연구 간 단순 순위화 금지)

- 후속 문헌이 인용한 F1: Logistic regression 0.543, Random Forest 약 0.788–0.796, GCN 0.628. 【검증됨】 https://escholarship.org/content/qt8rq2v0zz/qt8rq2v0zz.pdf / https://arxiv.org/pdf/2602.23599v1.pdf
- ChebNet 0.91, GraphSAGE 0.889, GATv2 0.881. 【검증됨】 https://www.nature.com/articles/s41598-025-08365-9?error=cookies_not_supported&code=50c3fb3f-a68c-4fff-a1ab-caaf612fa29c
- TFGAT + cyclic pseudo-label: precision 0.9814, recall 0.8390, F1 0.9046. 【검증됨】 https://www.nature.com/articles/s41598-025-08365-9?error=cookies_not_supported&code=50c3fb3f-a68c-4fff-a1ab-caaf612fa29c

### 4.3 임베딩·전파

- node2vec/DeepWalk/GraphSAGE 임베딩은 노드 이웃 구조를 벡터로 압축해 유사 지갑·클러스터를 근접시키는 데 사용된다. 【업계 추론】
- risk propagation/exposure(위험 점수의 하류 전파)와 taint accounting(poison/haircut/FIFO)은 다르다: 전자는 확률적 위험도, 후자는 "오염된 금액"의 회계 규칙이다. 【업계 추론】 https://github.com/TrustlessCrypto/dai-intelligence/blob/main/docs/requirements/blockchain-analytics/KYT-AML-USE-CASES.md
- 상용 KYT는 룰+지도학습+어노말리를 결합하는 것이 일반적 패턴이지만, 내부 가중치·스코어링 공식은 비공개다. 【업계 추론】 https://www.enterprisetimes.co.uk/2019/08/27/chainalysis-launches-suspicious-transaction-alert-tool/

---

## 5. 귀속·OSINT

### 5.1 거래소·서비스 attribution 원리

- 직접 소액 test deposit으로 deposit address ground truth를 확보한 뒤, hot-wallet sweep, consolidation, withdrawal batching, change/CIOH로 service cluster를 확장한다. 【업계 추론】 https://github.com/gl0bal01/intel-codex/blob/HEAD/Investigations/Techniques/sop-blockchain-investigation.md
- test deposit은 단일 주소 확인 증거이지 전체 클러스터의 자동 증명은 아니다. 【업계 추론】
- TRM 등 벤더는 수백만 웹페이지·다크웹 포럼·제재 리스트·스캠 신고 같은 OSINT와 자체 조사 결과를 라벨 DB에 축적한다. 【검증됨】 https://bigmarker-production.s3.amazonaws.com/content_object_shared_files/63d302f61c891b04ff39b3f150c491bb40b20e65/TRM_-_Why_Law_Enforcement_Agencies_Need_Blockchain_Intelligence_-_White_Paper__1_.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQVWLCX4FHDT4CTZB%2F20260216%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260216T095635Z&X-Amz-Expires=3600&X-Amz-Signature=2ee3f3029a314cc6fb916881734241408f606ccebb8056f414e42b797b78e73b&X-Amz-SignedHeaders=Host&response-content-disposition=attachment%3B%20filename%3D%22White_Paper_%7C_Why_Law_Enforcement_Agencies_Need_Blockchain_Intelligence.pdf%22%3B%20filename%2A%3DUTF-8%27%27White_Paper_%257C_Why_Law_Enforcement_Agencies_Need_Blockchain_Intelligence.pdf
- 한 KYT 요구문서는 약 500개 VASP의 deposit 주소·행동 지문 DB를 언급한다. 【구현 예】 https://github.com/TrustlessCrypto/dai-intelligence/blob/main/docs/requirements/blockchain-analytics/KYT-AML-USE-CASES.md

### 5.2 IP·P2P 타이밍 attribution

- first-spy estimator: 감시자가 다수 노드와 접속해 특정 트랜잭션을 처음 전달한 peer를 origin으로 추정한다. 【검증됨】 https://arXiv.org/pdf/2109.00376
- 이는 확률적 추정이며, Dandelion++(아래 6.7)와 Tor 사용 시 약화된다. 【검증됨】 https://arxiv.org/pdf/1805.11060

### 5.3 MEV bot·릴레이 라벨 (3.6과 연결)

- explorer 라벨, builder/relay 공개 통계, 번들 구조(공개된 경우), priority fee/tip 패턴, 디코딩된 호출로 전략 클래스를 추론한다. 【검증됨】 https://github.com/neversight/learn-skills.dev/blob/HEAD/data/skills-md/agentic-reserve/blockint-skills/mev-bot-infrastructure-analysis-agent/SKILL.md

### 5.4 조사 절차 표준 (TRM Investigator's Flip Book)

- A) 주소·tx 해시를 추적 도구에 입력 → B) 트랜잭션 네트워크 매핑으로 leverage point 식별 → C) 식별정보를 가진 제3자(거래소 등) 식별 → D) 법적 절차로 컨트롤러 정보 확보. 【검증됨】 https://cdn.prod.website-files.com/6082dc5b670562507b3587b4/698a5391bf77755a3a3e924b_TRM%20-%20Blockchain%20Investigator%27s%20Flip%20Book%20-%20US.pdf
- 핵심 원칙: **서비스(거래소·OTC 등)를 통과해 추적할 수 없다.** 서비스는 omnibus/통합 지갑 구조를 쓰므로 잘못된 source-of-funds 경로를 만들 위험이 크다. 【검증됨】 https://cdn.prod.website-files.com/6082dc5b670562507b3587b4/6806c836d610e22b1cdced37_TRM_Crypto Compliance Program Guide for Financial Institutions_Part 4.pdf

---

## 6. Monero

### 6.1 기본 구조

- ring size 16 = 실제 1 + decoy 15. 【검증됨】 https://github.com/anoni-net/docs/blob/HEAD/docs/en/advanced/zk-identity-payments.md / https://www.getmonero.org/resources/moneropedia/ringsignatures.html
- RingCT: Pedersen commitment로 금액 은닉, Bulletproofs+ range proof로 유효 범위·합 보존 검증. 【검증됨】 https://github.com/anoni-net/docs/blob/HEAD/docs/en/advanced/zk-identity-payments.md / https://www.getmonero.org/resources/moneropedia/ringCT.html
- stealth address: 수취인의 공개키로부터 송신자가 one-time 주소를 생성, 체인에 실제 주소가 노출되지 않음. 【검증됨】 https://www.getmonero.org/resources/moneropedia/stealthaddress.html
- subaddress: fresh subaddress를 매 결제마다 쓰면 수취인 링크를 줄인다. 【업계 추론】 https://github.com/sethforprivacy/sethforprivacy.com/blob/HEAD/content/posts/comparing-private-spends.md

### 6.2 Decoy 선택 분포 역사

- 초기 uniform → 2016 triangular/recent zone → 2018-10 v0.13 gamma. 【검증됨】 https://ar5iv.labs.arxiv.org/html/1812.02808
- gamma selector 경계 버그: 10-block-old decoy를 선택하지 못하던 문제, wallet v0.18.2.2에서 수정. 【검증됨】 https://github.com/monero-project/monero/pull/7821
- ring-size 강화 이력: 0→3(2016), 3→5(2017), 5→7(2018), 11(2018-10), 이후 조사 자료 기준 16. 【검증됨】 http://fc19.ifca.ai/preproceedings/27-preproceedings.pdf / http://link.springer.com/content/pdf/10.1007/978-3-319-66399-9_9.pdf

### 6.3 Closed-set / cascade 공격 (ZMR)

- Zero Mixin Removal(ZMR): mixin-0(또는 알려진 실제 spend) 출력이 다른 ring에서 decoy로 제거된다. 【검증됨】 http://fc19.ifca.ai/preproceedings/27-preproceedings.pdf
- Intersection Removal: N개 ring의 합집합이 정확히 N개 후보인 closed set이면, 그 후보들은 모두 실제로 한 번씩 소비됐으므로 다른 ring에서 제거 가능. 반복 적용 시 cascade. 【검증됨】 http://link.springer.com/content/pdf/10.1007/978-3-319-66399-9_9.pdf / http://fc19.ifca.ai/preproceedings/27-preproceedings.pdf
- ring size 강제 이후 구(舊) 출력에 대한 cascade 효과는 제한적이지만, 과거 거래 재분석에는 여전히 유효한 기법이다. 【업계 추론】

### 6.4 EAE / EABE

- EAE: Eve가 Alice에게 보내고/받아 ground truth output을 확보한 뒤 Alice의 다른 rings에서 후보 제거·확률 추론. 【검증됨】 https://github.com/monero-project/monero-site/blob/HEAD/_posts/2018-02-19-logs-for-the-Monero-Research-Lab-meeting-held-on-2018-02-19.md
- EABE: KYC 거래소가 양쪽 endpoint의 ground truth를 갖는 변형. 【검증됨】 https://github.com/monero-project/monero-site/blob/HEAD/_posts/2018-02-19-logs-for-the-Monero-Research-Lab-meeting-held-on-2018-02-19.md

### 6.5 OSPEAD (통계적 decoy 구별)

- 익명 관측에서 실제 spend-age 분포를 추정하는 기법(Bonhomme–Jochmans–Robin + Patra–Sen inversion). 【검증됨】 https://github.com/Rucknium/OSPEAD/blob/main/README.md
- 현재 분포와 decoy 분포 차이를 이용한 MAP decoder 성공률 23.5%, nominal 6.25%(1/16) 대비 effective ring size 4.2. 【검증됨】 https://github.com/Rucknium/OSPEAD/blob/main/README.md / https://www.getmonero.org/ru/2025/04/05/ospead-optimal-ring-signature-research.html
- OSPEAD 제안 분포 적용 추정 시 성공률 7.6%, effective ring size 13.2. 【검증됨】 https://github.com/Rucknium/OSPEAD/blob/main/README.md
- **평균적 probabilistic best guess이며 개별 ring 확정 식별이 아니다.** 【검증됨】 https://github.com/Rucknium/OSPEAD/blob/main/README.md

### 6.6 네트워크층: Dandelion++·Tor

- Dandelion++: stem 단계에서 소수 경로로 전달 후 fluff diffusion. first-spy보다 origin attribution을 어렵게 하지만 완전 방지 아님. 【검증됨】 https://arxiv.org/pdf/1805.11060 / https://arxiv.org/pdf/2201.11860
- Tor: 관측자가 clearnet IP 대신 Tor exit/onion endpoint를 보게 해 직접 IP attribution을 약화하나, 악성 entry/hidden-service, traffic correlation, endpoint 로그는 남는다. 【업계 추론】 https://github.com/sethforprivacy/sethforprivacy.com/blob/HEAD/content/posts/comparing-private-spends.md

---

## 7. Zcash

### 7.1 기본 구조

- note commitment는 value/recipient/randomness를 숨겨 Merkle tree에 삽입. spend 시 nullifier 공개로 중복 지출 방지, commitment와 직접 연결되지 않음. 【검증됨】 http://arxiv.org/pdf/1805.03180
- zk proof는 note membership, spending key 보유, nullifier 계산, value conservation을 증명한다. 【검증됨】 http://arxiv.org/pdf/1805.03180
- transparent↔shielded 경계에서는 공개 net value, 시간, 공개 주소가 관찰되지만 z→z 내부 sender/recipient/개별 amount는 알 수 없다. 【검증됨】 http://arxiv.org/pdf/1805.03180

### 7.2 Boundary analysis (Kappos et al. 2018)

- 당시 founder/miner 패턴으로 shielded 출금 가치 65.6%를 관련 입금에 연결, 일반 휴리스틱 3.5% 추가, 총 69.1% anonymity set 축소 주장. 【검증됨】 http://arxiv.org/pdf/1805.03180
- **이 결과는 당시 Sprout/사용 행태에 한정**되며 현행 풀(Orchard 등)에 그대로 적용하면 안 된다. 【업계 추론】

### 7.3 Turnstile

- 풀 간 이동 총액을 공개적으로 계량해, 풀에서 나갈 수 있는 총액이 들어온 총액을 넘지 않게 하는 aggregate supply invariant. 【검증됨】 http://arxiv.org/pdf/1805.03180
- Sprout→Sapling→Orchard turnstile migration의 공식 문서는 이번 조사에서 1차 확인하지 못함 (Could not verify 참조).

---

## 8. 브릿지

### 8.1 브릿지 유형

- lock-mint: A체인에 잠그고 B체인에 wrapped mint; 역방향은 burn-unlock. 【검증됨】 https://github.com/st7mpy/defigrail/blob/HEAD/content/topics/bridges.mdx
- native burn-mint: 발행자가 source에서 burn 후 destination에서 같은 native representation을 mint. 【검증됨】 https://github.com/st7mpy/defigrail/blob/HEAD/content/topics/bridges.mdx
- liquidity network: 양쪽 pool/relayer/bonder가 destination native liquidity를 먼저 지급하고 나중에 정산. 【검증됨】 https://github.com/st7mpy/defigrail/blob/HEAD/content/topics/bridges.mdx

### 8.2 Deterministic pairing 키 (이벤트 로그)

- Wormhole: `LogMessagePublished` ↔ `TransferRedeemed` — sequence + emitter chain + emitter address. 【검증됨】 https://github.com/gl0bal01/intel-codex/blob/HEAD/Investigations/Techniques/sop-blockchain-investigation.md
- LayerZero: `Packet`/`PacketSent` ↔ `PacketReceived`/executor delivery — nonce + src/dst chain + sender/receiver. 【검증됨】 https://github.com/gl0bal01/intel-codex/blob/HEAD/Investigations/Techniques/sop-blockchain-investigation.md
- Across: `FundsDeposited` ↔ `FilledRelay` — deposit ID + src/dst. 【검증됨】 https://github.com/gl0bal01/intel-codex/blob/HEAD/Investigations/Techniques/sop-blockchain-investigation.md
- 위는 **확정 링크**다. 반면 시간-가치·수수료 차감·relayer reuse 매칭은 deterministic ID가 없을 때의 **추론적 matching score**로 수식화해야 한다. 【업계 추론】

### 8.3 수사 활용

- TRM 등 상용 플랫폼은 브릿지·스왑 서비스를 넘나드는 자동 크로스체인 추적을 제공한다. 【검증됨】 https://walletinvestor.com/news/crypto-news/chainalysis-alternatives-best-blockchain-analytics-and-transaction-monitoring-tools/
- 소스·목적 체인의 금액(수수료 차감 반영), 시간 윈도우, relayer/filler 재사용을 결합한 상관분석이 표준이다. 【업계 추론】 https://github.com/TrustlessCrypto/dai-intelligence/blob/main/docs/requirements/blockchain-analytics/KYT-AML-USE-CASES.md

---

## 9. KYT 시스템 아키텍처

### 9.1 데이터 파이프라인 (공개 문서 기반 일반 구조)

- 소스: full/archive 노드 또는 RPC provider → 블록·로그·트레이스 + mempool 수집. 【검증됨】 https://medium.com/@gwrx2005/implementing-data-workflows-and-analytics-in-blockchain-finance-a-practical-perspective-3c514dd83b33
- streaming bus(Kafka급) → canonical ETL → reorg 처리(idempotent upsert) → raw warehouse + graph store. 【업계 추론】 https://medium.com/@gwrx2005/implementing-data-workflows-and-analytics-in-blockchain-finance-a-practical-perspective-3c514dd83b33
- 오픈소스 라벨링 구조(GrowThePie): 체인별 ETL 후 공통 스키마·라벨 병합. batch+stream 하이브리드, multi-chain 공통 스키마가 표준 패턴. 【구현 예】 https://github.com/growthepie/gtp-backend/blob/HEAD/backend/labeling/notes/architecture.md

### 9.2 스코어링·알러트

- category, service, direct/indirect exposure, direction, amount, value threshold가 alert severity에 사용된다. 【검증됨】 https://www.finextra.com/pressarticle/79570/chainalysis-launches-real-time-alerts-for-suspicious-cryptocurrency-transactions / https://www.enterprisetimes.co.uk/2019/08/27/chainalysis-launches-suspicious-transaction-alert-tool/
- 실시간 API + case-management UI + audit trail이 표준 구성이다. 【검증됨】 https://www.enterprisetimes.co.uk/2019/08/27/chainalysis-launches-suspicious-transaction-alert-tool/
- TRM Beacon: 검증된 조사관이 플래그한 주소 → 관련 지갑으로 자동 전파 → 참여 거래소·발행사에 실시간 알림 → 인출 전 동결. 【검증됨】 https://www.infosecurity-magazine.com/news/trm-labs-beacon-network-fight/
- 지연 목표는 공개되지 않았다. **설계 추론**: mempool alert 초 단위, block-confirmed enrichment 블록 도착 후 수초~수분, historical ETL은 체인 처리량 이상 지속 처리 + reorg idempotency. 【업계 추론】

### 9.3 탐지 로직 요구사항 (KYT 유스케이스 문서)

- 금액±허용오차, 시간 윈도우, relayer/filler 재사용을 결합한 크로스체인 전파. 【검증됨】 https://github.com/TrustlessCrypto/dai-intelligence/blob/main/docs/requirements/blockchain-analytics/KYT-AML-USE-CASES.md
- taint 회계: poison(전체 오염) / haircut(비례) / FIFO(순서 기반) 중 정책 선택. 【검증됨】 https://github.com/TrustlessCrypto/dai-intelligence/blob/main/docs/requirements/blockchain-analytics/KYT-AML-USE-CASES.md
- TRM Signatures 같은 behavioral intelligence: 알려진 악성 주소가 아닌, 세탁·사기 패턴 자체를 탐지하는 레이어. 【검증됨】 https://walletinvestor.com/news/crypto-news/chainalysis-alternatives-best-blockchain-analytics-and-transaction-monitoring-tools/

---

## 10. 종합 요약표: 볼 수 있는 것 / 확률적으로 좁힐 수 있는 것 / 온체인만으로 볼 수 없는 것

| 구분 | 내용 |
|---|---|
| **볼 수 있는 것 (확정)** | 브릿지 이벤트의 deterministic pairing (sequence/nonce/deposit ID) 【8.2】; Tornado 입출금 금액·시간·relayer 수수료 【2.1】; Monero 링 멤버십 집합과 nullifier 【6.1】; Zcash 경계 net value·시간·공개 주소 【7.1】; CREATE/CREATE2 파생 관계 【3.1】; 서비스 attribution 라벨(DB에 있는 경우) 【5.1】 |
| **확률적으로 좁힐 수 있는 것** | UTXO 클러스터(CIOH+change, 오탐 존재) 【1.1–1.3】; Tornado H1/H2/H3 디믹싱 (5–35%, 저신뢰 FIFO 포함) 【2.2】; EVM 가스·nonce 지문 【3.3】; first-spy IP 추정 【5.2】; Monero OSPEAD/MAP (개별 링 확정 아님) 【6.5】; Zcash boundary analysis 【7.2】; ML 스코어 (precision/recall 트레이드오프) 【4.2】; relayer reuse·시간-가치 브릿지 매칭 【8.2】 |
| **온체인만으로 볼 수 없는 것** | Monero 실제 sender·금액·수취인 (링 내부) 【6.1】; Zcash z→z 내부 sender/recipient/금액 【7.1】; Tornado commitment↔nullifier 연결 (H1–H3 외) 【2.2】; 서비스 omnibus 지갑 내부 고객 귀속 【5.4】; private mempool/RPC 사용 여부 【3.6】; 자연인 신원 (법적 절차 없이) 【5.4】; 상용 스코어링 내부 가중치·공식 【4.3】 |

---

## 11. 검증/추론 구분 요약

**검증된 사실 (1차·학술·공식 문서에서 확인)**
- UTXO 클러스터링의 CIOH·change 휴리스틱 종류, CoinJoin 지문(Whirlpool/Wasabi 수치), GraphSense 2026-04 휴리스틱 추가
- Tornado 구조·H1/H2/H3 수치(단, 2510.09433은 철회 표시 버전 — 학술 수치로만 취급), Tutela 가스·지갑 지문, Nova 임의금액·shielded transfer, Privacy Pools association set
- Elliptic 166 features와 각 모델 F1 수치 (단, split 상이 — 순위화 금지), illicit 약 2% 불균형
- CREATE/CREATE2 수식, MEV searcher→builder→relay 구조와 explorer 라벨, private mempool 증명 불가
- TRM flipbook A–D 절차와 "서비스를 통과해 추적 불가" 원칙, Beacon 네트워크 동작, Chainalysis 실시간 알럿의 severity 입력값
- Monero ring 16·RingCT·stealth·decoy 역사·gamma 버그 수정·ZMR/cascade·EAE/EABE·OSPEAD 수치(23.5%/4.2, 제안분포 7.6%/13.2)
- Zcash note/nullifier 구조와 Kappos 69.1% (2018 Sprout 한정)
- 브릿지 3유형과 Wormhole/LayerZero/Across 이벤트 키
- KYT 요구문서의 taint 회계(poison/haircut/FIFO), VASP DB 언급, TRM Signatures behavioral 레이어

**업계 표준 기반 추론 (정확한 내부 수치·공식은 비공개이므로 일반 패턴으로 서술)**
- CoinJoin 탐지 시 병합 억제, 약한 edge의 provenance 유지 방식
- Nova에서 고정액 FIFO 모델이 그대로 적용 불가
- EVM peel chain·Approval 그래프·deployer 팩토리 묶음의 수사 활용
- node2vec/GraphSAGE 임베딩, risk propagation vs taint 회계 구분, 룰+ML 결합
- test deposit의 클러스터 확장 한계, Tor 잔여 리스크
- 브릿지 추론적 matching score, KYT 지연 목표(초~수분)
- 상용 vendor 고유 알고리즘·스코어링 공식은 공개되지 않음

**구현 예 (특정 오픈소스, 업계 표준 아님)**
- bitcoin-sentinel의 peel-chain 비율 1–25%·3회 연속 규칙
- GrowThePie 라벨링 아키텍처
- DAI intelligence 문서의 ~500 VASP DB 언급

---

## 12. Could not verify / 한계

- arXiv 2510.09433의 "새 버전 철회" 표시: 결과 인용 시 버전 상태 명시 필요
- Zcash Sprout→Sapling→Orchard turnstile migration의 공식 spec/ZIP URL을 1차 확인하지 못함
- Monero 패치 높이·버전의 공식 릴리스 교차검증 미완 (PR #7821 논의만 확인)
- LayerZero·Wormhole 공식 문서/소스코드로 이벤트 키를 재검증하지 못함 (2차 SOP 문서 인용)
- 시뮬레이션 오탐률(63.46%/92.66%/57.47%)은 실제 상용 정밀도와 다른 지표
- 그래프 ML 수치들은 데이터셋·split이 달라 직접 비교 불가
- 2026년 검색 결과의 Zcash "Ironwood" 등은 1차 출처 없이 미사용

---

## 13. Sources

### UTXO
- http://arxiv.org/pdf/1706.00916v2 (clustering 기초)
- https://github.com/gl0bal01/intel-codex/blob/HEAD/Investigations/Techniques/sop-blockchain-investigation.md (SOP)
- https://en.Bitcoin.it/w/index.php?title=Privacy&diff=cur&oldid=56872 (change heuristics)
- https://arxiv.org/pdf/2105.09078 (CoinJoin 탐지)
- https://orbi.uliege.be/bitstream/2268/314439/1/paper.pdf (fingerprinting)
- https://inria.hal.science/hal-05315736/file/526450_1_En_11_Chapter.pdf (오탐률 시뮬레이션)
- https://arxiv.org/pdf/2109.10229 (CoinJoin 지문)
- https://github.com/graphsense/graphsense.github.io/blob/HEAD/news.md (GraphSense 2026-04)
- https://github.com/graphsense/graphsense-lib/blob/HEAD/clients/python/README.md
- https://github.com/graphsense/graphsense-transformation/blob/main/docs/transformation-concept.md (병합 개념)
- https://github.com/abdulwahed-sweden/bitcoin-sentinel/blob/HEAD/THREAT_MODELS.md (peel 구현 예)

### Tornado / 믹서
- https://arxiv.org/abs/2510.09433v1 / https://arxiv.org/pdf/2510.09433v2 (디믹싱, 철회 표시 주의)
- https://arxiv.org/pdf/2201.06811 (Tutela)
- https://cryptobriefing.com/defi-project-spotlight-tornado-cash-ethereums-top-privacy-tool/?utm_source=main_feed&utm_medium=rss (Nova)
- https://hackmd.io/@ak36/tornado_cash_nova_demo (Nova 데모)
- https://github.com/firoorg/firo-site/blob/HEAD/guide/privacy-technology-comparison.md (Privacy Pools 비교)
- https://iacr.steepath.eu/2023/273-DerechoPrivacyPoolswithProofCarryingDisclosures.pdf (Privacy Pools)

### EVM
- https://github.com/ethereumbook/ethereumbook/blob/HEAD/src/chapter_6.md (nonce)
- https://github.com/bengalcatbalu/eip-security-handbook/blob/HEAD/src/eips/opcodes/eip-1014.md (CREATE2)
- https://github.com/foundry-rs/book/blob/HEAD/src/pages/guides/deterministic-deployments-using-create2.mdx (CREATE/CREATE2)
- https://medium.com/@c.e.hirschauer/inside-the-dark-forest-the-maximal-extractable-value-playbook-8830f62f5511 (MEV 구조)
- https://cointelegraph.com/news/mev-bot-intercepts-77m-in-rseth-from-ethereum-wallet-exploit (Yoink 사례)
- https://github.com/sunweb3sec/defihacklabs/blob/HEAD/academy/onchain_debug/06_write_your_own_poc/en/readme.md (explorer 라벨)
- https://github.com/neversight/learn-skills.dev/blob/HEAD/data/skills-md/agentic-reserve/blockint-skills/mev-bot-infrastructure-analysis-agent/SKILL.md (MEV 포렌식 한계)

### 그래프 ML
- http://arxiv.org/abs/1908.02591 (Elliptic/Weber)
- https://escholarship.org/content/qt8rq2v0zz/qt8rq2v0zz.pdf (성능 인용)
- https://arxiv.org/pdf/2602.23599v1.pdf (후속 비교)
- https://www.nature.com/articles/s41598-025-08365-9?error=cookies_not_supported&code=50c3fb3f-a68c-4fff-a1ab-caaf612fa29c (ChebNet/GATv2/TFGAT)

### 귀속·OSINT / KYT
- https://arXiv.org/pdf/2109.00376 (first-spy)
- https://cdn.prod.website-files.com/6082dc5b670562507b3587b4/698a5391bf77755a3a3e924b_TRM%20-%20Blockchain%20Investigator%27s%20Flip%20Book%20-%20US.pdf (TRM 절차)
- https://cdn.prod.website-files.com/6082dc5b670562507b3587b4/6806c836d610e22b1cdced37_TRM_Crypto Compliance Program Guide for Financial Institutions_Part 4.pdf (서비스 통과 추적 불가)
- https://www.finextra.com/pressarticle/79570/chainalysis-launches-real-time-alerts-for-suspicious-cryptocurrency-transactions (실시간 알럿)
- https://www.enterprisetimes.co.uk/2019/08/27/chainalysis-launches-suspicious-transaction-alert-tool/ (알럿·케이스관리)
- https://www.infosecurity-magazine.com/news/trm-labs-beacon-network-fight/ (Beacon)
- https://walletinvestor.com/news/crypto-news/chainalysis-alternatives-best-blockchain-analytics-and-transaction-monitoring-tools/ (TRM Signatures·크로스체인)
- https://github.com/TrustlessCrypto/dai-intelligence/blob/main/docs/requirements/blockchain-analytics/KYT-AML-USE-CASES.md (KYT 요구·taint·VASP DB)
- https://github.com/TrustlessCrypto/dai-intelligence/blob/main/docs/requirements/blockchain-analytics/blockchain-analytics-requirements.md
- https://medium.com/@gwrx2005/implementing-data-workflows-and-analytics-in-blockchain-finance-a-practical-perspective-3c514dd83b33 (파이프라인)
- https://github.com/growthepie/gtp-backend/blob/HEAD/backend/labeling/notes/architecture.md (라벨링 구조)

### Monero
- https://www.getmonero.org/resources/moneropedia/ringsignatures.html
- https://www.getmonero.org/resources/moneropedia/ringCT.html
- https://www.getmonero.org/resources/moneropedia/stealthaddress.html
- https://github.com/anoni-net/docs/blob/HEAD/docs/en/advanced/zk-identity-payments.md (종합 구조)
- https://ar5iv.labs.arxiv.org/html/1812.02808 (gamma decoy)
- https://github.com/monero-project/monero/pull/7821 (decoy 버그 수정)
- http://fc19.ifca.ai/preproceedings/27-preproceedings.pdf (zero-mixin/cascade)
- http://link.springer.com/content/pdf/10.1007/978-3-319-66399-9_9.pdf (MONitERO)
- https://github.com/monero-project/monero-site/blob/HEAD/_posts/2018-02-19-logs-for-the-Monero-Research-Lab-meeting-held-on-2018-02-19.md (EAE/EABE)
- https://github.com/Rucknium/OSPEAD/blob/main/README.md (OSPEAD)
- https://www.getmonero.org/ru/2025/04/05/ospead-optimal-ring-signature-research.html
- https://arxiv.org/pdf/1805.11060 (Dandelion++)
- https://arxiv.org/pdf/2201.11860 (Dandelion++ 후속)
- https://github.com/sethforprivacy/sethforprivacy.com/blob/HEAD/content/posts/comparing-private-spends.md (subaddress·Tor 맥락)

### Zcash
- http://arxiv.org/pdf/1805.03180 (Kappos et al., boundary/turnstile)

### 브릿지
- https://github.com/st7mpy/defigrail/blob/HEAD/content/topics/bridges.mdx (3유형)
- https://github.com/gl0bal01/intel-codex/blob/HEAD/Investigations/Techniques/sop-blockchain-investigation.md (이벤트 키)

### 노트 파일
- notes/tornado-2510.09433.md, notes/tornado-detail.md, notes/graph-ml.md, notes/bridges.md (2026-09-27 조사 기록)
