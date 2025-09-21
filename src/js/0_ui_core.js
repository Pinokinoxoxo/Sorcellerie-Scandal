/* ============================================================================
 * 0_ui_core.js
 * - [수정] UI 레이아웃 업데이트 최적화 (debounce 적용)
 * - 공통 탭/상태 핸들러, 시간표 컨테이너 보정
 * - 가장 먼저 로드
 * ========================================================================== */
window.setup = window.setup || {};

(function () {
  "use strict";
  window.setup = window.setup || {};
  const $doc = $(document);

  /* 상태 변수 이름으로 값 대입 */
  function assignStateVarByName(varName, value) {
    if (typeof varName !== "string" || !varName.length) return;
    const sigil = varName.charAt(0);
    const key = varName.slice(1);
    if (!key) return;
    if (sigil === "$") State.variables[key] = value;
    else if (sigil === "_") State.temporary[key] = value;
  }

  /* 시간표 컨테이너에 .timetable 클래스 보정 (누락 대비) */
  function ensureTimetableClass() {
    const ids = ["#timetable-container", "#timetable-container-dialog"];
    ids.forEach((sel) => {
      const $el = $(sel);
      if ($el.length && !$el.hasClass("timetable")) $el.addClass("timetable");
    });
  }

  // SugarCube 패시지 렌더 타이밍에서 보정
  $doc.on(":passagedisplay", function (ev) {
    ensureTimetableClass();
    if (typeof setup.initSliders === "function") {
      setup.initSliders(ev.content);
    }
  });

  // 외부에서도 재호출 가능하게 노출
  setup.ui = setup.ui || {};
  setup.ui.assignStateVarByName = assignStateVarByName;
  setup.ui.ensureTimetableClass = ensureTimetableClass;
})();

/* ================================================================
   UI바 상태 감지 및 레이아웃 조정 (최적화 버전)
   ================================================================ */

// [추가] Debounce 유틸리티 함수: 연속적인 호출을 마지막 한 번만 실행
function debounce(func, delay) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => func.apply(this, args), delay);
  };
}

// UI바 레이아웃 업데이트 함수
function updateLayoutForUIBar() {
  const uiBar = document.getElementById('ui-bar');
  const body  = document.body;
  if (!uiBar) return;

  const isOpen = !uiBar.classList.contains('stowed') &&
                   getComputedStyle(uiBar).display !== 'none';

  body.classList.toggle('ui-bar-open',  isOpen);
  body.classList.toggle('ui-bar-closed', !isOpen);

  if (body.getAttribute('data-tags')?.includes('game-title')) {
    body.classList.remove('ui-bar-open');
    body.classList.add('ui-bar-closed');
  }
}

// [정리] UI Bar 상태 감지를 위한 이벤트 핸들러 통합 바인딩
(function bindUIBarHandlersOnce() {
    if (setup.uiBarHandlersBound) return; // 중복 실행 방지

    const debouncedUpdate = debounce(updateLayoutForUIBar, 50);
    const scheduleUpdate = () => requestAnimationFrame(updateLayoutForUIBar);

    // DOM 로드 완료 시
    $(document).ready(function() {
        // MutationObserver로 UI Bar의 class/style 변경 감지
        const uiBar = document.getElementById('ui-bar');
        if (uiBar) {
            const observer = new MutationObserver(debouncedUpdate);
            observer.observe(uiBar, {
                attributes: true,
                attributeFilter: ['class', 'style']
            });
        }
        // 초기 레이아웃 설정
        scheduleUpdate();
    });

    // 패시지 변경 시
    $(document).on(':passagedisplay', scheduleUpdate);

    // 창 크기 변경 시 (Debounce 적용으로 성능 최적화)
    $(window).on('resize', debounce(updateLayoutForUIBar, 150));

    setup.uiBarHandlersBound = true;
})();

// 초기/변경 타이밍에 확실히 적용
const schedule = () => requestAnimationFrame(() => requestAnimationFrame(updateLayoutForUIBar));
$(document).ready(schedule);
window.addEventListener('load', schedule);
$(document).on(':passageready :passagedisplay', schedule);
$(window).on('resize', schedule);

const uiBar = document.getElementById('ui-bar');
if (uiBar) new MutationObserver(schedule).observe(uiBar, { attributes: true, attributeFilter: ['class','style'] });

// [추가] 패시지가 표시될 때마다 UI Bar 상태를 확인하여 첫 로드 문제를 해결
$(document).on(':passageready', function () {
    // setTimeout으로 감싸서 렌더링이 완전히 끝난 후 실행되도록 보장
    setTimeout(updateLayoutForUIBar, 0);
});

// MutationObserver를 사용하여 UI바의 클래스/스타일 변경을 감지 (핵심 감지 로직)
const uiBarObserver = new MutationObserver(debounce(updateLayoutForUIBar, 50));

