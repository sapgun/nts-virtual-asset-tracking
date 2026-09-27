# 블록체인 분석 업체 공개 교육·인증 프로그램 커리큘럼 조사 리포트

> 작성일: 2026-09-27 | 목적: 각 업체가 **공개적으로** 밝히는 교육 커리큘럼·학습 목표·교육 모듈 중 '수사 워크플로우·기법'의 구체 내용 파악
> 태그: **[검증됨(공개 자료)]** = 업체 공식 공개 자료(공식 웹페이지·블로그·공개 PDF·공식 파트너 페이지)에서 직접 확인 / **[업계 추론]** = 공개 자료의 합리적 해석(확인 필요) / **[미확인]** = 공개 자료에서 확인 불가
> ※ 유료 교재 전문·시험 문항·유출 자료는 수집·복제하지 않았으며, 공개 커리큘럼·블로그·가이드의 요약 수준으로만 서술함.

## Summary

블록체인 분석 4개 업체(Chainalysis, TRM Labs, Elliptic, Merkle Science/Scorechain)의 **공개** 교육·인증 프로그램을 조사한 결과, 공통적으로 공개 커리큘럼은 "주소/트랜잭션 입력 → 그래프 확장·추적 → 클러스터링·익스포저 분석 → 실체 식별(거래소 KYC 등) → 사법 절차(영장·압수) → 케이스 저장·보고"라는 동일한 수사 워크플로우를 가르치고 있음이 확인된다 [검증됨(공개 자료)].

- **Chainalysis**: 2026년 1월 21일 Academy를 **CDAP(Chainalysis Digital Asset Programs)** 체계로 전면 개편 [검증됨(공개 자료)]. 기존 CRC(→CCI), CISC(→CCAI), CCFC(→CDAF) 등으로 개명. CRC의 공개 커리큘럼(입금주소 분리, 클러스터 병합, 필체인 분석, 믹서 식별)과 시험 형식(100문항/2.5시간/75%/오픈노트/1년 유효)이 가장 상세히 공개됨 [검증됨(공개 자료)]. Reactor 공개 워크플로우: 식별자 검색 → 실체 파악·OSINT 자동 스캔 → 거래상대방·익스포저 확인 → Watch 등록 → 패스파인딩 → 크로스체인 그래프 [검증됨(공개 자료)].
- **TRM Labs**: TRM Academy 7개 인증(CFC/CI/ACI/CCS/DFC/CSS/세금) + 2025년 신규 제품 인증(TRM Forensics Mastery, Solana/TRON/TON 조사 과정) [검증됨(공개 자료)]. TRM-ACI는 Wasabi·Tornado Cash 수동 디믹싱, derivation path, 컨트랙트 스푸핑 식별, hex 멀티시그 확인 등 고급 포렌식 주제를 공개 [검증됨(공개 자료)]. 무료 **Investigator's Flip Book** 2종이 수사 워크플로우(6문항 체크리스트, pass-through 주소 판별법, exposure 정의, 5단계 스캠 수사)를 상세 공개 [검증됨(공개 자료)].
- **Elliptic**: 컴플라이언스 중심. Elliptic Learn(AML 기초), 제품 인증(Lens/Navigator), Specialist Investigator 인증, ManchesterCF·뉴헤이븐대 공동 FIU CONNECT(9개 주제 공개) [검증됨(공개 자료)]. 다만 현재 과정별 상세 커리큘럼은 공식 페이지에 제한적으로만 공개 [미확인].
- **Merkle Science**: Merkle Science Institute 3개 인증(MiCAR 스테이블코인, 고급 컴플라이언스, Crypto Investigator). 무료 **Investigations Guide 2025**가 UTXO 클러스터링·트랜잭션 지문화, 크로스체인(스왑·브리지) 추적, 스테이블코인 수사 방법론을 공개 [검증됨(공개 자료)].
- **Scorechain**: Scorechain Academy는 **인증이 아닌 교육형 세미나**(컴플라이언스 책임자 대상)이며 인증·자격 부여가 없음을 공식 명시 [검증됨(공개 자료)]. AML 탐지 기법(거래 패턴 분석·지갑 리스크 스코어링·행위 모니터링)을 글로서리에서 공개.
- **주의**: 임무문의 'CCFR'이라는 명칭의 Chainalysis 인증은 공개 자료 어디에서도 확인되지 않음. 기존 명칭은 **CCFC**(Cryptocurrency Fundamentals Certification)이며, TRM에는 **CFC**가 있음 [미확인 — 명칭 혼동 가능성].

---

## Findings

### 1. Chainalysis Academy

#### 1-1. 과정명·인증명과 공개 커리큘럼 목차

**2026년 신체계(CDAP)** [검증됨(공개 자료)] — 출처: https://www.chainalysis.com/blog/new-chainalysis-academy-2026/ , https://www.chainalysis.com/academy-launch/
- 2026년 1월 21일 개편. 2개 학습 도메인(Investigations / Compliance), 단계별 티어 구조. 누적 41,000명 이상·1,500개 이상 기관/정부에서 인증 취득.
- 인증 체계와 구(舊) 인증 매핑:
  - **CDAF**(Chainalysis Digital Asset Fundamentals) — 선행 필수 과정. 구 CCFC·CDFT 대체.
  - **CCI**(Chainalysis Certified Investigator) — 구 **CRC**(Reactor Certification)·**CEIC**(Ethereum Investigations) 대체.
  - **CCCA**(Chainalysis Certified Compliance Analyst) — 구 **CKC**(KYT Certification)·**CRRT**(Risk & Regulation) 대체.
  - **CCAI**(Chainalysis Certified Advanced Investigator) — 구 **CISC**(Investigation Specialist Certification) 대체.
  - **CCEI**(Chainalysis Certified Elite Investigator) — 신설 캡스톤(최고 등급).
  - **CASC**(Chainalysis Asset Seizure Certification) — 정부 전문가용 스페셜리스트 과정으로 유지.
