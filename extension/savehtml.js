// stylePropertiesCopied = "background,color,border";
stylePropertiesCopied = "";
elms = document.body.querySelectorAll("*");
styleProperties = stylePropertiesCopied.split(",").map(obj => {
  return obj.trim();
});
for (let e of elms) {
  computedStyle = window.getComputedStyle(e);
  for (let prop of styleProperties) {
    if (computedStyle.hasOwnProperty(prop)) {
      e.style[prop] = computedStyle[prop];
    }
  }
}

strDoctype = "";
if (document.doctype != null) {
  strDoctype = new XMLSerializer().serializeToString(document.doctype)
}
output_html = strDoctype + document.querySelector("html").outerHTML;
downloadTextFile(output_html);

function downloadTextFile(str) {
  var blob = new Blob([str], {
    type: "text/plain"
  });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "update-computed-style.html";
  a.click();
}