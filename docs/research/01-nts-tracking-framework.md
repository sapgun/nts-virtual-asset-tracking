# 국세청 가상자산 추적 기술 스택 심층 분석 리포트

**조사일:** 2026-09-27
**범위:** 보난자팩토리/TranSight(KYT·트랜잭션 스크리닝), 디믹싱 기법, 국세청 2026년 조달분(납품 완료)과 별도 '가상자산 통합분석시스템'의 관계, 표준 온체인 추적 기술, 강제징수 1,461억원 사례의 기술적 원리, 경찰청 사업과의 관계
**독법:** 각 섹션에서 `[검증]`은 언론·공식·학술 자료로 확인한 사실, `[추론]`은 업계 표준 기반 해석을 의미한다. 각 사실 뒤에 URL을 표기한다.

---

## 1. 보난자팩토리 (Bonanza Factory)

- `[검증]` 2017년 설립된 국내 블록체인 컴플라이언스 전문기업으로, 블록체인 지갑의 위험도를 실시간으로 분석하는 KYT 솔루션 제공업체다.
  https://v.daum.net/v/20260618180506824
- `[검증]` 대표는 김영석이다.
  https://en.bloomingbit.io/feed/news/79430
- `[검증]` 주요 제품은 `TranSafer`(원화 입출금 검증)와 `TranSight`(가상자산 지갑 추적·검증/KYT)이다. TranSight는 공식 홈페이지에서 "국내 특화 가상자산 지갑 검증 솔루션"으로 소개된다.
  https://en.bloomingbit.io/feed/news/96981
  https://bonanza-factory.co.kr
- `[검증]` TranSight는 온체인 거래·지갑 주소를 분석해 자금세탁, 보이스피싱, 불법거래 연관 위험 신호를 탐지한다고 소개되며, 신한은행이 2026-05-07 도입했다(가상자산·스테이블코인 내부통제 SW 사용 계약).
  https://www.sportsseoul.com/news/read/1607781
  https://www.newsis.com/view/NISX20260507_0003620293
- `[검증]` 2025년 중소벤처기업부 '수익성장형 아기유니콘'에 선정됐으며, 관련 보도는 이를 **외부투자 없이 자력으로 성장**한 기업으로 설명한다. 공개된 외부 투자 라운드는 확인되지 않는다.
  https://en.bloomingbit.io/feed/news/96981
- `[검증]` 주요 실적·고객으로 케이뱅크·업비트 원화 입출금 검증 및 AML 솔루션 공급, 2022년 이노비즈 AA등급, 금감원 출신 김정재 부국장의 CLO 영입이 보도됐다.
  https://www.mk.co.kr/news/economy/10342416
- `[검증]` 향후 계획으로 GNN(그래프 신경망) 기반 거래 맵 분석 고도화와, 글로벌 거래소와의 공동개발 '가상자산 동결 프로토콜'을 TranSight에 적용하겠다고 밝혔다.
  https://en.bloomingbit.io/feed/news/96981
- `[검증]` 2026-09-23 보도: 카카오그룹과 2025-04 MOU를 맺고 원화 스테이블코인 AML 등 사업 확장을 협력 중이다.
  https://www.mk.co.kr/news/economy/12160284
- `[검증]` 2026-04-23 베트남 군인상업은행(MB은행)과 가상자산 거래소 입출금 연동 기술검증(PoC)을 완료했다(파이낸셜뉴스 보도, 네이버 검색 결과 기준).
- `[검증]` 별도 회사인 **보난자랩**의 JB인베스트먼트·삼일PwC 프리A 투자 보도는 보난자팩토리와 무관하므로 혼동 금지.
  https://v.daum.net/v/20260203105142457
- `[추론]` 공식 홈페이지(bonanza-factory.co.kr)는 JS-heavy SPA로 외부에서 기술 문서를 크롤링할 수 없고, TranSight의 지원 체인 목록·위험 카테고리·스코어링 가중치는 비공개로 보인다. 위 공개 보도 기반으로는 "지갑 위험도 실시간 분석" 수준의 기능 설명만 확인된다.

