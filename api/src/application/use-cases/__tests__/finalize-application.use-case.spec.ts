import { FinalizeApplicationUseCase } from '../finalize-application.use-case';
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

describe('FinalizeApplicationUseCase', () => {
  let useCase: FinalizeApplicationUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new FinalizeApplicationUseCase(
      mockApplicationRepository as any,
      mockEventRepository as any,
    );
    mockApplicationRepository.findById.mockResolvedValue(mockApplication);
    mockApplicationRepository.update.mockResolvedValue({
      ...mockApplication,
      status: ApplicationStatus.PENDING_VALIDATION,
    });
    mockEventRepository.save.mockResolvedValue({});
  });

  it('debe cambiar el estado a PENDING_VALIDATION', async () => {
    const result = await useCase.execute('test-id');

    expect(result.status).toBe(ApplicationStatus.PENDING_VALIDATION);
  });

  it('debe actualizar la solicitud en el repositorio', async () => {
    await useCase.execute('test-id');

    expect(mockApplicationRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: ApplicationStatus.PENDING_VALIDATION,
      }),
    );
  });

  it('debe registrar evento FINALIZED', async () => {
    await useCase.execute('test-id');

    expect(mockEventRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EventType.FINALIZED,
        description: 'Solicitud finalizada y enviada a validación',
      }),
    );
  });

  it('debe lanzar error si la solicitud está abandonada', async () => {
    mockApplicationRepository.findById.mockResolvedValue({
      ...mockApplication,
      status: ApplicationStatus.ABANDONED,
    });

    await expect(useCase.execute('test-id')).rejects.toThrow();
  });

  it('debe lanzar error si la solicitud no existe', async () => {
    mockApplicationRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('id-inexistente')).rejects.toThrow();
  });

  it('debe actualizar el campo updatedAt', async () => {
    await useCase.execute('test-id');

    expect(mockApplicationRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        updatedAt: expect.any(String),
      }),
    );
  });
});
