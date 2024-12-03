const textContainer = document.getElementById('text-container');
const textInput = document.getElementById('text-input');
const fontSelect = document.getElementById('font-select');
const fontSizeDisplay = document.getElementById('font-size');
const fontSizeSlider = document.getElementById('font-size-slider');
const addTextButton = document.getElementById('add-text');
const boldButton = document.getElementById('bold');
const italicButton = document.getElementById('italic');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');
const label=document.getElementById('label');
const colorSwatches = document.querySelectorAll('.color-swatch');

let currentText = null;
let history = [];
let historyIndex = -1;

//drag
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

function saveState() {
  history = history.slice(0, historyIndex + 1);
  history.push(textContainer.innerHTML);
  historyIndex++;
}

// Add text
addTextButton.addEventListener('click', () => {
  if (textInput.value.trim() === '') return;
  currentText = document.createElement('span');
  currentText.textContent = textInput.value;
  currentText.style.fontSize = `${fontSizeSlider.value}px`;
  currentText.style.position = 'absolute';
  currentText.style.left = '50%';
  currentText.style.top = '50%';
  currentText.style.transform = 'translate(-50%, -50%)';
  textContainer.innerHTML = '';
  textContainer.appendChild(currentText);
  enableDragging(currentText);
  saveState();
});

// slider
fontSizeSlider.addEventListener('input', () => {
  if (currentText) {
    currentText.style.fontSize = `${fontSizeSlider.value}px`;
    fontSizeDisplay.textContent = `${fontSizeSlider.value}px`;
    saveState();
  }
});

// bold
boldButton.addEventListener('click', () => {
  if (currentText) {
    currentText.style.fontWeight = currentText.style.fontWeight === 'bold' ? 'normal' : 'bold';
    saveState();
  }
});

//  italic 
italicButton.addEventListener('click', () => {
  if (currentText) {
    currentText.style.fontStyle = currentText.style.fontStyle === 'italic' ? 'normal' : 'italic';
    saveState();
  }
});

// Change font 
fontSelect.addEventListener('change', () => {
  if (currentText) {
    currentText.style.fontFamily = fontSelect.value;
    label.style.fontFamily = fontSelect.value;
    saveState();
  }
});

// Undo 
undoButton.addEventListener('click', () => {
  if (historyIndex > 0) {
    historyIndex--;
    textContainer.innerHTML = history[historyIndex];
    currentText = textContainer.querySelector('span');
    if (currentText) enableDragging(currentText);
  }
});

// Redo
redoButton.addEventListener('click', () => {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    textContainer.innerHTML = history[historyIndex];
    currentText = textContainer.querySelector('span');
    if (currentText) enableDragging(currentText);
  }
});

colorSwatches.forEach((color) => {
  color.addEventListener('click', () => {
    if (currentText) {
      const bgColor = window.getComputedStyle(color).backgroundColor;
      currentText.style.color = bgColor;
    }
  });
});


// dragging
function enableDragging(element) {
  element.addEventListener('mousedown', (event) => {
    isDragging = true;
    offsetX = event.offsetX;
    offsetY = event.offsetY;
  });

  document.addEventListener('mousemove', (event) => {
    if (isDragging && element) {
      const rect = textContainer.getBoundingClientRect();
      let left = event.clientX - rect.left - offsetX;
      let top = event.clientY - rect.top - offsetY;

      
      left = Math.max(0, Math.min(left, rect.width - element.offsetWidth));
      top = Math.max(0, Math.min(top, rect.height - element.offsetHeight));

      element.style.left = `${left}px`;
      element.style.top = `${top}px`;
      element.style.transform = 'none'; 
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      saveState();
    }
  });
}
