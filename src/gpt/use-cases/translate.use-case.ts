import OpenAI from "openai";

interface Options{
    prompt:string,
    lang:string
}

export const translateUseCase = async( openai:OpenAI, options: Options) =>{
    const { prompt, lang } = options;

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: `Traduce el siguiente texto al idioma ${prompt}:${lang}`},
            // { role:"user", content:prompt}
        ],
        model: "gpt-3.5-turbo",
        temperature:0.3, //Esto es para poder dar respuestas mas precisas, entre mas cerca al cero, mas precisa la respuesta
        // max_tokens:150
    });

    return{
        translation: completion.choices[0].message.content
    }

}