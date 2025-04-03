document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById("markdown-editor");
    const buttons = document.querySelectorAll("#toolbar button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const snippet = button.getAttribute("data-md");
            insertMarkdown(editor, snippet);
        });
    });
    editor.addEventListener("keydown", handleListEnter);
});

function insertMarkdown(textarea, snippet) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    if (selectedText) {
        let finalText = snippet;
        finalText = finalText.replace("bold", selectedText);
        finalText = finalText.replace("italic", selectedText);
        finalText = finalText.replace("Texto", selectedText);
        finalText = finalText.replace("Alt", selectedText);
        finalText = finalText.replace("code", selectedText);
        finalText = finalText.replace("Summary", selectedText);
        const before = textarea.value.substring(0, start);
        const after = textarea.value.substring(end);
        textarea.value = before + finalText + after;

        const cursorPos = start + finalText.length;
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = cursorPos;

    } else {
        const before = textarea.value.substring(0, start);
        const after = textarea.value.substring(end);

        textarea.value = before + snippet + after;
        textarea.focus();

        let cursorStart = start + snippet.length;
        let cursorEnd = cursorStart;

        if (snippet.includes("bold")) {
            const index = snippet.indexOf("bold");
            cursorStart = start + index;
            cursorEnd = cursorStart + 4;
        } else if (snippet.includes("italic")) {
            const index = snippet.indexOf("italic");
            cursorStart = start + index;
            cursorEnd = cursorStart + 6;
        } else if (snippet.includes("Texto")) {
            const index = snippet.indexOf("Texto");
            cursorStart = start + index;
            cursorEnd = cursorStart + 5;
        } else if (snippet.includes("Alt")) {
            const index = snippet.indexOf("Alt");
            cursorStart = start + index;
            cursorEnd = cursorStart + 3;
        } else if (snippet.includes("code")) {
            const index = snippet.indexOf("code");
            if (index !== -1) {
                cursorStart = start + index;
                cursorEnd = cursorStart + 4;
            }
        } else if (snippet.includes("Summary")) {
            const index = snippet.indexOf("Summary");
            cursorStart = start + index;
            cursorEnd = cursorStart + 7;
        }
        textarea.selectionStart = cursorStart;
        textarea.selectionEnd = cursorEnd;
    }
}

function handleListEnter(event) {
    const textarea = event.target;
    const cursorPos = textarea.selectionStart;
    const text = textarea.value;
    const beforeCursor = text.substring(0, cursorPos);
    const afterCursor = text.substring(cursorPos);
    const lines = beforeCursor.split("\n");
    const currentLine = lines[lines.length - 1];

    if (event.key === "Enter") {
        if (currentLine.match(/^-\s/)) {
            event.preventDefault();
            if (currentLine.trim() === "-") {
                textarea.value = lines.slice(0, -1).join("\n") + "\n" + afterCursor;
                textarea.selectionStart = textarea.selectionEnd = beforeCursor.length - currentLine.length;
            } else {
                textarea.value = beforeCursor + "\n- " + afterCursor;
                textarea.selectionStart = textarea.selectionEnd = beforeCursor.length + 3;
            }
        }
        else if (currentLine.match(/^\d+\.\s/)) {
            event.preventDefault();
            const match = currentLine.match(/^(\d+)\.\s/);
            const number = parseInt(match[1], 10);
            if (currentLine.trim() === number + ".") {
                textarea.value = lines.slice(0, -1).join("\n") + "\n" + afterCursor;
                textarea.selectionStart = textarea.selectionEnd = beforeCursor.length - currentLine.length;
            } else {
                const newLine = "\n" + (number + 1) + ". ";
                textarea.value = beforeCursor + newLine + afterCursor;
                textarea.selectionStart = textarea.selectionEnd = beforeCursor.length + newLine.length;
            }
        }
    }
}