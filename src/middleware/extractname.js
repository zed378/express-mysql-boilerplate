exports.invoiceExtractor = (filename) => {
  const match = filename.match(/uploads\/(.+)-invoice.pdf/);

  if (match) {
    const invoicePart = match[1];
    return invoicePart + "-invoice.pdf";
  } else {
    console.log("No match found");
  }
};
