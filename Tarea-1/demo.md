# Somos el Grupo Antonio Ossa

## Integrantes
Nuestro grupo está conformado por tres integrantes
1. Martín Errázuriz
2. José Man (completar)
...
---



## Presentación
Puedes acceder a las diapositivas de nuestra presentación a travez de [este link](https://docs.google.com/presentation/d/1gMPh8gSmEDqHBc4h20Bu-10Utlv1XUj2xlc5NFtVje4/edit?usp=sharing)
...
## Código
Para ejecutar nuestro código puedes correr el comando npx serve (pasar a inline code)

Para mantener sincronizado el **_scroll_  sincronizado** creamos la función

const editor = document.getElementById('markdown-editor');
const preview = document.getElementById('markdown-preview');
editor.addEventListener('scroll', syncScrollEditorToPreview);
preview.addEventListener('scroll', syncScrollPreviewToEditor);
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

(Pasar a `block code` con el comando slash)
---
...

### Podemos hacer una sección de detallas usando el comando slash:

Cosas que a nadie le importan (según ChatGPT)


Detalles (copiar)
1. El número exacto de semillas en una sandía 🍉
2. El tiempo de cocción perfecto del brócoli 🥦
3. El récord mundial de apilar monedas sobre un dedo 🪙
4. Los nombres de los camarógrafos en los créditos de una película que nadie vio 🎬
5. Cuántas pelusas hay debajo de tu sofá en este momento 🛋️
6. La vida amorosa de una lombriz de tierra promedio 🪱❤️
7. El código postal de un pueblo con 3 habitantes en Siberia 📍
8. El segundo nombre del tipo que inventó el clip 📎
9. Cuántas gotas de agua hay en una piscina olímpica 🏊‍♂️
10. El sonido que hace un caracol al moverse (si es que hace alguno) 🐌


---
...
## Otras funcionalidades
- También se puede activar el modo oscuro.
- El contenido es persistente (recargar página)
- Y podemos exportar un `.pdf` 
---
...
y recuerden, como dijo alguna vez Antonio Ossa...
> inventar algo