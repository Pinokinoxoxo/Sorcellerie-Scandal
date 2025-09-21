/* ============================================================================
 * 2_character.js
 *  - 캐릭터 데이터베이스
 * ========================================================================== */

/* ============================================================
 * 이름 생성기 및 헬퍼
 * ============================================================ */
setup.Names = {
    female: ["엘리슨", "레나", "배린다", "메이라", "로사니야", "아라네", "아일라", "타넬리아", "리나", "이사렐", "메리엘", "엘린시아"],
    male: ["에일몬", "엘라크", "타사리온", "키델", "실바르", "키노르", "프라안", "시나트", "아르틴", "폴루인", "알레드", "앤리스"],
    surname: ["미아하나", "헬레렌", "윈릭", "베이칸", "유리칸", "크리스렌", "브리퀴날", "벤발라르", "실미스", "피베로스", "레이릭", "글린단", "패렌", "크리스켄", "예스랄레이", "에란", "오리시스", "모튜말", "에일칸", "인시나", "미라카스", "친벨라", "엘피나", "진로"]
};

setup.random_name = function(gender, rng = new RNG()) {
    let firstname = rng.randomchoice(setup.Names[gender]);
    let surname = rng.randomchoice(setup.Names.surname);
    return firstname + " " + surname;
};

// 이름을 first와 last로 분리하는 헬퍼
setup.splitName = function(full) {
    const s = String(full ?? "").trim().replace(/\s+/gu, " ");
    if (!s) return { first: "", last: "" };
    const parts = s.split(" ");
    const last = parts.pop();
    const first = parts.join(" ");
    return { first, last };
};

// 이름 객체 → 전체 이름 문자열
setup.fullName = function(name) {
    if (!name) return "";
    const first = String(name.first || "").trim();
    const last = String(name.last || "").trim();
    return first && last ? (first + " " + last) : (first || last);
};

/* ============================================================
 * Character Data: compact, save-safe (JSON), maintainable
 * ============================================================ */
setup.ID = {
    RACE: { HUMAN: 0 },
    GENDER: { MALE: 0, FEMALE: 1 },
    STATUS: { PEASANT: 0, NOBLE: 1, ROYAL: 2, CLERIC: 3 },
    ORIENT: { STRAIGHT: 0, GAY: 1, BI: 2 },
    TITLE: { 
        NONE: 0, STUDENT: 1, ACOLYTE: 2, PRIEST: 3, 
        YOUNG_LORD: 4, YOUNG_LADY: 5, STAFF: 6, PROFESSOR: 7 
    },
    // 계층형 소속
    AFF: {
        NONE: { ID: 0 },
        ACADEMY: {
        ID: 1,
        ROLE:   { YEAR_1: 0, YEAR_2: 1, YEAR_3: 2, YEAR_4: 3, STAFF: 4, PROFESSOR: 5, RESEARCHER: 6, GRAD_STUDENT: 7 },
        DETAIL: { CLASSIC_MAGIC: 0, TACTICAL_MAGIC: 1, APPLIED_MAGIC: 2 },
        STATE:  { ENROLLED: 0, GRADUATED: 1, EXPELLED: 2, DROPPED_OUT: 3, ON_STAFF: 4, FORMER_STAFF: 5 }
        },
        TEMPLE: {
        ID: 2,
        ROLE:   { ACOLYTE: 0, PRIEST: 1, BISHOP: 2, PALADIN: 3 },
        DETAIL: { NONE: 0 },
        STATE:  { BELIEVER: 0, EXCOMMUNICATED: 1, FORMER_CLERGY: 2 }
        },
        TAVERN: {
        ID: 3,
        ROLE:   { STAFF: 0, COOK: 1 },
        DETAIL: { NONE: 0 },
        STATE:  { ACTIVE: 0, FORMER: 1 }
        }
    }
};
/* ============================================================
 * 3. 데이터 스키마 (Schema & Indexes)
 * ============================================================ */
