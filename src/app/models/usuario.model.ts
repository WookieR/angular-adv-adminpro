import { environment } from '../../environments/environment.prod';
const base_url = environment.base_url;

export class Usuario{

    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public google?: boolean,
        public role?: 'USER_ROLE' | 'ADMIN_ROLE',
        public id?: string,
        public img?: string){
    }

    get imageUrl(){

        if (!this.img){
            return `${base_url}/upload/usuario/no-image`;
        } else if (this.img.includes('https')){
            return this.img;
        } else if (this.img){
            return `${base_url}/upload/usuario/${this.img}`;
        } else{
            return `${base_url}/upload/usuario/no-image`;
        }
    }

}
