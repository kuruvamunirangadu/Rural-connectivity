import { Controller, Get, Param, Query } from '@nestjs/common';
import { ActivityGuideService } from './activity-guide.service';

@Controller('knowledge/activity-guides')
export class ActivityGuideController {
  constructor(private readonly guideService: ActivityGuideService) {}

  @Get()
  listGuides(@Query('activityType') activityType?: string, @Query('cropName') cropName?: string) {
    return this.guideService.listGuides({ activityType, cropName });
  }

  @Get(':activityType')
  getGuide(@Param('activityType') activityType: string, @Query('cropName') cropName?: string) {
    return this.guideService.getGuideForActivity(activityType, cropName);
  }
}
