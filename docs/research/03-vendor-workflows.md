# 상용 블록체인 분석 업체의 자금 추적 기술 해부: 공개 프레임워크·API·오픈소스와 실제 수사 사례

> 작성일: 2026-09-27 (UTC) · 연구 세션 ID: vendor-tracking-workflow-20260927-0754
> 원칙: **공개된 1차 자료(업체 개발자 문서·API 레퍼런스·백서·법정 문서·오픈소스)만 사용.** 공개되지 않은 내부 알고리즘·스코어링 가중치는 발명하지 않는다. 모든 주장에 URL을 붙이고, 아래 세 태그로 구분한다.
> - `검증됨(공개 1차 자료)`: 업체 공식 문서·개발자 문서·백서·법정 문서·오픈소스 코드에서 직접 확인
> - `업계 추론`: 1차 자료를 근거로 합리적으로 추론되나 직접 공개 근거가 없는 내용
> - `비공개(추론 불가)`: 업체가 공개하지 않아 검증할 수 없는 내부 동작

---

## Summary (핵심 요약)

1. **KYT(실시간 모니터링)** 와 **Investigator(사후 추적)** 는 같은 데이터 파이프라인 위의 두 애플리케이션이다. Chainalysis·Elliptic·TRM 모두 "동일한 데이터/리스크 로직을 screening·monitoring·investigation이 공유"한다는 점을 공식적으로 밝힌다. `검증됨(공개 1차 자료)`
2. 상용사의 전체 동작을 관통하는 공통 아키텍처가 존재한다: 풀노드/RPC·블록 파일 수집 → raw 정규화·저장 → 체인별 그래프 생성(UTXO 트랜잭션/주소 그래프 또는 account/token transfer 그래프) → 클러스터링/엔티티 그룹핑 → attribution 라벨 DB 결합 → direct/indirect exposure·행위 규칙·제재 리스트 기반 경보/점수 산출 → API/webhook/지속 리스크리닝 → KYT 경보·케이스 큐 → 조사 그래프 전후방 확장·크로스체인 추적 → VASP/custodian 같은 leverage point 식별 → 소환장/영장/MLAT/동결 요청 → KYC·IP·계정·장치/서버 증거로 신원 확정 → 그래프·타임스탬프·라벨·감사 로그를 증거/보고서로 export. 각 단계의 근거는 본문에 인용한다.
3. **공개된 것만으로 확인할 수 있는 것**: API 경로·요청/응답 필드(공개 Sanctions API, GraphSense REST), 클러스터링 공개 구현(GraphSense의 Rust union-find, CoinJoin co-spend 제외), KYT 경보 입력 항목(category·service·direct/indirect exposure·fund direction·amount·Severe/High/Medium/Low), indirect exposure의 "식별된 서비스에 닿을 때까지 홉을 거슬러 올라감" 방식(Chainalysis 공식 FAQ), 경보 지연 "온체인 발생 후 수 초 이내"(Chainalysis 공식 FAQ), TRM Signatures의 탐지 패턴(peeling chains·layering·change of custody), 법정에서의 A→D 절차(입력→네트워크 맵핑→제3자 식별→법적 절차로 신원 확보). `검증됨(공개 1차 자료)`
4. **확인할 수 없는 것**: 모든 상용사의 exact clustering heuristics 전체 목록, risk score 가중치, confidence 임계값, exposure 전파 반경, KYT 엔터프라이즈 API의 정확한 endpoint/schema(로그인 게이트), Elliptic 개발자 API 스펙, Bonanza Factory의 TranSafer 제품 상세. → `비공개(추론 불가)` / `Could not verify`.
5. 실제 수사 5건에서 반복되는 패턴은 "툴의 그래프가 단독으로 신원을 확정하지 않는다"는 점이다. Welcome to Video는 서버 데이터+결제 교차검증+거래소 계좌 압수가, Silk Road는 서버 지갑↔압수 laptop 지갑의 블록체인 직접 흐름+관리자 증거가, Tornado Cash/ChipMixer는 인프라·결제 기록과 운영자 신원의 연결이 결정적이었다. Bitcoin Fog Daubert ruling은 Reactor 방법론을 인정하되 블록체인 분석을 "minor witness"(정밀한 선 긋기를 요구하지 않는 보조 증거)로 취급했고, 수사관은 TRM Labs와 수동 분석으로 결과를 교차검증했다.

---

## 1. KYT 실시간 모니터링 — 입력·처리·출력 단계

### 1.1 입력: 무엇을 받아 무엇을 계산하는가

KYT는 거래소·지갑 사업자의 **입금/출금 트랜잭션**을 실시간으로 받아 위험을 평가한다. Chainalysis KYT 공식 제품 페이지는 "Assess risk of incoming and outgoing cryptocurrency transactions on your platform"이라 정의한다. `검증됨(공개 1차 자료)` — https://www.chainalysis.com/product/kyt/

