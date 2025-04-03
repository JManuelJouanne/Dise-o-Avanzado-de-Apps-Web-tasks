function convertMarkdownToHTML(markdownText) {
    let htmlText = markdownText;

    htmlText = htmlText.replace(/^(#{1,6})\s*(.*)$/gm, (match, hash, text) => {
        const level = hash.length;
        return `<h${level}>${text}</h${level}>`;
    });

    htmlText = htmlText.replace(/^\s*\*\s+(.*)$/gm, '<ul><li>$1</li></ul>');
    htmlText = htmlText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    htmlText = htmlText.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    htmlText = htmlText.replace(/^\s*>\s*(.*)$/gm, '<blockquote>$1</blockquote>');
    htmlText = htmlText.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
    htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    htmlText = htmlText.replace(/_([^_]+)_/g, '<em>$1</em>');
    htmlText = htmlText.replace(/\n/g, '<p>$&</p>');
    htmlText = htmlText.replace(/---/gm, '<hr>');
    htmlText = htmlText.replace(/`([^`]+)`/g, '<inlinecode>$1</inlinecode>');
    htmlText = htmlText.replace(/```([\s\S]*?)```/gm, '<pre><code>$1</code></pre>');
    return htmlText;
}

function syncPreview() {
    const editorContent = document.getElementById('markdown-editor').value;
    localStorage.setItem('markdownContent', editorContent);    
    const preview = document.getElementById('markdown-preview');
    preview.innerHTML = convertMarkdownToHTML(editorContent);
}

document.getElementById('markdown-editor').addEventListener('input', syncPreview);

const savedContent = localStorage.getItem('markdownContent');
if (savedContent !== null) {
    document.getElementById('markdown-editor').value = savedContent;
}

syncPreview();