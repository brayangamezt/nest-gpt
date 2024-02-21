import * as path from "path";
import * as fs from 'fs';
import OpenAI from "openai";


interface Options{
    prompt:string,
    voice?:string;
}


export const textToAudioUseCase = async( textToAudio:Options, openai:OpenAI ) =>{

    const { prompt, voice } = textToAudio;

    const voices = {
        'nova':'nova',
        'alloy':'alloy',
        'echo' :'echo',
        'fable':'fable',
        'onyx' :'onyx',
        'shimmer':'shimmer'
    }
    const selectedVoice = voices[voice] ?? 'nova';

    //Mantener todos los audios generados en el backend se guardaran en carpeta
    //La ruta de este __dirname es: C:\Users\BrayanGamez\Documents\frameworks\angular\openAI\02-nest-gpt\dist\gpt\use-cases
    const folderPath = path.resolve(__dirname,'../../../generated/audios' );
    const speechFile = path.resolve(`${ folderPath }/${new Date().getTime()}.mp3`);

    fs.mkdirSync( folderPath, { recursive:true } ); //Recursive es para crear el directorio en caso de que no exista

    //Generar el MP3
    const mp3 = await openai.audio.speech.create({
        model:'tts-1',
        voice:selectedVoice,
        input:prompt,
        response_format:'mp3'
    });

    // console.log('Este es el contenido MP3: ', mp3);

    const buffer = Buffer.from( await mp3.arrayBuffer() );
    // console.log('Informacion del buffer: ', buffer);

    fs.writeFileSync( speechFile, buffer );

    return speechFile;
}