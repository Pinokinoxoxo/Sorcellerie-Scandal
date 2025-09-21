/* ============================================================================
 * 4_school.js
 *  - 아카데미 교과/커리큘럼/시간표 + 과목 토글
 *  - Start8 탭 핸들러는 제거(공통 탭 바인딩 사용)
 * ========================================================================== */

setup.ACADEMY = {
    ID: {
        CATEGORY: { ARTS: 0, LIFE: 1, SOCIAL: 2, MAJOR_ELECTIVE: 3, MAJOR_CORE: 4 },
        TYPE: { TYPE_1: 0, TYPE_2: 1 }
    },
    LABEL: {
        CATEGORY: ['예술 교양', '생활 교양', '사회문화 교양', '전공 교양', '전공 필수'],
        TYPE: ['전공1', '전공2'],
        NAMES: {
            'AC1':'기초 마법 이해', 'AC2':'일반 마법', 'TB1':'마법 전술의 이해', 'TB2':'전투 마법', 'TA3':'근접 마도학 이론 및 응용', 'TB3':'마법 방어학', 'TA4':'마법 무기 운용법 1', 'TB4':'전략과 전술', 'TA5':'마법 무기 운용법 2', 'TB5':'고급 전술학', 'TA6':'마도 전술 응용', 'TB6':'지휘 및 리더십', 'TA7':'고급 전술 마법 1', 'TB7':'전장 마법과 작전 기획', 'TA8':'고급 전술 마법 2', 'TB8':'통합 전술 훈련', 'AB1':'현대 과학의 이해', 'AB2':'마법 실험 개론', 'AA3':'마법장론', 'AB3':'마법 회로 이론', 'AA4':'마법 장치 운용', 'AB4':'마법 신호 및 시스템', 'AA5':'마법 시스템 제어 및 응용', 'AB5':'마법 신호 해석', 'AA6':'고급 마법 1', 'AB6':'마법 공학 세미나', 'AA7':'고급 마법 2', 'AB7':'고급 마법 회로 설계', 'AA8':'고급 마법 공학 응용', 'AB8':'마법공학 종합 설계', 'AR1':'화성학과 음악형식', 'AR2':'사교 무용과 예법', 'AR3':'회화와 조형예술', 'AR4':'고전문학사', 'LI1':'수영', 'LI2':'요가와 필라테스', 'LI3':'기초 수공예와 재봉술', 'LI4':'기초 조리 실습', 'SO1':'사랑과 섹슈얼리티', 'SO2':'문화와 예술사', 'SO3':'사회적 의사소통', 'SO4':'사회 윤리와 신학', 'MA1':'기초 전투 마법', 'MA2':'기초 호신술', 'MA3':'융합 마법 세미나', 'MA4':'체력 단련과 체술'
        },
        DESCS: {
            'AR1': '음악의 기본 원리와 구조를 배웁니다. 작곡의 기초가 됩니다.', 'AR2': '다양한 사교춤과 그에 맞는 에티켓을 익혀 품위를 더합니다.', 'AR3': '그림과 조각을 통해 미적 감각과 표현력을 기릅니다.', 'AR4': '대륙의 고전 문학 작품들을 통해 시대상과 인간상을 탐구합니다.', 'LI1': '기초 영법을 배우고 심폐지구력을 향상시킵니다.', 'LI2': '심신을 단련하고 유연성을 길러 신체의 균형을 바로잡습니다.', 'LI3': '바늘과 실을 다루는 기초 기술을 익혀 간단한 소품을 만듭니다.', 'LI4': '기초적인 조리법과 식재료 다루는 법을 배웁니다.', 'SO1': '인간 관계의 핵심인 사랑과 성에 대해 인문학적으로 고찰합니다.', 'SO2': '대륙의 문화와 예술이 어떻게 발전해왔는지 그 역사를 배웁니다.', 'SO3': '효과적인 의사소통 기술을 배워 원만한 대인 관계를 형성합니다.', 'SO4': '복잡한 현대 사회의 윤리적 문제들을 신학적 관점에서 탐구합니다.', 'MA1': '가장 기초적인 공격 및 방어 마법 주문을 배웁니다.', 'MA2': '마법 없이 자신을 지킬 수 있는 기본적인 호신 기술을 익힙니다.', 'MA3': '다양한 속성의 마법을 융합하는 이론과 가능성을 연구합니다.', 'MA4': '기초 체력을 증진시키고, 맨몸으로 싸우는 기술을 단련합니다.'
        }
    },
    GRADES: {
        'A+': 4.5, 'A': 4.0, 'B+': 3.5, 'B': 3.0,
        'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0
    },
    RETAKE_GRADE_THRESHOLD: 2.5,
    courses: {},
    curriculum: {},
    timeSlots: {}
};


