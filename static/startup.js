
window.onload = () => {
  let renderer = new PageRenderer();
  let content = document.getElementById('main-content');
  content.innerHTML = renderer.render(content.innerHTML);
}

