const data = allmails;

// get keys as array
const keys = Object.keys(data[0]);

const commaSeparatedString = [
  keys.join(","),
  data.map((row) => keys.map((key) => row[key]).join(",")).join("\n")
].join("\n");

const csvBlob = new Blob([commaSeparatedString]);

const a2 = document.getElementById("csv-link");

a2.href = URL.createObjectURL(csvBlob);