(function (ACADEMY, G_ID, Time_ID) {
  const CAT   = ACADEMY.ID.CATEGORY;
  const MTYPE = ACADEMY.ID.TYPE;
  const MAJOR = G_ID.AFF.ACADEMY.DETAIL;
  const DAY   = Time_ID.DAYS;

  // 과목 DB
  ACADEMY.courses = {
    // --- 전공: 공통 ---
    'AC1': { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_1, major: MAJOR.TACTICAL_MAGIC, semester: '1-1', time: 'A1', fx:[{t:'abil', l:'학습 능력', n:1}, {t:'skill', l:'주문 시전', n:1}] },
    'AC2': { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_1, major: MAJOR.TACTICAL_MAGIC, semester: '1-2', time: 'B1', fx:[{t:'skill', l:'주문 시전', n:2}] },
    // --- 전공: 전술마법학 ---
    'TB1':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.TACTICAL_MAGIC, semester: '1-1', time: 'C1', fx:[{t:'abil', l:'판단력', n:1}, {t:'skill', l:'주문 숙련도', n:1}] },
    'TB2':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.TACTICAL_MAGIC, semester: '1-2', time: 'B2', fx:[{t:'skill', l:'주문 시전', n:3}] },
    'TA3':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_1, major: MAJOR.TACTICAL_MAGIC, semester: '2-1', time: 'B1', fx:[{t:'skill', l:'체술', n:2}, {t:'skill', l:'주문 시전', n:1}] },
    'TB3':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.TACTICAL_MAGIC, semester: '2-1', time: 'D1', fx:[{t:'abil', l:'자제력', n:2}] },
    'TA4':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_1, major: MAJOR.TACTICAL_MAGIC, semester: '2-2', time: 'C1', fx:[{t:'skill', l:'주문 숙련도', n:3}] },
    'TB4':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.TACTICAL_MAGIC, semester: '2-2', time: 'C2', fx:[{t:'abil', l:'판단력', n:2}] },
    'TA5':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_1, major: MAJOR.TACTICAL_MAGIC, semester: '3-1', time: 'C1', fx:[{t:'skill', l:'주문 숙련도', n:4}] },
    'TB5':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.TACTICAL_MAGIC, semester: '3-1', time: 'E1', fx:[{t:'abil', l:'판단력', n:3}, {t:'abil', l:'대인 관계력', n:1}] },
    'TA6':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_1, major: MAJOR.TACTICAL_MAGIC, semester: '3-2', time: 'D1', fx:[{t:'skill', l:'주문 시전', n:3}, {t:'skill', l:'주문 숙련도', n:2}] },
    'TB6':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.TACTICAL_MAGIC, semester: '3-2', time: 'B1', fx:[{t:'abil', l:'대인 관계력', n:3}] },
    'TA7':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_1, major: MAJOR.TACTICAL_MAGIC, semester: '4-1', time: 'D1', fx:[{t:'skill', l:'주문 시전', n:5}] },
    'TB7':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.TACTICAL_MAGIC, semester: '4-1', time: 'A1', fx:[{t:'abil', l:'판단력', n:4}] },
    'TA8':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_1, major: MAJOR.TACTICAL_MAGIC, semester: '4-2', time: 'E1', fx:[{t:'skill', l:'주문 시전', n:4}, {t:'skill', l:'주문 숙련도', n:3}] },
    'TB8':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.TACTICAL_MAGIC, semester: '4-2', time: 'A1', fx:[{t:'abil', l:'대인 관계력', n:2}, {t:'skill', l:'체술', n:3}] },
    // --- 전공: 응용마법과학 ---
    'AB1':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.APPLIED_MAGIC, semester: '1-1', time: 'C1', fx:[{t:'abil', l:'학습 능력', n:2}] },
    'AB2':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.APPLIED_MAGIC, semester: '1-2', time: 'B2', fx:[{t:'skill', l:'손재주', n:2}] },
    'AA3':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_1, major: MAJOR.APPLIED_MAGIC, semester: '2-1', time: 'B1', fx:[{t:'skill', l:'주문 숙련도', n:2}] },
    'AB3':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.APPLIED_MAGIC, semester: '2-1', time: 'D1', fx:[{t:'abil', l:'집중력', n:2}] },
    'AA4':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_1, major: MAJOR.APPLIED_MAGIC, semester: '2-2', time: 'C1', fx:[{t:'skill', l:'손재주', n:3}] },
    'AB4':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.APPLIED_MAGIC, semester: '2-2', time: 'C2', fx:[{t:'abil', l:'집중력', n:2}, {t:'abil', l:'학습 능력', n:1}] },
    'AA5':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_1, major: MAJOR.APPLIED_MAGIC, semester: '3-1', time: 'C1', fx:[{t:'skill', l:'손재주', n:4}] },
    'AB5':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.APPLIED_MAGIC, semester: '3-1', time: 'E1', fx:[{t:'abil', l:'판단력', n:3}] },
    'AA6':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_1, major: MAJOR.APPLIED_MAGIC, semester: '3-2', time: 'D1', fx:[{t:'skill', l:'주문 시전', n:2}, {t:'skill', l:'주문 숙련도', n:3}] },
    'AB6':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.APPLIED_MAGIC, semester: '3-2', time: 'B1', fx:[{t:'abil', l:'학습 능력', n:3}] },
    'AA7':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_1, major: MAJOR.APPLIED_MAGIC, semester: '4-1', time: 'D1', fx:[{t:'skill', l:'주문 시전', n:5}] },
    'AB7':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.APPLIED_MAGIC, semester: '4-1', time: 'A1', fx:[{t:'abil', l:'집중력', n:4}] },
    'AA8':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_1, major: MAJOR.APPLIED_MAGIC, semester: '4-2', time: 'E1', fx:[{t:'skill', l:'손재주', n:3}, {t:'skill', l:'주문 숙련도', n:4}] },
    'AB8':  { category: CAT.MAJOR_CORE, majorType: MTYPE.TYPE_2, major: MAJOR.APPLIED_MAGIC, semester: '4-2', time: 'A1', fx:[{t:'abil', l:'학습 능력', n:2}, {t:'abil', l:'판단력', n:3}] },
    // --- 교양 과목 ---
    'AR1': { category: CAT.ARTS,  time: 'A2', fx:[{t:'skill', l:'악기 연주', n:2}] },
    'AR2': { category: CAT.ARTS,  time: 'D2', fx:[{t:'abil', l:'사회 매력', n:1}, {t:'skill', l:'춤', n:2}] },
    'AR3': { category: CAT.ARTS,  time: 'D1', fx:[{t:'skill', l:'미술', n:3}] },
    'AR4': { category: CAT.ARTS,  time: 'E1', fx:[{t:'skill', l:'교양', n:2}] },
    'LI1': { category: CAT.LIFE,  time: 'E2', fx:[{t:'abil', l:'체력', n:1}, {t:'skill', l:'수영', n:3}] },
    'LI2': { category: CAT.LIFE,  time: 'B2', fx:[{t:'abil', l:'유연성', n:2}] },
    'LI3': { category: CAT.LIFE,  time: 'C2', fx:[{t:'skill', l:'손재주', n:1}, {t:'skill', l:'재봉술', n:2}] },
    'LI4': { category: CAT.LIFE,  time: 'B3', fx:[{t:'skill', l:'요리', n:3}] },
    'SO1': { category: CAT.SOCIAL,time: 'A2', fx:[{t:'skill', l:'성 지식', n:2}, {t:'abil', l:'성적 매력', n:1}] },
    'SO2': { category: CAT.SOCIAL,time: 'D2', fx:[{t:'skill', l:'교양', n:2}] },
    'SO3': { category: CAT.SOCIAL,time: 'D1', fx:[{t:'abil', l:'대인 관계력', n:2}] },
    'SO4': { category: CAT.SOCIAL,time: 'E1', fx:[{t:'skill', l:'신실함', n:3}] },
    'MA1': { category: CAT.MAJOR_ELECTIVE, time: 'E2', fx:[{t:'skill', l:'주문 시전', n:2}] },
    'MA2': { category: CAT.MAJOR_ELECTIVE, time: 'B2', fx:[{t:'skill', l:'체술', n:2}] },
    'MA3': { category: CAT.MAJOR_ELECTIVE, time: 'C2', fx:[{t:'abil', l:'학습 능력', n:1}] },
    'MA4': { category: CAT.MAJOR_ELECTIVE, time: 'B3', fx:[{t:'abil', l:'근력', n:1}, {t:'abil', l:'체력', n:1}] }
  };

  // 커리큘럼
  ACADEMY.curriculum = {
    [MAJOR.TACTICAL_MAGIC]: { '1-1':['AC1','TB1'], '1-2':['AC2','TB2'], '2-1':['TA3','TB3'], '2-2':['TA4','TB4'], '3-1':['TA5','TB5'], '3-2':['TA6','TB6'], '4-1':['TA7','TB7'], '4-2':['TA8','TB8'] },
    [MAJOR.APPLIED_MAGIC] : { '1-1':['AC1','AB1'], '1-2':['AC2','AB2'], '2-1':['AA3','AB3'], '2-2':['AA4','AB4'], '3-1':['AA5','AB5'], '3-2':['AA6','AB6'], '4-1':['AA7','AB7'], '4-2':['AA8','AB8'] }
  };

  // 시간 슬롯
  ACADEMY.timeSlots = {
    'A1': [[DAY.MON, 'B'], [DAY.THU, 'B']], 'A2': [[DAY.MON, 'D'], [DAY.THU, 'D']],
    'B1': [[DAY.MON, 'A'], [DAY.WED, 'A']], 'B2': [[DAY.MON, 'C'], [DAY.WED, 'C']], 'B3': [[DAY.MON, 'E'], [DAY.WED, 'E']],
    'C1': [[DAY.TUE, 'A'], [DAY.THU, 'A']], 'C2': [[DAY.TUE, 'C'], [DAY.THU, 'C']],
    'D1': [[DAY.TUE, 'B'], [DAY.FRI, 'A']], 'D2': [[DAY.TUE, 'D'], [DAY.FRI, 'C']],
    'E1': [[DAY.WED, 'B'], [DAY.FRI, 'B']], 'E2': [[DAY.WED, 'D'], [DAY.FRI, 'D']]
  };
})(setup.ACADEMY, setup.ID, setup.Time.ID);

