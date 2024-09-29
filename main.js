const { program } = require("commander");
const fs = require("fs");
const path = require("path");

program
  .requiredOption("-i, --input <path>", "Path to input file")
  .option("-o, --output <path>", "Path to output file")
  .option("-d, --display", "Display the result in console");
program.parse();

const options = program.opts();

if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

function readFile(filePath) {
  const fullPath = path.resolve(filePath); // converting relative file path to absolute path

  if (!fs.existsSync(fullPath)) {
    console.error("Cannot find input file");
    process.exit(1);
  }

  try {
    const data = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading the file:", error.message);
    process.exit(1);
  }
}

const inputData = readFile(options.input);
if (options.output && options.display) {
  const outputPath = path.resolve(options.output);
  fs.writeFileSync(outputPath, JSON.stringify(inputData, null, 2), "utf-8");
  console.log("Result is written\nDisplay the result:");
  console.log(JSON.stringify(inputData, null, 2));
} else if (options.output) {
  const outputPath = path.resolve(options.output);
  fs.writeFileSync(outputPath, JSON.stringify(inputData, null, 2), "utf-8");
  console.log("Result is written");
} else if (options.display) {
  console.log("Display the result:");
  console.log(JSON.stringify(inputData, null, 2));
} else {
  process.exit(0);
}
