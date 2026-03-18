import { cn } from "@/utils";
import { useEffect, useRef } from "react";
import { Textarea } from "./input";

export function AutoResizeTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const ref = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    }, [props.value]);

    return (
        <Textarea
            ref={ref}
            rows={1}
            {...props}
            className={cn("resize-none overflow-hidden", props.className)}
        />
    );
}