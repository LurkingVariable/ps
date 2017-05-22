import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/merge';

import { TTest, TTestRanges, TTestSet } from '../t-test';
import { Range } from '../range';
import { PlotOptions } from '../plot-options';
import { TTestService } from '../t-test.service';

let plotTitles = {
  "n": "Sample Size",
  "power": "Power",
  "powerByDelta": "Power",
  "delta": "Detectable Alternative"
};

@Component({
  selector: 'app-output-pane',
  templateUrl: './output-pane.component.html',
  styleUrls: ['./output-pane.component.css']
})
export class OutputPaneComponent implements OnInit {
  @Input() selectedModelSet: Observable<TTestSet>;
  @Input() plotOptions: PlotOptions;
  modelSet: TTestSet;
  subscription: Subscription;

  @ViewChild('topLeftPlot') topLeftPlotElement: ElementRef;
  @ViewChild('topRightPlot') topRightPlotElement: ElementRef;
  @ViewChild('bottomPlot') bottomPlotElement: ElementRef;

  constructor(private ttestService: TTestService) {}

  ngOnInit(): void {
    this.selectedModelSet.subscribe(modelSet => {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.modelSet = modelSet;

      let obs = Observable.merge(modelSet.onChange, this.plotOptions.onChange);
      this.subscription = obs.
        debounceTime(100).
        subscribe(changes => {
          this.drawPlot();
        });
      this.drawPlot();
    });
  }

  onResize(): void {
    this.drawPlot();
  }

  drawPlot(): void {
    if (this.modelSet) {
      let data = this.modelSet.data;
      let ranges = this.modelSet.ranges;

      switch (this.modelSet.model.output) {
        case "n":
          this.drawLinePlot(this.topLeftPlotElement, data.power, ranges.power, "Power", data.n, ranges.n, "Sample Size");
          this.drawLinePlot(this.topRightPlotElement, data.delta, ranges.delta, "Detectable Alternative", data.n, ranges.n, "Sample Size");
          break;
        case "power":
          this.drawLinePlot(this.topLeftPlotElement, data.n, ranges.n, "Sample Size", data.power, ranges.power, "Power");
          this.drawLinePlot(this.topRightPlotElement, data.delta, ranges.delta, "Detectable Alternative", data.powerByDelta, ranges.power, "Power", "x");
          break;
        case "delta":
          this.drawLinePlot(this.topLeftPlotElement, data.n, ranges.n, "Sample Size", data.delta, ranges.delta, "Detectable Alternative");
          this.drawLinePlot(this.topRightPlotElement, data.power, ranges.power, "Power", data.delta, ranges.delta, "Detectable Alternative");
          break;
      }
      this.drawBottomPlot();
    }
  }

