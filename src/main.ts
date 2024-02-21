import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Esto funciona para las validaciones de los Dtos (middlewares) y se instalan
  app.useGlobalPipes(
    new ValidationPipe({ whitelist:true, forbidNonWhitelisted:true })
  )

  app.enableCors(); //Permite que todos los dominios puedan hacer peticiones

  app.use( bodyParser.json({limit:'10mb'}) );
  app.use( bodyParser.urlencoded({ limit:'10mb', extended:true }) );

  await app.listen(3000);
}
bootstrap();
