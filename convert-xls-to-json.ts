import { readFile, utils } from "xlsx";

const filename = "horarios/horarios.sjl.processed";
const path = `data/${filename}.xlsx`;

const file = readFile(path);

const sheet = file.SheetNames[0];

if (!sheet) {
  throw new Error("Sheet not found");
}

const ws = file.Sheets[sheet];

if (!ws) {
  throw new Error("Worksheet not found");
}

const rows = utils.sheet_to_json(ws);

Bun.write(`result/${filename}.json`, JSON.stringify(rows))
  .then((r) =>
    console.log(
      `File result/${filename}.json created with rows: ${rows.length}`,
    ),
  )
  .catch(
    (e) => `Failed to create 'result/${filename}.json', error: ${e.message}`,
  );
