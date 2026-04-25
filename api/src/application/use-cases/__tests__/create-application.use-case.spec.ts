import { CreateApplicationUseCase } from '../create-application.use-case';
import { ApplicationStatus } from '../../../domain/enums/application-status.enum';
import { ApplicationChannel } from '../../../domain/enums/application-channel.enum';
import { EventType } from '../../../domain/enums/event-type.enum';

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

describe('CreateApplicationUseCase', () => {
  let useCase: CreateApplicationUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateApplicationUseCase(
      mockApplicationRepository as any,
      mockEventRepository as any,
    );
  });

  it('debe crear una solicitud con estado DRAFT', async () => {
    const input = {
      channel: ApplicationChannel.SELF_SERVICE,
      documentType: 'CC',
      documentNumber: '1234567890',
      fullName: 'Carlos Ruiz',
      phone: '3001234567',
      email: 'carlos@test.com',
      city: 'bogota',
    };

    mockApplicationRepository.save.mockResolvedValue({
      id: 'mock-id',
      status: ApplicationStatus.DRAFT,
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    mockEventRepository.save.mockResolvedValue({});

    const result = await useCase.execute(input);

    expect(result.status).toBe(ApplicationStatus.DRAFT);
    expect(result.channel).toBe(ApplicationChannel.SELF_SERVICE);
    expect(result.fullName).toBe('Carlos Ruiz');
  });

  it('debe guardar la solicitud en el repositorio', async () => {
    const input = {
      channel: ApplicationChannel.SELF_SERVICE,
      documentType: 'CC',
      documentNumber: '1234567890',
      fullName: 'Carlos Ruiz',
      phone: '3001234567',
      email: 'carlos@test.com',
      city: 'bogota',
    };

    mockApplicationRepository.save.mockResolvedValue({
      id: 'mock-id',
      ...input,
    });
    mockEventRepository.save.mockResolvedValue({});

    await useCase.execute(input);

    expect(mockApplicationRepository.save).toHaveBeenCalledTimes(1);
  });

  it('debe registrar evento CREATED al crear la solicitud', async () => {
    const input = {
      channel: ApplicationChannel.SELF_SERVICE,
      documentType: 'CC',
      documentNumber: '1234567890',
      fullName: 'Carlos Ruiz',
      phone: '3001234567',
      email: 'carlos@test.com',
      city: 'bogota',
    };

    mockApplicationRepository.save.mockResolvedValue({
      id: 'mock-id',
      ...input,
    });
    mockEventRepository.save.mockResolvedValue({});

    await useCase.execute(input);

    expect(mockEventRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EventType.CREATED,
        description: 'Solicitud creada',
      }),
    );
  });

  it('debe generar un id único para cada solicitud', async () => {
    const input = {
      channel: ApplicationChannel.SELF_SERVICE,
      documentType: 'CC',
      documentNumber: '1234567890',
      fullName: 'Carlos Ruiz',
      phone: '3001234567',
      email: 'carlos@test.com',
      city: 'bogota',
    };

    mockApplicationRepository.save.mockResolvedValue({
      id: 'mock-id-1',
      ...input,
    });
    mockEventRepository.save.mockResolvedValue({});
    const result1 = await useCase.execute(input);

    mockApplicationRepository.save.mockResolvedValue({
      id: 'mock-id-2',
      ...input,
    });
    const result2 = await useCase.execute(input);

    expect(mockApplicationRepository.save).toHaveBeenCalledTimes(2);
  });
});
