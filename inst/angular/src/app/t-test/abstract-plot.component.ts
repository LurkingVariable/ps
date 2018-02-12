import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';

import { PlotOptionsService } from './plot-options.service';
import { PaletteService } from './palette.service';
import { Range } from './range';

export enum Draw {
  No,
  Yes,
  Hover
}

export abstract class AbstractPlotComponent implements OnInit {
  @Input() name: string;
  @Input('fixed-width') fixedWidth: number;
  @Input('fixed-height') fixedHeight: number;

  title: string;
  xScale: any;
  yScale: any;
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: number = 50;
  unitLength: number = 20;

  @ViewChild('plot') plotElement: ElementRef;
  @ViewChild('unit') unitElement: ElementRef;

  constructor(public plotOptions: PlotOptionsService, public palette: PaletteService) { }

  ngOnInit() {
    this.setup();
  }

  getDimension(key: string): number {
    let dim = this.plotElement.nativeElement[key];
    let result = 0;
    if ('value' in dim) {
      result = dim.value;
    } else if ('baseVal' in dim) {
      result = dim.baseVal.value;
    } else {
      throw new Error(`can't get ${key}`);
    }
    return result;
  }

  protected translate(x: number, y: number): string {
    if (isNaN(x) || isNaN(y)) {
      return null;
    }
    return `translate(${x}, ${y})`;
  }

  protected getPath(data: any[], xName = "x", yName = "y"): string {
    let xScaleRange = this.xScale.domain().sort((a, b) => a - b);
    let yScaleRange = this.yScale.domain().sort((a, b) => a - b);
    let line = d3.line().
      x((d, i) => this.xScale(d[xName])).
      y((d, i) => this.yScale(d[yName])).
      defined((d, i) => {
        let x = d[xName];
        let y = d[yName];
        return typeof(x) === 'number' && typeof(y) == 'number' &&
          x >= xScaleRange[0] && x <= xScaleRange[1] &&
          y >= yScaleRange[0] && y <= yScaleRange[1];
      });

    return line(data);
  }

  protected setup(): void {
  }
}
