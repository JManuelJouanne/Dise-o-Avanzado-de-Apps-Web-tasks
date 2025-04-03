const dialog = document.getElementById("slash-dialog")
const codeBlockButton = document.getElementById("code-block-button");
const detailsButton = document.getElementById("details-button");
const details_snippet = `<details>
    <summary>Summary</summary>
Description
</details>`;


document.addEventListener("DOMContentLoaded", () => {
    editor.addEventListener("keydown", (event) => {
        if (event.key === "/") {
            event.preventDefault();
            dialog.style.display = "flex";
        }
    });

    codeBlockButton.addEventListener("click", () => {
        const snippet = codeBlockButton.getAttribute("data-md");
        insertMarkdown(editor, snippet);
    });
   
    detailsButton.addEventListener("click", () => {
        insertMarkdown(editor, details_snippet);
    });

    document.addEventListener("click", (event) => {
        if (dialog.style.display === "flex") {
            dialog.style.display = "none";
        }
    });
});
