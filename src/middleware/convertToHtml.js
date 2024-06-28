function formatErrorToHTML(errorMessage, stackTrace) {
  let html =
    '<div style="font-family: Arial, sans-serif; padding: 10px; border: 1px solid #ccc; background-color: #f8f8f8;">';

  // Error message
  html += `<p style="font-weight: bold; color: red;">${errorMessage}</p>`;

  // Stack trace
  html +=
    '<p style="font-family: Consolas, monospace; white-space: pre-wrap;">';
  stackTrace.split("\n").forEach((line) => {
    html += `&emsp;${line}<br>`;
  });
  html += "</p>";

  html += "</div>";

  return html;
}

module.exports = { formatErrorToHTML };
