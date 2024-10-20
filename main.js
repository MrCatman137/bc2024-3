const { program } = require("commander");
const fs = require("fs");
const path = require("path");

program.exitOverride();

program
  .requiredOption("-i, --input <path>", "Path to input file")
  .option("-o, --output <path>", "Path to output file")
  .option("-d, --display", "Display the result in console")
  .option("-m, --maxRate", "Display the maximum currency rate");

try {
  program.parse(process.argv);
} catch (error) {
  if (error.code === "commander.missingMandatoryOptionValue") {
    console.error("Please, specify input file");
    process.exit(1);
  }
}
const options = program.opts();

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

function findMaxRate(data) {
  let maxRate = -Infinity;

  for (const item of data) {
    if (item.rate && item.rate > maxRate) {
      maxRate = item.rate;
    }
  }
  return maxRate;
}

const inputData = readFile(options.input);
const maxRate = findMaxRate(inputData);

if (maxRate === -Infinity) {
  console.error("Could not find any valid rates.");
  process.exit(1);
}

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
} else if (options.maxRate) {
  console.log(`Максимальний курс: ${maxRate}`);
} else {
  process.exit(0);
}