setup.SCHEMA = {
    PART:      { _INDEX: { WOUND: 0, MARK: 1, CLEAN: 2, CLOTH: 3 }, COUNT: 4 },
    BODYPART_COMMON: ["head", "face", "neck", "eyeL", "eyeR", "nose", "mouth", "earL", "earR", "shoulderL", "shoulderR", "upperArmL", "upperArmR", "foreArmL", "foreArmR", "wristL", "wristR", "handL", "handR", "fingerL", "fingerR", "chest", "upperBelly", "lowerBelly", "back", "butt", "groin", "thighL", "thighR", "kneeL", "kneeR", "calfL", "calfR", "ankleL", "ankleR", "footL", "footR"],
    BODYPART_MALE: ["penis"],
    BODYPART_FEMALE: ["vulva", "breastL", "breastR"],
    
    HAIR:      { _INDEX: { LENGTH: 0, COLOR: 1, TEXTURE: 2, SHAPE: 3, STATE: 4, STYLE_F: 5, STYLE_B: 6, STYLE_ACC: 7, GROWTH_RATE: 8 }, COUNT: 9 },
    FACE:      { _INDEX: { SKIN_STATE: 0, SKIN_FEATURE: 1 }, COUNT: 2 },
    EYES:      { _INDEX: { SHAPE: 0, COLOR: 1, PUPIL: 2, BROW: 3 }, COUNT: 4 },
    MOUTH:     { _INDEX: { LIP: 0, THROAT_CAP: 1, THROAT_SENS: 2, THROAT_STATE: 3, TEETH: 4, FIRST_EXP: 5, EXP_COUNT: 6 }, COUNT: 7 },
    BODY:      { _INDEX: { SKIN_COLOR: 0, MUSCLE: 1, FAT: 2, WEIGHT: 3, BUILD: 4, PHYSIQUE: 5, SKIN: 6 }, COUNT: 7 },
    CHEST_F:   { _INDEX: { SIZE: 0, NIP_COLOR: 1, NIP_SHAPE: 2, NIP_TYPE: 3, NIP_SENS: 4, STATE: 5, EVENT_TAG: 6 }, COUNT: 7 },
    CHEST_M:   { _INDEX: { SHAPE: 0, NIP_COLOR: 1, NIP_SHAPE: 2, NIP_TYPE: 3, NIP_SENS: 4, STATE: 5 }, COUNT: 6 },
    BUTT:      { _INDEX: { SHAPE: 0, PRESSURE: 1, SENS: 2, RECOVERY: 3, STATE: 4, FLUID: 5, FIRST_EXP: 6, EXP_COUNT: 7 }, COUNT: 8 },
    GEN_M:     { _INDEX: { SIZE: 0, SENS: 1, STATE: 2, FIRST_EXP: 3, EXP_COUNT: 4 }, COUNT: 5 },
    GEN_F:     { _INDEX: { SHAPE: 0, PRESSURE: 1, SENS: 2, RECOVERY: 3, STATE: 4, FLUID: 5, FIRST_EXP: 6, EXP_COUNT: 7 }, COUNT: 8 },
    BODYHAIR:  { _INDEX: { LENGTH: 0, MAX: 1, STYLE: 2, GROWTH: 3 }, COUNT: 4 },
    BODYHAIR_AREAS_M: ["beard", "armpit", "chest", "leg", "pubic"],
    BODYHAIR_AREAS_F: ["armpit", "leg", "pubic"],
    MAKEUP:    { NAMES: ["eyeliner", "eyeshadow", "blusher", "lip", "perfume", "manicure", "pedicure"], COUNT: 7 },
    
    BASE:      { NAMES: ["health", "mood", "satiety", "thirst", "bathroom", "fatigue", "motivation", "cleanliness", "vulnerability"], COUNT: 9 },
    TEMP:      { NAMES: ["arousal", "pleasure", "pain", "humiliation", "drunk", "sensitivity", "orgasm", "stamina"], COUNT: 8 },

    ABIL:      { COMP: 5, MENTAL: 5, PHYS: 4, SEX: 9 },
    SKILL:     { SOCIAL: 2, COMBAT: 3, LIFE: 8, SEX: 8 }
};

