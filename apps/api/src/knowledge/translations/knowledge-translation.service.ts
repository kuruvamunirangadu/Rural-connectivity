import { Injectable, NotFoundException } from '@nestjs/common';

export interface TranslationDto {
  id: string;
  articleId: string;
  language: string; // 'te', 'hi', 'ta', 'kn'
  title: string;
  summary: string;
  content: string;
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED';
  reviewedById?: string;
  reviewedByName?: string;
  publishedAt?: string;
}

@Injectable()
export class KnowledgeTranslationService {
  private translations: TranslationDto[] = [
    {
      id: 'trans-cot-te-01',
      articleId: 'art-cot-spray-guide',
      language: 'te',
      title: 'పత్తి పంటలో పురుగుమందుల పిచికారీ మరియు రక్షణ మార్గదర్శకాలు',
      summary: 'బీటీ-పత్తిలో రసం పీల్చే పురుగులు మరియు గులాబీ రంగు కాయ తొలుచు పురుగు నివారణకు అధికారిక పిచికారీ పద్ధతులు.',
      content: `### 1. పిచికారీకి ముందు క్షేత్ర స్థాయి పరిశీలన (ETL)
పత్తి చేనులో రసాయన మందులు పిచికారీ చేయడానికి ముందు ఆర్థిక నష్ట పరిమితిని గమనించండి:
- రసం పీల్చే పురుగులు: ఆకుకు 5-10 పిల్ల పురుగులు లేదా పెద్ద పురుగులు.
- గులాబీ రంగు పురుగు: లింగాకర్షక బుట్టల్లో వరుసగా 3 రాత్రులు 8కి మించి మగ రెక్కల పురుగులు పడినప్పుడు.

### 2. వాతావరణం మరియు సమయం
- గాలి వేగం గంటకు 3 నుండి 10 కి.మీ మధ్య ఉన్నప్పుడే పిచికారీ చేయాలి. గాలికి ఎదురుగా ఎప్పుడూ నడవరాదు.
- ఉదయం 6:30 నుండి 9:30 గంటల వరకు లేదా సాయంత్రం 4:00 నుండి 6:30 గంటల వరకు మాత్రమే మందులు చల్లాలి. ఎండ తీవ్రతలో చేయరాదు.

### 3. రక్షణ పరికరాలు (PPE)
- ఆపరేటర్లు ఖచ్చితంగా మాస్క్, చేతి తొడుగులు మరియు రక్షణ కళ్లద్దాలు ధరించాలి.`,
      status: 'PUBLISHED',
      reviewedById: 'usr-senior-reviewer-99',
      reviewedByName: 'Dr. K. Somasekhar (State Technical Reviewer)',
      publishedAt: '2026-01-16T10:00:00Z',
    },
    {
      id: 'trans-ppe-te-02',
      articleId: 'art-sprayer-ppe-safety',
      language: 'te',
      title: 'రైతులు మరియు స్ప్రేయర్ ఆపరేటర్ల వ్యక్తిగత రక్షణ పరికరాల (PPE) జాబితా',
      summary: 'పురుగుమందులు పిచికారీ చేసే సమయంలో ధరించాల్సిన తప్పనిసరి రక్షణ పరికరాలు మరియు పరిశుభ్రత నియమాలు.',
      content: `### తప్పనిసరి వ్యక్తిగత రక్షణ పరికరాలు (PPE):
1. **శ్వాస రక్షణ**: N95 లేదా కార్బన్ మాస్క్ తప్పనిసరిగా ధరించాలి.
2. **కళ్ల రక్షణ**: రసాయనాలు కళ్లలో పడకుండా రక్షణ గాగుల్స్ ధరించాలి.
3. **చేతులు మరియు పాదాలు**: రబ్బరు గ్లౌజులు మరియు బూట్లు ధరించాలి.
4. **శరీర రక్షణ**: పూర్తి చేతుల ఏప్రాన్ లేదా కాటన్ రక్షణ దుస్తులు ధరించాలి.`,
      status: 'PUBLISHED',
      reviewedById: 'usr-senior-reviewer-99',
      reviewedByName: 'Dr. K. Somasekhar',
      publishedAt: '2026-01-19T10:00:00Z',
    },
  ];

  getTranslationsForArticle(articleId: string): TranslationDto[] {
    return this.translations.filter((t) => t.articleId === articleId);
  }

  getTranslation(articleId: string, language: string): TranslationDto {
    const trans = this.translations.find((t) => t.articleId === articleId && t.language === language);
    if (!trans) {
      throw new NotFoundException(`Translation for article ${articleId} in language '${language}' not found`);
    }
    return trans;
  }

  createOrUpdateTranslation(data: {
    articleId: string;
    language: string;
    title: string;
    summary: string;
    content: string;
    status?: 'DRAFT' | 'APPROVED' | 'PUBLISHED';
    reviewedById?: string;
  }): TranslationDto {
    const existingIdx = this.translations.findIndex(
      (t) => t.articleId === data.articleId && t.language === data.language
    );

    if (existingIdx !== -1) {
      this.translations[existingIdx] = {
        ...this.translations[existingIdx],
        title: data.title,
        summary: data.summary,
        content: data.content,
        status: data.status || this.translations[existingIdx].status,
      };
      return this.translations[existingIdx];
    }

    const id = `trans-${Date.now().toString(36)}`;
    const newTrans: TranslationDto = {
      id,
      articleId: data.articleId,
      language: data.language,
      title: data.title,
      summary: data.summary,
      content: data.content,
      status: data.status || 'DRAFT',
      reviewedById: data.reviewedById,
      publishedAt: data.status === 'PUBLISHED' ? new Date().toISOString() : undefined,
    };

    this.translations.push(newTrans);
    return newTrans;
  }
}
