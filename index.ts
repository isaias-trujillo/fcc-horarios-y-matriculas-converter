import * as XLSX from "xlsx";
import type FichaMatricula from "./types/FichaMatricula";
import mapRawToParsedFichas from "./types/mapRawToParsedFichas.ts";
import type ParsedFichaMatricula from "./types/ParsedFichaMatricula";

const path = "fichas de matriculas/presupuesto.xls";

const file = XLSX.readFile(path);
const sheets = file.SheetNames;

const chunkSize = 4000;
const chunks: ParsedFichaMatricula[][] = [];

for (let i = 0; i < sheets.length; i++) {
  const name = file.SheetNames[i];

  if (!name) {
    continue;
  }

  const ws = file.Sheets[name];

  if (!ws) {
    continue;
  }

  const raw: FichaMatricula[] = XLSX.utils.sheet_to_json(ws);
  const parsed = mapRawToParsedFichas({ raw, escuela: "PFP" });

  const bound = Math.ceil(parsed.length / chunkSize);
  for (let j = 0; j < bound; j++) {
    chunks.push(parsed.slice(j * chunkSize, (j + 1) * chunkSize));
  }
}
// create a new file per chunk with the total
chunks.forEach((chunk, index) => {
  const startRecordNumber = index * chunkSize + 1;
  const endRecordNumber = startRecordNumber + chunk.length - 1;
  const name = `parsed-fichas-de-matriculas/presupuesto/chunk-${index}-from-${startRecordNumber}-to-${endRecordNumber}.json`;
  const json = JSON.stringify(chunk);
  Bun.write(name, json).then((r) => console.log(r));
});
