import {
  Component, Input, OnInit, OnChanges, SimpleChanges, AfterViewChecked,
  ViewChild, ElementRef, ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as d3 from 'd3';

import { AbstractPlotComponent } from '../abstract-plot.component';
import { TTestSet } from '../t-test';
import { Range } from '../range';
import { PaletteService } from '../palette.service';

interface Group { mainPaths: string[], distPath: string, target: number };

@Component({
  selector: 'app-bottom-plot',
  templateUrl: './bottom-plot.component.html',
  styleUrls: ['./bottom-plot.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BottomPlotComponent extends AbstractPlotComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() modelSet: TTestSet;

  @ViewChild('unit') unitElement: ElementRef;
  @ViewChild('bottomAxis') bottomAxisElement: ElementRef;

  margin: number = 50;
  clipPathId: string;
  width: number;
  height: number;
  xScale: any;
  yScale: any;
  yScaleSD: any;
  groups: Group[];
  needDraw: boolean;
  private subscription: Subscription;

  constructor(public palette: PaletteService) {
    super();
    this.title = "Precision vs. Effect Size";
  }

  ngOnInit() {
    this.clipPathId = `${this.name}-plot-area`;
    this.plotOptions.onChange.subscribe(() => { this.compute(); } );
    this.compute();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.modelSet) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      if (this.modelSet) {
        let callback = () => { this.compute(); };
        let ranges = this.modelSet.ranges;
        this.subscription = this.modelSet.onCompute.subscribe(callback);
        this.subscription.add(ranges.onChange.subscribe(callback));
        this.compute();
      }
    }
  }

  ngAfterViewChecked(): void {
    this.draw();
  }

  onResize(): void {
    this.compute();
  }

  redraw(): void {
    this.compute();
  }

  private compute(): void {
    if (!this.modelSet) {
      return;
    }

    // margin
    let unitBox = this.unitElement.nativeElement.getBBox();
    if (unitBox && unitBox.width) {
      this.margin = unitBox.width * 2 + (20 * this.plotOptions.axisFontSize);
    }

    // dimensions
    this.width  = this.getDimension('width')  - (this.margin * 2);
    this.height = this.getDimension('height') - (this.margin * 2);

    let ranges = this.modelSet.ranges;
    let data = this.modelSet.data.map(d => d.tertiary);

    // compute scales
    this.xScale = d3.scaleLinear().
      domain(ranges.pSpace.toArray()).
      range([0, this.width]);

    this.yScale = d3.scaleLinear().
      domain([0, 0.8]).
      range([0, this.height]);

    let sampDistExtent = data.reduce((arr, subData) => {
      let extent = d3.extent(subData.data, d => d.sampDist);
      return d3.extent(arr.concat(extent));
    }, []);
    this.yScaleSD = d3.scaleLinear().
      domain(sampDistExtent.reverse()).
      range([0, this.yScale(0.5)]);

    this.groups = data.reverse().map(subData => {
      // sample distribution
      let distPath = this.getArea(subData.data, 'pSpace', 'sampDist');

      // main lines
      let leftLimit = subData.range[0];
      let rightLimit = subData.range[1];
      let points = [
        subData.range.map((xValue, i) => {
          return { x: xValue, y: 0.5 };
        }),
        [
          { x: leftLimit, y: 0.35 },
          { x: leftLimit, y: 0.65 }
        ],
        [
          { x: rightLimit, y: 0.35 },
          { x: rightLimit, y: 0.65 }
        ]
      ];
      let mainPaths = points.map(data => this.getPath(data));

      let result = {
        mainPaths: mainPaths,
        distPath: distPath,
        target: subData.target
      }
      return result;
    });

    this.needDraw = true;
  }

  private draw(): void {
    if (!this.needDraw) {
      return;
    }

    // axes (drawn by d3)
    let xAxis = d3.axisBottom(this.xScale).ticks(6);
    d3.select(this.bottomAxisElement.nativeElement).
      call(xAxis).
      attr("font-size", 15 * this.plotOptions.axisFontSize).
      attr("stroke-width", this.plotOptions.axisLineWidth * 1.5);

    this.needDraw = false;
  }

  private clipPath(): string {
    return `url(#${this.clipPathId})`;
  }

  private getArea(points: any[], xName: string, yName: string): string {
    let area = d3.area().
      x((d, i) => this.xScale(d[xName])).
      y0(this.yScaleSD(0)).
      y1((d, i) => this.yScaleSD(d[yName]));

    return area(points);
  }
}
