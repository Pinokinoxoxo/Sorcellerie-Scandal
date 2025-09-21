// setup.Time 객체 초기화
setup.Time = {
    // --------------------------------------------------------------------
    // 데이터 및 레이블 (번역이 필요한 부분)
    // --------------------------------------------------------------------
    ID: {
        DAYS:    { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 },
        MONTHS:  { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 },
        SEASONS: { SPRING: 'SPRING', SUMMER: 'SUMMER', AUTUMN: 'AUTUMN', WINTER: 'WINTER' }
    },
    
    LABEL: {
        // <<print setup.Time.LABEL.DAYS[ setup.Time.getDayOfWeek() ]>> 형태로 사용
        DAYS:   ['일', '월', '화', '수', '목', '금', '토'],
        // <<print setup.Time.LABEL.MONTHS[ V.time.month ]>> 형태로 사용 (V.time.month는 1~12)
        MONTHS: [null, '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        // <<print setup.Time.getSeasonLabel()>> 형태로 사용
        SEASONS: {
            SPRING: '봄',
            SUMMER: '여름',
            AUTUMN: '가을',
            WINTER: '겨울'
        }
    },

    // --------------------------------------------------------------------
    // 핵심 함수
    // --------------------------------------------------------------------

    /**
     * @desc 새 게임 시작 시 시간 변수를 초기화합니다. StoryInit에서 호출해야 합니다.
     */
    init: function() {
        // SugarCube 변수 $time 객체를 생성합니다.
        V.time = {
            year: 1890,
            month: 3, // 3월
            day: 1,   // 1일
            hour: 8,  // 오전 8시
            minute: 0 // 0분
        };
    },

    /**
     * @desc 지정된 분만큼 시간을 진행시키고 날짜와 시간을 다시 계산합니다.
     * @param {number} minutesToAdd - 진행시킬 시간(분 단위).
     */
    advance: function(minutesToAdd) {
        if (typeof minutesToAdd !== 'number' || minutesToAdd < 0) {
            console.error('advance() 함수에는 양의 숫자만 전달해야 합니다.');
            return;
        }

        let time = V.time;
        
        // 1. 총 분 추가
        time.minute += minutesToAdd;

        // 2. 분 -> 시간으로 변환
        if (time.minute >= 60) {
            time.hour += Math.floor(time.minute / 60);
            time.minute %= 60;
        }

        // 3. 시간 -> 일로 변환
        if (time.hour >= 24) {
            time.day += Math.floor(time.hour / 24);
            time.hour %= 24;
        }

        // 4. 일 -> 월/년으로 변환 (한 달은 21일)
        while (time.day > 21) {
            time.day -= 21;
            time.month++;
            if (time.month > 12) {
                time.month = 1;
                time.year++;
            }
        }
    },
    
    // --------------------------------------------------------------------
    // 정보 조회 함수 (Getter)
    // --------------------------------------------------------------------
    
    /**
     * @desc 현재 요일을 숫자 ID로 반환합니다. (0: 일요일 ~ 6: 토요일)
     * @returns {number} 0-6 사이의 요일 ID.
     */
    getDayOfWeek: function() {
        // 1890년 3월 1일은 실제 역사에서 토요일(ID: 6)이었습니다.
        const startDayOfWeek = this.ID.DAYS.SAT; 
        
        // 게임 시작일로부터 총 며칠이 지났는지 계산
        const yearDiff = V.time.year - 1890;
        const monthDiff = V.time.month - 3;
        const dayDiff = V.time.day - 1;
        
        const totalDaysPassed = (yearDiff * 12 * 21) + (monthDiff * 21) + dayDiff;
        
        return (startDayOfWeek + totalDaysPassed) % 7;
    },

    /**
     * @desc 현재 계절을 ID 문자열로 반환합니다.
     * @returns {string} 계절 ID (SPRING, SUMMER, AUTUMN, WINTER).
     */
    getSeason: function() {
        const month = V.time.month;
        if ([3, 4, 5].includes(month)) {
            return this.ID.SEASONS.SPRING;
        }
        if ([6, 7, 8].includes(month)) {
            return this.ID.SEASONS.SUMMER;
        }
        if ([9, 10, 11].includes(month)) {
            return this.ID.SEASONS.AUTUMN;
        }
        // 12, 1, 2월
        return this.ID.SEASONS.WINTER;
    },

    /**
     * @desc 현재 요일의 현지화된 이름을 반환합니다.
     * @returns {string} 예: "월"
     */
    getDayOfWeekLabel: function() {
        return this.LABEL.DAYS[this.getDayOfWeek()];
    },
    
    /**
     * @desc 현재 계절의 현지화된 이름을 반환합니다.
     * @returns {string} 예: "봄"
     */
    getSeasonLabel: function() {
        return this.LABEL.SEASONS[this.getSeason()];
    },

    /**
     * @desc 보기 좋은 형식의 날짜 문자열을 반환합니다.
     * @returns {string} 예: "1890년 3월 1일 (토)"
     */
    getFormattedDate: function() {
        const time = V.time;
        const monthLabel = this.LABEL.MONTHS[time.month];
        const dayOfWeekLabel = this.getDayOfWeekLabel();
        return `${time.year}년 ${monthLabel} ${time.day}일 (${dayOfWeekLabel})`;
    },
    
    /**
     * @desc 보기 좋은 형식의 시간 문자열을 반환합니다. (HH:MM)
     * @returns {string} 예: "08:00"
     */
    getFormattedTime: function() {
        const time = V.time;
        const hour = String(time.hour).padStart(2, '0');
        const minute = String(time.minute).padStart(2, '0');
        return `${hour}:${minute}`;
    }
};