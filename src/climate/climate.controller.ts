import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { ClimateService } from './climate.service';
import { Response } from 'express';

@Controller() // Removed 'climate' prefix to fix 404 errors on endpoints
export class ClimateController {
  constructor(private readonly climateService: ClimateService) {}

  @Get('getDataTopic1')
  async getDataTopic1(@Res() res: Response) {
    const data = await this.climateService.getDataTopic1();
    if (data) {
      return res.status(HttpStatus.OK).json(data);
    } else {
      return res.status(HttpStatus.NOT_FOUND).send('No data found');
    }
  }

  @Get('getDataTopic2')
  async getDataTopic2(@Res() res: Response) {
    const data = await this.climateService.getDataTopic2();
    if (data) {
      return res.status(HttpStatus.OK).json(data);
    } else {
      return res.status(HttpStatus.NOT_FOUND).send('No data found');
    }
  }

  @Get('TableDataTopic1')
  async TableDataTopic1(@Res() res: Response) {
    const data = await this.climateService.TableDataTopic1();
    if (data) {
      return res.status(HttpStatus.OK).json(data);
    } else {
      return res.status(HttpStatus.NOT_FOUND).send('No data found');
    }
  }

  @Get('TableDataTopic2')
  async TableDataTopic2(@Res() res: Response) {
    const data = await this.climateService.TableDataTopic2();
    if (data) {
      return res.status(HttpStatus.OK).json(data);
    } else {
      return res.status(HttpStatus.NOT_FOUND).send('No data found');
    }
  }

  @Get('getDataForOneDayTopic1')
  async getDataForOneDayTopic1(@Res() res: Response) {
    const data = await this.climateService.getDataForOneDayTopic1();
    if (data) {
      return res.status(HttpStatus.OK).json(data);
    } else {
      return res.status(HttpStatus.NOT_FOUND).send('No data found');
    }
  }

  @Get('getDataForOneDayTopic2')
  async getDataForOneDayTopic2(@Res() res: Response) {
    const data = await this.climateService.getDataForOneDayTopic2();
    if (data) {
      return res.status(HttpStatus.OK).json(data);
    } else {
      return res.status(HttpStatus.NOT_FOUND).send('No data found');
    }
  }

  @Get('getDataForSevenDaysTopic1')
  async getDataForSevenDaysTopic1(@Res() res: Response) {
    const data = await this.climateService.getDataForSevenDaysTopic1();
    if (data) {
      return res.status(HttpStatus.OK).json(data);
    } else {
      return res.status(HttpStatus.NOT_FOUND).send('No data found');
    }
  }

  @Get('getDataForSevenDaysTopic2')
  async getDataForSevenDaysTopic2(@Res() res: Response) {
    const data = await this.climateService.getDataForSevenDaysTopic2();
    if (data) {
      return res.status(HttpStatus.OK).json(data);
    } else {
      return res.status(HttpStatus.NOT_FOUND).send('No data found');
    }
  }

  @Get('getDataForonemonthTopic1')
  async getDataForOneMonthTopic1(@Res() res: Response) {
    const data = await this.climateService.getDataForOneMonthTopic1();
    if (data) {
      return res.status(HttpStatus.OK).json(data);
    } else {
      return res.status(HttpStatus.NOT_FOUND).send('No data found');
    }
  }

  @Get('getDataForonemonthTopic2')
  async getDataForOneMonthTopic2(@Res() res: Response) {
    const data = await this.climateService.getDataForOneMonthTopic2();
    if (data) {
      return res.status(HttpStatus.OK).json(data);
    } else {
      return res.status(HttpStatus.NOT_FOUND).send('No data found');
    }
  }
}
