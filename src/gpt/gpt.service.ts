import * as path from 'path';
import * as fs from 'fs';

import { Injectable, NotFoundException } from '@nestjs/common';
import { audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase, ortographyCheckUseCase, prosConstDicusserStreamUseCase, prosConstDicusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import OpenAI from 'openai';
import { ImageGenerationDto, ImageVaritionDto, OrtographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './Dtos';
import { AudioToTextDto } from './Dtos/audioToTextDto';


@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });


    async ortographyCheck( ortographyDto:OrtographyDto ){

        return await ortographyCheckUseCase( this.openai ,{ prompt:ortographyDto.prompt} );

    }

    async prosConsDicusser( {prompt}:ProsConsDiscusserDto ){
        return await prosConstDicusserUseCase( this.openai, { prompt } );
    }

    async prosConsDicusserStream( {prompt}:ProsConsDiscusserDto ){
        return await prosConstDicusserStreamUseCase( this.openai, { prompt } );
    }

    async translateText( translateDto:TranslateDto ){
        return await translateUseCase(this.openai, translateDto);
    }

    async textToAudio( textToAudio:TextToAudioDto ){
        return await textToAudioUseCase( textToAudio, this.openai )
    }

    async textToAudioGetter( fileId:string ){

        const filePath = path.resolve(__dirname,'../../generated/audios/', `${fileId}.mp3` );
        
        //Verificar si existe
        const wasFound = fs.existsSync( filePath );

        if( !wasFound ) throw new NotFoundException(`File ${ fileId } NOT FOUND`);

        return filePath;

    }

    async audioToText( audioFile:Express.Multer.File, AudioToTextDto:AudioToTextDto ){
        const { prompt } = AudioToTextDto;
        return audioToTextUseCase( this.openai, {audioFile, prompt} );
    }

    async imageGeneration( imageGenerationDto:ImageGenerationDto ){
        return await imageGenerationUseCase( this.openai, imageGenerationDto );
    }

    async imageGetter(filename:string){
        const pathFile = path.resolve(__dirname,'../../generated/images/',filename);
        const wasFound = fs.existsSync(pathFile);

        if( !wasFound ) throw new NotFoundException(`File ${ filename } WAS NOT FOUND`);

        return pathFile;
    }

    async generateImageVaritation( imageVaritionDto:ImageVaritionDto ){
        return await imageVariationUseCase( this.openai, imageVaritionDto );
    }

}