/* PC의 성기 첫경험 여부를 '경험 있음'으로 설정하기
<<set $pc.genitals[setup.SCHEMA.GEN_M._INDEX.FIRST_EXP] to 1>>

NPC 카일(kyle)의 구강 첫경험 여부 확인하기
<<if $npcs.kyle.mouth[setup.SCHEMA.MOUTH._INDEX.FIRST_EXP] is 1>>
  카일은 구강 경험이 있습니다.
<</if>> */

setup.IDX = Object.freeze({
    // 23. 능력치
    ABIL: {
        COMP: { ATTR_ALL: 0, ATTR_SOCIAL: 1, ATTR_SEXUAL: 2, ATTR_LOOKS: 3, LEARNING: 4 },
        MENTAL: { FOCUS: 0, JUDGEMENT: 1, SELF_CONTROL: 2, EMOTION: 3, SOCIAL: 4 },
        PHYS: { STAMINA: 0, STRENGTH: 1, FLEXIBILITY: 2, AGILITY: 3 },
        SEX: { SELF_CONTROL: 0, PROACTIVE: 1, LIBIDO: 2, CHASTITY: 3, VOYEURISM: 4, EXHIBITIONISM: 5, DOM_SUB: 6, SAD_MAS: 7, BONDAGE: 8 }
    },
    // 24. 스킬
    SKILL: {
        SOCIAL: { CULTURE: 0, PIETY: 1 },
        COMBAT: { MARTIAL: 0, CASTING: 1, MASTERY: 2 },
        LIFE: { DEXTERITY: 0, SEWING: 1, SINGING: 2, INSTRUMENT: 3, DANCING: 4, SWIMMING: 5, ART: 6, COOKING: 7, HOUSEWORK: 8 },
        SEX: { KNOWLEDGE: 0, SEDUCTION: 1, WAIST: 2, HAND: 3, BREAST: 4, GENITAL: 5, ANAL: 6, FOOT: 7 }
    }
}); Object.freeze(setup.IDX);

/* ============================================================
 * 4. 데이터 구조 생성 헬퍼 (Factory Helpers)
 * ============================================================ */
setup._zeroArray = (n) => new Array(n).fill(0);
setup._defaultPreg = function () {
  return {
    isPregnant: false, status: 0, gestation: 0, fatherId: null,
    cycleDay: 1, cycleLength: 28, fertility: 100,
    spermLife: 72, ovumLife: 24, isFertile: false,
    birthCount: 0, lastDelivery: null, birthStatus: 0
  };
};

//소속 설정 함수
setup.setAff = function (char, domainKey, roleKey = 'NONE', detailKey = 'NONE', stateKey = 'ACTIVE') {
  const A = setup.ID.AFF;
  const D = A?.[domainKey];

  if (!D || typeof D !== 'object' || !('ID' in D)) {
    char.aff = [A.NONE.ID, 0, 0, 0];
    return;
  }
  const role   = (D.ROLE   && D.ROLE[roleKey])   ?? 0;
  const detail = (D.DETAIL && D.DETAIL[detailKey]) ?? 0;
  const state  = (D.STATE  && D.STATE[stateKey]) ?? 0;

  char.aff = [D.ID, role, detail, state];
};
/* ============================================================
 * 3) 성별 전환 시 안전 재구성 (버그 방지 포인트)
 *    - chest/genitals/bodyhair/bodyparts를 성별 스키마에 맞춰 재할당
 *    - 여성 전환 시 preg 기본 필드 생성, 남성 전환 시 제거
 * ============================================================ */
setup.switchGender = function (ch, newGender) {
  if (!ch) return;
  const G = setup.ID.GENDER, S = setup.SCHEMA;
  if (ch.gender === newGender) return;
  ch.gender = newGender;

  // 가슴/성기 배열 재생성
  ch.chest    = setup._zeroArray(newGender === G.FEMALE ? S.CHEST_F.COUNT : S.CHEST_M.COUNT);
  ch.genitals = setup._zeroArray(newGender === G.FEMALE ? S.GEN_F.COUNT   : S.GEN_M.COUNT);

  // 체모 영역 재구성
  const areas = (newGender === G.FEMALE) ? S.BODYHAIR_AREAS_F : S.BODYHAIR_AREAS_M;
  ch.bodyhair = Object.fromEntries(areas.map(a => [a, setup._zeroArray(S.BODYHAIR.COUNT)]));

  // 바디파트 키 재구성
  const bodyPartsList = [...S.BODYPART_COMMON, ...(newGender === G.FEMALE ? S.BODYPART_FEMALE : S.BODYPART_MALE)];
  ch.bodyparts = Object.fromEntries(bodyPartsList.map(p => [p, setup._zeroArray(S.PART.COUNT)]));

  // 임신 필드 처리
  if (newGender === G.FEMALE) {
    if (!ch.preg) ch.preg = setup._defaultPreg();
  } else {
    if ('preg' in ch) delete ch.preg;
  }
};

