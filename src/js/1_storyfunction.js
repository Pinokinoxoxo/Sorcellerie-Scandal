/* ============================================================================
 * 1_storyfunction.js
 *  - RNG, 복사 헬퍼, 선택(배경/연애) 적용, 슬라이더 유틸
 * ========================================================================== */

// 랜덤 함수
class RNG {
  constructor(seed) {
    // LCG using GCC's constants
    this.m = 0x80000000; // 2**31
    this.a = 1103515245;
    this.c = 12345;
    this.state = seed || Date.now();
    this.seed = this.state;
  }
  randomint() {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
  }
  random() { return this.randomint() / (this.m - 1); } // [0,1]
  lastrandom() { return this.state / (this.m - 1); }   // [0,1]
  rir(start, end) { // [start, end)
    const rangeSize = end - start;
    return start + Math.floor(this.random() * rangeSize);
  }
  randomchoice(array) { return array[this.rir(0, array.length)]; }
  randomrelfreq(array) {
    // [item, weight, item, weight, ...]
    let sum = 0;
    const cum = array.reduce((acc, v, i) => {
      if (i % 2 === 1) { sum += v; acc.push(sum); } else { acc.push(v); }
      return acc;
    }, []);
    const roll = this.rir(0, sum);
    for (let i = 1; i < cum.length; i += 2) {
      if (roll < cum[i]) return cum[i - 1];
    }
    return cum[0];
  }
  shuffle(array) {
    let i = array.length;
    while (i !== 0) {
      const r = Math.floor(this.random() * i);
      i--;
      [array[i], array[r]] = [array[r], array[i]];
    }
    return array;
  }
}
setup.RNG = RNG;

/* ──────────────────────────────────────────────────────────────
 * 내부 복사 헬퍼 (스냅샷에 사용)
 * ────────────────────────────────────────────────────────────── */
setup._cloneArr = a => (Array.isArray(a) ? a.slice() : []);
setup._cloneAbil = function (abil) {
  // 실제 구조: composite/mental/physical/sexual
  return {
    composite: setup._cloneArr(abil?.composite),
    mental:    setup._cloneArr(abil?.mental),
    physical:  setup._cloneArr(abil?.physical),
    sexual:    setup._cloneArr(abil?.sexual)   // ← fix: sexabil → sexual
  };
};
setup._cloneSkill = function (skill) {
  // 실제 구조: social/combat/life/sexual
  return {
    social:  setup._cloneArr(skill?.social),
    combat:  setup._cloneArr(skill?.combat),
    life:    setup._cloneArr(skill?.life),
    sexual:  setup._cloneArr(skill?.sexual)    // ← fix: sexskill → sexual
  };
};

/* 시각용 효과 렌더 */
setup.renderEffects = function (fx) {
  if (!Array.isArray(fx) || !fx.length) return "";
  return fx.map(e => `<span class="eff-${e.t}">${e.l}</span> ${e.n >= 0 ? '+' + e.n : e.n}`).join(", ");
};

/* ──────────────────────────────────────────────────────────────
 * 배경 데이터
 * ────────────────────────────────────────────────────────────── */
setup.bgOrder = [
  "bakery","news","telegraph","dock","tailor","temple","grocer","orphanage","thug"
];

