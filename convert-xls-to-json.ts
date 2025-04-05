import { readFile, utils } from "xlsx";

const path = "data-de-prueba-de-recti.xlsx";

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
  .filter((a) => a.rectificacion === true);

Bun.write("converted/data-de-prueba-de-recti.json", JSON.stringify(rows));