window.renderTimetable = function (containerSelector) {
    const $target = $(containerSelector);
    if ($target.length === 0) return;

    if (!$target.hasClass("timetable")) $target.addClass("timetable");

    const periods = [
        { key: 'A', title: 'A교시', time: '09:00 - 10:15' },
        { key: 'B', title: 'B교시', time: '10:30 - 11:45' },
        { key: 'C', title: 'C교시', time: '12:00 - 13:15' },
        { key: 'D', title: 'D교시', time: '13:30 - 14:45' },
        { key: 'E', title: 'E교시', time: '15:00 - 16:15' },
        { key: 'F', title: 'F교시', time: '16:30 - 17:45' }
    ];

    const containerId = containerSelector.replace('#', '');

    // --- 수정된 부분 시작 ---
    // .slice() 부분을 제거하여 '일' ~ '토' 전체 요일을 사용합니다.
    const timetableDayLabels = setup.Time.LABEL.DAYS;
    const timetableDayKeys = Object.keys(setup.Time.ID.DAYS).map(k => k.toLowerCase());
    // --- 수정된 부분 끝 ---

    // 헤더: [빈칸] + [요일들]
    let html = '<table><thead><tr>';
    html += '<th class="corner"></th>';
    
    // 전체 요일 레이블 배열을 사용합니다.
    timetableDayLabels.forEach(dayLabel => {
        html += `<th class="day-col">${dayLabel}</th>`;
    });
    html += '</tr></thead><tbody>';

    // 바디: 각 교시 행 + 각 요일 셀
    periods.forEach(p => {
        html += `<tr><th class="period-row"><div class="period-title">${p.title}</div><div class="period-time">${p.time}</div></th>`;
        
        // 전체 요일 키 배열을 사용합니다.
        timetableDayKeys.forEach(dayKey => {
            const cellId = `cell-${containerId}-${p.key}-${dayKey}`;
            html += `<td id="${cellId}"></td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    $target.html(html);
};

window.updateTimetable = function (containerSelector) {
  const $target = $(containerSelector);
  if ($target.length === 0) return;

  $target.find('td').removeClass('conflict').empty().css('background-color', '');

  const playerMajorId  = State.variables.pc?.aff?.[2];
  const playerSemester = State.variables.pc?.semester;
  const majorCourses   = setup.ACADEMY.getMajorCoursesFor(playerMajorId, playerSemester) || [];
  const selectedElects = State.variables.selectedCourses || [];
  const allCourses     = [...new Set([...selectedElects, ...majorCourses])];

  const containerId = containerSelector.replace('#', '');

  // --- 수정된 부분 시작 ---
  // setup.Time.ID.DAYS 객체의 키('SUN', 'MON'...)를 소문자 배열로 만듭니다.
  // dayId(숫자)를 인덱스로 사용하여 요일 키('mon', 'tue'...)를 찾을 수 있습니다.
  const dayKeyMap = Object.keys(setup.Time.ID.DAYS).map(k => k.toLowerCase());
  // --- 수정된 부분 끝 ---

  allCourses.forEach(code => {
    const course     = setup.ACADEMY.courses[code];
    const courseName = setup.ACADEMY.LABEL.NAMES[code] || code;
    if (!course) return;

    const slots = setup.ACADEMY.timeSlots[course.time];
    if (!slots) return;

    slots.forEach(([dayId, period]) => {
      const pKey   = String(period).toUpperCase();

      // --- 수정된 부분 ---
      // 기존: const dayKey = setup.Time.dayKeys[dayId];
      // 변경: 위에서 만든 dayKeyMap을 사용하여 숫자인 dayId를 문자열 키로 변환합니다.
      const dayKey = dayKeyMap[dayId];
      if (!dayKey) return; // 혹시 모를 오류 방지
      // --- 수정된 부분 ---

      const cellId = `#cell-${containerId}-${pKey}-${dayKey}`;
      const $cell  = $(cellId);

      const blockHtml =
        `<div class="course-block course-${code}" data-course="${code}">
           <div class="course-name">${courseName}</div>
         </div>`;

      if ($cell.html()) {
        $cell.addClass('conflict').append(blockHtml);
      } else {
        $cell.html(blockHtml);
      }
    });
  });
};

