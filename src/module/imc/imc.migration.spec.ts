import * as XLSX from "xlsx"; //npm install xlsx
                              //npm install --save-dev @types/xlsx
                                //Post migracion, validar que el excel generado cumpla con los requisitos

interface ImcRow {
  id: number;
  peso: number;
  altura: number;
  imc: number;
  imcRedondeado: number;
  categoria: string;
  fechahora: Date;
}

function readExcel(filePath: string): ImcRow[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  return rows.map((row, index) => ({
    id: Number(row["id"]),
    peso: Number(row["peso"]),
    altura: Number(row["altura"]),
    imc: Number(row["imc"]),
    imcRedondeado: Number(row["imcRedondeado"]),
    categoria: String(row["categoria"]),
    fechahora: new Date(row["fechahora"]),
  }));
}

describe("Validación Excel - Migración IMC", () => {
  let data: ImcRow[];

  beforeAll(() => {
    data = readExcel("./exports/imc.xlsx"); // ruta de tu archivo y la tabla a probar. Este tests esta hecho unicamente para el entity IMC
  });
// integridad de datos
  it("No debería haber campos nulos ni undefined", () => {
    data.forEach((row, idx) => {
      expect(row.id).not.toBeNull();
      expect(row.peso).not.toBeNaN();
      expect(row.altura).not.toBeNaN();
      expect(row.imc).not.toBeNaN();
      expect(row.imcRedondeado).not.toBeNaN();
      expect(row.categoria).toBeTruthy();
      expect(row.fechahora).toBeInstanceOf(Date);
    });
  });
 
  it(" Los campos deberían seguir el orden definido en el entity IMC", () => {
    const keys = Object.keys(data[0]);
    expect(keys).toEqual([
      "id",
      "peso",
      "altura",
      "imc",
      "imcRedondeado",
      "categoria",
      "fechahora",
    ]);
  });

  it("Los registros deberían estar ordenados por ID ascendente", () => {
    for (let i = 1; i < data.length; i++) {
      expect(data[i].id).toBeGreaterThanOrEqual(data[i - 1].id);
    }
  });

  it("El IMC redondeado debería coincidir con el IMC real", () => {
    data.forEach((row) => {
      const expected = Math.round(row.imc);
      expect(row.imcRedondeado).toBe(expected);
    });
  });

  it(" No debería haber categorías vacías o inválidas", () => {
    const validCategories = ["Bajo peso", "Normal", "Sobrepeso", "Obesidad"];
    data.forEach((row) => {
      expect(validCategories).toContain(row.categoria);
    });
  });
});
