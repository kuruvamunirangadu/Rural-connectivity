import { Injectable, ForbiddenException } from '@nestjs/common';

export type AIActionType =
  | 'GET_FARM_DATA'
  | 'GET_PRICE_ESTIMATE'
  | 'SEARCH_RESOURCES'
  | 'CREATE_WORK_REQUEST_DRAFT'
  | 'EXECUTE_PAYMENT'
  | 'RELEASE_SETTLEMENT'
  | 'APPROVE_VERIFICATION'
  | 'MODIFY_FINANCIAL_LEDGER';

@Injectable()
export class ActionPolicyService {
  private forbiddenDirectActions = new Set<AIActionType>([
    'EXECUTE_PAYMENT',
    'RELEASE_SETTLEMENT',
    'APPROVE_VERIFICATION',
    'MODIFY_FINANCIAL_LEDGER',
  ]);

  validateAIAction(action: AIActionType, userRole = 'FARMER') {
    if (this.forbiddenDirectActions.has(action)) {
      throw new ForbiddenException(
        `AI Guardrail Violation: Action '${action}' is restricted from autonomous AI execution. Critical financial and verification actions must be triggered by authorized human users.`
      );
    }
    return { allowed: true, action };
  }
}
