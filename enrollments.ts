import {readFile, utils} from 'xlsx'
import type EnrollementRow from "./types/enrollments/EnrollementRow";
import fixEnrollmentRow from "./utils/fixEnrollmentRow.ts";

const filename = "matriculas.raw";
const path = `data/${filename}.xlsx`;

const file = readFile(path);

if (!file) {
    throw new Error("File not found");
}

const sheet = file.SheetNames[0];

if (!sheet) {
    throw new Error("Sheet not found");
}

const ws = file.Sheets[sheet];

if (!ws) {
    throw new Error("Worksheet not found");
}

const rows = (utils.sheet_to_json(ws) as EnrollementRow[]).map(fixEnrollmentRow).filter(Boolean);

const chunkSize = 1000;

const chunks = Array.from({ length: Math.ceil(rows.length / chunkSize) }, (_, i) => rows.slice(i * chunkSize, (i + 1) * chunkSize));

chunks.forEach((chunk, i) => {
    Bun.write(`result/${filename}/chunk-${i}.json`, JSON.stringify(chunk))
        .then((r) =>
            console.log(
                `File result/${filename}-${i}.json created with rows: ${chunk.length}`,
            ),
        )
        .catch(
            (e) => `Failed to create 'result/${filename}-${i}.json', error: ${e.message}`,
        );
});