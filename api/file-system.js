const fs = require("fs");
const path = require("path");


function getFilePath(filename) {
  return path.join(__dirname, "..", "modules", filename); 
}

function read_file(filename) {
  const filePath = getFilePath(filename);
  try {
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
}

function write_file(filename, data) {
  const filePath = getFilePath(filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

module.exports = { read_file, write_file };
