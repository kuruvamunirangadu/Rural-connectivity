import { Injectable } from '@nestjs/common';

export interface NotificationTemplate {
  type: string;
  language: 'en' | 'te';
  titleTemplate: string;
  bodyTemplate: string;
}

@Injectable()
export class NotificationTemplateService {
  private templates: NotificationTemplate[] = [
    // 1. WORK_OPPORTUNITY (for Provider)
    {
      type: 'WORK_OPPORTUNITY',
      language: 'en',
      titleTemplate: '🔔 New Work Opportunity',
      bodyTemplate: 'Farmer {{customerName}} requested {{resourceName}} in {{location}} for {{date}} at {{time}}.',
    },
    {
      type: 'WORK_OPPORTUNITY',
      language: 'te',
      titleTemplate: '🔔 కొత్త పని అవకాశం',
      bodyTemplate: 'రైతు {{customerName}} {{date}}న {{time}}కి {{location}}లో {{resourceName}} కోసం అభ్యర్థించారు.',
    },

    // 2. OFFER_ACCEPTED
    {
      type: 'OFFER_ACCEPTED',
      language: 'en',
      titleTemplate: '🔔 Offer Accepted',
      bodyTemplate: '{{providerName}} accepted your request for {{resourceName}} on {{date}}.',
    },
    {
      type: 'OFFER_ACCEPTED',
      language: 'te',
      titleTemplate: '🔔 ఆఫర్ ఆమోదించబడింది',
      bodyTemplate: '{{providerName}} {{date}}న {{resourceName}} పనిని ఆమోదించారు.',
    },

    // 3. BOOKING_CONFIRMED
    {
      type: 'BOOKING_CONFIRMED',
      language: 'en',
      titleTemplate: '✅ Booking Confirmed',
      bodyTemplate: 'Booking #{{bookingId}} confirmed for {{date}} at {{time}}. Amount: ₹{{amount}}.',
    },
    {
      type: 'BOOKING_CONFIRMED',
      language: 'te',
      titleTemplate: '✅ బుకింగ్ నిర్ధారించబడింది',
      bodyTemplate: 'బుకింగ్ #{{bookingId}} {{date}}న {{time}}కి నిర్ధారించబడింది. మొత్తం: ₹{{amount}}.',
    },

    // 4. WORK_REMINDER
    {
      type: 'WORK_REMINDER',
      language: 'en',
      titleTemplate: '⏰ Service Reminder',
      bodyTemplate: 'Your {{resourceName}} service is scheduled for tomorrow at {{time}}.',
    },
    {
      type: 'WORK_REMINDER',
      language: 'te',
      titleTemplate: '⏰ సేవా రిమైండర్',
      bodyTemplate: 'మీ {{resourceName}} సేవ రేపు {{time}}కి షెడ్యూల్ చేయబడింది.',
    },

    // 5. PROVIDER_ARRIVING
    {
      type: 'PROVIDER_ARRIVING',
      language: 'en',
      titleTemplate: '📍 Provider Arrived',
      bodyTemplate: 'Your service provider {{providerName}} has arrived at your farm location.',
    },
    {
      type: 'PROVIDER_ARRIVING',
      language: 'te',
      titleTemplate: '📍 సర్వీస్ ప్రొవైడర్ చేరుకున్నారు',
      bodyTemplate: 'మీ సర్వీస్ ప్రొవైడర్ {{providerName}} మీ పొలం వద్దకు చేరుకున్నారు.',
    },

    // 6. WORK_STARTED
    {
      type: 'WORK_STARTED',
      language: 'en',
      titleTemplate: '🚜 Work in Progress',
      bodyTemplate: 'Service provider started {{resourceName}} operation on your field.',
    },
    {
      type: 'WORK_STARTED',
      language: 'te',
      titleTemplate: '🚜 పని ప్రారంభమైంది',
      bodyTemplate: 'మీ పొలంలో {{resourceName}} పని ప్రారంభించబడింది.',
    },

    // 7. WORK_COMPLETED
    {
      type: 'WORK_COMPLETED',
      language: 'en',
      titleTemplate: '✓ Work Completed',
      bodyTemplate: '{{resourceName}} work completed. Please inspect and confirm completion.',
    },
    {
      type: 'WORK_COMPLETED',
      language: 'te',
      titleTemplate: '✓ పని పూర్తయింది',
      bodyTemplate: '{{resourceName}} పని పూర్తయింది. దయచేసి పరిశీలించి నిర్ధారించండి.',
    },

    // 8. RATING_REQUEST
    {
      type: 'RATING_REQUEST',
      language: 'en',
      titleTemplate: '⭐ Rate Your Service',
      bodyTemplate: 'Please share your experience with {{providerName}} to help build trust.',
    },
    {
      type: 'RATING_REQUEST',
      language: 'te',
      titleTemplate: '⭐ మీ అనుభవాన్ని రేట్ చేయండి',
      bodyTemplate: 'నమ్మకాన్ని పెంచడానికి దయచేసి {{providerName}}తో మీ అనుభవాన్ని రేట్ చేయండి.',
    },
  ];

  render(type: string, language: 'en' | 'te' = 'en', variables: Record<string, string | number> = {}): { title: string; body: string } {
    let tmpl = this.templates.find((t) => t.type === type && t.language === language);
    if (!tmpl) {
      tmpl = this.templates.find((t) => t.type === type && t.language === 'en') || {
        type,
        language: 'en',
        titleTemplate: '🔔 RuralConnect Notification',
        bodyTemplate: 'You have a new update regarding your farm service.',
      };
    }

    let title = tmpl.titleTemplate;
    let body = tmpl.bodyTemplate;

    for (const [k, v] of Object.entries(variables)) {
      const reg = new RegExp(`{{${k}}}`, 'g');
      title = title.replace(reg, String(v));
      body = body.replace(reg, String(v));
    }

    return { title, body };
  }
}
