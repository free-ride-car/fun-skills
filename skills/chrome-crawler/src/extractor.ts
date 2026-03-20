/**
 * Data Extractor
 * 提供多种数据提取方式
 */

export class Extractor {
  /**
   * 使用 CSS 选择器提取数据
   */
  static css(selector, options = {}) {
    const { attribute = 'textContent', multiple = false } = options;

    if (multiple) {
      return `
        Array.from(document.querySelectorAll('${selector}'))
          .map(el => el.${attribute})
          .filter(val => val != null)
      `;
    } else {
      return `document.querySelector('${selector}')?.${attribute}`;
    }
  }

  /**
   * 使用 XPath 提取数据
   */
  static xpath(xpathExpr) {
    return `
      (function() {
        const result = document.evaluate('${xpathExpr}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue?.textContent || null;
      })()
    `;
  }

  /**
   * 提取页面基本信息
   */
  static pageInfo() {
    return `
      {
        url: window.location.href,
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || '',
        keywords: document.querySelector('meta[name="keywords"]')?.content || ''
      }
    `;
  }

  /**
   * 提取页面所有链接
   */
  static links(options = {}) {
    const { domainOnly = false, includeText = true } = options;

    let script = `
      Array.from(document.querySelectorAll('a[href]'))
        .map(a => {
          const href = a.href;
    `;

    if (domainOnly) {
      script += `if (!href.includes(window.location.hostname)) return null;`;
    }

    script += `
          return {
            href: href,
            text: '${includeText ? `a.textContent.trim()` : ''}'
          };
        })
        .filter(l => l && l.href)
    `;

    return script;
  }

  /**
   * 提取页面标题列表
   */
  static headings(level = null) {
    if (level) {
      return `
        Array.from(document.querySelectorAll('h${level}'))
          .map(h => h.textContent.trim())
      `;
    }
    return `
      Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .map(h => ({
          level: h.tagName.toLowerCase(),
          text: h.textContent.trim()
        }))
    `;
  }

  /**
   * 提取表格数据
   */
  static table(selector = 'table') {
    return `
      (function extractTable(selector) {
        const table = document.querySelector(selector);
        if (!table) return null;

        const rows = Array.from(table.querySelectorAll('tr'));
        if (rows.length === 0) return null;

        const headers = Array.from(rows[0].querySelectorAll('th, td'))
          .map(cell => cell.textContent.trim());

        const data = rows.slice(1).map(row => {
          const cells = Array.from(row.querySelectorAll('td, th'));
          return cells.map(cell => cell.textContent.trim());
        });

        return { headers, data };
      })('${selector}')
    `;
  }

  /**
   * 提取图片信息
   */
  static images() {
    return `
      Array.from(document.querySelectorAll('img[src]'))
        .map(img => ({
          src: img.src,
          alt: img.alt || '',
          width: img.naturalWidth,
          height: img.naturalHeight
        }))
        .filter(img => img.src)
    `;
  }

  /**
   * 提取 JSON 数据（从 script 标签或内联数据）
   */
  static json(selector = 'script[type="application/json"]') {
    return `
      (function extractJson(selector) {
        const script = document.querySelector(selector);
        if (!script) return null;
        try {
          return JSON.parse(script.textContent);
        } catch {
          return null;
        }
      })('${selector}')
    `;
  }

  /**
   * 提取表单数据
   */
  static form(selector = 'form') {
    return `
      (function extractForm(selector) {
        const form = document.querySelector(selector);
        if (!form) return null;

        const fields = Array.from(form.querySelectorAll('input, select, textarea'))
          .map(field => ({
            type: field.type,
            name: field.name,
            id: field.id,
            value: field.value,
            placeholder: field.placeholder || ''
          }))
          .filter(f => f.name);

        return {
          action: form.action,
          method: form.method,
          fields
        };
      })('${selector}')
    `;
  }

  /**
   * 构建自定义提取脚本
   */
  static custom(script) {
    return script;
  }
}