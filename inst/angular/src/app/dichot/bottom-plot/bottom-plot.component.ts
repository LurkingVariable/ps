import {
  Component, Input, Output, OnChanges, SimpleChanges, AfterViewChecked,
  ViewChild, ElementRef, ViewEncapsulation, EventEmitter
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import * as d3 from 'd3';
import * as stableSort from 'stable';

import { AbstractPlotComponent, Draw } from '../../abstract-plot.component';
import { Project } from '../project';
import { DichotExpressed, DichotCI } from '../dichot';
import { Range } from '../../range';
import { PlotOptionsService } from '../../plot-options.service';
import { PaletteService } from '../../palette.service';

interface Group {
  index: number;
  id: string;
  leftPath: string;
  centerPath: string;
  rightPath: string;
  distPath: string;
  left: number;
  originalTarget: number;
  target: number;
  right: number;
  label: string;
  color: string;
  fillOpacity: number;
  strokeOpacity: number;
  primary: boolean;
  sym: string;
  leftCI?: DichotCI[];
  rightCI?: DichotCI[];
  newN: number;
};

enum CIBar {
  Left,
  Right
};

@Component({
  selector: 'dichot-bottom-plot',
  templateUrl: './bottom-plot.component.html',
  styleUrls: ['./bottom-plot.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BottomPlotComponent extends AbstractPlotComponent implements OnChanges, AfterViewChecked {
  @Input('project') project: Project;
  @Input('disable-drag-target') disableDragTarget = false;
  @Input('disable-drag-ci') disableDragCI = false;
  @Output() modelChanged = new EventEmitter();

  xAxisTitle = "Parameter Space";
  nullValue: number;

  leftMargin: number = 10;
  rightMargin: number = 10;
  topMargin: number = 50;
  bottomMargin: number = 50;
  viewBox: string;

  yScaleSD: any;
  mainGroup: Group;
  groups: Group[];
  needDraw = Draw.No;

  // target dragging
  targetDragging = false;
  showTargetInfo = false;

  // bar dragging
  barDragging = false;
  showLeftBarInfo = false;
  showRightBarInfo = false;

  constructor(
    public plotOptions: PlotOptionsService,
    public palette: PaletteService
  ) {
    super(plotOptions, palette);
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      this.setup();
    }, 1);
  }

  ngAfterViewChecked(): void {
    this.draw();
  }

  redraw(): void {
    this.setup();
  }

  toggleTargetInfo(value: boolean): void {
    if (!this.targetDragging && !this.barDragging) {
      this.showTargetInfo = value;
      if (value) {
        this.needDraw = Draw.Hover;
      }
    }
  }

  toggleLeftBarInfo(value: boolean): void {
    if (!this.targetDragging && !this.barDragging) {
      this.showLeftBarInfo = value;
      if (value) {
        this.needDraw = Draw.Hover;
      }
    }
  }

  toggleRightBarInfo(value: boolean): void {
    if (!this.targetDragging && !this.barDragging) {
      this.showRightBarInfo = value;
      if (value) {
        this.needDraw = Draw.Hover;
      }
    }
  }

  getColor(index: number): string {
    return this.palette.getColor(index, this.plotOptions.paletteTheme);
  }

  trackByGroupId(index: number, group: Group): any {
    return group.id;
  }

  private setupDimensions(): boolean {
    // dimensions
    if (this.fixedWidth) {
      this.width = this.fixedWidth;
    } else {
      this.width = this.getDimension('width');
      if (this.width == 0) {
        // window isn't ready to draw
        return false;
      }
    }
    if (this.fixedHeight) {
      this.height = this.fixedHeight;
    } else {
      this.height = this.getDimension('height');
      if (this.height == 0) {
        // window isn't ready to draw
        return false;
      }
    }
    // margin
    this.topMargin = this.plotOptions.getFontSize() + 20;
    this.bottomMargin = 10 + this.plotOptions.getFontSize() +
      this.plotOptions.getAxisLineWidth() +         // x axis line width
      (this.plotOptions.getAxisFontSize() / 2) + 9; // x axis tick (font + tick)
    this.leftMargin = this.plotOptions.getAxisFontSize() + 9;
    this.rightMargin = this.leftMargin;

    this.viewBox = `0 0 ${this.width} ${this.height}`;
    this.innerWidth  = this.width  - this.leftMargin - this.rightMargin;
    this.innerHeight = this.height - this.topMargin - this.bottomMargin;

    return true;
  }

  protected setup(): boolean {
    if (!this.project || !this.project.pSpaceRange) {
      return false;
    }

    this.setupTitle();
    if (!this.setupDimensions()) {
      return false;
    }
    this.setupScales();
    this.setupGroups();
    this.setupNullValue();
    this.resetDragging();

    this.needDraw = Draw.Yes;
    return true;
  }

  private setupTitle(): void {
    this.title = `Precision (95% Confidence Interval) and Effect Size`;

    let param = this.project.getDetAltParam();
    switch (param) {
      case 'psi':
      case 'psiAlt':
        this.xAxisTitle = "Odds ratio of exposure (ψ)";
        break;

      case 'p1':
      case 'p1Alt':
        this.xAxisTitle = "Probability of the outcome for an experimental patient (p₁)";
        break;

      case 'r':
      case 'rAlt':
        this.xAxisTitle = "Relative risk of failure for experimental subjects relative to controls (R)";
        break;
    }
  }

  private setupScales(): void {
    let pSpaceRange = this.project.pSpaceRange;
    this.xScale = d3.scaleLinear().
      domain(pSpaceRange.toArray()).
      range([0, this.innerWidth]);

    this.yScale = d3.scaleLinear().
      domain([0, 0.7]).
      range([0, this.innerHeight]);

    let sampDistExtent = this.project.models.reduce((arr, model) => {
      let extent = d3.extent(model.sampDist, d => d.y);
      return d3.extent(arr.concat(extent));
    }, []);
    this.yScaleSD = d3.scaleLinear().
      domain(sampDistExtent.reverse()).
      range([0, this.yScale(0.5)]).
      clamp(true);
  }

  private setupGroups(): void {
    this.groups = this.project.models.map((model, i) => {
      let ci = model.getCI();

      // main lines
      let leftLimit = ci[0];
      let leftPath = this.getPath([
        { x: leftLimit, y: 0.40 },
        { x: leftLimit, y: 0.60 }
      ], 'x', 'y', false);

      let rightLimit = ci[1];
      let rightPath = this.getPath([
        { x: rightLimit, y: 0.40 },
        { x: rightLimit, y: 0.60 }
      ], 'x', 'y', false);

      let centerPath = this.getPath([
        { x: leftLimit, y: 0.5 },
        { x: rightLimit, y: 0.5 }
      ], 'x', 'y', false);

      // sample distribution
      let distPath = this.getArea(model.sampDist, 'x', 'y');

      let param = this.project.getDetAltParam();
      let sym = "";
      switch (param) {
        case 'psi':
        case 'psiAlt':
          sym = "ψ";
          break;
        case 'p1':
        case 'p1Alt':
          sym = "p₁";
          break;

        case 'r':
        case 'rAlt':
          sym = "R";
          break;
      }

      let target = model.getCITarget();
      let result = {
        index: i,
        id: `${this.name}-group-${i}`,
        leftPath: leftPath,
        centerPath: centerPath,
        rightPath: rightPath,
        distPath: distPath,
        left: leftLimit,
        originalTarget: target,
        target: target,
        right: rightLimit,
        label: "95% CI",
        color: this.getColor(i),
        fillOpacity: 0.5,
        strokeOpacity: 0.9,
        primary: this.project.selectedIndex == i,
        sym: sym,
        leftCI: stableSort(
          model.confidenceIntervals,
          (a, b) => d3.ascending(a.ci1, b.ci1)
        ),
        rightCI: stableSort(
          model.confidenceIntervals,
          (a, b) => d3.ascending(a.ci2, b.ci2)
        )
      } as Group;
      return result;
    });

    // order group in reverse so that they are drawn properly, put the selected
    // group at the end
    stableSort.inplace(
      this.groups,
      (a, b) => {
        if (a.primary) return 1;
        if (b.primary) return -1;
        return d3.descending(b.index, a.index);
      }
    );
    this.mainGroup = this.groups[this.groups.length - 1];
  }

  private setupNullValue(): void {
    let model = this.project.getModel(0);
    switch (model.expressed) {
      case DichotExpressed.TwoProportions:
        this.nullValue = model.p0
        break;

      case DichotExpressed.OddsRatio:
      case DichotExpressed.RelativeRisk:
        this.nullValue = 1;
        break;

      default:
        this.nullValue = undefined;
    }
  }

  private resetDragging(): void {
    this.targetDragging = false;
    this.barDragging = false;
  }

  private draw(): void {
    if (this.needDraw == Draw.No) {
      return;
    }

    this.drawInfoBox('left');
    this.drawInfoBox('right');
    this.drawInfoBox('target');

    if (this.needDraw == Draw.Hover) {
      this.needDraw = Draw.No;
      return;
    }

    let svg = d3.select(this.plotElement.nativeElement);
    let t = d3.transition();

    // axes (drawn by d3)
    let xAxis = d3.axisBottom(this.xScale).ticks(Math.floor(this.innerWidth / 75));
    svg.select(`#${this.name}-bottom-axis`).
      transition(t).
      call(xAxis).
      attr("font-size", 15 * this.plotOptions.axisFontSize).
      attr("stroke-width", this.plotOptions.axisLineWidth * 1.5);

    // alternate groups
    this.groups.forEach((group, index) => {
      let id = `#${group.id}`;
      svg.select(id).
        transition(t).
        attr('transform', this.translate(this.leftMargin, this.topMargin));
      svg.select(`${id}-dist`).transition(t).attr('d', group.distPath);
      svg.select(`${id}-center`).transition(t).attr('d', group.centerPath);
      svg.select(`${id}-left`).transition(t).attr('d', group.leftPath);
      svg.select(`${id}-right`).transition(t).attr('d', group.rightPath);
      svg.select(`${id}-target`).
        transition(t).
        attr('cx', this.xScale(group.target)).
        attr('cy', this.yScale(0.5));
    });

    // make target point draggable
    let target = d3.select(`#${this.mainGroup.id}-target`);
    let targetDrag = d3.drag().
      container(target.node().parentNode.parentNode).
      on("start", this.dragTargetStart.bind(this)).
      on("drag", this.dragTarget.bind(this)).
      on("end", this.dragTargetEnd.bind(this));
    target.call(targetDrag);

    // make left bar draggable
    let leftBar = d3.select(`#${this.mainGroup.id}-left`);
    let leftBarDrag = d3.drag().
      container(leftBar.node().parentNode.parentNode).
      on("start", this.dragBarStart.bind(this, CIBar.Left)).
      on("drag", this.dragBar.bind(this, CIBar.Left)).
      on("end", this.dragBarEnd.bind(this, CIBar.Left));
    leftBar.call(leftBarDrag);

    // make right bar draggable
    let rightBar = d3.select(`#${this.mainGroup.id}-right`);
    let rightBarDrag = d3.drag().
      container(rightBar.node().parentNode.parentNode).
      on("start", this.dragBarStart.bind(this, CIBar.Right)).
      on("drag", this.dragBar.bind(this, CIBar.Right)).
      on("end", this.dragBarEnd.bind(this, CIBar.Right));
    rightBar.call(rightBarDrag);

    this.needDraw = Draw.No;
  }

  private drawInfoBox(which: string): void {
    let svg = d3.select(this.plotElement.nativeElement);
    let box = svg.select(`#${this.name}-${which}-box`);
    let coords = svg.select(`#${this.name}-${which}-coords`);
    if (box.size() > 0 && coords.size() > 0) {
      let dim = coords.node().getBBox();
      let left = dim.x - 5, right = dim.x + dim.width + 5;
      let unit = dim.width / 16;
      let lmid = left + (7 * unit) + 5, rmid = left + (9 * unit) + 5;
      let mid = left + (8 * unit) + 5;
      let top = dim.y - 5, bottom = dim.y + dim.height + 5;
      box.attr("d", d3.line()([
        [left, top], [right, top], [right, bottom],
        [rmid, bottom], [mid, bottom + 5], [lmid, bottom],
        [left, bottom], [left, top]
      ]));
    }
  }

  ci(): number[] {
    return [this.mainGroup.left, this.mainGroup.right];
  }

  ciWidth(): number {
    return Math.abs(this.mainGroup.right - this.mainGroup.left);
  }

  private getArea(points: any[], xName: string, yName: string): string {
    let area = d3.area().curve(d3.curveBasis).
      x((d, i) => this.xScale(d[xName])).
      y0(this.yScaleSD(0)).
      y1((d, i) => this.yScaleSD(d[yName]));

    return area(points);
  }

  private dragTargetStart(): void {
    if (this.disableDragTarget) return;

    this.targetDragging = true;
    this.mainGroup.fillOpacity = 0.1;
    this.mainGroup.strokeOpacity = 0.1;
  }

  private dragTarget(event: any): void {
    if (this.disableDragTarget) return;

    let mouseX = d3.event.x - this.leftMargin;
    let x = this.xScale.invert(mouseX);
    if (x >= 0 && x < 0.1) {
      x = 0.1;
      mouseX = this.xScale(x);
    } else if (x < 0 && x > -0.1) {
      x = -0.1;
      mouseX = this.xScale(x);
    }

    let offset = mouseX - this.xScale(this.mainGroup.originalTarget);
    let g = d3.select(`#${this.mainGroup.id}`).
      attr('transform', this.translate(this.leftMargin + offset, this.topMargin));
    this.mainGroup.target = x;

    this.needDraw = Draw.Hover;
  }

  private dragTargetEnd(): void {
    if (this.disableDragTarget) return;

    if (this.project) {
      let param = this.project.getDetAltParam();
      let newDetAlt = this.mainGroup.target;
      this.project.updateModel(this.project.selectedIndex, param, newDetAlt).subscribe(() => {
        this.modelChanged.emit();
      });
    }
    this.showTargetInfo = false;
  }

  private dragBarStart(which: CIBar): void {
    if (this.disableDragCI) return;

    this.barDragging = true;
  }

  private dragBar(which: CIBar, event: any): void {
    if (this.disableDragCI) return;

    let mouseX = d3.event.x - this.leftMargin;
    let x = this.xScale.invert(mouseX);

    let bisector, ciData;
    switch (which) {
      case CIBar.Left:
        ciData = this.mainGroup.leftCI;
        bisector = d3.bisector(data => data.ci1).left;
        break;

      case CIBar.Right:
        ciData = this.mainGroup.rightCI;
        bisector = d3.bisector(data => data.ci2).left;
        break;
    }
    let index = bisector(ciData, x);
    if (!index) return;
    if (index >= ciData.length) {
      index = ciData.length - 1;
    }

    let ci = ciData[index];
    this.mainGroup.left = ci.ci1;
    this.mainGroup.right = ci.ci2;
    this.mainGroup.newN = ci.n;
    let model = this.project.getModel(this.project.selectedIndex);
    model.n = ci.n;

    // redraw lines
    let leftPath = this.getPath([
      { x: this.mainGroup.left, y: 0.40 },
      { x: this.mainGroup.left, y: 0.60 }
    ], 'x', 'y', false);

    let rightPath = this.getPath([
      { x: this.mainGroup.right, y: 0.40 },
      { x: this.mainGroup.right, y: 0.60 }
    ], 'x', 'y', false);

    let centerPath = this.getPath([
      { x: this.mainGroup.left, y: 0.5 },
      { x: this.mainGroup.right, y: 0.5 }
    ], 'x', 'y', false);

    let svg = d3.select(this.plotElement.nativeElement);
    svg.select(`#${this.mainGroup.id}-left`).attr('d', leftPath);
    svg.select(`#${this.mainGroup.id}-right`).attr('d', rightPath);
    svg.select(`#${this.mainGroup.id}-center`).attr('d', centerPath);

    this.needDraw = Draw.Hover;
  }

  private dragBarEnd(which: CIBar): void {
    if (this.disableDragCI) return;

    if (this.project && this.mainGroup.newN) {
      this.project.updateModel(this.project.selectedIndex, 'n', this.mainGroup.newN).subscribe(() => {
        this.modelChanged.emit();
      });
    }
    this.showLeftBarInfo = false;
    this.showRightBarInfo = false;
  }
}