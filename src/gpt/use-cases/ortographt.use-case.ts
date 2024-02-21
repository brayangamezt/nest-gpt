import OpenAI from "openai";

interface Options{
    prompt:string
}

export const ortographyCheckUseCase = async( openai:OpenAI ,options:Options )=>{

    const { prompt } = options;

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: `
                Te serán proveídos textos en español con posibles errores ortográficos y gramaticales,
                Las palabras usadas deben de existir en el diccionario de la Real Academia Española,
                Debes de responder en formato JSON, 
                tu tarea es corregirlos y retornar información soluciones,

                Si no hay errores, debes de retornar un mensaje de felicitaciones.

                Ejemplo de salida:
                {
                    userScore: number, // asignar 100 si no encontraron errores
                    errors: string[], // ['error -> solución']
                    message:string, // usa emojis y exto para felicitar al usuario
                }
            `},
            { role:"user", content:prompt}
        ],
        model: "gpt-3.5-turbo",
        temperature:0.3, //Esto es para poder dar respuestas mas precisas, entre mas cerca al cero, mas precisa la respuesta
        max_tokens:150
    });

    const jsonResponse = JSON.parse( completion.choices[0].message.content );

    return jsonResponse;
}

// Tambien siempre debes de dar un porcentaje (userScore) de acierto del 0 al 100 asignando como 100 cuando no se encuentran errores.