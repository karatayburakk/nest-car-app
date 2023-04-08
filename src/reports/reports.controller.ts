import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    console.log(typeof query.year);
  }

  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  @Post()
  create(
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: User,
  ): Promise<Report> {
    return this.reportsService.create(createReportDto, user);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  approveReport(
    @Param('id') id: number,
    @Body() approveReportDto: ApproveReportDto,
  ) {
    return this.reportsService.changeApproval(id, approveReportDto);
  }
}
