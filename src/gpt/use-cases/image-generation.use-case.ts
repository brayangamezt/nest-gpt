import * as fs from 'fs';
import * as path from 'path';

import OpenAI from "openai";
import { downloadBase64ImageAsPng, downloadImageAsPng } from "src/helpers";

interface Options{
    prompt:string;
    originalImage?:string;
    maskImage?:string;
}

export const imageGenerationUseCase = async(openai:OpenAI, options:Options) =>{
    const { prompt, originalImage, maskImage } = options;

    //verificar original image
    if( !originalImage || !maskImage ){

        //La response genera un objeto donde viene un URL que dirige a la imagen creada
        const response = await openai.images.generate({
            prompt:prompt,
            model:'dall-e-2',
            n:1,
            size:'1024x1024',
            quality:'standard',
            response_format:'url'
        });
    
        // console.log('muestra la ruta dirname: ', __dirname); C:\Users\BrayanGamez\Documents\frameworks\angular\openAI\02-nest-gpt\dist\gpt\use-cases
    
        //Guardar imagen en la carpeta de images
        const fileName = await downloadImageAsPng( response.data[0].url );
        const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

        console.log(response);
    
        return{
            url: url,
            localPath: response.data[0].url,
            revised_prompt:response.data[0].revised_prompt
        }
    }


    const pngImagePath = await downloadImageAsPng(originalImage, true);
    const maskPath = await downloadBase64ImageAsPng( maskImage, true );

    const response = await openai.images.edit({
        model:'dall-e-2',
        prompt:prompt,
        image: fs.createReadStream( pngImagePath ),
        mask: fs.createReadStream( maskPath ),
        n:1,
        size:'1024x1024',
        response_format:'url'
    });

    const fileName = await downloadImageAsPng( response.data[0].url );
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
        url: url,
        localPath: response.data[0].url,
    }
    
}