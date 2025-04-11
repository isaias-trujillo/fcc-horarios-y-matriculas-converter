import type Row from "./Row";

type FixedRow = Omit<Row, 'Ciclo'> & { Ciclo: number, seccion: number, horarios: Record<Day, string> };

export default FixedRow;