---

## 2. 디믹싱(Demixing) 기술

### 2.1 공개 연구·업계 자료로 확인된 디믹싱 기법 (일반론)

- `[검증]` Tornado Cash는 0.1/1/10/100 ETH 고정 액면(fixed denomination) 풀 구조로, zk-SNARK로 예치와 출금을 단절한다. 공개 디믹싱 도구는 다음 휴리스틱을 결합한다: (1) 같은 액면 풀에서 N개 예치 후 일정 시간창 내 N개 출금, (2) relayer 수수료를 뺀 실제 수취액(D−fee) 밴드 필터링, (3) denomination 프로파일, (4) 분할 출금 후 공통 하류 통합(consolidation) 주소 탐지.
  https://github.com/maslovsa/tornado-demix
- `[검증]` 2025년 arXiv 연구("Clustering Deposit and Withdrawal Activity in Tornado Cash: A Cross-Chain Analysis")는 이더리움·BSC·폴리곤에서 주소 재사용·직접 전송·FIFO형 시간근접 휴리스틱 등을 통해 총 23억 달러 이상의 출금을 원입금과 연결했다고 주장한다. **이는 암호학적 증명이나 확정 귀속이 아니라 행동 휴리스틱 기반**이다.
  https://arxiv.org/pdf/2510.09433v1
- `[검증]` 업계 실무 자료에 따르면, 타이밍·액면·가스 설정·릴레이어/가스 대납 지갑·출금 스케줄·출금 후(post-exit) 추적을 누적해 확률 점수를 매기는 방식으로 후보집합을 축소한다.
  https://github.com/forefy/.context/blob/HEAD/skills/blockchain/blockchain-forensics/references/advanced-techniques.md
- `[검증]` Tornado Cash는 2025-03-21 제재 해제 후 이용이 재증가했으며, 2025년에 약 25억 달러의 거래를 처리했다.
  https://www.cryptopolitan.com/ko/tornado-cash-proof-of-demand-for-privacy/

### 2.2 보난자팩토리의 디믹싱 주장

- `[검증]` 이데일리 보도에 따르면 국세청 도입 솔루션의 기능으로 **"믹서(Mixer) 역추적"**이 명시돼 있다. 즉, 회사는 믹서 역추적을 제품 기능으로 주장(보도자료·선정 공시 기반)하고 있다.
  https://v.daum.net/v/20260618180506824
- `[검증]` 동 보도에 따르면 TranSight 도입으로 국세청은 탈세 혐의자 은닉자산 추적, 변칙 상속·증여, 역외 탈세 분석 등에 활용한다.
  https://v.daum.net/v/20260618180506824
- `[미확인]` 보난자팩토리의 디믹싱 **구체 알고리즘·정량적 성공률·자체 사례 수치**는 공개 보도에서 확인되지 않는다. 최종 리포트상 "디믹싱 기능 보유 주장"은 보도 기반 `[검증]`, 기술적 실효성 수치화는 불가로 표기해야 한다.

### 2.3 디믹싱의 기술적 한계

- `[검증]` 디믹싱은 믹서 노트의 암호학적 연결을 '깨는' 기술이 아니라, **후보집합 축소 → 확률적 귀속 → 하류(거래소 등 식별 지점) 식별**의 확률 추론 파이프라인이다. CoinJoin 체인지 출력 분석, 타이밍·금액 교차대조, 가스 지문 등이 핵심이며, zk 기반 노트 단절 자체는 수학적으로 유효하게 유지된다.
  https://github.com/forefy/.context/blob/HEAD/skills/blockchain/blockchain-forensics/references/advanced-techniques.md

---

## 3. 국세청 2026년 조달분 — '가상자산 탈세대응 거래추적 SW 라이선스 구매'