- 개편된 인증에는 최신 사례 기반 케이스스터디 포함: pig-butchering 스캠, AI 기반 사기, 초국가 자금세탁 네트워크 [검증됨(공개 자료)].

**구 인증별 공개 커리큘럼 (가장 상세한 공개 자료)** [검증됨(공개 자료)]
- **CRC (Reactor Certification)** 과정 개요(Chainalysis 공식 과정 소개서, scribd 미러): https://www.scribd.com/document/632450170/Chainalysis-Reactor-Certification-Overview
  - 학습 목표: ① 암호화폐 흐름 추적 ② 자금의 출처·목적지 특정 ③ 블록체인 서비스 익명성 해제(deanonymize) ④ 명확한 그래프·기록 작성 ⑤ 실제 케이스스터디 실습
  - 선수 요건: Crypto Essentials 또는 비트코인 트랜잭션 기초 이해, Reactor Essentials 교육 및/또는 실제 Reactor 사용 경험
  - 과정 아젠다: Bitcoin Transactions & Chainalysis / Reactor Fundamentals / Building graphs / **Isolating Deposit Addresses(입금 주소 분리)** / **Transaction Analysis & Cluster Merges(트랜잭션 분석·클러스터 병합)** / Identifying transactions of interest / **Peel Chain Analysis(필체인 분석)** / Identification Strategies / **Identifying mixers(믹서 식별)**
- **CISC (Investigation Specialist Certification)** 과정 개요(Chainalysis 공식 과정 소개서 한국어판, 자사 S3 호스팅): https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2Ftwiimd6dacphxj9igwlrlb1n%2Fpublic%2F1682635189%2FChainalysis-Investigation+Specialist-Certification-Overview-KR.pdf
  - 학습 목표: 고급 Reactor 기능·워크플로우 사용, 타 도구 정보 활용 심화 트랜잭션 분석, 특정 지갑 유형 식별, 난독화 패턴 인식(코인조인 믹싱·체인 호핑), 엔티티 위험 평가
  - 아젠다: 탈중앙화 거래소(DEX) / 트랜잭션·주소 기능 분석 / 고급 지갑 동작 방식과 난독화 기술 / 더스팅(dusting) / 체인 호핑 / 수탁형·비수탁형 지갑 / 시험 리뷰·준비

#### 1-2. 교육에서 가르치는 실제 수사 워크플로우 단계