/* ============================================================
 * 6) LI/PC 코어 보장
 * ============================================================ */
setup.ensureLIFields = function (ch) {
  const S = setup.SCHEMA;
  if (!ch.mouth) ch.mouth = setup._zeroArray(S.MOUTH.COUNT);
  if (!ch.temp)  ch.temp  = setup._zeroArray(S.TEMP.COUNT);
  if (!ch.abil) {
    ch.abil = {
      composite: setup._zeroArray(S.ABIL.COMP),
      mental:    setup._zeroArray(S.ABIL.MENTAL),
      physical:  setup._zeroArray(S.ABIL.PHYS),
      sexual:    setup._zeroArray(S.ABIL.SEX),
    };
  }
  if (!ch.skill) {
    ch.skill = {
      social:  setup._zeroArray(S.SKILL.SOCIAL),
      combat:  setup._zeroArray(S.SKILL.COMBAT),
      life:    setup._zeroArray(S.SKILL.LIFE),
      sexual:  setup._zeroArray(S.SKILL.SEX),
    };
  }
};
setup.ensurePCCore = function (ch) {
  ch.type = 'PC';
  setup.ensureLIFields(ch);

  const S = setup.SCHEMA;
  if (!ch.hair) ch.hair = setup._zeroArray(S.HAIR.COUNT);
  if (!ch.face) ch.face = setup._zeroArray(S.FACE.COUNT);
  if (!ch.eyes) ch.eyes = setup._zeroArray(S.EYES.COUNT);
  if (!ch.body) ch.body = setup._zeroArray(S.BODY.COUNT);
  if (!ch.butt) ch.butt = setup._zeroArray(S.BUTT.COUNT);

  if (!ch.base)  ch.base  = setup._zeroArray(S.BASE.COUNT);

  // 착용 슬롯 보장(없을 수 있음)
  if (!ch.wear) {
    const slots = [
      "u_under","u_midunder","u_inner","u_top","u_coat","u_coat2",
      "l_under","l_midunder","l_bottom","l_socks","l_shoes",
      "acc_glasses","acc_headband","acc_hairpin","acc_mask","acc_hat",
      "acc_scarf","acc_glove","acc_belt","acc_neck","acc_nose","acc_ear",
      "acc_ring","acc_wrist","acc_belly","acc_cloth","acc_etc","acc_bag"
    ];
    ch.wear = {};
    for (const s of slots) ch.wear[s] = 0;
  }
};

/* ============================================================
 * 7) 성별 스펙 재질화(왕복 안전)
 *    - 최초: 성별 전용 필드 생성
 *    - 변경: switchGender로 파괴적 재구성
 *    - 누락: 보수 생성
 * ============================================================ */
