interface MedicoUser{
    _id: string;
    nombre: string;
    email: string;
}

interface MedicoHospital{
    _id: string;
    nombre: string;
}

export class Medico{

    constructor(
        public nombre: string,
        public _id?: string,
        public img?: string,
        public usuario?: MedicoUser,
        public hospital?: MedicoHospital
        ){
    }
}