공개된 KYT 경보 입력 항목은 `category`(위험 범주), `service`(관련 서비스), direct/indirect exposure, fund direction(입금/출금), amount(금액)이며, 경보 등급은 Severe/High/Medium/Low 체계다. (2019년 공개 보도 기반 — https://www.enterprisetimes.co.uk/2019/08/27/chainalysis-launches-suspicious-transaction-alert-tool/ , 2차 자료이므로 보고서에서는 `검증됨(공개 1차 자료)`보다 한 단계 낮게 취급)

### 1.2 처리: 클러스터링 휴리스틱과 exposure 계산

Chainalysis는 공식 제품 페이지에서 내부 아키텍처를 이렇게 공개한다: "Our proprietary architecture ingests transaction data at scale, handles **hundreds of clustering heuristics**" — 즉 내부 클러스터링 휴리스틱이 **수백 개 수준**이라는 사실 자체는 공식 공개 정보다. 단, 각 휴리스틱의 구체 내용은 공개되지 않는다. `검증됨(공개 1차 자료)` — https://www.chainalysis.com/product/kyt/

Exposure 계산의 핵심 공개 사실:

- **Indirect exposure 측정 방식**: "Chainalysis measures indirect exposure by going back **as many hops as needed until an identified service**" — 홉 수를 고정하지 않고, 식별된 서비스(거래소 등 귀속된 엔티티)에 도달할 때까지 거슬러 올라간다. `검증됨(공개 1차 자료)` — https://www.chainalysis.com/product/kyt/ (FAQ)
- 이는 보고서 독자가 오해하기 쉬운 지점이다: "N홉 이내" 같은 고정 반경이 아니라 **식별된 서비스 도달 시점까지의 가변 깊이**다.

### 1.3 출력: 경보·대시보드·API

- **경보 지연**: "KYT monitors activity in real time and generates alerts **within seconds of a transaction occurring on chain**" — 온체인 발생 후 수 초 이내 경보 생성. `검증됨(공개 1차 자료)` — https://www.chainalysis.com/product/kyt/ (FAQ)
- 경보 관리: bulk 관리, case management 협업 ("Manage alerts in bulk and collaborate via case management")
- Overview dashboard: risk scores, alert overviews, volume by category, top counterparty interactions
- Custom groups: 특정 서비스 대상 alert (location, negative press, on-chain exposure 기준)
- Custom address lists: 모니터링 대상 주소 업로드/관리
- Behavioral alerts: 의심 행동 패턴 거래 알림
- Enhanced due diligence: alert를 Reactor에서 열어 심층 조사로 연결 → **KYT→Investigator 파이프라인이 공식 기능으로 연결**됨
- 지원 범위: 400+ networks, 50M+ tokens (FAQ)
- Risk tuning: "behavioral alerts, direct and indirect exposure"; alert thresholds, rules, typologies는 사용자가 완전 제어
- "teams can quickly integrate the KYT API" — API 통합이 공식 언급되나, **KYT 엔터프라이즈 API의 정확한 endpoint/schema는 로그인 게이트 뒤에 있어 공개 접근 불가** → `Could not verify`. 제3자 설계 문서에서 발견된 `/v2/users`, `/v1/transfers`, `/v1/addresses` 경로는 제3자 관찰일 뿐 1차 자료가 아니므로 파라미터를 만들지 않는다.

### 1.4 업체별 KYT 구현 비교

| 업체/제품 | 입력 | 처리(공개된 부분) | 출력 | 근거 |
|---|---|---|---|---|
| Chainalysis KYT | 입출금 트랜잭션 | 수백 개 클러스터링 휴리스틱, direct/indirect exposure (식별 서비스 도달까지 홉 추적) | 실시간 경보(수 초), bulk 관리, case mgmt, KYT API | `검증됨(공개 1차 자료)` — https://www.chainalysis.com/product/kyt/ |
| Elliptic Lens | 사전 트랜잭션 wallet screening | configurable risk logic (동일 파이프라인 공유) | wallet risk profile, 사용자 임계값, 지속 모니터링 | `검증됨(공개 1차 자료)` — https://www.elliptic.co/hubfs/Elliptic_Guide_How_to_Defend_Your_Business_Against_Crypto_Crime.pdf?utm_campaign=Typologies%202023 |
| Elliptic Navigator | inbound/outbound 트랜잭션 | 사용자 위험 파라미터 | 실시간 monitoring, flag | 고객 사례 기반 — https://www.elliptic.co/media-center/how-bitget-improved-risk-prevention-by-99-with-elliptics-blockchain-intelligence |
| TRM Wallet Screening | 주소 | ownership risk + counterparty risk 반환 | risk categories (sanctions, terrorist financing, hacked/stolen funds, ransomware, scams 등) | `검증됨(공개 1차 자료)` — TRM 공식 백서 (notes/trm-forensics.md 참조) |
| Scorechain | 주소/지갑/트랜잭션 | configurable indicators (type/country/behaviour) | 0–100 risk score + category breakdown, red flags, audit trail | `검증됨(공개 1차 자료)` — https://www.scorechain.com/resources/crypto-glossary/btcscan ; https://www.scorechain.com/blog/scorechain-releases-risk-indicators-feature-to-enhance-compliance-for-cryptocurrency-risk-aml-solutions/ |
| Merkle Science Compass | 트랜잭션 | customizable rules, predictive behavioral analytics | 실시간 continuous monitoring, case-management workflow | `검증됨(공개 1차 자료)` — https://blog.merklescience.com/hubfs/One%20-%20Pager/Compass%20Factsheet_Nov%202023.pdf |
| Bonanza Factory TranSight | 블록체인 거래정보·지갑주소 | (2차 보도만) | 실시간 지갑 위험도, AML/FDS 연동 | 2차 보도 — https://bloomingbit.io/feed/news/111553 ; https://www.m-i.kr/news/articleView.html?idxno=1370584 |

---

## 2. Investigator 그래프 추적 — 주소 입력부터 케이스 저장까지

### 2.1 Chainalysis Reactor

공식 제품 페이지(https://www.chainalysis.com/product/reactor/, `검증됨(공개 1차 자료)`, 2026-09-27 실 브라우저 열람):

- **정의**: "Investigate and trace funds across blockchains"
- **엔티티 연결**: "It links on-chain activity to real-world entities using **ground-truth attributions and rigorous clustering**" — 온체인 활동을 실제 엔티티에 연결하는 두 기둥이 (1) ground-truth attribution, (2) rigorous clustering임을 공식 명시
- **추적 범위**: 27+ blockchains, 40M+ assets (FAQ); 134K+ unique real-world counterparties/organizations/services 연결
- **워크플로우**: "Follow the money at every step" — 최초 입금(first deposit)부터 최종 현금화(final cash-out)까지 추적, illicit network 매핑
- **자동화**: "Tasks that once demanded deep expertise and hours of parsing now happen in a click. Swaps, bridges, ..." — 스왑·브리지 같은 복잡한 파싱이 원클릭으로 처리 (구 Storyline 기능이 Reactor에 통합된 것으로 보임 — `업계 추론`. Storyline은 2022년 발표된 cross-chain tracking 기능이었으나 현재 제품 메뉴에 별도 링크가 없음)
- **KYT 연동**: "Reactor works hand in hand with KYT, carrying over alerts with risk scores, entities, and context" — 경보→조사의 공식 파이프라인
- **외부 툴 연동**: Cellebrite, Siren, i2 (디지털 포렌식·링크 분석)
- **하위 기능**: Rapid(AI triage), Wallet Scan(seed phrase → balances·historical activity·illicit links), Signals(30M+ 미식별 지갑 지표), Community, Labs
- **배포**: cloud / on-premises / FedRAMP

주의: "주소 입력 → 그래프 확장 → exposure 확인 → 케이스 저장"이라는 구체 UI 절차는 공식 페이지가 문장으로 풀지 않으므로 `Could not verify`로 처리한다. 발명하지 않는다.

### 2.2 TRM Forensics

공식 제품 페이지(http://www.trmlabs.com/blockchain-intelligence-platform/forensics, `검증됨(공개 1차 자료)`, index):

- **Universal tracing**: "Trace between entities and addresses, allowing for both rapid decision making at a macro level and the ability to drill into specific fund movements — **essential for legal process**"
- **미표시 flow 노출**: "TRM also surfaces flows between graph elements that are **not yet plotted**" — 그래프에 아직 그려지지 않은 노드 사이의 자금 흐름도 표면화
- **Signatures®**: "TRM automatically detects and surfaces suspicious patterns across transactions"; "Automatically trace common programmatic tactics, such as **peeling chains and layering**, and identify more difficult patterns such as **potential change of custody**" — 탐지 패턴 예시(peeling chains, layering, change of custody)가 공식 명시됨. 내부 패턴 모델·가중치는 `비공개(추론 불가)`
- **Glass box attribution**: "the only blockchain intelligence platform that shows you the **attribution source and confidence score** … for every attribution, enabling **parallel reconstruction** of investigations for use as evidence in court" — 모든 attribution마다 출처와 confidence score를 공개해 법정에서 병렬 재구성(parallel reconstruction) 가능
- **Custom graph elements**: physical asset, financial institution, location 같은 오프체인 데이터를 조사 그래프에 추가·온체인 주소/엔티티와 연결
- **Seed Analysis**: seed phrase로 관련 지갑·잔액을 신속 식별 (압수 목적)
- **Automatic cross-chain tracing**; **Multi-route pathfinding**: "See and visualize every path between an address and any category or entity through multiple hops"
- **Transaction fingerprinting**: "Quickly find BTC transactions using limited information or search based on specific transactional patterns"
- Case management (graphs/notes 통합), graph customizations, export in common formats
- 사례: FBI Qakbot — $8.6M 랜섬웨어 자금 압수

### 2.3 TRM 공식 조사 절차 (Flip Book A–D)

공식 법집행 가이드(https://www.trmlabs.com/guides/the-blockchain-investigators-flip-book-a-guide-for-law-enforcement, `검증됨(공개 1차 자료)`):

- **A. 입력**: transaction hash, incoming/outgoing addresses 등의 정보를 TRM Labs Graph Visualizer 같은 블록체인 추적 소프트웨어에 입력
- **B. 네트워크 맵핑**: transaction network를 맵핑해 **leverage point**(지렛대 지점) 식별
- **C. 제3자 식별**: 주소의 controller에 대한 정보를 보유할 수 있는 제3자(third parties) 식별
- **D. 법적 절차**: legal process로 제3자로부터 controller 정보 확보
- 전체 흐름: 1. Identify illicit conduct → 2. Trace proceeds → 3. Seek disruption → 4. Serve legal process
- 주소 조회 후 검토 항목: 거래 수, 최근 거래 시점, 보유가치, 더 큰 주소 네트워크 소속 여부, attribution/risk 여부

이는 본 보고서 전체의 수사 워크플로우(섹션 8)와 정확히 일치하는, 업체가 공식 문서로 공개한 절차다.

### 2.4 Triage (현장 초동)

공식 가이드(https://www.trmlabs.com/guides/identifying-crypto-artifacts-in-the-field-flip-book, `검증됨(공개 1차 자료)`): 주소/tx hash 검색 → chain·거래 수·총거래량·USD 잔액·귀속정보 확인 → Insights/Details 검토 → VASP, 고위험 exposure, 모니터링·전문가 escalation 판단.

### 2.5 Elliptic Investigator

공식 제품 페이지(https://www.elliptic.co/products/investigator/, `검증됨(공개 1차 자료)`):

- wallet/transaction을 자동 fund-flow graph로 변환
- one-click cross-chain/bridge tracing
- entity attribution
- graph, timestamp, label을 규제·법원용 형식으로 export

플랫폼 페이지(https://www.elliptic.co/products/): "동일한 저지연 data pipeline·dataset·configurable risk logic을 screening, monitoring, investigation에서 공유" + API 접근 제공. 즉 Elliptic도 KYT와 Investigator가 같은 파이프라인 위의 애플리케이션이다.

---

## 3. 공개 API와 SDK — 경로·요청·응답

### 3.1 Chainalysis 공개 Sanctions API

`검증됨(공개 1차 자료)` (공개 문서 사본, index):

- `GET https://public.chainalysis.com/api/v1/address/{addressToCheck}`
- 헤더: `X-API-Key`
- 응답: `identifications[]` 내 `category`, `name`, `description`, `url`
- **이것은 무료 Sanctions API이며 KYT 엔터프라이즈 API가 아니다.** KYT 엔터프라이즈 API의 endpoint/schema는 로그인 게이트 뒤에 있어 `Could not verify`.

### 3.2 TRM 공개 API

`검증됨(공개 1차 자료)` (공식 개발자 문서 https://docs.trmlabs.com/):

- 공개되는 것은 **Sanctions API와 Chainabuse API** (공식 문서 홈 명시)
- Sanctions API v1: REST, form-encoded request, JSON response, 표준 HTTP 코드
- 기본 제한: 1 req/s, 100 req/day, 429 응답의 `Retry-After`
- 플랫폼 API 키는 이 공개 endpoint에 유효하지 않음
- 엔터프라이즈 주소 스크리닝·엔티티 리스크의 정확한 endpoint는 공식 공개 문서로 미검증 → `Could not verify`

### 3.3 GraphSense REST (오픈소스)

`검증됨(공개 1차 자료)` (GitHub graphsense-lib, index):

```python
graphsense.Configuration(host="https://api.iknaio.com")
configuration.api_key['api_key'] = os.environ["API_KEY"]
with graphsense.ApiClient(configuration) as api_client:
    graphsense.AddressesApi(api_client).get_address(currency, address, include_actors=True)
```

- `get_address(currency, address, include_actors=True)` → `GET /{currency}/addresses/{address}`
- `get_address_cluster(...)` → `GET /{currency}/addresses/{address}/cluster`
- `get_address_entity(...)` → deprecated alias
- `get_tag_summary_by_address`, `list_address_links`, `list_address_neighbors`, `list_address_txs`, `list_related_addresses`, `list_tags_by_address`
- `list_cluster_addresses(currency, cluster, page=None, pagesize=10)`
- 편의 wrapper: `GraphSense(api_key="...", currency="btc").lookup_address(..., with_tags=True, with_cluster=True, with_tag_summary=True)`; raw 호출 `gs.raw.txs.list_address_txs("btc", "...")`
- 참고: https://github.com/graphsense/graphsense-lib/blob/HEAD/clients/python/docs/AddressesApi.md, https://github.com/graphsense/graphsense-lib/blob/HEAD/clients/python/docs/ClustersApi.md, https://github.com/graphsense/graphsense-lib/blob/HEAD/clients/python/README_EXT.md

### 3.4 Elliptic / Scorechain / Merkle API

- Elliptic: 플랫폼 페이지에서 API 접근 제공을 공식 언급하나, 정확한 endpoint·request/response schema는 공식 공개 문서로 미검증 → `Could not verify` (docs.elliptic.co는 이번 세션에서 도구 접근 실패)
- Scorechain: 공식 OpenAPI 후보(https://tech-doc.api.scorechain.com/api.yaml) 미열람. 제3자 통합 문서의 `POST /scoringAnalysis`, `POST /scoringAnalysis/evmPortfolio`, `POST /registerDeposit`, `POST /registerWithdrawal`, `GET /scenarios/alerts`, `GET /reports`는 제3자 관찰일 뿐 → `Could not verify`

---

## 4. 데이터 파이프라인과 클러스터링 — 공개된 구현 해부

### 4.1 GraphSense transformation pipeline (오픈소스 전체 공개)

`검증됨(공개 1차 자료)` — https://github.com/graphsense/graphsense-spark/blob/HEAD/README.md (2026-09-27 열람):

1. **Ingest**: graphsense-lib가 raw block/transaction data를 Apache Cassandra에 ingest (`graphsense-cli ingest from-node -e dev -c {NETWORK}` → `{NETWORK}_raw` keyspace: `exchange_rates`, `transaction`, `block` 테이블)
2. **Transform**: Spark 파이프라인이 **address graph와 de-normalized views**를 계산해 다시 Cassandra에 저장 (transformed keyspace)
3. **Serve**: GraphSense REST가 이를 제공하고, graphsense-dashboard의 주 데이터 소스로 사용
4. **Writer**: `cassandra`(CQL write path) 또는 `sidecar`(SSTable bulk load)
5. 해당 repo는 **archived**이며, 파이프라인은 graphsense-lib monorepo의 `spark/`로 이전됨

이것이 상용 파이프라인의 공개 레퍼런스 구현이다: **raw 수집 → 그래프/역정규화 변환 → REST 서빙**의 3단 구조는 모든 상용사가 공유하는 아키텍처의 공개 버전이다 (`업계 추론`).

### 4.2 Clustering 공개 구현

`검증됨(공개 1차 자료)`:

- 최신 구현: block chunk read → **Rust union-find clustering engine** → mapping → `fresh_address_cluster`, `fresh_cluster_addresses`
- 함수: `Clustering.process_transactions`, `get_mapping`, `rebuild_from_mapping`, `get_diff` — https://github.com/graphsense/graphsense-lib/releases/tag/v2.13.0
- v2.15.0 변경: cluster ID는 `min(address_id)`, **CoinJoin co-spend 제외**, multi-member cluster만 저장, singleton은 read 시 합성 — https://github.com/graphsense/graphsense-lib/releases/tag/v2.15.0

즉 공개적으로 확인되는 핵심 클러스터링 메커니즘은 **co-spend union-find + CoinJoin 제외**다. 상용사들의 "수백 개 휴리스틱"(Chainalysis 공식 문구)의 구체 내용은 `비공개(추론 불가)`.

### 4.3 Elliptic 166-feature 연구 모델 — 제품과의 분리선

`검증됨(공개 1차 자료)` — 논문 https://econpapers.repec.org/paper/arxpapers/1908.02591.htm:

- 203,769 Bitcoin transaction nodes, 234,355 payment edges, **166 node features** (일부 non-public)
- LR/RF/MLP/GCN 비교, 논문에서는 RF 우세
- 공개된 feature 범주 수준: 시간 특징(time step), 집계 특징(입출금 수·금액·수수료 등), graph-local features

**중요**: 이 연구 데이터셋이 현재 Lens/Navigator 제품의 실제 production scoring model이라는 **공개 근거는 없다**. 제품에서는 risk rules, score, exposure category로 노출되지만, 166개 feature와 production score의 직접 매핑은 `비공개(추론 불가)`다. 보고서 독자가 흔히 하는 오해(연구 모델 = 제품 모델)를 명시적으로 차단한다.

### 4.4 Cross-chain tracing (공개 원리)

`검증됨(공개 1차 자료)`:

- Elliptic Nexus/Holistic Screening 백서: multi-asset screening, same-chain cross-asset tracing, cross-chain tracing — https://www.elliptic.co/hubfs/State%20of%20cross-chain%20crime/Elliptic_Cross-Chain_Crime_Report.pdf
- Chainalysis Reactor: "Swaps, bridges … happen in a click" (스마트컨트랙트 파싱 기반) — https://www.chainalysis.com/product/reactor/
- TRM Forensics: automatic cross-chain tracing, multi-route pathfinding — http://www.trmlabs.com/blockchain-intelligence-platform/forensics

브리지 추적의 공개 원리는 **소스 체인의 lock/burn 이벤트와 목적 체인의 mint/release 이벤트를 브리지 컨트랙트 로그로 페어링**하는 것이다 (`업계 추론` — 오픈소스 SOP 문서가 이 원리를 기술: https://github.com/gl0bal01/intel-codex/blob/HEAD/Investigations/Techniques/sop-blockchain-investigation.md). 각 사의 정확한 페어링 알고리즘은 `비공개(추론 불가)`.

---

## 5. 업체별 워크플로우 비교표

| 단계 | Chainalysis | TRM Labs | Elliptic | GraphSense(OSS) |
|---|---|---|---|---|
| 수집·정규화 | proprietary architecture, 대규모 ingest (공식 문구) | 수백 네트워크 ingest (플랫폼) | 동일 저지연 pipeline 공유 | Cassandra raw keyspace (`{NETWORK}_raw`) |
| 클러스터링 | 수백 개 휴리스틱 (구체 비공개) | wallet clustering (구체 비공개) | (구체 비공개) | Rust union-find, CoinJoin co-spend 제외 (공개) |
| Attribution | ground-truth attributions, 134K+ counterparties | glass box: source+confidence score 공개 | entity attribution | tags (공개 API) |
| KYT/스크리닝 | KYT: 실시간 경보(수 초), direct/indirect exposure | Wallet Screening: ownership+counterparty risk | Lens/Navigator: configurable risk logic | — (분석용) |
| Investigator | Reactor: 그래프 추적, KYT 경보 연계, Cellebrite/Siren/i2 연동 | Forensics: universal tracing, Signatures®, seed analysis, multi-route pathfinding | Investigator: 자동 fund-flow graph, one-click cross-chain | dashboard + REST |
| 패턴 탐지 | behavioral alerts | Signatures® (peeling chains, layering, change of custody) | typologies | — |
| 법집행 연계 | 120+ 전문가, Daubert 대응 | Flip Book A–D, Beacon network, Deconflict | 법원용 export | — |
| API | 공개 Sanctions API만 확인; KYT API는 gated | 공개 Sanctions/Chainabuse API; 엔터프라이즈는 gated | API 제공 언급; 스펙 미공개 | REST 전체 공개 |

---

## 6. 해외 실제 수사 사례 — 법정 문서로 확인된 추적 절차

### 6.1 Welcome to Video (손종우) — 서버 데이터 × 블록체인 교차검증

**법정 문서** (Case 1:19-cv-03098, forfeiture complaint, 사본): https://www.scribd.com/document/430595306/USA-vs-Twenty-Four-Cryptocurrency-Accounts

- ¶22: 서버 포렌식 이미지에서 WTV 호스팅 확인. 고객 데이터가 **어느 고객이 어느 BTC 결제와 연결**되는지 식별. 서버의 username/download 데이터와 결제 샘플을 교차검증 → 결제가 영상 다운로드와 대응. `검증됨(공개 1차 자료)` (법원 제출 문서 사본)
- ¶24: "**Analyzing the blockchain revealed BTC addresses that laundered BTC to Welcome To Video from accounts hosted at BTC Exchange 1, BTC Exchange 2, and BTC Exchange 3**" — 블록체인 분석으로 WTV로 BTC를 세탁한 주소를 발견, 세 거래소의 계좌에서 유입됨을 확인. `검증됨(공개 1차 자료)`
- ¶25: 해당 거래소 계좌들이 압수 대상(Defendant Properties). `검증됨(공개 1차 자료)`

**워크플로우** (법정 문서 기반): 사이트가 사용자별 고유 deposit address 발급 → 서버 데이터와 온체인 결제 교차검증 → 거래소 유입 주소 클러스터링 → 거래소 계좌 특정 → 압수. DOJ: 사이트는 비트코인으로 운영, 최소 337명 체포, 23명 피해자 구조 (https://www.justice.gov/archives/ag/page/file/1326061/dl).

**신원 연결** (2차 보도, 보조): 서버 page source에서 노출된 IP를 한국 주거지로 추적하고, undercover 요원이 WTV 제공 계좌로 보낸 BTC가 손종우 명의·전화·이메일의 계좌로 이동한 정황이 공소에 적시됨 (https://lovelyti.com/2019/10/20/how-bitcoin-transactions-were-used-to-track-down-the-23-year-old-south-korean-operating-a-global-child-exploitation-site-from-his-bedroom/ — 2차).

주의: 이 사건에서 특정 상용 분석 툴의 사용이 법정 문서에 명시되어 있지 않으므로 기술하지 않는다.

### 6.2 Tornado Cash (Storm/Semenov) × Lazarus — 제재 주소 추적

**정부 1차** (IRS-CI, 2023-08-23): https://www.irs.gov/compliance/criminal-investigation/tornado-cash-founders-charged-with-money-laundering-and-sanctions-violations

- 혐의: money laundering conspiracy, sanctions violations conspiracy, unlicensed money transmitting business conspiracy
- "$1 billion in money laundering transactions", "laundered **hundreds of millions of dollars for the Lazarus Group**"
- Storm 체포(Washington), Semenov 도주 중. `검증됨(공개 1차 자료)`

**워크플로우** (공소 기반): OFAC 지정 blocked wallet → Tornado Cash 유입 flow 추적 → 운영자들이 "ineffective sanctions change"임을 private chats에서 인식했다는 공소 주장 → 인프라/결제 기록 → 운영자 신원 연결. 2022-04/05 Lazarus 해킹 수익이 Tornado Cash로 세탁된 사실은 IRS 보도에 명시. IRS 수사관이 "follow the flow of cryptocurrency transactions"으로 공소의 기초를 마련했다는 점은 2차 요약 (https://www.lexology.com/library/detail.aspx?g=0f826340-2c52-4a76-ab4d-2805f2fbd4cd).

이 사건의 교훈: 믹서 자체의 익명성에도 불구하고 **제재 지정 주소의 유입/유출 지점 + 운영 인프라의 오프체인 흔적**이 추적의 축이 된다 (`업계 추론`).

### 6.3 ChipMixer (Minh Quốc Nguyễn) — 서비스 클러스터 귀속 → 인프라 압수

**정부 1차** (DOJ EDPA, 2023-03-15): https://www.justice.gov/usao-edpa/pr/justice-department-investigation-leads-takedown-darknet-cryptocurrency-mixer-processed

- 2017–2023 약 **$3B** 처리 (ransomware, darknet market, fraud, crypto heists, hacking)
- 법원 승인으로 **도메인 2개 + GitHub 계정** 압수; 독일 BKA가 **backend servers + $46M+** 암호자산 압수
- Minh Quốc Nguyễn (49, Hanoi) 기소: money laundering, unlicensed money transmitting, identity theft. `검증됨(공개 1차 자료)`

**워크플로우** (`업계 추론` + 2차): 서비스 자금 클러스터 식별 → 범죄 서비스 귀속(Elliptic 분석: $844M+ 범죄 연계 BTC, Lazarus의 KuCoin/Axie Ronin/Harmony Horizon, LockBit·REvil 등 — https://thehackernews.com/2023/03/authorities-shut-down-chipmixer.html?hl=ru, 2차) → 도메인/GitHub/서버 압수 → 운영자 신원 기소. complaint 본문의 tracing 단계는 이번 세션에서 미확보 → `Could not verify`.

### 6.4 Bitcoin Fog (Roman Sterlingov) — Daubert ruling과 교차검증

**정부 1차** (IRS 판결 보도): https://www.irs.gov/compliance/criminal-investigation/jury-finds-russian-swedish-operator-of-bitcoin-fog-guilty-of-running-the-darknet-cryptocurrency-mixer

- 2011–2021 **120만 BTC 이상** (당시 약 $4억); darknet, narcotics, computer fraud, identity theft, WTV 연계
- "painstakingly tracing bitcoin through the blockchain". `검증됨(공개 1차 자료)`

**Daubert ruling의 핵심** (2차 분석 — https://finintegrity.org/lighting-up-the-darknet/):

- 사용 툴: **Chainalysis Reactor**. 법원은 방법론의 신뢰성을 인정했으나 블록체인 분석을 **"minor witness"**로 취급 — "precise line drawing"(정밀한 선 긋기)을 요구하지 않는 방식으로 사용되었다는 점이 핵심
- 법원은 Elliptic, TRM Labs의 툴도 Chainalysis와 **comparable**하다고 인정
- 수사관은 **TRM Labs로 결과를 교차검증**하고, 5개 주소는 블록체인을 **수동으로** 분석해 검증
- 블록체인 분석이 단독 증거가 아니라 **다른 증거(체포 시 소지품, 포럼 게시물, IP 분석, 수동 추적)와 결합**되어 사용됨

**반론** (법원 제출 defense expert report, CipherTrace Jonelle Still): http://storage.courtlistener.com/recap/gov.uscourts.dcd.232431/gov.uscourts.dcd.232431.159.1.pdf (Case 1:21-cr-00399-RDM, Document 159-1)

- Chainalysis가 false positive/error rate에 대한 통계 분석을 수행하지 않았다는 증언
- peel chain attribution 연구의 FDR 51.64% 인용

이 사건이 주는 방법론적 교훈: **휴리스틱 클러스터링의 오탐 문제는 법정에서 다퉈질 수 있으며, 실무에서는 복수 툴 교차검증 + 수동 검증이 표준**이다.

### 6.5 Silk Road (Ross Ulbricht) — 서버 지갑 ↔ laptop 지갑 직접 흐름

블록체인 요소는 **2차 보도** 수준으로만 확인 (법원 문서 직접 인용은 이번 세션 미수행 → `Could not verify`에 별도 기재):

- FBI 요원 Ilhwan Yum이 아이슬란드 서버의 지갑 주소와 압수된 laptop의 지갑 주소를 **블록체인에 교차검증**. laptop의 144,000 BTC 중 **약 90%가 Silk Road 서버에서 이전**됨 ($16–18M 상당, 당시) — https://www.computerworld.com/article/1626194/fbi-consultant-silk-road-founder-had-16-18m-worth-of-bitcoins-on-laptop.html (2차)
- 서버 위치 특정은 CAPTCHA 유출 IP라는 FBI 주장 (논란 있음) — https://cointelegraph.com/news/ulbrichts-defense-doubts-fbis-explanation-of-how-it-found-silk-roads-servers (2차)

이 사건의 핵심 연결은 `클러스터링 → 거래소 소환장`이 아니라 **`서버 주소 확보 → blockchain direct flow → 압수 laptop의 private-key·관리자 증거`**다. 즉 온체인 분석은 신원 확정의 필요조건이 아니라, 압수된 장치·서버 증거와 결합될 때 위력을 발휘한다.

---

## 7. Bonanza Factory (보난자팩토리) — TranSight/TranSafer

**2차 보도 기반** (1차 자료 미확보 — 아래 `Could not verify` 참조):

- 보난자팩토리: 2017년 설립 디지털자산 컴플라이언스 전문기업
- **TranSight(트랜사이트)**: 블록체인 거래정보·지갑주소 분석, 자금세탁·보이스피싱 등 금융범죄 위험 신호, 실시간 지갑 위험도, AML/FDS 연동. 자체 DB 범주(보도): 고위험 주소, VASP 식별 주소, FIU 미신고 VASP, 국내 범죄 연관 주소 — https://bloomingbit.io/feed/news/111553
- 신한은행이 은행권 최초로 TranSight 기반 온체인 모니터링 체계 도입 (2026-09 보도) — https://www.m-i.kr/news/articleView.html?idxno=1370584
- 공공사업: 국세청 가상자산 탈세 대응 거래추적 시스템 구축 사업자로 선정 (거래 흐름 시각화, 클러스터링, 믹서 역추적, 비수탁형 지갑 분석), 경찰청 가상자산 분석 지원 사업 우선협상대상자 (범죄 혐의 지갑 실체 규명, 최종 유입 거래소 식별, 증거화 지원 — 실제 수사와 영장 집행에 활용) — https://v.daum.net/v/20260618180506824
- **TranSafer**: 2026-09-27 검색에서 TranSight 관련만 나왔고, `TranSafer`라는 정확한 제품명과 공개 기능은 확인되지 않음 → **`Could not verify`**

회사 공식 제품 페이지·보도자료·인터뷰 원문은 이번 세션에서 확보하지 못했으므로, 위 내용은 전부 2차 보도 기반이며 제품 기능 확정 기술이 아니다.

---

## 8. 종합: 업체 공개 자료로 재구성한 자금 추적 아키텍처

아래 다이어그램의 각 단계는 본문에서 인용한 1차 자료에 근거한다. 상용사의 exact clustering heuristics, score weights, confidence threshold, propagation radius는 `비공개(추론 불가)`이며 다이어그램에 수치로 표기하지 않는다.

```
Full node/RPC·block files
  → raw blocks/transactions/logs 정규화·저장
      (GraphSense: Cassandra {NETWORK}_raw — block/transaction/exchange_rates)
  → chain-specific graph 생성
      (UTXO: transaction/address graph · account: token transfer graph)
      (GraphSense: Spark가 address graph + de-normalized views 계산)
  → clustering/entity grouping
      (공개: co-spend union-find + CoinJoin 제외 / 비공개: 상용사 수백 개 휴리스틱)
  → attribution label DB 결합
      (OSINT·법집행·서비스 데이터; TRM은 source+confidence score를 glass box로 공개)
  → direct/indirect exposure·행위 규칙·제재 리스트 기반 경보/점수
      (Chainalysis: 식별된 서비스에 닿을 때까지 홉 추적; 온체인 발생 후 수 초 이내 경보)
      (TRM Signatures®: peeling chains·layering·change of custody)
  → REST/API·webhook·continuous rescreening
      (공개 API: Chainalysis/TRM Sanctions API, GraphSense REST 전체)
  → KYT alert/case queue
      (bulk 관리·case management; alert → Reactor/Forensics로 escalate)
  → investigator graph 전후방 확장·cross-chain tracing
      (미표시 flow 노출, multi-route pathfinding, one-click bridge tracing)
  → VASP/custodian 같은 leverage point 식별
      (TRM Flip Book B단계의 공식 용어)
  → subpoena/warrant/MLAT/freezing request
      (TRM Flip Book D단계; Beacon: 참여 거래소의 출금 전 hold/freeze)
  → KYC·IP·계정·device/server evidence로 신원 확정
      (WTV: 서버 데이터×결제 교차검증+거래소 계좌; Silk Road: 서버↔laptop 직접 흐름+관리자 증거)
  → graph·timestamps·labels·audit log를 증거/보고서로 export
      (Elliptic: 법원용 형식 export; TRM: parallel reconstruction; Bitcoin Fog: 복수 툴 교차검증)
```

**Latency에 대한 주의**: "real-time"이라는 마케팅 표현을 임의로 ms 단위로 바꾸지 않는다. 본 보고서에서 latency 수치로 쓸 수 있는 것은 Chainalysis 공식 FAQ의 "within seconds of a transaction occurring on chain"(KYT 경보)과 TRM 공개 Sanctions API의 rate limit(1 req/s, 100 req/day)뿐이다.

---

## 9. Could not verify (확인 불가 목록)

1. **Chainalysis KYT 엔터프라이즈 API**의 정확한 endpoint·request/response schema — 개발자 문서가 로그인 게이트 뒤에 있음 (2026-09-27 확인). 제3자 문서의 `/v2/users`, `/v1/transfers`, `/v1/addresses`는 1차 자료가 아님.
2. **TRM 엔터프라이즈 주소 스크리닝·엔티티 리스크 API**의 정확한 endpoint·schema — 공식 공개 문서에 없음. 제3자 문서의 `/v2/public/sanctions`, `/v2/public/entities/{address}/risk`는 발명 가능성이 있어 미사용.
3. **Elliptic 개발자 API**의 endpoint·request/response — docs.elliptic.co가 이번 세션에서 도구 접근 실패. 플랫폼 페이지의 "API 접근 제공" 언급만 확인.
4. **Scorechain 공식 OpenAPI** (https://tech-doc.api.scorechain.com/api.yaml) — 미열람. 제3자 문서의 endpoint 목록은 1차 자료가 아님.
5. **Bonanza Factory TranSafer** — 정확한 제품명과 공개 기능이 검색에서 확인되지 않음. 회사 공식 제품 페이지·보도자료·인터뷰 원문도 미확보.
6. **Merkle Science Tracker**의 공식 제품 페이지/자료 — Compass factsheet만 확보.
7. **Mastercard/CipherTrace 현행 제품 상태** — Armada/Inspector/Sentry는 legacy factsheet만 확인, 2024년 중단 보도의 원문 URL 미확보. 2026년 현행성은 legacy로 표시.
8. **Reactor의 구체 UI 절차** (주소 입력 → 그래프 확장 → exposure 확인 → 케이스 저장) — 공식 페이지가 절차를 문장으로 풀지 않음.
9. **ChipMixer complaint 본문**의 tracing 단계 — DOJ 보도자료와 Wikipedia의 인용까지만 확인.
10. **Bitcoin Fog Daubert order 원문** — finintegrity 2차 분석으로만 인용.
11. **Silk Road 법정 문서**에서 blockchain 절차 직접 인용 — 2차 보도(재판 증언 보도)까지만 확인.
12. **TRM Beacon 공식 announcement의 안정적 URL** — 백서 URL이 서명·만료형.
13. **Elliptic 166-feature와 production score의 매핑** — 공개 근거 없음 (연구 모델 ≠ 제품 모델로 명시).
14. 모든 상용사의 **exact clustering heuristics 전체 목록, risk score 가중치, confidence 임계값, exposure 전파 반경** — `비공개(추론 불가)`.

---

## Sources (출처 목록)

### 검증됨(공개 1차 자료) — 실 브라우저 열람
- https://www.chainalysis.com/product/reactor/ — Reactor 제품 페이지 (2026-09-27, verified live)
- https://www.chainalysis.com/product/kyt/ — KYT 제품 페이지 (2026-09-27, verified live)

### 검증됨(공개 1차 자료) — index 단계
- https://github.com/ladinglogichq/cockpit-intelligence/blob/HEAD/backend/supabase/dataset/Chainalysis.md — Chainalysis 공개 문서 사본 (Sanctions API)
- https://docs.trmlabs.com/ , https://docs.trmlabs.com/guides/sanctions/introduction — TRM 공식 개발자 문서
- http://www.trmlabs.com/blockchain-intelligence-platform/forensics — TRM Forensics 제품 페이지
- https://www.trmlabs.com/guides/the-blockchain-investigators-flip-book-a-guide-for-law-enforcement — TRM Flip Book
- https://www.trmlabs.com/guides/identifying-crypto-artifacts-in-the-field-flip-book — TRM Triage
- https://www.trmlabs.com/resources/blog/how-to-increase-the-effectiveness-and-efficiency-of-your-aml-programs — TRM Signatures
- TRM 백서 (Wallet Screening/Beacon) — notes/trm-forensics.md의 CDN URL 참조
- https://www.elliptic.co/products/investigator/ — Elliptic Investigator
- https://www.elliptic.co/products/ — Elliptic 플랫폼
- https://www.elliptic.co/hubfs/Elliptic_Guide_How_to_Defend_Your_Business_Against_Crypto_Crime.pdf?utm_campaign=Typologies%202023 — Elliptic Lens 가이드
- https://www.elliptic.co/hubfs/State%20of%20cross-chain%20crime/Elliptic_Cross-Chain_Crime_Report.pdf — Elliptic cross-chain 백서
- https://econpapers.repec.org/paper/arxpapers/1908.02591.htm — Elliptic 166-feature 연구 논문
- https://github.com/graphsense/graphsense-lib/blob/HEAD/clients/python/docs/AddressesApi.md — GraphSense Python client
- https://github.com/graphsense/graphsense-lib/blob/HEAD/clients/python/docs/ClustersApi.md
- https://github.com/graphsense/graphsense-lib/blob/HEAD/clients/python/README_EXT.md
- https://github.com/graphsense/graphsense-spark/blob/HEAD/README.md — GraphSense transformation pipeline
- https://github.com/graphsense/graphsense-lib/releases/tag/v2.13.0 , https://github.com/graphsense/graphsense-lib/releases/tag/v2.15.0 — clustering 릴리즈
- https://blog.merklescience.com/hubfs/One%20-%20Pager/Compass%20Factsheet_Nov%202023.pdf — Merkle Compass
- https://www.scorechain.com/resources/crypto-glossary/bitcoin-aml-api , https://www.scorechain.com/resources/crypto-glossary/btcscan , https://www.scorechain.com/blog/scorechain-releases-risk-indicators-feature-to-enhance-compliance-for-cryptocurrency-risk-aml-solutions/ — Scorechain
- https://third-party-media.cbinsights.com/144093_2745_137143_CipherTrace-Armada-Virtual-Asset-Risk-Mitigation-for-Financial-Institutions-051320.pdf — CipherTrace legacy
- https://www.justice.gov/archives/ag/page/file/1326061/dl — DOJ Welcome to Video
- https://www.scribd.com/document/430595306/USA-vs-Twenty-Four-Cryptocurrency-Accounts — WTV forfeiture complaint (Case 1:19-cv-03098, 법원 제출 문서 사본)
- https://www.irs.gov/compliance/criminal-investigation/tornado-cash-founders-charged-with-money-laundering-and-sanctions-violations — IRS Tornado Cash
- https://www.justice.gov/usao-edpa/pr/justice-department-investigation-leads-takedown-darknet-cryptocurrency-mixer-processed — DOJ ChipMixer
- https://www.irs.gov/compliance/criminal-investigation/jury-finds-russian-swedish-operator-of-bitcoin-fog-guilty-of-running-the-darknet-cryptocurrency-mixer — IRS Bitcoin Fog
- http://storage.courtlistener.com/recap/gov.uscourts.dcd.232431/gov.uscourts.dcd.232431.159.1.pdf — Bitcoin Fog defense expert report (Case 1:21-cr-00399-RDM Doc 159-1)

### 2차 자료 (보조 근거 — 배경/탐색 단서로만 사용)
- https://www.enterprisetimes.co.uk/2019/08/27/chainalysis-launches-suspicious-transaction-alert-tool/ — KYT alert 항목
- https://aws.amazon.com/marketplace/pp/prodview-5fransajdzw5c — Reactor 기능 목록
- https://cointelegraph.com/news/defi-ing-exploits-new-chainalysis-tool-tracks-stolen-crypto-across-multiple-chains — Storyline
- https://www.elliptic.co/media-center/how-bitget-improved-risk-prevention-by-99-with-elliptics-blockchain-intelligence — Elliptic Navigator 고객 사례
- https://finintegrity.org/lighting-up-the-darknet/ — Bitcoin Fog Daubert 분석
- https://www.lexology.com/library/detail.aspx?g=0f826340-2c52-4a76-ab4d-2805f2fbd4cd — Tornado Cash 공소 요약
- https://thehackernews.com/2023/03/authorities-shut-down-chipmixer.html?hl=ru — ChipMixer/Elliptic 분석
- https://www.computerworld.com/article/1626194/fbi-consultant-silk-road-founder-had-16-18m-worth-of-bitcoins-on-laptop.html — Silk Road 재판 증언
- https://gantnews.com/2015/02/05/bitcoin-fallacy-led-to-silk-road-founders-conviction/ — Silk Road
- https://cointelegraph.com/news/ulbrichts-defense-doubts-fbis-explanation-of-how-it-found-silk-roads-servers — Silk Road 서버 논란
- https://cointelegraph.com/news/cipher-trace-expert-says-chainalysis-data-contributed-wrongful-arrest-alleged-bitcoin-fog-founder — Bitcoin Fog 반론
- https://lovelyti.com/2019/10/20/how-bitcoin-transactions-were-used-to-track-down-the-23-year-old-south-korean-operating-a-global-child-exploitation-site-from-his-bedroom/ — WTV 식별 과정
- https://en.wikipedia.org/wiki/ChipMixer — ChipMixer (DOJ complaint 인용 참조용)
- https://bloomingbit.io/feed/news/111553 , https://www.sportsseoul.com/news/read/1607781 , https://www.m-i.kr/news/articleView.html?idxno=1370584 , https://v.daum.net/v/20260618180506824 — Bonanza Factory/TranSight
- https://github.com/gl0bal01/intel-codex/blob/HEAD/Investigations/Techniques/sop-blockchain-investigation.md — 오픈소스 수사 SOP (브리지 페어링 원리 등)
