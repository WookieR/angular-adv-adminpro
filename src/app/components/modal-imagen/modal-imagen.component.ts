import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor( public modalImagenService: ModalImagenService, public fileUpload: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen(file: File){
    this.imagenSubir = file;

    if (!file){
      return this.imgTemp = null;
    }

    const reader = new FileReader();

    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  subirImagen(){

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUpload.actualizarFoto(this.imagenSubir, tipo, id).then( img => {
      Swal.fire('Guardado', 'Los cambios fueron guardados', 'success');
      this.modalImagenService.nuevaImagen.emit(img);
      this.cerrarModal();
    }, err => {
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    });
  }

}
