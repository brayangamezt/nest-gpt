import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';

import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenerationDto, ImageVaritionDto, OrtographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './Dtos';


@Controller('gpt')
export class GptController {

  constructor(private readonly gptService: GptService) {}

  @Post('ortography-check')
  ortographyCheck(@Body() bodyOrtographyDto:OrtographyDto){

    return this.gptService.ortographyCheck( bodyOrtographyDto );
    
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() bodyProsConsDiscusser:ProsConsDiscusserDto ){
    return this.gptService.prosConsDicusser( bodyProsConsDiscusser );
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(@Body() bodyProsConsDiscusser:ProsConsDiscusserDto, @Res() res: Response){

    const stream = await this.gptService.prosConsDicusserStream( bodyProsConsDiscusser );
    res.setHeader('Content-Type', 'application/json');
    res.status( HttpStatus.OK );

    for await( const chunk of stream ){
      const piece = chunk.choices[0].delta.content || '';
      // console.log(piece);
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  translate(@Body() bodyTranslate:TranslateDto ){
    return this.gptService.translateText(bodyTranslate);
  }

  @Post('text-to-audio')
  async textToAudio( @Body() bodyTextToAudio:TextToAudioDto, @Res() res:Response ){

    const filePath = await this.gptService.textToAudio( bodyTextToAudio );

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile( filePath );

  }

  @Get('text-to-audio/:fileId')
  async textToAudioById( @Res() res:Response, @Param('fileId') fielId:string ){

    const filePath = await this.gptService.textToAudioGetter(fielId);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile( filePath );

  }

  //Controlador para convertir de audio a texto
  @Post('audio-to-text')
  @UseInterceptors( FileInterceptor('file', { //Este segundo parametro que es de multer es para espeficar donde se guardara el archivo
    storage:diskStorage({
      destination:'./generated/uploads',
      filename:(req,file,callback)=>{
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${ new Date().getTime() }.${ fileExtension }`;
        return callback(null, fileName);
      }
    }) 
  }) )
  async audioToText( @UploadedFile( new ParseFilePipe({validators:[ 
      new MaxFileSizeValidator({ 
        maxSize:1000 * 1024 * 5, message:'File is biger than 5mb',
      }),
      new FileTypeValidator({fileType:'audio/*'}) 
    ]}) )file:Express.Multer.File, @Body() audioToText:AudioToTextDto ){
      
    return this.gptService.audioToText( file, audioToText );
  }


  @Post('image-generation')
  async imageGeneration( @Body() imageGenerationDto:ImageGenerationDto ){
    return this.gptService.imageGeneration( imageGenerationDto );
  }

  @Get('image-generation/:filename')
  async getImage(@Res() res:Response ,@Param('filename') filename:string){
    const filePath = await this.gptService.imageGetter(filename);

    res.status(HttpStatus.OK);
    res.sendFile( filePath );
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVaritionDto:ImageVaritionDto){
    return await this.gptService.generateImageVaritation( imageVaritionDto );
  }

}