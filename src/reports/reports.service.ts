import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepo: Repository<Report>,
  ) {}

  create(createReportDto: CreateReportDto, user: User) {
    const report = this.reportsRepo.create(createReportDto);
    report.user = user;
    return this.reportsRepo.save(report);
  }

  async changeApproval(id: number, approveReportDto: ApproveReportDto) {
    const report = await this.reportsRepo.findOne({ where: { id } });
    if (!report) throw new NotFoundException();

    report.approved = approveReportDto.approved;

    return this.reportsRepo.save(report);
  }
}
