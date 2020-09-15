import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.css']
})
export class RxjsComponent implements OnInit, OnDestroy {

  intervalSubs: Subscription;

  constructor() {

    // this.retornaObservable().pipe(
    //   retry(1)
    // ).subscribe( valor => {
    //   console.log('Subscripcion: ', valor);
    // }, err => {
    //   console.warn('error', err);
    // }, () => {
    //   console.log('complete');
    // });
    this.intervalSubs = this.retornaIntervalo().subscribe( console.log );
  }

  retornaIntervalo() {
    const interval$ = interval(100).
                        pipe(
                          //take(10),
                          map( valor => valor + 1 ),
                          filter( valor => ( valor % 2 === 0) ? true : false)
                        );

    return interval$;
  }

  retornaObservable(): Observable<number>{
    let i = -1;

    return new Observable<number>( observer => {

      const intervalo = setInterval(() => {

        i++;

        observer.next(i);

        if ( i === 3){
          clearInterval(intervalo);
          observer.complete();
        }

        if ( i === 2){
          observer.error('i llego al valor de 2');
        }

      }, 1000);

    });

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

}