  private drawLinePlot(elementRef: ElementRef, xData: any, xRange: Range, xTitle: string, yData: any, yRange: Range, yTitle: string, which = "y"): void {
    // clear existing graph
    let element = elementRef.nativeElement;
    element.innerHTML = "";

    let ranges = this.modelSet.ranges;
    let data = this.modelSet.data;

    // set dimensions
    let margin2 = 100, margin = 50;
    let width = 0;
    if ('value' in element.width) {
      width = element.width.value;
    } else if ('baseVal' in element.width) {
      width = element.width.baseVal.value;
    } else {
      throw new Error("can't get width");
    }
    width -= margin2;

    let height = 0;
    if ('value' in element.height) {
      height = element.height.value;
    } else if ('baseVal' in element.height) {
      height = element.height.baseVal.value;
    } else {
      throw new Error("can't get height");
    }
    height -= margin2;

    let svg = d3.select(element);

    if (this.plotOptions.fontFamily != "") {
      svg.style("font-family", this.plotOptions.fontFamily);
    }
    svg.style("font-size", `${this.plotOptions.fontSize * 100}%`);

    // append clip paths
    let defs = svg.append('defs');
    let clipPathId = svg.attr('class') + '-plot-area';
    defs.append("clipPath").
      attr("id", clipPathId).
      append("rect").
      attr("x", 0).
      attr("y", 0).
      attr("width", width).
      attr("height", height);

    // compute scales
    let x = d3.scaleLinear().
      domain(xRange.toArray()).
      range([0, width]);

    let y = d3.scaleLinear().
      domain(yRange.toArray().reverse()).
      range([0, height]);

    // append axes
    let xAxis = d3.axisBottom(x).ticks(6);
    svg.append("g").
      attr("transform", `translate(${margin},${height + margin})`).
      call(xAxis);

    let yAxis = d3.axisLeft(y).ticks(6);
    svg.append("g").
      attr("transform", `translate(${margin},${margin})`).
      call(yAxis);

    // append labels
    let yLabel = svg.append("text").
      attr("x", 0).
      attr("y", 0).
      attr("dy", "1em").
      attr("class", "axis-label").
      style("text-anchor", "middle").
      text(yTitle);
    let yLabelYOffset = height / 2 + margin;
    yLabel.
      attr("transform", `translate(0,${yLabelYOffset}) rotate(-90)`);

    let xLabel = svg.append("text").
      attr("x", 0).
      attr("y", 0).
      attr("dy", "2.5em").
      attr("class", "axis-label").
      style("text-anchor", "middle").
      text(xTitle);
    let xLabelXOffset = width / 2 + margin;
    let xLabelYOffset = height + margin;
    xLabel.
      attr("transform", `translate(${xLabelXOffset},${xLabelYOffset})`);

    // append title
    let title = svg.append("text").
      attr("x", 0).
      attr("y", 0).
      attr("dy", "2em").
      attr("class", "title").
      style("text-anchor", "middle").
      text(`${yTitle} vs. ${xTitle}`);
    let titleBBox = title.node().getBBox();
    let titleXOffset = width / 2 + margin;
    title.
      attr("transform", `translate(${titleXOffset},0)`);

    // append main line
    let points;
    if (which == "x") {
      points = xData.values.map((xValue, i) => {
        return { x: xValue, y: yData.values[0][i] };
      });
    } else if (which == "y") {
      points = xData.values[0].map((xValue, i) => {
        return { x: xValue, y: yData.values[i] };
      });
    }

    let line = d3.line().
      x((d, i) => x(d.x)).
      y((d, i) => y(d.y));
    let group = svg.append("g").
      attr("transform", `translate(${margin},${margin})`);
    group.append("path").
      attr("class", "line").
      attr("clip-path", `url(#${clipPathId})`).
      style("stroke-width", this.plotOptions.lineWidth).
      attr("d", line(points));

    // append drop lines
    points = [
      { x: xRange.min, y: yData.target },
      { x: xData.target, y: yData.target }
    ];
    line = d3.line().
      x((d, i) => x(d.x)).
      y((d, i) => y(d.y));
    svg.append("g").
      attr("transform", `translate(${margin},${margin})`).
      append("path").
      attr("clip-path", `url(#${clipPathId})`).
      attr("class", "drop-line").
      style("stroke-width", this.plotOptions.lineWidth / 2).
      attr("d", line(points));

    points = [
      { x: xData.target, y: yRange.min },
      { x: xData.target, y: yData.target }
    ];
    line = d3.line().
      x((d, i) => x(d.x)).
      y((d, i) => y(d.y));
    svg.append("g").
      attr("transform", `translate(${margin},${margin})`).
      append("path").
      attr("class", "drop-line").
      attr("clip-path", `url(#${clipPathId})`).
      style("stroke-width", this.plotOptions.lineWidth / 2).
      attr("d", line(points));

    // append target point
    let circle = svg.append("circle").
      attr("r", 5).
      attr("cx", x(xData.target)).
      attr("cy", y(yData.target)).
      attr("clip-path", `url(#${clipPathId})`).
      attr("class", "target").
      attr("transform", `translate(${margin},${margin})`);
    circle.append("title").text(`Target: (${xData.target}, ${yData.target})`);
  }