setup.materializeGenderSpec = function (ch, targetGender) {
  if (!ch) return;
  const G = setup.ID.GENDER, S = setup.SCHEMA;
  if (targetGender !== G.MALE && targetGender !== G.FEMALE) {
    console.warn('materializeGenderSpec: 잘못된 성별');
    return;
  }

  // 최초 결정(=null → target)
  if (ch.gender == null) {
    ch.gender = targetGender;
    ch.chest    = setup._zeroArray(targetGender === G.FEMALE ? S.CHEST_F.COUNT : S.CHEST_M.COUNT);
    ch.genitals = setup._zeroArray(targetGender === G.FEMALE ? S.GEN_F.COUNT   : S.GEN_M.COUNT);
    const areas = (targetGender === G.FEMALE) ? S.BODYHAIR_AREAS_F : S.BODYHAIR_AREAS_M;
    ch.bodyhair = Object.fromEntries(areas.map(a => [a, setup._zeroArray(S.BODYHAIR.COUNT)]));
    const bodyPartsList = [...S.BODYPART_COMMON, ...(targetGender === G.FEMALE ? S.BODYPART_FEMALE : S.BODYPART_MALE)];
    ch.bodyparts = Object.fromEntries(bodyPartsList.map(p => [p, setup._zeroArray(S.PART.COUNT)]));
    if (targetGender === G.FEMALE && !ch.preg) ch.preg = setup._defaultPreg();
    if (targetGender === G.MALE && 'preg' in ch) delete ch.preg;
    return;
  }

  // 성별 변경 → 파괴적 재구성
  if (ch.gender !== targetGender) {
    setup.switchGender(ch, targetGender);
    return;
  }

  // 성별 동일 + 전용 필드 누락 보수
  if (!ch.chest || !ch.genitals || !ch.bodyhair || !ch.bodyparts) {
    ch.chest    = setup._zeroArray(targetGender === G.FEMALE ? S.CHEST_F.COUNT : S.CHEST_M.COUNT);
    ch.genitals = setup._zeroArray(targetGender === G.FEMALE ? S.GEN_F.COUNT   : S.GEN_M.COUNT);
    const areas = (targetGender === G.FEMALE) ? S.BODYHAIR_AREAS_F : S.BODYHAIR_AREAS_M;
    ch.bodyhair = Object.fromEntries(areas.map(a => [a, setup._zeroArray(S.BODYHAIR.COUNT)]));
    const bodyPartsList = [...S.BODYPART_COMMON, ...(targetGender === G.FEMALE ? S.BODYPART_FEMALE : S.BODYPART_MALE)];
    ch.bodyparts = Object.fromEntries(bodyPartsList.map(p => [p, setup._zeroArray(S.PART.COUNT)]));
    if (targetGender === G.FEMALE && !ch.preg) ch.preg = setup._defaultPreg();
    if (targetGender === G.MALE && 'preg' in ch) delete ch.preg;
  }
};

/* ============================================================
 * 8) 경험 초기화 (공통/성별/통합)
 * ============================================================ */
setup.resetExperienceCommon = function (ch) {
    const { MOUTH, BUTT } = setup.SCHEMA;
    if (ch?.mouth) { ch.mouth[MOUTH._INDEX.FIRST_EXP] = 0; ch.mouth[MOUTH._INDEX.EXP_COUNT] = 0; }
    if (ch?.butt)  { ch.butt[BUTT._INDEX.FIRST_EXP]   = 0; ch.butt[BUTT._INDEX.EXP_COUNT]   = 0; }
};
setup.resetExperienceByGender = function (ch) {
    const { GEN_F, GEN_M } = setup.SCHEMA, G = setup.ID.GENDER;
    if (!ch?.genitals || (ch.gender !== G.MALE && ch.gender !== G.FEMALE)) return;
    if (ch.gender === G.FEMALE) { ch.genitals[GEN_F._INDEX.FIRST_EXP] = 0; ch.genitals[GEN_F._INDEX.EXP_COUNT] = 0; }
    else                        { ch.genitals[GEN_M._INDEX.FIRST_EXP] = 0; ch.genitals[GEN_M._INDEX.EXP_COUNT] = 0; }
};
setup.resetAllExperience = function (ch) {
    setup.resetExperienceCommon(ch);
    setup.resetExperienceByGender(ch);
};

/* ============================================================
 * 9) 팩토리 (NPC → LI → PC) + makePlayer
 * ============================================================ */
