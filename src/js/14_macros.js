/* 대사 스타일 */
Macro.add('line', {
  tags: null,
  handler() {
    const klass = this.args[0] || '';           // 'pc' | 'npc' | 'sys' | ''
    const body = this.payload[0]?.contents ?? '';
    const $p = $(document.createElement('span')).addClass(`say ${klass}`);
    new Wikifier($p[0], body);                  // 위키텍스트 렌더
    $(this.output).append($p);
  }
});

Macro.add('pc', { tags: null, handler() { this.args.unshift('pc'); Macro.get('line').handler.call(this); }});
Macro.add('npc', { tags: null, handler() { this.args.unshift('npc'); Macro.get('line').handler.call(this); }});
Macro.add('sys', { tags: null, handler() { this.args.unshift('sys'); Macro.get('line').handler.call(this); }});

// 조사 처리 매크로 (사용예시 : <<kparticle $variable '이/가'>> 이루어졌다.)
Macro.add('kparticle', {
    handler: function () {
        if (this.args.length < 2) {
            return this.error('Variable value and particle type are required.');
        }

        let value = this.args[0];  // 변수 값 자체 (예: '아델라 라모스')
        let particleType = this.args[1];  // 조사 종류 (예: '이/가')

        // 변수 값이 undefined 또는 null일 때 예외 처리
        if (typeof value !== 'string' || value.trim().length === 0) {
            return this.error(`Provided value is not defined or is not a valid string.`);
        }

        // 조사 선택 함수
        function selectParticle(type, word) {
            // 공백이 있을 경우 마지막 단어로 받침 여부를 확인
            const lastWord = word.trim().split(/\s+/).pop(); // 마지막 단어 가져오기
            const lastChar = lastWord.charCodeAt(lastWord.length - 1);
            const isBatchim = (lastChar - 0xAC00) % 28 !== 0; // 받침 여부 확인

            switch (type) {
                case '이/가':
                    return isBatchim ? '이' : '가';
                case '은/는':
                    return isBatchim ? '은' : '는';
                case '을/를':
                    return isBatchim ? '을' : '를';
                case '으로/로':
                    return isBatchim && lastChar !== 0x3134 ? '으로' : '로';
                case '와/과':
                    return isBatchim ? '과' : '와';
                case '이다/다':
                    return isBatchim ? '이다' : '다';
                default:
                    return '';
            }
        }

        // 결과 생성
        const particle = selectParticle(particleType, value);
        const result = value + particle;

        // 출력
        this.output.append(document.createTextNode(result));
    }
});