- `[검증]` 공고번호 `R26BK01455053`, 공고일 2026-04-15, 입찰 2026-04-28~30, 개찰 2026-04-30. 예산금액 148,065,740원, 품목 단가 146,500,000원(약 1억4,650만원). 공고기관은 조달청 대전지방조달청, 수요기관은 국세청. 제한경쟁·협상에 의한 계약.
  https://dima-g2b.com/list/R26BK01455053
- `[검증]` 2026-05-22 보난자팩토리가 사업자로 선정됐다(이데일리).
  https://v.daum.net/v/20260618180506824
- `[검증]` 2025년에도 동명 공고(`R25BK00810601`, 2025-04-24 게시, 사업금액 147,752,590원)가 있었으나 낙찰 집계 결과가 확인되지 않는다. 2025분과 2026분(본 사업)은 별개이므로 혼동 금지.
  https://seenthis.kr/bid/174318?page=45
- `[검증]` 도입 효과(보도): BTC·ETH 등 거래 흐름 시각화, 클러스터링, 믹서 역추적, 비수탁형 지갑 분석.
  https://v.daum.net/v/20260618180506824
- `[미확인]` 발주 스펙 세부(7천만 개 이상 자산 그래프 시각화, 100개 이상 블록체인 교차거래 추적, IP·위치·Tor 정보 수집, 다크웹·텔레그램 OSINT, 분석보고서·법정심리 컨설팅)는 제안요청서 원문 PDF 입수 실패로 1차 자료 교차검증이 안 됐다. 나라장터 원문 링크 접근 시도도 오류로 실패했다. 해당 항목은 미션 제공 스펙으로만 표기.

---

## 4. '가상자산 통합분석시스템' (별도 사업 — 조달분과의 관계)

### 4.1 사업 개요
- `[검증]` 국세청은 연간 약 80억 건의 가상자산 거래를 AI로 분석하는 '가상자산 통합분석시스템'을 구축 중이다. AI·머신러닝·통계 기법으로 거래명세서 이상패턴을 사전 탐지하고, 연령·성별·지역 인구통계 + 거래유형별 데이터를 이용해 불법거래 흐름을 검증한다. 목적은 자금세탁·변칙증여·역외탈세 차단이며, 2027년 가상자산 과세(거래소 자료제출 의무화)에 대비한 인프라다.
  https://www.mk.co.kr/news/economy/11970240
- `[검증]` 나라장터 사전규격 공개일 2026-03-20, 계약일부터 2026-12-31, 약 30억원 규모. 2026-03 입찰, 04 개발 착수, 11월 최종 오픈 목표.
  https://www.mk.co.kr/news/stock/11978457
- `[검증]` 국회예산정책처 보고서는 2026년 말까지 '(가칭)가상자산 통합분석시스템' 구축 완료 계획을 명시한다.
  https://www.nabo.go.kr/board/file/bulkDown.do?idx=9433&bid=68

### 4.2 4대 기능 (사전규격·보도 기준)
1. VASP 제출 거래명세서 + 블록체인 거래정보 통합관리
2. 납세자별 거래정보 조회·분석(거래현황·자산 증감·보유 잔고)
3. 지갑주소 + 블록체인 거래정보 결합, 거래 흐름 시각적 추적
4. AI·머신러닝·통계 기반 이상거래 패턴 탐지
  https://www.mk.co.kr/news/stock/11978457

### 4.3 기술 스택 — 스카이월드와이드(SKAI) / AgensGraph
- `[검증]` 핵심 파트너는 스카이월드와이드(SKAI). 그래프/RDB 하이브리드 DBMS `AgensGraph` 기반, 스머핑·레이어링·믹서·DeFi 수법 탐지, 5단계 이상 복잡한 자금 흐름을 신속 추적, GNN 결합 자금지갑 식별·거래관계 시각화를 제공한다.
  https://v.daum.net/v/20260706140318646
- `[검증]` 2026-07 국세청 디지털자산총괄과가 신설됐다.
  https://v.daum.net/v/20260311150701818

