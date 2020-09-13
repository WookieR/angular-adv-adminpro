import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

  public labels1: string[] = [ 'Puto', 'Trolo', 'Tragasable' ];
  public data1 = [
    [100, 100, 100],
  ];

  public labels2: string[] = [ 'Hermana', 'Prima', 'Madre' ];
  public data2 = [
    [300, 100, 1000],
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