공개 자료에서 확인되는 Reactor 기반 수사 워크플로우 [검증됨(공개 자료)]:
1. **식별자 입력**: 암호화폐 주소를 입력하면 해당 지갑을 통제하는 실체(entity)와 관련 주소를 확인. 검색 시 수천 개 소셜미디어 포럼·다크넷 사이트를 자동 OSINT 스캔 (출처: Chainalysis Reactor 제품 소개 자료).
2. **실체·익스포저 파악**: 서비스(거래소 등)의 주요 거래상대방(top counterparties)과 위험 익스포저(risk exposure) 검토.
3. **모니터링 설정**: "watch"를 설정해 향후 트랜잭션 감시.
4. **패스파인딩**: 자동화된 경로 탐색(automated pathfinding)으로 수사 개시.
5. **그래프 구축·기록**: 조사 그래프를 만들고 발견 사항을 문서화(CRC 학습 목표 "Create clear graphs and records of your findings").
6. **크로스체인 조사** (Reactor Cross-Chain Investigations): 그래프에 여러 암호화폐가 포함되면 그래프 이름 아래 드롭다운에 자산 목록 표시 → 자산 선택 시 해당 자산을 보유·보유했던 클러스터가 밝게 하이라이트, 나머지는 어둡게 표시 → 특정 자산의 흐름을 전체 수사 범위 안에서 파악 (출처: https://www.chainalysis.com/blog/cross-chain-investigations/ ).

#### 1-3. 공개 교육 자료·블로그·웨비나의 구체 기법

- **입금 주소 분리(Isolating Deposit Addresses)**: 거래소 입금 주소를 분리·식별해 자금의 현금화 지점을 특정하는 기법 — CRC 커리큘럼의 독립 모듈 [검증됨(공개 자료)].
- **클러스터 병합(Transaction Analysis & Cluster Merges)**: 트랜잭션 분석을 통해 관련 주소 클러스터를 병합하는 기법 — CRC 모듈 [검증됨(공개 자료)].
- **필체인 분석(Peel Chain Analysis)**: 자금 세탁 시퀀스를 따라가는 분석 방법 — CRC의 핵심 분석 기법 모듈 [검증됨(공개 자료)].
- **믹서 식별(Identifying mixers)**: 믹서 동작 원리 이해 및 식별 — CRC 모듈. CISC에서는 코인조인 믹싱·체인 호핑 등 난독화 기법 사용 거래 조사로 심화 [검증됨(공개 자료)].
- **OSINT 활용**: 오픈소스 인텔리전스 활용이 CRC 학습 목표에 명시; 소환장(subpoena) 요청·응답 프로세스 이해도 포함 [검증됨(공개 자료)].
- **데모 케이스 — BadgerDAO 해킹 추적** (2021년 12월, 약 1.2억 달러·19개 토큰을 5시간 내 탈취 후 DeFi 프로토콜로 BTC·ETH로 스왑): 크로스체인 그래프 기능 시연에 사용된 공개 사례 [검증됨(공개 자료)] (출처: https://www.chainalysis.com/blog/cross-chain-investigations/ ).
- **최신 교육 케이스 유형** (2026 개편): pig-butchering 스캠, AI 기반 사기 스킴, 초국가 자금세탁 네트워크를 워크플로우·프레임워크로 분해해 교육 [검증됨(공개 자료)].

#### 1-4. 인증 시험의 공개된 시험 범위/출제 영역

[검증됨(공개 자료)] (공식 과정 소개서 기준 — 문항 자체가 아닌 공개 가이드)
- **CRC**: 객관식 100문항 / 2.5시간 / 75% 이상 합격 / 오픈노트 허용. 자격 유효기간 1년. 활성 Reactor 라이선스 보유자는 Academy에서 무료 Refresher 과정·시험으로 갱신 가능, 미보유자는 CRC 재수강으로 갱신.
- **CISC**: 80문항 / 4시간 / 75% 이상 합격 / 오픈노트. 응시 전제: CRC 취득 + 3개월 이상 Reactor 사용 경험, 과정 실습·토론 적극 참여.
- **신체계(CDAF/CCI/CCCA/CCAI/CCEI)**: 2026년 개편 발표 자료에는 단계 구조와 매핑만 공개되고, 각 인증의 문항 수·시간·합격 기준 등 시험 스펙은 공개 자료에서 확인되지 않음 [미확인].

#### 1-5. 무료 공개 자료

[검증됨(공개 자료)]
- **Academy 무료 카탈로그** (https://academy.chainalysis.com/student/catalog/list — 로그인 없이 목록 확인 가능): Chainalysis Fundamentals(패스), Intro to Smart Contracts(20분 — EOA vs 스마트컨트랙트 구분, 컨트랙트 생성자·자금 추적), UTXO model(20분 — 인풋/아웃풋 추적과 수사상 한계), ABM model(20분 — 이더리움 계정 모델), Web3 Wallets(20분), What is DeFi?(20분).
- **Chainalysis 블로그** (https://www.chainalysis.com/blog/): 수사 케이스 분석·블록체인 인텔리전스 리서치 공개. "일반 대중·주니어 전문가도 기본 교육 콘텐츠·리포트·웨비나 탐색 가능" 명시.
- **2026 Crypto Crime Report**: 연례 무료 공개 보고서(공식 사이트에서 제공).
- **CASC(자산 압수 인증)** 소개 페이지는 공개되어 있으나 상세 커리큘럼은 제한적 [미확인].

---

### 2. TRM Labs

#### 2-1. 과정명·인증명과 공개 커리큘럼 목차

**TRM Academy 전문 인증** [검증됨(공개 자료)] — 출처: https://www.trmlabs.com/training-and-certifications
- **TRM Crypto Fundamentals Certification (CFC)**: 암호화폐 생태계 전반 오리엔테이션 — 블록체인 횡단 실체·트랜잭션 추적 개념 포함.
- **TRM Certified Investigator (CI)**: 온체인 수사 기법 — 블록체인 횡단 자금 추적, 의심 활동과 실세계 실체 연결.
- **TRM Advanced Crypto Investigator (ACI)**: 수사 경험자 대상 고급 과정 — 블록체인 인텔리전스 최대 활용.
- **TRM Certified Crypto Compliance Specialist (CCS)**: 규제 준수, 온체인 컴플라이언스 워크플로우, 제3자 리스크·티폴로지.
- **TRM Digital Forensics and Cryptocurrencies (DFC)**: 전통 포렌식과 암호화폐 수사 연계 — 증거 내 암호화폐 흔적 식별.
- **TRM Crypto Seizure Specialist (CSS)**: 법집행기관 대상 암호화폐 식별·압수·관리.
- **TRM Crypto Tax Specialist**: 과세 이벤트 식별·추적·보고.
- 전 과정 온라인 온디맨드, 구성: 온디맨드 영상 + 교육 자료 + 라이브챗 강사 접근 + 디지털 수료증·배지 + 시험 관리. 통계: 75시간 이상 영상, 1,500페이지 이상 자료, 13,000건 이상 인증 발급.
- **2025년 신규 과정** [검증됨(공개 자료)]: **TRM Forensics Mastery**(TRM Forensics 제품 인증 — 최초의 제품 인증), **Investigating Solana**(크로스체인 조사 포함), **Tips and Tricks for TRON Investigations**, **Understanding and Investigating TON**, **TRM Triage Orientation** (출처: TRM 공식 블로그 2025년 4월·5월 Product Highlights).

**ACI 공개 학습 주제** [검증됨(공개 자료)] — 출처: TRM 공식 파트너 DataExpert (https://dataexpert.eu/academy/trm-advanced-crypto-investigator)
- 암호화폐 범죄로 이어지는 위협 환경·공격 벡터 이해
- **Wasabi·Tornado Cash 등 서비스를 통한 수동 디믹싱(demixing) 설명**
- **Derivation path(파생 경로) 이해**
- **컨트랙트 읽기 및 컨트랙트 스푸핑 식별**
- **서명(signature) 적용 — 수동 및 TRM Labs 제공 방식**
- **Hex에서의 멀티시그 확인 등 고급 포렌식 기법**

**무료 과정 "Tracing on TRON" 전체 커리큘럼** [검증됨(공개 자료)] — 출처: https://www.trmlabs.com/training-and-certifications/tracing-on-tron
- Module 1: Investigating TRON 개요 / 2: 토큰 유형 / 3: 블록 익스플로러 활용 / 4: 흔한 불법 사용 사례·사기 패턴 / 5: 트랜잭션 이해 / 6: 토큰 트랜잭션 / 7: 컨트랙트 읽기 / 8: 주소 활성화 / 9: 실드(Shielded) 트랜잭션 / 10: DeFi 트랜잭션 / 11: 브리지 트랜잭션 / 12: 팁과 트릭 / 13: 요약. 각 모듈 독립 수강 가능.
- 학습 성과: TRON과 이더리움의 차이, 레드플래그·스캠 패턴, 주소·트랜잭션·토큰 추적, EOA vs 서비스 주소 판별 등 TRON 특화 수사 기법.

#### 2-2. 교육에서 가르치는 실제 수사 워크플로우 단계

**TRM Blockchain Investigator's Flip Book (공식 무료 교육 자료)**에 명시된 표준 워크플로우 [검증됨(공개 자료)] — 출처: https://cdn.prod.website-files.com/6082dc5b670562507b3587b4/698a5391bf77755a3a3e924b_TRM%20-%20Blockchain%20Investigator%27s%20Flip%20Book%20-%20US.pdf
1. **Step 1 — 불법 행위 식별(Identify Illicit Conduct)**: 고소장 등에서 확보한 단일 주소를 그래프 시각화 도구에 복사·붙여넣기(전자 형태로 확보해 붙여넣는 것이 모범 관행; 7자리만 알아도 자동 완성).
2. **Step 2 — 자금 추적(Trace Proceeds)**:
   - A) 트랜잭션 해시·입출금 주소를 추적 소프트웨어(TRM Graph Visualizer)에 입력.
   - B) 네트워크를 매핑해 **레버리지 포인트 식별** — 6개 질문: ① 주소가 관련된 트랜잭션 수 ② 최근 트랜잭션 시점 ③ 보유 가치 ④ 더 큰 주소 네트워크의 일부인지 ⑤ 리스크 귀속(attribution) 존재 여부 ⑥ 기록·자산을 보관하는 제3자에 대한 익스포저 존재 여부.
   - C) **서비스 대상 제3자 식별** — 그래프 스크린샷으로 검사·상급자에게 영장 필요성 설명.
   - D) **사법 절차** — VASP에 대한 소환장 등으로 KYC 문서, 가입자 정보, 이메일, IP, IMEI·디바이스 ID, 전체 거래 내역, 연관 계정 확보.
3. **Step 3 — 차단(Effectuate Disruption)**: 기소(각 트랜잭션이 별도 법 위반 가능), 압수·몰수 — 몰수 법리(예: 18 USC 981(a)(1)(I) 북한 자금조달 민사몰수)와 실무 5요소(보관 시설, 접근 통제, 자산 형태, 비상 대응, 청산 시점).

**TRM Investigating Crypto Scams Flip Book의 5단계 스캠 수사 워크플로우** [검증됨(공개 자료)]:
1. 피해자가 송금한 수신 주소("Known Scammer Address")를 블록체인 인텔리전스 소프트웨어에 복사·붙여넣기.
2. 해당 주소에서 자금을 받은 후속 주소 식별(예: "Compliant Exchange A").
3. "Compliant Exchange A"에 자금 동결 + 주소 통제자 관련 기록 제출 요청.
4. **역방향 추적**: 스캐머 주소로 들어온 자금을 역추적해 추가 잠재 피해자 식별(추가 입금도 사기 수익일 가능성 높음).
5. 자금 **원천까지 역추적**(예: "Compliant Exchange B")해 "Potential Victim" 주소 통제자의 신원 확보.

**TRM Forensics 제품 기능 기반 워크플로우** [검증됨(공개 자료)] — 출처: https://www.trmlabs.com/blockchain-intelligence-platform/forensics
- 자동 크로스체인 추적 / 다중 경로 패스파인딩(주소와 카테고리·실체 간 모든 경로 시각화) / 피해자 리포트 / 트랜잭션 지문화(transaction fingerprinting — 제한된 정보로 BTC 트랜잭션 탐색) / 케이스 관리(그래프·노트 통합) / 그래프 커스터마이징(요소 숨기기, 색상 코드, 노트, 커스텀 명칭, 내보내기).

#### 2-3. 공개 교육 자료·블로그·웨비나에서 공개된 구체 기법

- **Exposure 해석법** (Flip Book 정의): A가 B에 직접 송금 → B는 A에 대한 **직접 익스포저**; A→B→C인 경우 C는 A에 대한 **간접 익스포저**, B에 대한 직접 익스포저 [검증됨(공개 자료)].
- **Pass-through 주소 판별법** (Flip Book): 트랜잭션 2건(입금 1·출금 1), 입출금 동일 거액($154,814), 잔액 $0, 당일 39분 간격 이동 → "비경제적 거래"로 불법 자금의 레드플래그. 거래상대방이 Binance·Coinbase 같은 컴플라이언트 중앙화 VASP면 기록 요청의 지렛대로 활용 [검증됨(공개 자료)].
- **제재 회피 탐지 5대 기법** (공식 가이드 "Detecting Five Common Sanctions Evasion Techniques"): ① 주소 변경·신규 생성 — 신선한 미지정 주소를 소수 거래에 사용 후 폐기하는 사이클 반복 → 대응: 정적 지정 목록이 아닌 **빈번한 이름·주소 스크리닝** 필요 [검증됨(공개 자료)].
- **행위 기반 탐지 신호** ("Hidden Signals on the Blockchain" 보고서): 브랜드가 아닌 행위 신호가 가장 지속적 — 브로커 허브, 반복 거래상대방 패턴, 짧은 보유 기간, 일관된 오프라프 의존성 [검증됨(공개 자료)].
- **어트리뷰션 방법론** (법집행 백서): 수백만 웹페이지·다크웹 포럼·범죄 마켓·OSINT(스캠 신고·제재 목록) 수집 → 주소 라벨링·매핑, 내부 수사관의 독자 인텔리전스로 보강 [검증됨(공개 자료)].
- **Chainabuse OSINT 활용**: TRM 운영 공개 스캠 신고 플랫폼 — 수사관이 케이스 주소를 검색해 다수 피해자 신고 여부·연관 사건 연결·신규 스캠 트렌드 조기 경보에 활용 [검증됨(공개 자료)].

#### 2-4. 인증 시험의 공개된 시험 범위/출제 영역

[검증됨(공개 자료) — 범위 수준]
- TRM 공식 페이지: 모든 과정에 "시험 관리(exam administration)" 포함, 온디맨드 시험으로 명시. 문항 수·시간·합격 기준 등 스펙은 공개 자료에서 확인되지 않음 [미확인].
- TRM-ACI 출제 영역(공개 학습 주제에서 도출 — DataExpert): 위협 환경·벡터 / Wasabi·Tornado Cash 수동 디믹싱 / derivation path / 컨트랙트 읽기·스푸핑 식별 / 서명 적용 / hex 멀티시그 확인 [검증됨(공개 자료)].
- TRM-CI 출제 영역(공식 과정 설명): 블록체인 기술 기초·암호화폐·신흥 사용 사례 + 온체인 수사 기법 — 블록체인 횡단 자금 추적, 의심 활동과 실세계 실체 연결 [검증됨(공개 자료)].

#### 2-5. 무료 공개 자료

[검증됨(공개 자료)]
- **Blockchain Investigator's Flip Book** (공식 PDF, 위 URL): 용어 정의·추적 전략·소환장 작성·압수/몰수 실무를 담은 현장용 퀵 레퍼런스.
- **Investigating Crypto Scams Flip Book** (공식 PDF): 스캠 수사 5단계 워크플로우.
- **"Tracing on TRON" 무료 과정** (13개 모듈, 위 URL): TRON 특화 수사 무료 교육.
- **"Detecting Five Common Sanctions Evasion Techniques"** 가이드 (공식 PDF).
- **"Hidden Signals on the Blockchain"** 보고서, **"Why Law Enforcement Agencies Need Blockchain Intelligence"** 백서 (공식 PDF).
- **TRM 블로그·Product Highlights**: 신기능·수사 기법 업데이트(예: TRM Forensics의 entity 레벨 그래프, 커스텀 엔티티, 대용량 트랜잭션 트리밍).

---

### 3. Elliptic

#### 3-1. 과정명·인증명과 공개 커리큘럼 목차

[검증됨(공개 자료)] — 출처: https://www.elliptic.co/solutions/education-and-training , https://www.elliptic.co/newsroom/elliptic-manchestercf-launch-crypto-compliance-certification/
- **Elliptic Learn – Certify**: AML·암호화폐 기초 인증. 주제 영역(공식 "How to" 가이드 기준): Crypto KYC, Blockchain Analytics(블록체인 분석이란·간략 가이드), Travel Rule(개념·101 가이드·관할권별 요건), Sanctions Compliance.
- **제품 인증(Product Certifications)**: Elliptic Lens(지갑 스크리닝), Elliptic Navigator(트랜잭션 모니터링) 도구 교육 [업계 추론 — 공식 페이지보다 업계 정리 자료에서 확인].
- **Specialist Investigator Certification**: Elliptic 플랫폼을 활용한 고급 수사 [업계 추론 — 공식 페이지 상세 미공개].
- **FIU CONNECT (Cryptoassets)** — Elliptic × ManchesterCF × 뉴헤이븐 대학교(대학 인정, ManchesterCF Financial Intelligence Specialist 지정의 14개 모듈 중 하나. 3년 내 12개 모듈 이수 시 FIS 지정): 공개 커리큘럼·평가 주제 9개 —
  1. Fundamentals of Cryptoassets / 2. Privacy and Anonymity Enhancement / 3. Blockchain Analytics / 4. Illicit Typologies / 5. Terrorist Financing / 6. Cybersecurity and Hacking / 7. Regulatory Oversight / 8. Sanctions / 9. Emerging Cryptoasset Developments.
  온라인 플랫폼(디지털 교재·시험), 은행 보안 요건 충족.
- 교육 설계: 1차 방어선(리스크 인지·에스컬레이션) vs 2차 방어선(통제 설계) 역할별 경로, 고객 LMS 탑재·맞춤형 경로 제공.

#### 3-2. 교육에서 가르치는 실제 수사 워크플로우 단계

Elliptic의 공개 교육은 컴플라이언스 중심이며, 수사 워크플로우 자체는 제품 기능 중심으로 서술됨 [업계 추론]:
- **Lens(지갑 스크리닝)**: 고객 출금 지갑이 믹서·프라이버시 지갑 연관 주소인지 식별 (출처: Elliptic Typologies 2022 "Preventing Financial Crime in Cryptoassets").
- **Navigator(트랜잭션 모니터링)**: 믹서·프라이버시 지갑에 대한 익스포저가 있는 트랜잭션 탐지.
- **고위험 시나리오 EDD**: 자금의 목적·궁극적 출처/목적지에 대한 추가 정보 요구 등 정책·절차 수립 (출처: 위 Typologies 가이드).
- 컴플라이언스 체크리스트(공식 가이드): Travel Rule 실사, 등록, 블록체인 분석 도구 보유(위험 익스포저 식별·의심 거래 실시간 탐지·차단), 제재 스크리닝, 직원 교육(레드플래그·티폴로지), 기록 보관 [검증됨(공개 자료)].

#### 3-3. 공개 교육 자료·블로그·웨비나에서 공개된 구체 기법

- **믹서·프라이버시 지갑 대응 통제** (Typologies 2022): Lens 지갑 스크리닝 + Navigator 거래 모니터링 + 고위험 시나리오 EDD [검증됨(공개 자료)].
- **Holistic Screening 개념**: 여러 블록체인을 단일 통합 그래프로 취급해 브리지·DEX·자산 스왑을 자동 추적 (업계 기술 정리 자료에서 확인 — Elliptic 공식 마케팅 용어) [업계 추론].
- **제재 익스포저 해석**: VASP·지갑이 관여하는 위험 익스포저를 식별·평가하는 도구 요건으로 공개 가이드에 명시 [검증됨(공개 자료)].
- **Elliptic 블로그**: 제재 대상 주소 분석(예: OFAC 제재 주소의 수령 암호화폐 분석), 범죄 유형별 리서치 공개 [검증됨(공개 자료)].

#### 3-4. 인증 시험의 공개된 시험 범위/출제 영역

- FIU CONNECT: 9개 주제(상기)가 평가 범위로 공개 [검증됨(공개 자료)]. 문항 수·형식·합격 기준은 미공개 [미확인].
- Elliptic Learn Certify / Specialist Investigator / 제품 인증의 시험 스펙(문항 수·시간·합격선)은 공개 자료에서 확인되지 않음 [미확인].

#### 3-5. 무료 공개 자료

[검증됨(공개 자료)]
- **Elliptic 블로그** (https://www.elliptic.co/blog): 제재·랜섬웨어·범죄 유형 분석 리서치.
- **Typologies 가이드** ("Preventing Financial Crime in Cryptoassets" 2022, 공식 PDF): 믹서·프라이버시 지갑 등 유형별 통제 방안.
- **"How to" 가이드**: Crypto KYC, Blockchain Analytics, Travel Rule, Sanctions Compliance 주제별 공개 가이드.
- **웨비나·부트캠프**: 예) Elliptic × FINTRAIL APAC Cryptoasset Compliance Virtual Bootcamp(세션 1: APAC 암호화폐 리스크, 세션 2: 규제).

---

### 4. Merkle Science / Scorechain

#### 4-1. 과정명·인증명과 공개 커리큘럼 목차

**Merkle Science Institute** [검증됨(공개 자료)] — 출처: https://www.merklescience.com/training-certifications
- 온디맨드 인증 3종, 구성: 온디맨드 과정 접근 + 교육 자료 + 디지털 수료증·배지 + 시험 관리 + 강사 접근. 통계: 18시간 이상 영상, 1,500페이지 이상 자료, 3,528건 인증 발급.
  1. **MiCar Compliance: Stablecoin Issuers Certification** — MiCAR 이전 프레임워크~MiCAR 핵심 요소, 스테이블코인 분류, 발행자 의무, 리스크 관리, 트랜잭션 모니터링.
  2. **Crypto Compliance Advanced Certification** — 글로벌 규제 환경, 컴플라이언스 모범 관행, 신흥 트렌드(남용·자금세탁·금융범죄 대응).
  3. **Crypto Investigator Certification** — 블록체인 기초·암호화폐 세부 사항~신흥 애플리케이션, **표준 수사 기법(standard investigative techniques)** 심화. 수료 후 블록체인 횡단 자금 흐름 추적, 의심 활동과 실세계 실체 연결 역량 확보. 대상: 전문 수사관·컴플라이언스 담당·분석가·규제기관.

**Scorechain Academy** [검증됨(공개 자료)] — 출처: https://scorechain.com/resources/scorechain-academy
- **인증이 아님을 공식 명시**: "교육 목적이며 인증·규제 승인·공식 자격을 부여하지 않음. 내부 정책·절차·규제 의무를 대체하지 않음."
- 대상: 컴플라이언스 책임자·이노베이션 책임자·시니어 이해관계자. 목표: 핵심 암호화폐 리스크 개념 이해, 주요 온체인 메커니즘 설명, 정보에 기반한 의사결정 지원.
- 범위: 컴플라이언스 관련 필수 암호화폐 개념 / 암호자산에 적용되는 AML·KYT 원칙 / 흔한 온체인 리스크 티폴로지·행위 / 실제 사례·현실 시나리오 / 컴플라이언스 팀과 암호화폐 도구 간 상호작용. 라이브(현장·원격) 제공, 수준별 맞춤.

#### 4-2. 교육에서 가르치는 실제 수사 워크플로우 단계

- **Merkle Science**: "표준 수사 기법"을 가르친다고 공개하나, 단계별 워크플로우(주소 입력→확장→필터링→노트→케이스 저장)의 UI 단위 절차는 공개 자료에서 확인되지 않음 [미확인]. 다만 무료 가이드의 방법론(아래 4-3)은 수사 절차 관점에서 서술됨.
- **Scorechain**: 수사 워크플로우가 아닌 **리스크 판단 워크플로우** 교육 — "올바른 질문을 던지고 암호화폐 익스포저를 평가하며 분석 도구·팀과 효과적으로 상호작용"하는 역량 목표 [검증됨(공개 자료)]. 플랫폼 기능(Investigation Tool·Case Manager·Entity Directory·Exploration Tool·Flux Analysis)이 수사 지원을 하나 교육 과정의 단계별 절차는 미공개 [미확인].

#### 4-3. 공개 교육 자료·블로그·웨비나에서 공개된 구체 기법

**Merkle Science — Investigations Guide 2025 (무료)** [검증됨(공개 자료)] — 출처: https://info.merklescience.com/investigations-guide-2025
- **UTXO Mastery**: 클러스터링(clustering)과 트랜잭션 지문화(transaction fingerprinting)로 소유 패턴 파악.
- **Cross-Chain Tracing**: 범죄자가 스왑·브리지를 악용하는 방식과 추적 방법.
- **Stablecoin Investigations**: USDT·USDC·PYUSD의 컴플라이언스 환경 이해.
- **Case Studies**: 랜섬웨어·자금세탁 사건에서 수백만 달러 회수 사례.
- **Hands-On Methodologies**: 실제 수사에 사용된 수동 추적 워크스루.

**Merkle Science 블로그 실무 팁** [검증됨(공개 자료)] — 출처: https://www.merklescience.com/blog/top-mistakes-investigators-make-when-investigating-crypto-crime
- 법집행기관은 암호화폐 자산을 **체계적으로 수색**해야 함. 압수한 암호화폐는 오프라인 생성 지갑 또는 신뢰 채널(평판 있는 거래소)을 통한 지갑에 보관.

**Scorechain 공개 탐지 기법** (공식 크립토 글로서리) [검증됨(공개 자료)] — 출처: https://www.scorechain.com/resources/crypto-glossary/aml-solutions-crypto
1. **Transaction Analysis**: 스트럭처링·레이어링 같은 패턴 모니터링.
2. **Wallet Risk Scoring**: 고위험 실체와의 연결성 기반 지갑 평가.
3. **Behavioral Monitoring**: 비정상 행위 식별 — 예) 자금의 급속 이동, 프라이버시 코인 사용.