setup.ACADEMY.getMajorCoursesFor = function (majorId, semester) {
  const curriculum = setup.ACADEMY.curriculum;
  if (majorId === undefined || !semester || !curriculum[majorId] || !curriculum[majorId][semester]) {
    return [];
  }
  return curriculum[majorId][semester];
};

window.toggleCourse = function (courseCode) {
    // 0) 코드 정규화
    const norm = v => String(v == null ? '' : v).trim().toUpperCase();
    const code = norm(courseCode);

    if (!/^[A-Z]{2}\d$/.test(code) && !setup.ACADEMY.courses[code]) {
        console.warn('[toggleCourse] Unknown course code (raw):', courseCode);
        alert('알 수 없는 과목 코드입니다.');
        return;
    }

    const selected = (State.variables.selectedCourses || []).map(norm);
    const isSelected = selected.includes(code);

    // 2) 선택/취소 로직
    if (isSelected) {
        State.variables.selectedCourses = selected.filter(c => c !== code);
    } else {
        const newCourse = setup.ACADEMY.courses[code];
        if (!newCourse) {
            console.warn('[toggleCourse] Unknown course code:', code);
            alert('알 수 없는 과목 코드입니다.');
            return;
        }
        if (selected.length >= 2) {
            alert('최대 2개의 교양 과목만 선택할 수 있습니다.');
            return;
        }

        const majorId = State.variables.pc?.aff?.[2];
        const semester = State.variables.pc?.semester;
        const majorReq = setup.ACADEMY.getMajorCoursesFor(majorId, semester) || [];

        const reservedTimes = [...selected, ...majorReq]
            .map(c => setup.ACADEMY.courses[norm(c)])
            .filter(Boolean)
            .map(c => c.time);

        if (reservedTimes.includes(newCourse.time)) {
            alert('이미 다른 과목과 시간이 겹칩니다!');
            return;
        }
        State.variables.selectedCourses = [...selected, code];
    }

    // 3) UI 갱신 (개선된 방식)
    updateTimetable('#timetable-container');
    $.wiki('<<replace "#selected-courses-display">><</replace>>');

    // [개선] 전체를 리로드하는 대신 클릭된 버튼의 상태만 직접 변경합니다.
    const $clickedChoice = $(`.choice-section:has(.js-toggle-course[data-code="${code}"])`);
    if ($clickedChoice.length > 0) {
        $clickedChoice.toggleClass('selected', !isSelected);
        const $actionSpan = $clickedChoice.find('.choice-action');
        if (!isSelected) {
            // 새로 선택된 경우
            $actionSpan.html(
                '<a href="javascript:void(0)" class="btn btn--accent js-toggle-course" data-code="' + code + '">선택 취소</a>' +
                '<span class="btn is-disabled" aria-disabled="true" style="margin-left:8px;">✓ 선택됨</span>'
            );
        } else {
            // 선택 취소된 경우
            $actionSpan.html(
                '<a href="javascript:void(0)" class="btn js-toggle-course" data-code="' + code + '">선택</a>'
            );
        }
    }
};


$(document).on('click', '.js-toggle-course', function (ev) {
  ev.preventDefault();
  const code = String($(this).data('code') ?? '').trim().toUpperCase();
  if (!code) return;
  window.toggleCourse(code);
});