setup.createNPC = function (firstName = "", lastName = "", gender = setup.ID.GENDER.MALE) {
    const char = {
        type: "NPC",
        name: { first: firstName, last: lastName },
        gender,
        birthday: { year: 1872, month: 1, day: 1, age: 18 },
        race: setup.ID.RACE.HUMAN,
        status: setup.ID.STATUS.PEASANT,
        title: setup.ID.TITLE.NONE,
        aff: [0, 0, 0, 0]
    };
    // 외형/신체 기본 배열
    char.hair  = setup._zeroArray(setup.SCHEMA.HAIR.COUNT);
    char.face  = setup._zeroArray(setup.SCHEMA.FACE.COUNT);
    char.eyes  = setup._zeroArray(setup.SCHEMA.EYES.COUNT);
    char.body  = setup._zeroArray(setup.SCHEMA.BODY.COUNT);
    char.butt  = setup._zeroArray(setup.SCHEMA.BUTT.COUNT);
    char.chest = setup._zeroArray(gender === setup.ID.GENDER.FEMALE ? setup.SCHEMA.CHEST_F.COUNT : setup.SCHEMA.CHEST_M.COUNT);
    char.genitals = setup._zeroArray(gender === setup.ID.GENDER.FEMALE ? setup.SCHEMA.GEN_F.COUNT : setup.SCHEMA.GEN_M.COUNT);
    // 착용 슬롯
    const slots = ["u_under","u_midunder","u_inner","u_top","u_coat","u_coat2","l_under","l_midunder","l_bottom","l_socks","l_shoes","acc_glasses","acc_headband","acc_hairpin","acc_mask","acc_hat","acc_scarf","acc_glove","acc_belt","acc_neck","acc_nose","acc_ear","acc_ring","acc_wrist","acc_belly","acc_cloth","acc_etc","acc_bag"];
    char.wear = {}; for (const s of slots) char.wear[s] = 0;
    return char;
};
setup.createLI = function (firstName, lastName, gender) {
    const char = setup.createNPC(firstName, lastName, gender);
    char.type = "LI";
    // LI 확장
    char.mouth = setup._zeroArray(setup.SCHEMA.MOUTH.COUNT);
    char.temp  = setup._zeroArray(setup.SCHEMA.TEMP.COUNT);
    char.abil  = {
        composite: setup._zeroArray(setup.SCHEMA.ABIL.COMP),
        mental:    setup._zeroArray(setup.SCHEMA.ABIL.MENTAL),
        physical:  setup._zeroArray(setup.SCHEMA.ABIL.PHYS),
        sexual:    setup._zeroArray(setup.SCHEMA.ABIL.SEX)
    };
    char.skill = {
        social:  setup._zeroArray(setup.SCHEMA.SKILL.SOCIAL),
        combat:  setup._zeroArray(setup.SCHEMA.SKILL.COMBAT),
        life:    setup._zeroArray(setup.SCHEMA.SKILL.LIFE),
        sexual:  setup._zeroArray(setup.SCHEMA.SKILL.SEX)
    };
    if (gender === setup.ID.GENDER.FEMALE) char.preg = setup._defaultPreg();
    return char;
};
setup.createPC = function (firstName = "", lastName = "", gender = setup.ID.GENDER.MALE) {
    const char = setup.createLI(firstName, lastName, gender);
    char.type = "PC";
    char.orient = setup.ID.ORIENT.STRAIGHT;
    char.base   = setup._zeroArray(setup.SCHEMA.BASE.COUNT);

    // 체모/바디파트
    const S = setup.SCHEMA;
    const areas = (gender === setup.ID.GENDER.FEMALE) ? S.BODYHAIR_AREAS_F : S.BODYHAIR_AREAS_M;
    char.bodyhair = Object.fromEntries(areas.map(a => [a, setup._zeroArray(S.BODYHAIR.COUNT)]));
    const bp = [...S.BODYPART_COMMON, ...(gender === setup.ID.GENDER.FEMALE ? S.BODYPART_FEMALE : S.BODYPART_MALE)];
    char.bodyparts = Object.fromEntries(bp.map(p => [p, setup._zeroArray(S.PART.COUNT)]));
    return char;
};
setup.makePlayer = function () {
    return {
        ver: 1,
        type: "PC",
        name: { first: "", last: "" },
        gender: null, // ★ 성별 미정
        birthday: { year: 1872, month: 1, day: 1, age: 18 },
        race: setup.ID.RACE.HUMAN,
        status: setup.ID.STATUS.PEASANT,
        title: setup.ID.TITLE.NONE,
        aff: [0, 0, 0, 0]
    };
};

