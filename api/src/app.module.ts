import { Module } from '@nestjs/common';
import { ApplicationsController } from './presentation/controllers/applications.controller';
import { CreateApplicationUseCase } from './application/use-cases/create-application.use-case';
import { GetApplicationUseCase } from './application/use-cases/get-application.use-case';
import { ListApplicationsUseCase } from './application/use-cases/list-applications.use-case';
import { UpdateApplicationUseCase } from './application/use-cases/update-application.use-case';
import { SimulateOfferUseCase } from './application/use-cases/simulate-offer.use-case';
import { FinalizeApplicationUseCase } from './application/use-cases/finalize-application.use-case';
import { AbandonApplicationUseCase } from './application/use-cases/abandon-application.use-case';
import { GetApplicationEventsUseCase } from './application/use-cases/get-application-events.use-case';
import { InMemoryApplicationRepository } from './infrastructure/repositories/in-memory-application.repository';
import { InMemoryApplicationEventRepository } from './infrastructure/repositories/in-memory-application-event.repository';
import { IApplicationRepository } from './domain/repositories/application.repository';
import { IApplicationEventRepository } from './domain/repositories/application-event.repository';

@Module({
  controllers: [ApplicationsController],
  providers: [
    // Repositorios — se inyectan como la clase abstracta
    {
      provide: IApplicationRepository,
      useClass: InMemoryApplicationRepository,
    },
    {
      provide: IApplicationEventRepository,
      useClass: InMemoryApplicationEventRepository,
    },
    // Casos de uso
    CreateApplicationUseCase,
    GetApplicationUseCase,
    ListApplicationsUseCase,
    UpdateApplicationUseCase,
    SimulateOfferUseCase,
    FinalizeApplicationUseCase,
    AbandonApplicationUseCase,
    GetApplicationEventsUseCase,
  ],
})
export class AppModule {}
