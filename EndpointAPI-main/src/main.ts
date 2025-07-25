import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UserService } from "./modules/user/user.service";
import * as dotenv from 'dotenv';
import { CollectionPointsService } from './modules/collection-points/collection-points.service';
import { StatsService } from './modules/stats/stats.service';
import { ScheduleService } from './modules/schedule/schedule.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('EndpointAPI')
    .setDescription('API for user management')
    .setVersion('0.0.1')
    .addTag('endpoint')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const userService = app.get(UserService);
  await userService.initDefaultUserWithRole();

  const collectionPointService = app.get(CollectionPointsService);
  await collectionPointService.initDefaultCollectionPoints();

  const adminUser = await userService.getUserByEmail('admin@scrap-snap.com');

  const statsService = app.get(StatsService);
  await statsService.initDefaultStats(adminUser._id);

  const scheduleService = app.get(ScheduleService);
  await scheduleService.initDefaultSchedules();

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap().then(r => console.log('Server is running on port ' + (process.env.PORT || 3000)));