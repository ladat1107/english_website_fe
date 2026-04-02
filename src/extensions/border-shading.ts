import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        borderShading: {
            setBorderShading: () => ReturnType;
        };
    }
}

export const BorderShading = Node.create({
    name: "borderShading",

    group: "block",

    content: "block+",

    parseHTML() {
        return [
            {
                tag: "div[data-border-shading]",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            mergeAttributes(HTMLAttributes, {
                "data-border-shading": "true",
                class:
                    "tiptap-border-shading ",
            }),
            0,
        ];
    },

    addCommands() {
        return {
            setBorderShading:
                () =>
                    ({ chain }) => {
                        return chain()
                            .insertContent({
                                type: this.name,
                                content: [{ type: "paragraph" }],
                            })
                            .focus()
                            .run();
                    },
        };
    },
});