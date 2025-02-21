
let port = chrome.runtime.connect();

// Отслеживание кликов мыши
document.addEventListener('click', (e) => {
  if (e.target.matches('a, button, input[type="submit"], input[type="button"]')) {
    port.postMessage({
      type: 'click',
      selector: generateSelector(e.target),
      text: e.target.textContent || e.target.value,
      timestamp: Date.now()
    });
  }
});

// Отслеживание ввода текста
document.addEventListener('input', (e) => {
  if (e.target.matches('input[type="text"], textarea')) {
    port.postMessage({
      type: 'input',
      selector: generateSelector(e.target),
      value: e.target.value,
      timestamp: Date.now()
    });
  }
});

// Генерация уникального селектора для элемента
function generateSelector(el) {
  if (el.id) {
    return `#${el.id}`;
  }
  if (el.className) {
    return `.${el.className.split(' ').join('.')}`;
  }
  let path = [];
  while (el.parentNode) {
    let tag = el.tagName.toLowerCase();
    let siblings = Array.from(el.parentNode.children).filter(child => 
      child.tagName === el.tagName
    );
    if (siblings.length > 1) {
      let index = siblings.indexOf(el) + 1;
      tag += `:nth-child(${index})`;
    }
    path.unshift(tag);
    el = el.parentNode;
    if (el === document.body) break;
  }
  return path.join(' > ');
}