#### 4-4. 인증 시험의 공개된 시험 범위/출제 영역

- **Merkle Science**: "시험 관리(exam administration)" 포함 명시 외에 문항 수·형식·합격 기준·출제 영역 미공개 [미확인].
- **Scorechain**: 인증이 없으므로 해당 없음 [검증됨(공개 자료)].

#### 4-5. 무료 공개 자료

[검증됨(공개 자료)]
- **Merkle Science**: Investigations Guide 2025(무료 가이드), 공식 블로그(수사 실수·팁), 웨비나.
- **Scorechain**: 공식 블로그, 크립토 글로서리(AML Solutions·Crypto Compliance Solutions — 탐지 기법·플랫폼 기능 설명), 케이스스터디.

---

## Could not verify

1. **'CCFR' 명칭의 Chainalysis 인증 존재 여부** — Chainalysis 공식 자료(신·구 체계 모두)에 해당 약어 없음. 구 명칭은 CCFC(Cryptocurrency Fundamentals Certification), TRM에는 CFC(Crypto Fundamentals Certification)가 있어 임무문의 CCFR은 명칭 혼동일 가능성이 높음 [미확인].
2. **유료 과정의 모듈별 상세 실라버스** — TRM ACI/CI, Chainalysis 신체계(CCI/CCAI/CCEI), Elliptic Specialist Investigator, Merkle Science Crypto Investigator의 모듈 단위 목차는 로그인이 필요한 유료 과정이라 공개 자료에서 확인 불가 [미확인]. (단, TRM ACI는 공식 파트너 DataExpert가 학습 주제를 공개했고, Chainalysis 구 CRC/CISC는 공식 과정 소개서가 공개되어 있음.)
3. **시험 문항·정확한 출제 비중(blueprint)** — 모든 업체가 문항 자체를 비공개. 공개된 것은 형식(문항 수·시간·합격선·오픈노트 여부)과 출제 영역(주제) 수준뿐 [미확인].
4. **Elliptic 과정별 상세 커리큘럼** — 공식 교육 페이지는 프로그램 수준 설명만 제공하고, Learn Certify/제품 인증/Specialist Investigator의 모듈 목차·시험 스펙은 공개 자료에서 확인 불가 [미확인].
5. **Chainalysis Academy 무료 모듈의 정확한 접근 범위** — 카탈로그 목록은 로그인 없이 확인 가능하고 블로그는 "일반 대중도 기본 교육 콘텐츠 탐색 가능"이라고 하나, 각 모듈의 실제 무료 수강 가능 여부는 로그인 필요 여부상 확인 불가 [미확인].
6. **Merkle Science Crypto Investigator의 단계별 수사 워크플로우(UI 절차)** — "표준 수사 기법" 교육은 공지되나 UI 패널 단위 절차는 미공개 [미확인].
7. **Scorechain의 수사관 대상 인증** — Scorechain Academy는 인증을 부여하지 않는다고 공식 명시 [검증됨(공개 자료)].

