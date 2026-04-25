import { SimulateOfferUseCase } from '../simulate-offer.use-case';
import { ApplicationStatus } from '../../../domain/enums/application-status.enum';
import { ApplicationChannel } from '../../../domain/enums/application-channel.enum';
import { EventType } from '../../../domain/enums/event-type.enum';

const mockApplication = {
  id: 'test-id',
  status: ApplicationStatus.DRAFT,
  channel: ApplicationChannel.SELF_SERVICE,
  documentType: 'CC',
  documentNumber: '1234567890',
  fullName: 'Carlos Ruiz',
  phone: '3001234567',
  email: 'carlos@test.com',
  city: 'bogota',
  monthlyIncome: 5000000,
  monthlyExpenses: 1000000,
  requestedAmount: 10000000,
  termMonths: 36,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockApplicationRepository = {
  save: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
};

const mockEventRepository = {
  save: jest.fn(),
  findByApplicationId: jest.fn(),
};

describe('SimulateOfferUseCase', () => {
  let useCase: SimulateOfferUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SimulateOfferUseCase(
      mockApplicationRepository as any,
      mockEventRepository as any,
    );
    mockApplicationRepository.findById.mockResolvedValue(mockApplication);
    mockEventRepository.save.mockResolvedValue({});
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.spyOn(Math, 'random').mockRestore();
  });

  it('debe retornar oferta viable cuando la capacidad de pago es suficiente', async () => {
    const result = await useCase.execute('test-id');

    expect(result.viable).toBe(true);
    expect(result.monthlyPayment).toBeDefined();
    expect(result.monthlyRate).toBe(0.018);
    expect(result.totalAmount).toBeDefined();
  });

  it('debe retornar no viable cuando la capacidad de pago es insuficiente', async () => {
    mockApplicationRepository.findById.mockResolvedValue({
      ...mockApplication,
      monthlyIncome: 1000000,
      monthlyExpenses: 900000,
      requestedAmount: 50000000,
      termMonths: 12,
    });

    const result = await useCase.execute('test-id');

    expect(result.viable).toBe(false);
    expect(result.message).toBeDefined();
  });

  it('debe registrar evento SIMULATION_SUCCESS en oferta viable', async () => {
    await useCase.execute('test-id');

    expect(mockEventRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EventType.SIMULATION_SUCCESS,
      }),
    );
  });

  it('debe registrar evento SIMULATION_FAILED en oferta no viable', async () => {
    mockApplicationRepository.findById.mockResolvedValue({
      ...mockApplication,
      monthlyIncome: 1000000,
      monthlyExpenses: 900000,
      requestedAmount: 50000000,
      termMonths: 12,
    });

    await useCase.execute('test-id');

    expect(mockEventRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EventType.SIMULATION_FAILED,
      }),
    );
  });

  it('debe lanzar error cuando la solicitud no existe', async () => {
    mockApplicationRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('id-inexistente')).rejects.toThrow();
  });

  it('debe lanzar ServiceUnavailableException con 10% de probabilidad', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.05);

    await expect(useCase.execute('test-id')).rejects.toThrow();

    expect(mockEventRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EventType.SIMULATION_ERROR,
      }),
    );
  });

  it('debe calcular la cuota con fórmula de amortización francesa', async () => {
    const result = await useCase.execute('test-id');

    if (
      result.viable &&
      result.monthlyPayment &&
      result.totalAmount &&
      result.monthlyRate
    ) {
      const expectedPayment = Math.round(
        (10000000 * 0.018 * Math.pow(1.018, 36)) / (Math.pow(1.018, 36) - 1),
      );
      expect(result.monthlyPayment).toBe(expectedPayment);
    }
  });
});
