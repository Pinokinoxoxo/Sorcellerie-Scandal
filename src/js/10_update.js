setup.update_vars = function(vars) {
    // 이 함수는 저장된 변수 객체(State.variables)를 업데이트합니다.

    // -------------------------------------------------------------------
    // [개발자 가이드]
    // 
    // 1. 이 함수는 게임의 세이브 파일 하위 호환성을 위해 존재합니다.
    // 2. 게임을 업데이트하여 새로운 변수를 추가하거나 데이터 구조를 바꿀 때,
    //    이전 버전에서 저장한 유저들이 게임을 문제없이 이어할 수 있도록
    //    이곳에서 데이터를 변환해줍니다.
    //
    // 3. 새로운 업데이트가 필요할 때마다 아래 템플릿을 사용해 새로운 case를 추가하세요.
    // -------------------------------------------------------------------

    if (vars == null) {
        return console.error("버전 업데이트를 위한 변수 객체가 제공되지 않았습니다.");
    }

    // 저장 파일의 변수 버전을 가져옵니다. 없으면 0으로 시작합니다.
    let version = vars.varsversion || 0;
    // 업데이트 전 원래 버전을 기록해 둡니다. (로그 출력용)
    const oversion = version;

    switch (version) {
        // 이 switch문은 'break'를 사용하지 않습니다.
        // 예를 들어, 저장 파일 버전이 0이라면 case 0부터 시작해서
        // 그 아래의 모든 case를 순차적으로 실행하게 됩니다.

        // TEMPLATE FOR FUTURE ADDITIONS (미래의 업데이트를 위한 템플릿)
        /*
        case 0: // 이 업데이트를 설명하는 주석 (예: v.0.2.0 업데이트 - 캐릭터 스탯 추가)
        {
            // 여기에 변수 업데이트 코드를 작성합니다.
            // 예: if (vars.playerStats.dexterity === undefined) { vars.playerStats.dexterity = 10; }
            
            version++; // <<= 절대 잊지 마세요!
        }
        case 1: // v.0.3.0 업데이트 - 새로운 지역 '동쪽 숲' 변수 추가
        {
            // if (!vars.locations.east_forest) { vars.locations.east_forest = { discovered: false }; }

            version++; // <<= 절대 잊지 마세요!
        }
        */

        default:
        {
            // 모든 업데이트가 끝난 후 항상 실행되는 최종 작업 공간입니다.
            // 1. 최종적으로 업데이트된 버전을 변수 객체에 저장합니다.
            vars.varsversion = version;
            // 2. 이 세이브 파일이 어떤 게임 버전들을 거쳐왔는지 기록합니다. (디버깅에 유용)
            if (!vars.versions) {
                vars.versions = [];
            }
            // Config.saves.version은 현재 게임의 버전 문자열입니다. (아래 설명 참조)
            if (vars.versions.length === 0 || vars.versions[vars.versions.length - 1] !== Config.saves.version) {
                vars.versions.push(Config.saves.version);
            }      
            // 모든 업데이트가 끝난 후 항상 실행할 코드가 있다면 여기에 추가합니다.
            // 예: setup.recalculate_all_stats();
            // 변수 버전이 실제로 업데이트되었는지 확인하고 로그를 남깁니다.
            if (version > oversion) {
                console.log(`변수 버전이 v${oversion}에서 v${version}으로 업데이트되었습니다.`);
            }
        }
    }
};