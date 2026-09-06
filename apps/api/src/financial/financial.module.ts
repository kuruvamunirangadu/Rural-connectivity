import { Module } from '@nestjs/common';
import { FinancialProfileService } from './profiles/financial-profile.service';
import { FinancialProfileController } from './profiles/financial-profile.controller';
import { IncomeService } from './income/income.service';
import { IncomeController } from './income/income.controller';
import { ExpenseService } from './expenses/expense.service';
import { ExpenseController } from './expenses/expense.controller';
import { FinancialSummaryService } from './summaries/financial-summary.service';
import { FinancialSummaryController } from './summaries/financial-summary.controller';
import { ConsentService } from './consent/consent.service';
import { ConsentController } from './consent/consent.controller';
import { IndicatorService } from './credit-readiness/indicator.service';
import { CreditProfileService } from './credit-readiness/credit-profile.service';
import { CreditReadinessController } from './credit-readiness/credit-readiness.controller';
import { FinancialPartnerService } from './partners/financial-partner.service';
import { FinancialPartnerController } from './partners/financial-partner.controller';
import { MockBankPartnerAdapter } from './partners/adapters/mock-bank-adapter';
import { FinancingRequestService } from './financing/financing-request.service';
import { FinancingApplicationService } from './financing/financing-application.service';
import { FinancingController } from './financing/financing.controller';
import { RepaymentService } from './repayments/repayment.service';
import { RepaymentController } from './repayments/repayment.controller';

@Module({
  controllers: [
    FinancialProfileController,
    IncomeController,
    ExpenseController,
    FinancialSummaryController,
    ConsentController,
    CreditReadinessController,
    FinancialPartnerController,
    FinancingController,
    RepaymentController,
  ],
  providers: [
    FinancialProfileService,
    IncomeService,
    ExpenseService,
    FinancialSummaryService,
    ConsentService,
    IndicatorService,
    CreditProfileService,
    FinancialPartnerService,
    MockBankPartnerAdapter,
    FinancingRequestService,
    FinancingApplicationService,
    RepaymentService,
  ],
  exports: [
    FinancialProfileService,
    IncomeService,
    ExpenseService,
    FinancialSummaryService,
    ConsentService,
    IndicatorService,
    CreditProfileService,
    FinancialPartnerService,
    FinancingRequestService,
    FinancingApplicationService,
    RepaymentService,
  ],
})
export class FinancialModule {}
