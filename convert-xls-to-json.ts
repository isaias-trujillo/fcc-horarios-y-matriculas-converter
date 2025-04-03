import { readFile, utils } from "xlsx";

const path = "horarios-03-04.xlsx";

const file = readFile(path);

const sheet = file.SheetNames[0];

if (!sheet) {
  throw new Error("Sheet not found");
}

const ws = file.Sheets[sheet];

if (!ws) {
  throw new Error("Worksheet not found");
}

const rows = utils
  .sheet_to_json(ws)
  .filter((a) => !("¿Es un grupo de rectificacion?" in a));

Bun.write("converted/horarios-03-04.json", JSON.stringify(rows));