setup.BG = {
  bakery:    { title:"보육원 잡부",
    desc:"당신은 무거운 짐을 나르고 낡은 배관을 고치며 보육원의 궂은일을 도맡아왔다. 반복되는 육체노동은 당신의 몸을 단련시켰다. 아무도 찾지 않는 지하실 구석은 당신이 남몰래 마법을 연습할 수 있는 유일한 곳이었다.",
    fx:[ {t:'abil',l:'근력',n:1}, {t:'abil',l:'체력',n:1}, {t:'skill',l:'가사노동',n:1}, {t:'skill',l:'손재주',n:1}, {t:'skill',l:'주문 시전',n:1} ] },
  news:      { title:"보육원 보모",
    desc:"보육원에서 어린 동생들을 돌보는 것은 온전히 당신의 몫이었다. 갓난아기의 기저귀를 갈고, 서툰 바느질로 찢어진 옷을 꿰매는 일상 속에서 마법을 연습할 시간은 부족했지만, 대신 다양한 능력을 얻었다.",
    fx:[ {t:'abil',l:'감정 관리',n:1}, {t:'abil',l:'대인 관계력',n:1}, {t:'abil',l:'자제력',n:1} ] },
  telegraph: { title:"신문 팔이",
    desc:"당신은 어린 시절부터 신문을 받아 거리를 돌아다니며 신문을 팔고 다녔다. 도시의 모든 길목과 소문은 당신의 손바닥 안에 있었다. 재빠르게 인파를 헤치고, 경쟁자들과 주먹다짐을 벌이며 살아남는 법을 터득했다.",
    fx:[ {t:'abil',l:'집중력',n:1}, {t:'abil',l:'학습 능력',n:1}, {t:'skill',l:'손재주',n:1} ] },
  dock:      { title:"구두 닦이",
    desc:"당신은 어릴 적부터 구두닦이 통을 들고 거리를 다니며 사람들의 구두를 닦아주고 푼돈을 벌었다. 구두를 닦으면서 수많은 사람들에게 귀동냥을 한 당신은 사람의 비위를 맞추고 표정 뒤에 숨겨진 진실을 읽어내는 데 능숙하다.",
    fx:[ {t:'abil',l:'근력',n:1}, {t:'abil',l:'민첩성',n:1}, {t:'skill',l:'체술',n:1}, {t:'skill',l:'손재주',n:1} ] },
  tailor:    { title:"성당의 시종",
    desc:"성당 부속 보육원에서 자란 당신은 양질의 식사를 제공한다는 소리를 듣고 사제를 돕는 시종 역할을 도맡았다. 당신은 엄격한 규율 속에서 기도문을 외우고, 성경을 필사하며 신앙과 지식을 쌓았다.",
    fx:[ {t:'abil',l:'유연성',n:1}, {t:'skill',l:'재봉술',n:1}, {t:'skill',l:'미술',n:1}, {t:'abil',l:'외모 매력',n:1}, {t:'skill',l:'교양',n:1} ] },
  temple:    { title:"부두의 꼬마",
    desc:"보육원의 답답한 생활을 견딜 수 없었던 당신은 부둣가에서 수많은 선원들 사이에서 눈칫밥을 먹고, 밀수품을 운반하는 잡일을 도우며 지냈다. 그러면서 당신은 바다 짠내와 함께 흘러들어온 마법에 대한 소문을 주워들으며 공부를 했다.",
    fx:[ {t:'abil',l:'대인 관계력',n:1}, {t:'abil',l:'자제력',n:1}, {t:'skill',l:'신실함',n:1} ] },
  grocer:    { title:"거리의 광대",
    desc:"당신은 늙은 악사가 연주하는 낡은 허디거디 연주에 맞춰 거리에서 춤을 추며, 때로는 노래를 부르며 푼돈을 벌었다. 사람들의 시선을 사로잡기 위해 당신은 열심히 춤을 추고 노래를 배우며 거리를 누볐다.",
    fx:[ {t:'abil',l:'판단력',n:1}, {t:'abil',l:'사회 매력',n:1}, {t:'skill',l:'요리',n:1} ] },
  orphanage: { title:"거리의 좀도둑",
    desc:"당신에게 마법은 생존을 위한 기술이었다. 당신은 거리를 활보하며 은밀하게 마법을 사용하여 사람들의 지갑과 귀중품을 훔치고 다녔다. 당신은 범죄행각을 들키지 않기 위해 항상 고도의 집중력을 유지하며 마법을 정밀하게 제어했다.",
    fx:[ {t:'abil',l:'체력',n:1}, {t:'skill',l:'손재주',n:1}, {t:'abil',l:'자제력',n:1} ] },
  thug:      { title:"동네 불량배",
    desc:"보육원과 거리는 힘의 논리로 움직이는 곳이었다. 당신은 살아남기 위해 주먹을 쓰는 법부터 배웠다. 싸움에서 이기는 것은 단순한 자존심이 아닌 생존의 문제였다. 당신에게 마법은 싸움을 위한 보조 도구였다.",
    fx:[ {t:'skill',l:'체술',n:1}, {t:'abil',l:'민첩성',n:1}, {t:'abil',l:'대인 관계력',n:1} ] }
};

