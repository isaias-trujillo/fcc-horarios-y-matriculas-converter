import {readFile, utils} from 'xlsx'
import fixScheduleRow from "./utils/fixScheduleRow.ts";
import type ScheduleRow from "./types/schedules/ScheduleRow";

const filename = "horarios.lunes.raw";
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

const rows = (utils.sheet_to_json(ws) as ScheduleRow[]).map(fixScheduleRow).filter(Boolean);

Bun.write(`result/${filename}.json`, JSON.stringify(rows))
    .then((r) =>
        console.log(
            `File result/${filename}.json created with rows: ${rows.length}`,
        ),
    )
    .catch(
        (e) => `Failed to create 'result/${filename}.json', error: ${e.message}`,
    );