### 4.4 조달분(SW 라이선스)과 통합분석시스템의 관계
- `[검증]` 두 사업은 **별개 사업**이다. 조달분(보난자팩토리 TranSight, ~1.465억원, 2026-07 납품 완료)은 상용 온체인 분석 라이선스 도입이고, 통합분석시스템(~30억원, 2026-12 완료 예정)은 국세청 내부 데이터(VASP 거래명세서, 납세자 정보)와 블록체인 데이터를 통합하는 독자 시스템 구축이다. 언론 보도는 두 사업을 각각 독립된 발주로 다룬다.
  https://v.daum.net/v/20260618180506824
  https://www.mk.co.kr/news/stock/11978457
- `[추론]` 업계 표준 패턴(상용 KYT = 이상거래 플래그·온체인 그래프 제공 / 과세기관 내부 시스템 = 신고 데이터·거래소 자료 매칭·과세판정)을 고려하면, TranSight는 온체인 흐름 탐지 레이어로, 통합분석시스템은 이를 포함한 종합 분석·과세판정 플랫폼으로 기능할 가능성이 높다. 직접적인 기술 통합 언급은 공개 자료에서 확인되지 않으므로 `[추론]`으로 표기한다.
- `[검증]` 업계에서는 30억원 규모로 온·오프체인을 결합해 해외거래소·개인지갑까지 분석하기에는 예산이 부족하다는 우려가 보도됐다.
  https://www.mk.co.kr/news/stock/11978457

---

## 5. 표준 온체인 추적 기법 (Bitcoin / EVM / Cross-chain)

### 5.1 Bitcoin (UTXO)
- `[검증]` **Common-Input-Ownership Heuristic(CIOH)**: 동일 트랜잭션의 모든 입력 주소는 같은 소유자가 통제한다고 가정한다. 학술 계보: Reid & Harrigan(2011), Ron & Shamir, Meiklejohn et al. "A Fistful of Bitcoins"(IMC 2013).
  https://arxiv.org/abs/1107.4524
  http://snap.stanford.edu/class/cs224w-2015/projects_2015/Community_Detection_and_Analysis_in_the_Bitcoin_Network.pdf
- `[검증]` **Change 주소 탐지**: 처음 등장한 유일한 출력 주소, 지불액보다 비정형 소수단위 금액, 입력과 동일 스크립트 유형, 잔돈이 송신자 클러스터와 후속 합쳐지는 패턴을 결합한다.
  https://cointhinktank.com/upload/Bitcoin%20Pricing-Adoption-and-Usage.pdf
- `[검증]` **한계**: naive하게 적용하면 오류율이 63%를 초과할 수 있으며, CoinJoin은 서로 다른 사용자의 입력을 섞어 CIOH를 의도적으로 깨뜨리므로 예외처리가 필수다.
  https://medium.com/@geo_58036/issue-1-the-common-input-ownership-heuristic-10e48510db11

### 5.2 EVM (계정 기반)
- `[추론]` 업계 표준: 주소=계정 구조이므로 external tx + internal call trace + ERC-20 `Transfer` 이벤트 로그를 결합해 자금 흐름을 재구성한다. 스마트컨트랙트/DEX swap/브릿지 이벤트를 디코딩하고, fan-in(집금)·fan-out(분산)·peeling(조각 분산)·sweep(일소) 패턴, nonce·가스 대납자(gas payer)·공통 상대방(common counterparties) 기준으로 주소를 묶는다. (일반 KYT 업계 기술 기준, TranSight 고유 스펙 아님)
  https://github.com/forefy/.context/blob/HEAD/skills/blockchain/blockchain-forensics/SKILL.md
