import { Button, useToaster } from "@tossteam/tds";
import { useEffect } from "react";
import { useLogger } from "somewhere";
// ...

function createLogName({ logType, eventType }: { logType: LogType; eventType?: EventType }) {
    const serviceName = packageJson.name;
    const routerPath = location.pathname;

    const screenName = `payments_${serviceName}__${rotuerPath}`;
    const eventName = `::${eventType}__${eventName}`;

    const logName = `${screenName}${logType === "event" ? eventName : ""}`;

    return logName;
}

function RegisterCardPage() {
    // ...
    // (제거됨)
    // const REGISTER_CARD_SCREEN_LOG_ID = 123;
    // const REGISTER_CARD_CLICK_LOG_ID = 456;
    // const REGISTER_CARD_POPUP_LOG_ID = 789;

    const toast = useToaster();
    const logger = useLogger();

    useEffect(() => {
        logger.screen({
            // logId: REGISTER_CARD_SCREEN_LOG_ID, (제거됨)
            params: { title: PAGE_TITLE },
        });
    }, []);

    return (
        <>
            // ...
            <Button
                onClick={async () => {
                    try {
                        logger.click({
                            // logId: REGISTER_CARD_CLICK_LOG_ID, (제거됨)
                            params: { title: PAGE_TITLE, button: "다음" },
                        });
                        await registerCard(cardInfo);
                        // ...
                    } catch (error) {
                        logger.popup({
                            // logId: REGISTER_CARD_POPUP_LOG_ID, (제거됨)
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
