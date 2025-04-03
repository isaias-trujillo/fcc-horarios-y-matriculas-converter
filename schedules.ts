const file = Bun.file("horarios_procesados.json");
const json: Record<PropertyKey, unknown>[] = await file.json();

const counter: Record<string, string[]> = {};

json.forEach((row) => {
  const key = `${row.codigo_de_asignatura}-${row.seccion}`;
  if (!(key in counter)) {
    counter[key] = [row.identificacion as string];
    return;
  }
  if (!counter[key]?.includes(row.identificacion as string)) {
    counter[key]?.push(row.identificacion as string);
  }
});

console.log(Object.entries(counter).filter(([, v]) => v.length > 1));