- `[검증]` 실명 연결의 핵심은 **주소 라벨 매핑(attribution)**: 테스트 입출금, 공개 주소, KYC/법집행 자료, OSINT, 제재리스트를 통해 클러스터에 엔티티 라벨을 부착한다. "하나의 식별된 출금이 전체 클러스터에 이름을 붙인다."
  https://blog.blockmagnates.com/how-on-chain-fraud-investigation-actually-works-a-technical-primer-for-compliance-teams-aeffd9daf0e0
  https://github.com/treib-holdings/learnbitcoin-content/blob/HEAD/rabbit-holes/bitcoin-privacy.mdx
- `[검증]` 상용 라벨 DB 규모 예시: Elliptic은 1,100+ 네트워크, 20억+ 라벨 주소 커버리지를 주장한다. Chainalysis는 58,000개 이상의 실제 서비스(10억+ 주소 연관)를 식별하고 일 1,200개 글로벌 협력 네트워크와 협업한다.
  https://www.elliptic.co
  https://www.chainalysis.com/wp-content/uploads/2024/10/law-enforcement-kr-release.pdf

### 5.3 Cross-chain / 브릿지
- `[검증]` 브릿지 추적의 업계 표준 기법: (1) lock/mint 또는 burn/mint 이벤트와 브릿지 message/nonce를 source/destination 양쪽에서 대응, (2) 직접 참조가 없으면 시간-가치 상관분석(±수 분, 수수료 0.1~0.3% 차감 매칭), (3) gas payer 재사용·수신주소 재사용·aggregator 내부 이벤트로 보강, (4) lock-and-mint 방식 브릿지의 중앙 보관소(choke point)를 모니터링한다.
  https://github.com/forefy/.context/blob/HEAD/skills/blockchain/blockchain-forensics/SKILL.md
  https://github.com/gl0bal01/intel-codex/blob/HEAD/Investigations/Techniques/sop-mixer-tracing.md

---

## 6. 프라이버시 코인·셀프커스터디·CARF — 추적 한계

### 6.1 Monero
- `[검증]` 링서명(송신 입력 후보, 현재 링사이즈 16) + 스텔스 주소(수신자 은닉) + RingCT(금액 은닉)로 온체인 송수신자·금액이 숨는다. 현 링사이즈에서는 BTC식 확정 흐름 추적이 불가능하며, 엔드포인트/IP·거래소·사용자 실수 등 외부 단서 중심이다.
  https://github.com/hacktricks-wiki/hacktricks/blob/HEAD/src/privacy/cryptocurrency-privacy.md
- `[검증]` 2025년 OSPEAD 연구의 확률적 디코딩은 무작위 추측(1/16) 대비 1/4 수준 개선에 그친다. IRS는 2020년 62.5만 달러 현상금을 걸었으나 의미있는 성과를 공개하지 않았고, Chainalysis+Integra FEC가 IRS와 추적 계약을 체결했으나 공개 검증된 완전 추적 방법은 없다.
  https://github.com/anoni-net/docs/blob/HEAD/docs/en/advanced/zk-identity-payments.md
  https://www.noones.com/blog/monero-tracking
- `[검증]` 보난자팩토리 관계자도 시사저널 인터뷰(2026-06-11)에서 마약 거래에서 모네로 등 '다크코인' 결제 증가 추세를 확인했다 — 추적 난이도의 인정이다.
  https://v.daum.net/v/20260611094050762
- `[검증]` EU는 2027년부터 규제 거래소의 프라이버시코인 거래 금지를 추진 중이다.
  https://cryptonews.com/kr/cryptocurrency/what-are-privacy-coins/

### 6.2 Zcash
- `[검증]` transparent 영역은 추적 가능하지만, shielded pool 내부의 shielded-to-shielded 경로는 보이지 않는다. 입·출구 시간/금액 등 경계 분석(boundary analysis)만 가능하다 (Kappos et al. 2018, Quesnelle 2017).
  https://github.com/gl0bal01/intel-codex/blob/HEAD/Investigations/Techniques/sop-blockchain-investigation.md

