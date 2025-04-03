
document.getElementById('export-button').addEventListener('click', function () {
    const element = document.getElementById('markdown-preview');
    const detailsElements = element.querySelectorAll('details');
    detailsElements.forEach(details => {
        // details.setAttribute('open');
    });
    html2pdf().from(element).save();
});
