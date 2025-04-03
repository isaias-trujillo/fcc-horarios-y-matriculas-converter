import type FichaMatricula from "./FichaMatricula";
import type ParsedFichaMatricula from "./ParsedFichaMatricula";

const mapRawToParsedFichas = ({
  raw,
  escuela,
}: {
  raw: FichaMatricula[];
  escuela: string;
}): ParsedFichaMatricula[] => {
  const pattern = /[\s\n\r\t]+/g;
  // return parsed data: replace all spaces with a single sp and trim all strings (if not string is unnecessary)
  return raw.map((raw) => {
    return {
      codigo: fixMyString(raw.cod_alumno),
      apellido_paterno: fixMyString(raw.ape_paterno),
      apellido_materno: fixMyString(raw.ape_materno),
      nombres: fixMyString(raw.nom_alumno),
      codigo_de_asignatura: fixMyString(raw.cod_asignatura),
      seccion: fixMyString(raw.cod_seccion.toString()),
      ciclo: raw.num_ciclo_ano_asig || 10,
      asignatura: fixMyString(raw.des_asignatura),
      ingreso: fixMyString(raw.anio_ingreso),
      correo: fixMyString(raw.coe_alumno),
      escuela: fixMyString(escuela),
      plan_de_estudios: fixMyString(raw.cod_plan),
    };
  });
};

export const fixMyString = (str: string) => {
  const pattern = /[\s\n\r\t]+/g;
  return str
    .split(" ")
    .map((s) => s.trim().replaceAll(pattern, ""))
    .join(" ")
    .trim();
};

export default mapRawToParsedFichas;