### 6.3 셀프커스터디
- `[검증]` 국세청은 김상훈 의원실 답변에서 "개인지갑을 통한 거래의 특성상 미신고 거래를 모두 식별하기 어렵다"고 인정했다. 검찰·경찰·IRS가 사용하는 것과 유사한 상용 추적 SW 도입을 검토 중이다.
  https://www.tokenpost.kr/news/policy/401167
  https://www.wikitree.co.kr/articles/1156339
- `[검증]` 온체인 주소 간 이동은 관찰되지만, 그것이 매매인지 단순 보관 이전인지, 소유자·취득가액·양도가액은 온체인만으로 확정할 수 없다. 거래소 자료 + 납세자 신고·소명이 병행되어야 한다.
  https://www.tokenpost.kr/news/policy/401167

### 6.4 CARF(가상자산 자동정보교환) 시차
- `[검증]` 2027년 첫 교환: 한국·영국·일본·독일 등 46개국 → 2028년: 싱가포르·홍콩·스위스·캐나다·UAE 등 29개국 → 2029년: 미국. 국가별 시차로 초기 해외거래 정보 공백이 우려된다.
  https://news.tf.co.kr/read/economy/2366019.htm
  https://biz.heraldcorp.com/article/10866199
- `[검증]` 체이널리시스 집계 2025년 기준 CARF 비포괄 경로 비중(타이거리서치 인용 보도): 일본 59.1%, 영국 65.2%, 미국 75.4%, 이탈리아 76.6%.
  https://www.etoday.co.kr/news/view/2629063
- `[검증]` 역외거래 부과제척기간은 7년(부정행위 시 15년)으로, 사후 확보된 정보로 추후 과세가 가능하다.
  https://www.nabo.go.kr/board/file/bulkDown.do?idx=9433&bid=68

---

## 7. 강제징수 1,461억원 (2021~2024) — 기술적 원리

- `[검증]` 총 14,140명, 1,461억원: 2021년 5,741명 712억원 / 2022년 4명 6억원(시장침체로 직접 강제징수보다 추적조사 중심) / 2023년 5,108명 368억원 / 2024년 3,291명 381억원 (김영진 의원실 자료).
  https://www.mk.co.kr/news/economy/11425454
- `[검증]` 기술적 핵심: 가상자산 자체(개인키)가 아니라, **거래소에 대한 '출금청구채권·반환청구채권'을 압류·가압류**했다. 지갑 비밀번호를 확보하지 않고도 집행이 가능했던 이유다.
  https://www.mk.co.kr/news/economy/9786877
- `[검증]` 절차: ① 거래소 자료로 체납자 보유 확인 → ② 거래소 계정·출금·반환청구채권 압류·동결 → ③ 자진 매각 또는 별도 납부 권고 → ④ 불응 시 체납자와 거래소에 매각 예정 통보 → ⑤ 세무서 계정으로 이전 → ⑥ 당일 시장가 매각 후 체납액 충당.
  https://www.mk.co.kr/news/economy/11425454
- `[검증]` 법적 근거: 2018-05 대법원 판결(가상자산을 주식·채권과 같은 몰수 가능 무형재산으로 인정), 2022-01 국세징수법 개정(압류 가상자산 직접 매각 가능).
  https://www.mk.co.kr/news/economy/11425454
- `[검증]` 2021년 최초 대규모 사례: 2,416명, 366억원을 현금 징수 또는 채권 확보. 강남 병원 운영 A씨(병원수입 39억원 은닉, 27억원 체납), 부동산 양도 B씨(양도세 12억원 체납) — 압류 후 자진 납부. 222명은 은닉 혐의로 추가 추적조사.
  https://www.mk.co.kr/news/economy/9786877
- `[검증]` 2025-05에는 압류 가상자산을 국세청이 직접 매각해 국고로 환수한 첫 사례가 보도됐다.
  https://blog.naver.com/ifezian
- `[추론]` 셀프커스터디·해외거래소 자산은 채권 압류 방식이 통하지 않으므로, TranSight 도입·통합분석시스템 구축의 목적은 바로 이 사각지대를 좁히는 것이다. 다만 강제집행의 기술적 병목은 여전히 거래소 협조·개인키 확보에 있다.

