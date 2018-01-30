class PageRenderer {
  constructor() {
    this.marked = new marked.Renderer();
    let _code = this.marked.code.bind(this.marked);
    this.marked.code = (code, lang, escaped) => {
      switch (lang) {
        case 'latex':
          return this.renderLaTeX(code, true);
          break;
        case undefined:
          {
            let result = hljs.highlightAuto(code);
            return this.renderCode(result.language, result.value);
          }
          break;
        default:
          {
            let result = hljs.highlight(lang, code, true);
            return this.renderCode(result.language, result.value);
          }
          break;
      }
    }
    let _codespan = this.marked.codespan.bind(this.marked);
    this.marked.codespan = (text) => {
      if (text.startsWith('!')) {
        return this.renderLaTeX(text.slice(1), false);
      } else {
        return _codespan(text);
      }
    }
  }

  render(string) {
    return marked(string, {breaks: true, renderer: this.marked});
  }

  renderCode(lang, value) {
    return `<pre><code class="hljs ${lang}">${value}</code></pre>`;
  }

  renderLaTeX(expr, block = false) {
    let splited = expr.split('\\\\');
    let html = '';
    for (let e of splited) {
      if (block) e = '\\displaystyle ' + e;
      try {
        html += katex.renderToString(e, {throwOnError: false});
      } catch (e) {
        html += e;
      }
    }
    if (block) {
      html = html.replace(/class=\"katex\"/g, 'class="katex katex-block" style="display: block;"');
    }
    return html;
  }
}

