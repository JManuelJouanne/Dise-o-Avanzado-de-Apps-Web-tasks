const editor = document.getElementById('markdown-editor');
const preview = document.getElementById('markdown-preview');

let isSyncing = false;

function syncScrollEditorToPreview() {
  if (!isSyncing) {
    isSyncing = true;
    preview.scrollTop = editor.scrollTop;
    isSyncing = false;
  }
}

function syncScrollPreviewToEditor() {
  if (!isSyncing) {
    isSyncing = true;
    editor.scrollTop = preview.scrollTop;
    isSyncing = false;
  }
}

editor.addEventListener('scroll', syncScrollEditorToPreview);
preview.addEventListener('scroll', syncScrollPreviewToEditor);