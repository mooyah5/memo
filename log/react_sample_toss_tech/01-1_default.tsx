import { Button, useToaster } from "@tossteam/tds";
import { useEffect } from "react";
import { useLogger } from "somewhere";
// ...

const REGISTER_CARD_SCREEN_LOG_ID = 123;
const REGISTER_CARD_CLICK_LOG_ID = 456;
const REGISTER_CARD_POPUP_LOG_ID = 789;

const PAGE_TITLE = "카드 정보를 입력해주세요";

export default function RegisterCardPage() {
    // ...
    const toast = useToaster();
    const logger = useLogger();

    useEffect(() => {
        // 스크린 로그 요청
        logger.screen({
            logId: REGISTER_CARD_SCREEN_LOG_ID,
            params: { title: PAGE_TITLE },
        });
    }, []);

    return (
        <>
            // ...
            <Button
                onClick={async () => {
                    try {
                        // 클릭 로그 요청
                        logger.click({
                            logId: REGISTER_CARD_CLICK_LOG_ID,
                            params: { title: PAGE_TITLE, button: "다음" },
                        });
                        await registerCard(cardInfo);
                        // ...
                    } catch (error) {
                        // 토스트 팝업 로그 요청
                        logger.popup({
                            logId: REGISTER_CARD_POPUP_LOG_ID,
                            type: "toast",
                            params: { title: PAGE_TITLE, message: error.message },
                        });
                        toast.open(error.message);
                    }
                }}
            >
                다음
            </Button>
        </>
    );
}

// 스크린 로그: 유저가 페이지에 접속했을 때
// 클릭 로그: 유저가 클릭했을 때
// 팝업 로그: 유저가 토스트/모달을 봤을 때

// 정의한 액션 발생마다 액션 직전, 로그 식별자(logId)와 함께 로깅했음

// => 로그 식별자 생성 로직 분리 (더 이상 개발자가 logId를 신경 쓸 필요 없도록. 몰라도 됨.)

function createLogName({ logType, eventType }: { logType: LogType; eventType?: EventType }) {
    const serviceName = packageJson.name;
    const routerPath = location.pathname;

    const screenName = `payments_${serviceName}__${rotuerPath}`;
    const eventName = `::${eventType}__${eventName}`;

    const logName = `${screenName}${logType === "event" ? eventName : ""}`;

    return logName;
}
