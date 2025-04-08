import * as XLSX from "xlsx";
import type FichaMatricula from "./types/FichaMatricula";
import mapRawToParsedFichas from "./types/mapRawToParsedFichas.ts";
import type ParsedFichaMatricula from "./types/ParsedFichaMatricula";

const careerCodes = {
  presupuesto: "PFP",
  contabilidad: "C",
  gestion: "GT",
  auditoria: "AUD",
  criminalistica: "CFF",
} as const;

Object.entries(careerCodes).forEach(async ([filename, code]) => {
  const path = `data/fichas_de_matriculas/${filename}.xls`;
  const exists = await Bun.file(path).exists();

  if (!exists) {
    console.log(`File ${path} not found`);
    return;
  }

  const file = XLSX.readFile(path);
  const sheets = file.SheetNames;

  const chunkSize = 2500;
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
    const parsed = mapRawToParsedFichas({ raw, escuela: code });

    const bound = Math.ceil(parsed.length / chunkSize);
    for (let j = 0; j < bound; j++) {
      chunks.push(parsed.slice(j * chunkSize, (j + 1) * chunkSize));
    }
  }
  // create a new file per chunk with the total
  chunks.forEach((chunk, index) => {
    const startRecordNumber = index * chunkSize + 1;
    const endRecordNumber = startRecordNumber + chunk.length - 1;
    const name = `result/fichas_de_matriculas/${filename}/chunk-${index}-from-${startRecordNumber}-to-${endRecordNumber}.json`;
    const json = JSON.stringify(chunk);
    Bun.write(name, json).then((r) => console.log(r));
  });
});