/* ============================================================
 * 10) Start용: 새 게임 시드
 * ============================================================ */
setup.newGame = function () {
  State.variables.pc = setup.makePlayer(); // 성별 미정 PC
  State.variables.npcs = {};
};

setup.statMappings = {
    // 복합 능력치
    '사회 매력': { path: ['abil', 'composite'], idx: setup.IDX.ABIL.COMP.ATTR_SOCIAL },
    '성적 매력': { path: ['abil', 'composite'], idx: setup.IDX.ABIL.COMP.ATTR_SEXUAL },
    '외모 매력': { path: ['abil', 'composite'], idx: setup.IDX.ABIL.COMP.ATTR_LOOKS },
    '학습 능력': { path: ['abil', 'composite'], idx: setup.IDX.ABIL.COMP.LEARNING },

    // 정신적 능력치
    '집중력':    { path: ['abil', 'mental'], idx: setup.IDX.ABIL.MENTAL.FOCUS },
    '판단력':    { path: ['abil', 'mental'], idx: setup.IDX.ABIL.MENTAL.JUDGEMENT },
    '자제력':    { path: ['abil', 'mental'], idx: setup.IDX.ABIL.MENTAL.SELF_CONTROL },
    '감정 관리':    { path: ['abil', 'mental'], idx: setup.IDX.ABIL.MENTAL.EMOTION },
    '대인 관계력':    { path: ['abil', 'mental'], idx: setup.IDX.ABIL.MENTAL.SOCIAL },

    // 육체적 능력치
    '체력':    { path: ['abil', 'physical'], idx: setup.IDX.ABIL.PHYS.STAMINA },
    '근력':    { path: ['abil', 'physical'], idx: setup.IDX.ABIL.PHYS.STRENGTH },
    '유연성':    { path: ['abil', 'physical'], idx: setup.IDX.ABIL.PHYS.FLEXIBILITY },
    '민첩성':    { path: ['abil', 'physical'], idx: setup.IDX.ABIL.PHYS.AGILITY },
    
    // 성적 능력치
    '자제심':    { path: ['abil', 'sexual'], idx: setup.IDX.ABIL.SEX.SELF_CONTROL },
    '적극성':  { path: ['abil', 'sexual'], idx: setup.IDX.ABIL.SEX.PROACTIVE },
    '성욕':  { path: ['abil', 'sexual'], idx: setup.IDX.ABIL.SEX.LIBIDO },
    '정숙도':  { path: ['abil', 'sexual'], idx: setup.IDX.ABIL.SEX.CHASTITY },
    '관음성':  { path: ['abil', 'sexual'], idx: setup.IDX.ABIL.SEX.VOYEURISM },
    '노출성':  { path: ['abil', 'sexual'], idx: setup.IDX.ABIL.SEX.EXHIBITIONISM },
    '지배/복종':  { path: ['abil', 'sexual'], idx: setup.IDX.ABIL.SEX.DOM_SUB },
    '가학/피학':  { path: ['abil', 'sexual'], idx: setup.IDX.ABIL.SEX.SAD_MAS },
    '구속/규율':  { path: ['abil', 'sexual'], idx: setup.IDX.ABIL.SEX.BONDAGE },

    // 사회적 스킬
    '교양':    { path: ['skill', 'social'], idx: setup.IDX.SKILL.SOCIAL.CULTURE },
    '신실함':    { path: ['skill', 'social'], idx: setup.IDX.SKILL.SOCIAL.PIETY },

    // 전투 기술
    '체술':    { path: ['skill', 'combat'], idx: setup.IDX.SKILL.COMBAT.MARTIAL },
    '주문 시전':    { path: ['skill', 'combat'], idx: setup.IDX.SKILL.COMBAT.CASTING },
    '주문 숙련도':    { path: ['skill', 'combat'], idx: setup.IDX.SKILL.COMBAT.MASTERY },

    // 생활 기술
    '손재주':   { path: ['skill', 'life'], idx: setup.IDX.SKILL.LIFE.DEXTERITY },
    '재봉술':   { path: ['skill', 'life'], idx: setup.IDX.SKILL.LIFE.SEWING },
    '노래':   { path: ['skill', 'life'], idx: setup.IDX.SKILL.LIFE.SINGING },
    '악기 연주':   { path: ['skill', 'life'], idx: setup.IDX.SKILL.LIFE.INSTRUMENT },
    '춤':   { path: ['skill', 'life'], idx: setup.IDX.SKILL.LIFE.DANCING },
    '수영':    { path: ['skill', 'life'], idx: setup.IDX.SKILL.LIFE.SWIMMING },
    '미술':    { path: ['skill', 'life'], idx: setup.IDX.SKILL.LIFE.ART },
    '요리':    { path: ['skill', 'life'], idx: setup.IDX.SKILL.LIFE.COOKING },
    '가사노동':    { path: ['skill', 'life'], idx: setup.IDX.SKILL.LIFE.HOUSEWORK },
    
    // 성적 기술
    '성 지식': { path: ['skill', 'sexual'], idx: setup.IDX.SKILL.SEX.KNOWLEDGE },
    '유혹':    { path: ['skill', 'sexual'], idx: setup.IDX.SKILL.SEX.SEDUCTION },
    '허리놀림':      { path: ['skill', 'sexual'], idx: setup.IDX.SKILL.SEX.WAIST },
    '손 기술': { path: ['skill', 'sexual'], idx: setup.IDX.SKILL.SEX.HAND },
    '가슴 활용':    { path: ['skill', 'sexual'], idx: setup.IDX.SKILL.SEX.BREAST },
    '성기 활용':      { path: ['skill', 'sexual'], idx: setup.IDX.SKILL.SEX.GENITAL },
    '항문 활용': { path: ['skill', 'sexual'], idx: setup.IDX.SKILL.SEX.ANAL },
    '발 놀림':    { path: ['skill', 'sexual'], idx: setup.IDX.SKILL.SEX.FOOT }
};

