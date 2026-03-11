import { useEffect, useState } from "react";

export function useTyping(text: string, enabled: boolean) {
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        if (!enabled) {
            setDisplayText(text);
            return;
        }

        const minDuration = 1000;
        const maxDuration = 3000;

        const duration = Math.min(
            maxDuration,
            Math.max(minDuration, text.length * 25)
        );

        const intervalTime = duration / text.length;

        let index = 0;
        setDisplayText("");

        const interval = setInterval(() => {
            index++;
            setDisplayText(text.slice(0, index));

            if (index >= text.length) {
                clearInterval(interval);
            }
        }, intervalTime);

        return () => clearInterval(interval);
    }, [text, enabled]);

    return displayText;
}