/* 배경 적용: 스냅샷에서 다시 계산 (중복 누적 방지) */
setup.applyBackground = function (pc, key, mode = "apply") {
  const bg = setup.BG[key];
  if (!pc || !key || !bg || !Array.isArray(bg.fx)) {
    console.error("applyBackground: invalid args", { pc: !!pc, key, bg });
    return;
  }
  // 1) 최초 스냅샷
  if (!pc.baseStatsSnapshot) {
    pc.baseStatsSnapshot = {
      abil : setup._cloneAbil(pc.abil),
      skill: setup._cloneSkill(pc.skill)
    };
  }
  // 2) 매번 스냅샷으로 리셋
  pc.abil  = setup._cloneAbil(pc.baseStatsSnapshot.abil);
  pc.skill = setup._cloneSkill(pc.baseStatsSnapshot.skill);

  // 3) mode === 'apply'만 누적
  if (mode === "apply") {
    bg.fx.forEach(e => {
      if (e.t === "abil" || e.t === "skill") {
        setup.modifyStat(pc, e.l, e.n);
      }
    });
  }
};

/* 연애 경험 */
setup.romOrder = ["sheltered","curious","puppy","dater","sexual"];
setup.ROM = {
  sheltered: { title: "철저한 보호",
    desc : "고아원에서 철저히 보호받으며 자랐다. 연애/성 지식이 거의 없다.",
    fx   : [ {t:'abil', l:'자제력', n:1} ] },
  curious:   { title: "이론만 조금",
    desc : "연애 경험은 없지만, 이야기와 연애 소설로 귀동냥은 했다.",
    fx   : [ {t:'abil', l:'성 지식', n:1}, {t:'skill', l:'유혹', n:1}, {t:'sexy', l:'성 지식', n:1} ] },
  puppy:     { title: "소꿉연애",
    desc : "누군가와 사귀긴 했지만, 어릴 적의 소꿉장난에 가까웠다.",
    fx   : [ {t:'skill', l:'성 지식', n:1}, {t:'abil', l:'유혹', n:1} ] },
  dater:     { title: "연애 경험",
    desc : "몇몇 아이들과 사귄 적이 있고, 어느 정도 애정 행각도 해봤다.",
    fx   : [ {t:'skill', l:'성 지식', n:1}, {t:'skill', l:'유혹', n:1}, {t:'sexy', l:'손 기술', n:1} ] },
  sexual:    { title: "잠자리 경험",
    desc : "사귀던 사람이 있었고, 그 사람과 잠자리를 가진 적도 있다.",
    fx   : [ {t:'skill', l:'성 지식', n:1}, {t:'skill', l:'손 기술', n:1}, {t:'skill', l:'허리놀림', n:1}, {t:'sexy', l:'성기 활용', n:1} ] }
};

/* 연애 적용/되돌리기(표시용 sexy 제외) */
setup.applyRomance = function (pc, key, mode = "apply") {
  const data = setup.ROM[key];
  if (!data || !Array.isArray(data.fx)) return;
  const mul = (mode === "undo") ? -1 : 1;
  data.fx.forEach(e => {
    if (e.t !== "sexy") setup.modifyStat(pc, e.l, e.n * mul);
  });
};
