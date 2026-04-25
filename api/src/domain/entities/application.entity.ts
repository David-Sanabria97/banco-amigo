import { ApplicationStatus } from '../enums/application-status.enum';
import { ApplicationChannel } from '../enums/application-channel.enum';

export class Application {
  id: string;
  status: ApplicationStatus;
  channel: ApplicationChannel;
  documentType: string;
  documentNumber: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  requestedAmount?: number;
  termMonths?: number;
  loanPurpose?: string;
  dataConsentAccepted?: boolean;
  advisorId?: string;
  createdAt: string;
  updatedAt: string;
}
