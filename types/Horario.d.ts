type Horario = {
  "PLAN DE\r\nESTUDIOS": number; // study plan
  CICLO: number; // cycle
  EP: string; // professional career
  "C\u00D3D.": number; // course code
  ASIGNATURAS: string; // course name
  "CRED.": number; // credits
  AULA: string; // classroom (optional)
  TURNO: string; // turn: M (Mañana), T (Tarde) o N (Noche)
  DOCENTE: string; // professor name
  [key: string]: unknown; // schedule: day of week with time (or time range) values
};

export default Horario;
