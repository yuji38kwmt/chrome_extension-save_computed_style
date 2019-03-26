initailizeSelectBox();

document.getElementById("saveHtmlButton").addEventListener("click", function (element) {
  let propertyArray = $("#select-styleProperties").val();
  let stylePropertiesCopied = propertyArray != null ? propertyArray.join(",") : "";

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    const exectedScript = `
    stylePropertiesCopied = "${stylePropertiesCopied}";
    // 今のスタイルをstyle属性に設定する
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
    
    // HTMLファイルをダウンロード
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
    `;

    chrome.tabs.executeScript(
      tabs[0].id, {
        code: exectedScript
      });
  });
}, false);

/**
 * style プロパティのセレクトボックスを設定
 */
function initailizeSelectBox() {
  let selectBox = document.getElementById("select-styleProperties");
  styleDeclaration = window.getComputedStyle(document.body);
  for (let property of styleDeclaration) {
    let optionElm = document.createElement("option");
    optionElm.value = property;
    optionElm.textContent = property;
    selectBox.appendChild(optionElm);
  }

  $(selectBox).selectize();

}