// 페이지 로드 시 Observer 시작 및 초기 레이아웃 설정
$(document).ready(function() {
    const uiBar = document.getElementById('ui-bar');
    if (uiBar) {
        uiBarObserver.observe(uiBar, {
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }
    updateLayoutForUIBar(); // 초기 실행
});

// [수정] 윈도우 리사이즈 시에는 debounce된 함수를 호출하여 성능 저하 방지
$(window).on('resize', debounce(updateLayoutForUIBar, 150));


/* ================================================================
   범용 탭 핸들러 (상태 기억 기능 포함)
   ================================================================ */
(function () {
    // 이 코드가 두 번 이상 실행되는 것을 방지합니다.
    if (setup.universalTabsBound) return;

    // --- 기능 1: 탭 버튼 클릭 시 작동 ---
    $(document).on('click', '.tab-container .tab-btn', function () {
        const $btn = $(this);
        const $root = $btn.closest('.tab-container');
        const target = $btn.data('target');
        const stateVar = $root.data('state-var');

        // 버튼과 패널의 active 상태를 업데이트합니다.
        $root.find('.tab-btn').removeClass('active').attr('aria-selected', 'false');
        $btn.addClass('active').attr('aria-selected', 'true');
        $root.find('.tab-panel').removeClass('active').attr('hidden', true);
        $root.find(`.tab-panel[data-tab="${target}"]`).addClass('active').removeAttr('hidden');

        // data-state-var에 지정된 변수에 현재 탭 상태를 저장합니다.
        if (stateVar) {
            if (stateVar.startsWith('$')) {
                State.variables[stateVar.substring(1)] = target;
            } else {
                State.temporary[stateVar] = target;
            }
        }
    });

    // --- 기능 2: 패시지 진입 시 마지막 탭 상태 복원 ---
    $(document).on(':passagedisplay', function (ev) {
        // 새로 표시된 내용 안에서 .tab-container를 모두 찾습니다.
        $(ev.content).find('.tab-container').each(function () {
            const $root = $(this);
            const stateVar = $root.data('state-var');
            let activeTab;

            // 1. 복원할 탭 상태를 가져옵니다.
            if (stateVar) {
                if (stateVar.startsWith('$')) {
                    activeTab = State.variables[stateVar.substring(1)];
                } else {
                    activeTab = State.temporary[stateVar];
                }
            }

            // 2. 저장된 상태가 없다면, 첫 번째 탭을 기본값으로 사용합니다.
            if (!activeTab) {
                activeTab = $root.find('.tab-btn').first().data('target');
            }
            
            // 3. 해당 탭을 활성화합니다.
            if (activeTab) {
                $root.find('.tab-btn').removeClass('active').attr('aria-selected', 'false');
                $root.find('.tab-btn[data-target="' + activeTab + '"]').addClass('active').attr('aria-selected', 'true');
                $root.find('.tab-panel').removeClass('active').attr('hidden', true);
                $root.find(`.tab-panel[data-tab="${activeTab}"]`).addClass('active').removeAttr('hidden');
            }
        });
    });

    setup.universalTabsBound = true;
})();

setup.renderCourseEffects = function(fxArr) {
    if (!fxArr || !fxArr.length) return "";
    const effects = fxArr.map(fx => `${fx.l} +${fx.n}`).join(', ');
    return `효과: ${effects}`;
};

/* 2) 라벨 계산 */
setup.sliderLabelFor = function (key, value) {
  const table = setup.SLIDER_LABELS[key];
  if (!table) return String(value);
  const v = Number(value);
  for (const row of table) if (v <= row.max) return row.text;
  return table[table.length - 1].text;
};

/* 3) 슬라이더 초기화/바인딩 */
setup.initSliders = function (root) {
  // $(document).on(":passagerender",  ev => setup.initSliders(ev.content));
  // $(document).on(":passagedisplay", ev => setup.initSliders(ev.content));
  const $root = root ? $(root) : $(document);

  $root.find("input.tw-slider").each(function () {
    const input = this;
    const $input = $(input);
    if ($input.data("bound")) return;

    const varName = $input.data("var");       // "_genitalsize" or "$pcSomething"
    const labelKey = $input.data("label-key");
    const min  = Number(input.getAttribute("min")  || 0);
    const max  = Number(input.getAttribute("max")  || 100);
    const step = Number(input.getAttribute("step") || 1);

    if (!varName) return;

    // 시길 제거한 키
    const sigil = varName.charAt(0);
    const key   = (sigil === "$" || sigil === "_") ? varName.slice(1) : varName;

    // 저장소 결정
    const store = (sigil === "_") ? State.temporary : State.variables;

    // 초기값
    if (store[key] == null) store[key] = min;

    input.value = Number(store[key]);

    // 라벨/값 엘리먼트
    const $right   = $input.closest(".container-doubleright, .container-right");
    const $labelEl = $right.find(`.slider-label[data-for="${varName}"]`);
    const $valueEl = $right.find(`.slider-value[data-for-val="${varName}"]`);

    // UI 갱신
    const updateUI = () => {
      let val = Number(input.value);
      if (val < min) val = min;
      else if (val > max) val = max;
      store[key] = val;
      if ($labelEl.length) $labelEl.text(setup.sliderLabelFor(labelKey || key, val));
      if ($valueEl.length) $valueEl.text(val);
    };

    input.addEventListener("input",  updateUI);
    input.addEventListener("change", updateUI);
    updateUI();
    $input.data("bound", true);
  });
};