---

## Sources

| # | 출처 | 확인일 | 방식 | 내용 |
|---|------|--------|------|------|
| 1 | https://www.chainalysis.com/blog/new-chainalysis-academy-2026/ | 2026-09-27 | 직접 열람 | 2026 Academy 개편(CDAP), 인증 매핑, 케이스 유형 |
| 2 | https://www.chainalysis.com/academy-launch/ | 2026-09-27 | 직접 열람 | 구→신 인증 매핑표 |
| 3 | https://academy.chainalysis.com/student/catalog/list | 2026-09-27 | 직접 열람 | 무료 카탈로그(UTXO/ABM/Web3/DeFi 등) |
| 4 | https://www.scribd.com/document/632450170/Chainalysis-Reactor-Certification-Overview | 2026-09-27 | 직접 열람 | CRC 공식 과정 개요(목표·아젠다·시험 형식) |
| 5 | https://everpath-course-content.s3-accelerate.amazonaws.com/.../CRC+Zertifizierungskurs+2023+%281%29.pdf | 2026-09-27 | 인덱스 | CRC 과정 소개(독일어, Chainalysis 자사 호스팅) |
| 6 | https://everpath-course-content.s3-accelerate.amazonaws.com/.../Chainalysis-Investigation+Specialist-Certification-Overview-KR.pdf | 2026-09-27 | 인덱스 | CISC 과정 소개(한국어, Chainalysis 자사 호스팅) |
| 7 | https://www.chainalysis.com/blog/cross-chain-investigations/ | 2026-09-27 | 인덱스 | Reactor 크로스체인 기능·BadgerDAO 데모 케이스 |
| 8 | https://www.trmlabs.com/training-and-certifications | 2026-09-27 | 직접 열람 | TRM Academy 7개 인증·구성·통계 |
| 9 | https://www.trmlabs.com/training-and-certifications/tracing-on-tron | 2026-09-27 | 인덱스 | 무료 "Tracing on TRON" 13개 모듈 |
| 10 | https://dataexpert.eu/academy/trm-advanced-crypto-investigator | 2026-09-27 | 직접 열람 | TRM-ACI 학습 주제(디믹싱·derivation path 등) |
| 11 | https://cdn.prod.website-files.com/.../TRM%20-%20Blockchain%20Investigator%27s%20Flip%20Book%20-%20US.pdf | 2026-09-27 | 직접 열람(전체) | TRM 수사 워크플로우·exposure·pass-through 기법 |
| 12 | TRM Investigating Crypto Scams Flip Book (bigmarker S3 PDF) | 2026-09-27 | 인덱스 | 스캠 수사 5단계 워크플로우 |
| 13 | https://www.globenewswire.com/news-release/2023/03/09/2624062/0/en/TRM-Labs-Launches-On-Demand-Crypto-Compliance-and-Investigations-Certifications-in-TRM-Academy.html | 2026-09-27 | 인덱스 | TRM Academy 출범·인증 설명 |
| 14 | TRM "Detecting Five Common Sanctions Evasion Techniques" (공식 PDF) | 2026-09-27 | 인덱스 | 제재 회피 5대 기법 |
| 15 | TRM "Hidden Signals on the Blockchain" (공식 PDF) | 2026-09-27 | 인덱스 | 행위 기반 탐지 신호 |
| 16 | https://www.elliptic.co/solutions/education-and-training | 2026-09-27 | 직접 열람 | Elliptic 교육 프로그램 개요 |
| 17 | https://www.elliptic.co/newsroom/elliptic-manchestercf-launch-crypto-compliance-certification/ | 2026-09-27 | 인덱스 | FIU CONNECT 9개 주제 커리큘럼 |
| 18 | https://www.elliptic.co/hubfs/Typologies-2022-Preventing%20Financial%20Crime%20in%20Crypto-NH.pdf | 2026-09-27 | 인덱스 | 믹서 대응 통제(Lens·Navigator) |
| 19 | https://www.merklescience.com/training-certifications | 2026-09-27 | 직접 열람 | Merkle Science Institute 3개 인증 |
| 20 | https://info.merklescience.com/investigations-guide-2025 | 2026-09-27 | 직접 열람 | 무료 Investigations Guide 2025 목차 |
| 21 | https://www.merklescience.com/blog/top-mistakes-investigators-make-when-investigating-crypto-crime | 2026-09-27 | 인덱스 | 수사 실무 팁(체계적 수색·압수 자산 보관) |
| 22 | https://scorechain.com/resources/scorechain-academy | 2026-09-27 | 직접 열람 | Scorechain Academy(비인증 교육) 범위 |
| 23 | https://www.scorechain.com/resources/crypto-glossary/aml-solutions-crypto | 2026-09-27 | 인덱스 | AML 탐지 3대 기법 |
| 24 | https://cncintel.com/reviews/chainalysis/ | 2026-09-27 | 인덱스 | CRC 스킬 정리(제3자 리뷰) |
| 25 | https://financefeeds.com/where-to-take-an-aml-for-crypto-course-online/ | 2026-09-27 | 인덱스 | Elliptic Academy 과정 정리(제3자) |

