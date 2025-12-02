// 카드 등록 페이지에 좀 더 복잡한 로직을 추가

import { Button, useToaster } from "@tossteam/tds";
import { useEffect } from "react";
import { useLogger } from "somewhere";
// ...

function RegisterCardPage() {
    // ...
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
        <Button onClick={async () => {
            try {
                logger.click({ params: { title: PAGE_TITLE, button: '다음' }}); // 로깅
                await validatecCrdNumber({ cardNumber });
                await validateCardOwner({ cardNumber, name });
                await registerCard({ cardNumber, ... });
                router.push('/identification');     
            } catch (error) {
                logger.popup({ 
                    type: 'toast', 
                    params: { title: PAGE_TITLE, message: error.message }
                });
                toast.open(error.message);
            }
        }}>
        다음
        </Button>
    </>
  );
}
// 로직이 한 눈에 안 들어오고,
// 로직 전에 로깅 관련 코드가 먼저 눈에 들어옴. => logScreen, logClick 로깅 컴포넌트 제작