setup.modifyStat = function (character, statLabel, amount) {
  if (!character || !statLabel || typeof amount !== 'number') {
    console.warn("modifyStat: 잘못된 인수");
    return;
  }
  const m = setup.statMappings[statLabel];
  if (!m) { console.warn(`[modifyStat] 매핑 없음: ${statLabel}`); return; }
  let obj = character;
  for (const k of m.path) {
    obj = obj?.[k];
    if (!obj) { console.warn("modifyStat: 경로 누락", m.path); return; }
  }
  obj[m.idx] = (obj[m.idx] ?? 0) + amount;
};

/* ============================================================
 * 12) 슬라이더 라벨
 * ============================================================ */
setup.SLIDER_LABELS = {
  genitalsize: [
    { max: 10, text: '왜소함' },
    { max: 20, text: '작음' },
    { max: 40, text: '보통' },
    { max: 50, text: '큼' },
    { max: 60, text: '상당히 큼' },
    { max: 70, text: '두툼함' },
    { max: 80, text: '대물' },
    { max: 90, text: '거근' },
    { max: 100, text: '거대함' }
  ],
  buttshape_m: [
    { max: 10, text: '납작함' },
    { max: 20, text: '슬림함' },
    { max: 40, text: '평범함' },
    { max: 50, text: '탄탄함' },
    { max: 70, text: '다부짐' },
    { max: 80, text: '근육질' },
    { max: 100, text: '우락부락함' }
  ],
  buttshape_f: [
    { max: 10, text: '납작함' },
    { max: 20, text: '슬림함' },
    { max: 40, text: '평범함' },
    { max: 50, text: '큼' },
    { max: 70, text: '커다람' },
    { max: 80, text: '육감적임' },
    { max: 100, text: '풍만함' }
  ],
  breastsize: [
    { max: 10, text: '왜소함' },
    { max: 20, text: '아담함' },
    { max: 30, text: '작음' },
    { max: 40, text: '보통' },
    { max: 50, text: '봉긋함' },
    { max: 60, text: '큼' },
    { max: 70, text: '커다람' },
    { max: 80, text: '풍만함' },
    { max: 90, text: '엄청남' },
    { max: 100, text: '거대함' }
  ]
};