
export const truncateHTML = (html, wordLimit = 20) => {
  if (typeof window === "undefined") {
  return { htmlText: "", wordCount: 0 };
}
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  let count = 0;
  let stop = false;

  const walk = (node) => {
    if (stop) return null;

    // TEXT NODE
    if (node.nodeType === 3) {
      const text = node.textContent?.trim();

      if (!text) return null;

      const words = text.split(/\s+/);
      const remain = wordLimit - count;

      const selected = words.slice(0, remain);

      count += selected.length;

      if (count >= wordLimit) stop = true;

      return document.createTextNode(selected.join(" ") + " ");
    }

    // ELEMENT NODE
    if (node.nodeType === 1) {
      const clone = document.createElement(node.tagName.toLowerCase());

      // copy attributes
      [...node.attributes].forEach((attr) => {
        clone.setAttribute(attr.name, attr.value);
      });

      for (const child of node.childNodes) {
        const newChild = walk(child);
        if (newChild) clone.appendChild(newChild);
        if (stop) break;
      }

      return clone;
    }

    return null;
  };

  const result = document.createElement("div");

  for (const child of doc.body.childNodes) {
    const newNode = walk(child);
    if (newNode) result.appendChild(newNode);
    if (stop) break;
  }

  return {
    htmlText: result.innerHTML.trim(),
    wordCount: count,
  };
};