import { IsString } from "class-validator";


export class ImageVaritionDto{

    @IsString()
    readonly baseImage:string;
}