---

## 8. 경찰청 사업과의 관계

- `[검증]` 2026-06-18 보난자팩토리가 경찰청 '가상자산 분석 지원' 사업의 우선협상대상자로 선정됐다(나라장터 공고).
  https://v.daum.net/v/20260618180506824
- `[검증]` 범위: 사기·자금세탁 범죄 혐의 지갑의 실체 규명, 자금의 최종 유입 거래소 식별·증거화, 수사·영장 집행에 활용. 대상: BTC·ETH·ERC-20·신규 개발 토큰. 분석이 불가능하면 구체 사유 제시 의무. **모네로 등 프라이버시코인도 가능한 범위에서 분석 + 상세 보고서 요구** (단, '가능한 범위' — 완전 추적 가능 주장이 아님에 주의).
- `[검증]` 경찰청은 2024-05부터 연 2회 사업자를 선정해 왔으며, 보난자팩토리 선정은 이번이 처음이다. 국세청 사업자 선정(2026-05-22)으로부터 약 한 달 뒤다.
- `[추론]` 두 사업의 관계: 같은 공급자(보난자팩토리)·유사한 온체인 그래프·클러스터링·귀속 DB(TranSight)를 사용하지만, **국세청분은 탈세·변칙증여·역외탈세/과세·징수 목적의 라이선스 구매**(조달청 대전, 약 1.465억원), **경찰청분은 범죄수익 추적·증거화·영장집행 목적의 분석 지원 용역**으로 서로 별도 조달 사업이다. 공동 시스템이라는 공개 근거는 없다.
- `[검증]` 압수·압류 가상자산의 민간 수탁 사업도 병행 추진 중이며(국세청이 2026년 첫 민간수탁 사업자 선정), 국세청 PRTG 니모닉 노출 사고(2026-02-27 탈취, 400만 개·69억원, 보도자료 사진에 니모닉 노출)가 디지털자산총괄과 신설·민간위탁·전문인력 채용의 계기가 됐다.
  https://v.daum.net/v/20260311150701818

---

## 9. 검증된 사실 vs 추론·업계 표준 기반 해석 — 요약표

| # | 항목 | 분류 | 근거 |
|---|------|------|------|
| 1 | 보난자팩토리 2017년 설립, 대표 김영석, TranSight/TranSafer 제품 | `[검증]` | 언론 보도 (daum·bloomingbit·sportsseoul·newsis) |
| 2 | 아기유니콘 선정(2025), 외부투자 없이 자력 성장 | `[검증]` | bloomingbit 보도 |
| 3 | 케이뱅크·업비트·신한은행 공급, MB은행 PoC, 카카오 MOU | `[검증]` | mk·fnnews·newsis 보도 |
| 4 | 디믹싱 = 후보집합 축소·확률귀속·하류 식별의 확률 추론 (암호학적 단절은 유지) | `[검증]` | arXiv 2510.09433, 업계 forensics 자료 |
| 5 | 보난자팩토리의 믹서 역추적 기능 주장 (성공률·알고리즘 수치 없음) | `[검증]`(보도 기반 주장) + `[미확인]`(수치) | 이데일리 보도 |
| 6 | R26BK01455053 공고(2026-04-15, 1.465억원, 제한경쟁·협상), 2026-05-22 보난자팩토리 선정, 2026-07 납품 | `[검증]` | 나라장터 미러 + 이데일리 |
| 7 | 발주 스펙 세부(7000만개 그래프·100+체인·IP/Tor·다크웹·텔레그램 OSINT·법정심리) | `[미확인]` | RFP PDF 입수 실패 — 미션 제공 스펙으로만 표기 |
| 8 | 통합분석시스템 ~30억원, 80억 건 분석, 2026-12 완료 예정, SKAI/AgensGraph | `[검증]` | mk·nabo·머니투데이 보도 |
| 9 | SW 라이선스 조달분과 통합분석시스템은 별도 사업 (역할분담 해석은 추론) | `[검증]` + `[추론]` | 언론 보도가 각 독립 발주로 서술 |
| 10 | CIOH·change 탐지·attribution·브릿지 추적의 표준 기법 | `[검증]` | 학술(arXiv·IMC·스탠포드) + 업계 자료 |
| 11 | TranSight 파이프라인(노드/RPC→정규화→태깅→그래프→GNN→스코어)은 업계 표준 기반 재구성 | `[추론]` | 회사의 GNN 언급 보도 외 정확한 파이프라인은 비공개 |
| 12 | 모네로 현 링사이즈 16에서 확정 추적 불가, IRS 현상금·Chainalysis 계약에도 검증된 완전 추적법 없음 | `[검증]` | OSPEAD 2025, noones, bitcoinworld |
| 13 | 셀프커스터디 미신고 식별 한계 국세청 인정 | `[검증]` | tokenpost·wikitree (의원실 답변 보도) |
| 14 | CARF 국가별 시차(한국 2027·홍콩/싱가포르/UAE 2028·미국 2029) | `[검증]` | tf·herald·newspim |
| 15 | 강제징수 1,461억원, 출금청구채권 압류 방식, 절차·사례·법적 근거 | `[검증]` | mk 보도 2건 (2021-03·2025) |
| 16 | 경찰청 가상자산 분석 지원 사업 우선협상대상자 선정(2026-06-18), 국세청분과 별도 조달 | `[검증]` | 이데일리 보도 |

