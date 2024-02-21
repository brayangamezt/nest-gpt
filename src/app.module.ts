import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ ConfigModule.forRoot() , GptModule], //ConfigurModule se instala para poder utilizar variables de entorno
  controllers: [],
  providers: [],
})
export class AppModule {}
