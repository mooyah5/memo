import { Button, useToaster } from "@tossteam/tds";
import { useEffect, useRouter } from "react";
import { useLogger } from "somewhere";
// ...

export function LogScreen({ children, params }: Props) {
    const router = useRouter();
    const logger = useLogger();

    useEffect(() => {
        if (router.isReady) {
            logger.screen({ params });
        }
    }, [router.isReady]);

    return <>{children}</>;
}

export function LogClick({ children, params }: Props) {
    const child = Children.only(children);
    const logger = useLog();

    return cloneElement(child, {
        onClick: (...args: any[]) => {
            logger.click({ params });

            if (child.props && typeof child.props["onClick"] === "function") {
                return child.props["onClick"](...args);
            }
        },
    });
}


function RegisterCardPage() {
    // ...

    return (
        <LogScreen params={{ title: PAGE_TITLE }}>
            <LogClick params={{ title: PAGE_TITLE, button: '다음' }}>
                <Button onClick={async () => {
                    try {
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
            </LogClick>
        </LogScreen>
    );
}

// 로깅 고도화 이후
// 아래 패턴 요구사항 발생

// - 스크린 로그에 찍힌 제목이 스크린 하위 버튼들에도 찍히도록
// - 특정 영역은 전부 A 파라미터 추가
// - 이 서비스에서 사용하고 있는 식별자가 모든 로그 파라미터에 찍히도록