---

### 옵션 비교표 (임무 기준: 공개 커리큘럼 상세도 · 수사 워크플로우 공개 수준 · 무료 자료)

| 업체 | 인증/과정 수 (공개) | 수사 워크플로우 공개 수준 | 공개 시험 스펙 | 무료 실무 자료 |
|------|-------------------|------------------------|--------------|--------------|
| Chainalysis | 6종(CDAF/CCI/CCCA/CCAI/CCEI/CASC) + 구 7종 매핑 | 높음 — Reactor UI 절차·그래프·크로스체인 공개 | CRC·CISC 상세(문항수·시간·합격선) | Academy 기초 모듈, 블로그, 연례 범죄 보고서 |
| TRM Labs | 7종 + 2025 신규 5과정 | 매우 높음 — Flip Book 2종에 단계별 절차·체크리스트 | 형식만(온디맨드·시험 포함) | Flip Book 2종, TRON 무료 과정, 제재회피 가이드 |
| Elliptic | Learn·제품 인증·Investigator·FIU CONNECT | 중간 — 컴플라이언스 중심, 수사 절차는 제품 기능 수준 | FIU CONNECT 주제만 | 블로그, Typologies 가이드, 웨비나 |
| Merkle Science | 3종 | 중간 — 가이드 방법론 수준 | 형식만 | Investigations Guide 2025, 블로그 팁 |
| Scorechain | 0종(인증 없음 명시) | 낮음 — 리스크 판단 교육 | 해당 없음 | 블로그, 글로서리, 케이스스터디 |