  private drawBottomPlot(): void {
    // clear existing graph
    let element = this.bottomPlotElement.nativeElement;
    element.innerHTML = "";

    let data = this.modelSet.data;
    let ranges = this.modelSet.ranges;

    // set dimensions
    let margin2 = 100, margin = 50;
    let width = 0;
    if ('value' in element.width) {
      width = element.width.value;
    } else if ('baseVal' in element.width) {
      width = element.width.baseVal.value;
    } else {
      throw new Error("can't get width");
    }
    width -= margin2;

    let height = 0;
    if ('value' in element.height) {
      height = element.height.value;
    } else if ('baseVal' in element.height) {
      height = element.height.baseVal.value;
    } else {
      throw new Error("can't get height");
    }
    height -= margin2;

    let svg = d3.select(element);

    if (this.plotOptions.fontFamily != "") {
      svg.style("font-family", this.plotOptions.fontFamily);
    }
    svg.style("font-size", `${this.plotOptions.fontSize * 100}%`);

    // append clip paths
    let defs = svg.append('defs');
    defs.append("clipPath").
      attr("id", "bottom-plot-area").
      append("rect").
      attr("x", 0).
      attr("y", 0).
      attr("width", width).
      attr("height", height);

    // compute scales
    let x = d3.scaleLinear().
      domain(ranges.pSpace.toArray()).
      range([0, width]);

    let y = d3.scaleLinear().range([0, height]);

    // append axes
    let xAxis = d3.axisBottom(x);
    svg.append("g").
      attr("transform", `translate(${margin},${height + margin})`).
      call(xAxis);

    // append axes labels
    let xLabel = svg.append("text").
      attr("x", 0).
      attr("y", 0).
      attr("dy", "2.5em").
      attr("class", "axis-label").
      style("text-anchor", "middle").
      text("Parameter Space");
    let xLabelXOffset = width / 2 + margin;
    let xLabelYOffset = height + margin;
    xLabel.
      attr("transform", `translate(${xLabelXOffset},${xLabelYOffset})`);

    // append title
    let title = svg.append("text").
      attr("x", 0).
      attr("y", 0).
      attr("dy", "2em").
      attr("class", "title").
      style("text-anchor", "middle").
      text("Precision vs. Effect size");
    let titleBBox = title.node().getBBox();
    let titleXOffset = width / 2 + margin;
    title.
      attr("transform", `translate(${titleXOffset},0)`);

    // append ab line
    let points = [
      { x: ranges.pSpace.min, y: 0.5 },
      { x: ranges.pSpace.max, y: 0.5 }
    ];
    let line = d3.line().
      x((d, i) => x(d.x)).
      y((d, i) => y(d.y));

    svg.append("g").
      attr("transform", `translate(${margin},${margin})`).
      append("path").
      attr("clip-path", "url(#bottom-plot-area)").
      attr("class", "ab-line").
      style("stroke-width", this.plotOptions.lineWidth / 4).
      attr("d", line(points));

    // append main line
    points = [
      { x: data.pSpace.values[0], y: 0.5 },
      { x: data.pSpace.values[1], y: 0.5 }
    ];
    line = d3.line().
      x((d, i) => x(d.x)).
      y((d, i) => y(d.y));

    svg.append("g").
      attr("transform", `translate(${margin},${margin})`).
      append("path").
      attr("clip-path", "url(#bottom-plot-area)").
      attr("class", "pspace-line").
      style("stroke-width", this.plotOptions.lineWidth).
      attr("d", line(points));

    // append left bracket line
    points = [
      { x: data.pSpace.values[0], y: 0.3 },
      { x: data.pSpace.values[0], y: 0.7 }
    ];
    line = d3.line().
      x((d, i) => x(d.x)).
      y((d, i) => y(d.y));

    svg.append("g").
      attr("transform", `translate(${margin},${margin})`).
      append("path").
      attr("clip-path", "url(#bottom-plot-area)").
      attr("class", "pspace-line").
      style("stroke-width", this.plotOptions.lineWidth).
      attr("d", line(points));

    // append right bracket line
    points = [
      { x: data.pSpace.values[1], y: 0.3 },
      { x: data.pSpace.values[1], y: 0.7 }
    ];
    line = d3.line().
      x((d, i) => x(d.x)).
      y((d, i) => y(d.y));

    svg.append("g").
      attr("transform", `translate(${margin},${margin})`).
      append("path").
      attr("clip-path", "url(#bottom-plot-area)").
      attr("class", "pspace-line").
      style("stroke-width", this.plotOptions.lineWidth).
      attr("d", line(points));

    // append center point
    let circle = svg.append("circle").
      attr("r", 3).
      attr("cx", x(0)).
      attr("cy", y(0.5)).
      attr("clip-path", "url(#bottom-plot-area)").
      attr("class", "pspace-center").
      attr("transform", `translate(${margin},${margin})`);

    // append target point
    circle = svg.append("circle").
      attr("r", 5).
      attr("cx", x(data.pSpace.target)).
      attr("cy", y(0.5)).
      attr("clip-path", "url(#bottom-plot-area)").
      attr("class", "pspace-target").
      attr("transform", `translate(${margin},${margin})`);
    circle.append("title").text(`Target: ${data.pSpace.target}`);
  }
}
