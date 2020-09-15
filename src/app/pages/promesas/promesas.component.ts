import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.getUsuario().then(usuarios => {
      console.log(usuarios);
    });
    // const promise = new Promise((resolve, reject) => {
    //   if(false){
    //     resolve('hola mundo');
    //   }else{
    //     reject('Algo salio mal')
    //   }
    // });

    // promise.then(resp => {
    //   console.log('Termine');
    // }).catch(err => {
    //   console.log(err);
    // });

    // console.log('fin del init');

  }

  getUsuario(){

    return new Promise( (resolve, reject) => {
      fetch('https://reqres.in/api/users?page=1')
      .then( resp => resp.json() )
      .then( body => resolve(body.data));
    });
  }

}