---

## 10. Could not verify / 미확보 항목

1. **나라장터 제안요청서 원문(R26BK01455053)**: 2026-09-27 실브라우저 접속 시도 오류, index 미러(dima-g2b)도 공고 요약만 제공. 7000만 개 그래프·100+ 체인·IP/Tor·다크웹·텔레그램 OSINT·법정심리 컨설팅 항목은 1차 자료 미확보.
2. **TranSight 지원 체인 목록·위험 카테고리·스코어링 가중치·데이터 파이프라인**: 공식 홈페이지 JS 렌더링으로 크롤 불가, 언론 보도에 기능명 수준만. 비공개로 판단.
3. **보난자팩토리 디믹싱 정량 지표**: 성공률·자체 사례 수치 없음. "믹서 역추적 기능 보유"는 보도 기반 주장으로만 표기.
4. **2025년 1차 공고(R25BK00810601) 낙찰 결과**: seenthis 미러에 마감 표시만 있고 낙찰자 정보 없음.
5. **통합분석시스템 사전규격 원문**: 나라장터 사전규격 공개일(2026-03-20) 보도만 확인, PDF 원문 미확보.
6. **CARF 비포괄 경로 비중 수치**: 체이널리시스 원 보고서 미확보 → 타이거리서치 인용 보도 기준임을 명시.

---

## Sources

- notes/01-bonanza-factory.md — 보난자팩토리 기업·제품 정보 (2026-09-27)
- notes/02-nts-procurement.md — 국세청 조달·통합분석시스템 (2026-09-27)
- notes/03-techniques-limits.md — 디믹싱·표준기법·한계·강제징수·경찰청 (2026-09-27)
- 주요 URL: https://v.daum.net/v/20260618180506824 (이데일리, 국세청·경찰청 선정)
- https://www.mk.co.kr/news/economy/11970240 (통합분석시스템 80억 건)
- https://www.mk.co.kr/news/stock/11978457 (사전규격 ~30억원)
- https://www.nabo.go.kr/board/file/bulkDown.do?idx=9433&bid=68 (NABO 보고서)
- https://v.daum.net/v/20260706140318646 (SKAI/AgensGraph)
- https://dima-g2b.com/list/R26BK01455053 (2026 조달 공고 미러)
- https://arxiv.org/pdf/2510.09433v1 (Tornado Cash 디믹싱 연구)
