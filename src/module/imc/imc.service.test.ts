import { Test, TestingModule } from "@nestjs/testing";
import { ImcService } from "./imc.service";
import { CalcularImcDto } from "./dto/calcular-imc-dto";
import { BadRequestException } from "@nestjs/common";

describe("ImcService", () => {
  let service: ImcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImcService],
    }).compile();

    service = module.get<ImcService>(ImcService);
  });

  it("debería estar definido", () => {
    expect(service).toBeDefined();
  });

  describe("calcularImc", () => {
    //  Casos correctos
    it("debería calcular un IMC normal", () => {
      const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
      const result = service.calcularImc(dto);
      expect(result.imc).toBeCloseTo(22.86, 2);
      expect(result.categoria).toBe("Normal");
    });

    it("debería retornar 'Bajo peso' si IMC < 18.5", () => {
      const dto: CalcularImcDto = { altura: 1.80, peso: 50 };
      const result = service.calcularImc(dto);
      expect(result.imc).toBeCloseTo(15.43, 2);
      expect(result.categoria).toBe("Bajo peso");
    });

    it("debería retornar 'Sobrepeso' si 25 <= IMC < 30", () => {
      const dto: CalcularImcDto = { altura: 1.65, peso: 75 };
      const result = service.calcularImc(dto);
      expect(result.imc).toBeCloseTo(27.55, 2);
      expect(result.categoria).toBe("Sobrepeso");
    });

    it("debería retornar 'Obeso' si IMC >= 30", () => {
      const dto: CalcularImcDto = { altura: 1.60, peso: 80 };
      const result = service.calcularImc(dto);
      expect(result.imc).toBeCloseTo(31.25, 2);
      expect(result.categoria).toBe("Obeso");
    });

    //  Casos inválidosvalidaciones)
    it("debería lanzar error si el peso es <= 0", () => {
      const dto: CalcularImcDto = { altura: 1.70, peso: 0 };
      expect(() => service.calcularImc(dto)).toThrow(
        new BadRequestException("El peso debe ser mayor a 0 y menor a 500 kg"),
      );
    });

    it("debería lanzar error si el peso es >= 500", () => {
      const dto: CalcularImcDto = { altura: 1.70, peso: 500 };
      expect(() => service.calcularImc(dto)).toThrow(
        new BadRequestException("El peso debe ser mayor a 0 y menor a 500 kg"),
      );
    });

    it("debería lanzar error si la altura es <= 0", () => {
      const dto: CalcularImcDto = { altura: 0, peso: 70 };
      expect(() => service.calcularImc(dto)).toThrow(
        new BadRequestException("La altura debe ser mayor a 0 y menor a 3 metros"),
      );
    });

    it("debería lanzar error si la altura es >= 3", () => {
      const dto: CalcularImcDto = { altura: 3, peso: 70 };
      expect(() => service.calcularImc(dto)).toThrow(
        new BadRequestException("La altura debe ser mayor a 0 y menor a 3 metros"),
      );
    });
});
  });

