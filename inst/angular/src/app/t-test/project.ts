import { Observable, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import * as d3 from 'd3';
import * as stableSort from 'stable';

import { Range } from '../range';
import { Point } from '../point';
import { AbstractProject } from '../abstract-project';
import { LinePlotHandler } from '../line-plot-handler';
import { CIPlotHandler } from '../ci-plot-handler';
import { TTest, TTestKind, TTestAttribs } from './t-test';
import { TTestService, PlotDataRanges, PlotDataResponse } from './t-test.service';
import { TTestLinePlotHandler } from './t-test-line-plot-handler';
import { TTestCIPlotHandler } from './t-test-ci-plot-handler';

export class Project extends AbstractProject {
  kind: TTestKind;
  models: TTest[] = [];
  selectedIndex: number = 0;
  changeHistory: any[] = [];

  nRange?: Range;
  powerRange?: Range;
  deltaRange?: Range;
  pSpaceRange?: Range;

  previousRanges: {
    nRange?: Range;
    powerRange?: Range;
    deltaRange?: Range;
    pSpaceRange?: Range;
  };

  constructor(private ttestService: TTestService) {
    super();
  }

  getOutput(): string {
    if (this.models.length > 0) {
      return this.models[0].output;
    }
    return '';
  }

  updatePlotData(): Observable<any> {
    this.updatingPlotData.emit();
    let ranges = {
      nRange: this.nRange,
      powerRange: this.powerRange,
      deltaRange: this.deltaRange,
      pSpaceRange: this.pSpaceRange
    } as PlotDataRanges;

    return this.ttestService.plotData(this.models, ranges, this.pointsPerPlot).
      pipe(map((result: PlotDataResponse) => {
        if (typeof(this.pointsPerPlot) === 'undefined') {
          this.pointsPerPlot = result.points;
        }

        result.data.forEach((data, i) => {
          Object.assign(this.models[i], data);
        });

        if (this.customRanges) return;

        let output = this.getOutput();
        let nRange, powerRange, deltaRange;
        for (let i = 0, ilen = this.models.length; i < ilen; i++) {
          let model = this.models[i];
          switch (output) {
            case "n":
            case "nByCI":
              powerRange = this.makeXRange(model.nVsPower, this.nRange);
              powerRange.description = "Power";
              if (i == 0) {
                this.powerRange = powerRange;
              } else {
                this.powerRange.combine(powerRange);
              }

              deltaRange = this.makeXRange(model.nVsDelta, this.nRange);
              deltaRange.description = "Detectable Alternative";
              if (i == 0) {
                this.deltaRange = deltaRange;
              } else {
                this.deltaRange.combine(deltaRange);
              }
              break;
            case "power":
              nRange = this.makeXRange(model.powerVsN, this.powerRange);
              nRange.description = "Sample Size";
              if (i == 0) {
                this.nRange = nRange;
              } else {
                this.nRange.combine(nRange);
              }
              break;

            case "delta":
              powerRange = this.makeXRange(model.deltaVsPower, this.deltaRange);
              powerRange.description = "Power";
              if (i == 0) {
                this.powerRange = powerRange;
              } else {
                this.powerRange.combine(powerRange);
              }

              nRange = this.makeXRange(model.deltaVsN, this.deltaRange);
              nRange.description = "Sample Size";
              if (i == 0) {
                this.nRange = nRange;
              } else {
                this.nRange.combine(nRange);
              }
              break;
          }
        }

        this.previousRanges = {
          nRange: this.nRange ? this.nRange.clone() : undefined,
          powerRange: this.powerRange ? this.powerRange.clone() : undefined,
          deltaRange: this.deltaRange ? this.deltaRange.clone() : undefined,
          pSpaceRange: this.pSpaceRange ? this.pSpaceRange.clone() : undefined
        };
      }));
  }

  resetRanges(): void {
    if (this.previousRanges) {
      Object.assign(this, this.previousRanges);
    }
  }

  addModel(model: TTest): Observable<any> {
    return this.ttestService.calculate(model).
      pipe(mergeMap((result: TTestAttribs) => {
        let model = new TTest(result);
        model.name = this.getModelName(this.models.length);
        this.models.push(model);
        if (!this.customRanges) {
          this.calculateRanges();
        }

        this.changeHistory.push({
          'type': 'add', 'index': this.models.length - 1,
          'params': model.attribs()
        });

        return this.updatePlotData();
      }));
  }

  updateModel(index: number, key: string, value: any): Observable<any> {
    let model = this.models[index];

    let which = key;
    let changes = { [key]: value };
    if (key !== 'output') {
      if (model.output === 'nByCI') {
        if (key === 'delta') {
          // delta was changed, so turn on "deltaMode"
          changes.deltaMode = true;
          which = 'power';
        } else if (key === 'power') {
          // power was changed, so turn off "deltaMode"
          changes.deltaMode = false;
        }
      } else if (this.models[0].output !== 'n') {
        if (key === 'ci') {
          // 95% confidence interval width was changed, so turn on "ciMode"
          changes.ciMode = true;
          which = 'n';

        } else if (key === 'n') {
          // Sample size was changed, so turn off "ciMode"
          changes.ciMode = false;
        }
      }
    }

    let models = [model];
    if (key === "output") {
      // If the output is changed, all models need to be updated. Additionally,
      // reset the flag to keep ranges.
      models = this.models;
      this.customRanges = false;
    }

    models.forEach(m => { Object.assign(m, changes); });
    let obs = models.map((model, i) => {
      return this.ttestService.calculate(model).pipe(
        map((result: TTestAttribs) => {
          Object.assign(model, result);
        })
      );
    });
    return zip(...obs).pipe(
      mergeMap(() => {
        if (!this.customRanges) {
          this.calculateRanges();
        }
        this.changeHistory.push({
          'type': 'change', 'index': index,
          'key': key, 'params': model.attribs()
        });
        return this.updatePlotData();
      })
    );
  }

  removeModel(index: number): Observable<any> {
    this.models.splice(index, 1);
    this.changeHistory.push({
      'type': 'remove', 'index': index
    });
    if (!this.customRanges) {
      this.calculateRanges();
    }
    return this.updatePlotData();
  }

  getModel(index: number): TTest {
    return this.models[index];
  }

  modelCount(): number {
    return this.models.length;
  }

  calculateRanges(): void {
    let nRange = [];
    let powerRange = [];
    let deltaRange = [];
    let pSpaceRange = [];

    let output = this.getOutput();
    let values;
    for (let i = 0, ilen = this.models.length; i < ilen; i++) {
      let model = this.models[i];

      switch (output) {
        case "n": /* fall through */
        case "nByCI":
          // calculate n range
          values = stableSort([model.n * 0.5, model.n * 1.5], d3.ascending);
          if (i == 0 || values[0] < nRange[0]) {
            nRange[0] = values[0];
          }
          if (i == 0 || values[1] > nRange[1]) {
            nRange[1] = values[1];
          }
          break;

        case "power":
          if (i == 0) {
            powerRange = [0.01, 1];
          }

          // calculate delta range
          values = stableSort([1.5 * model.sigma, -1.5 * model.sigma], d3.ascending);
          if (i == 0 || values[0] < deltaRange[0]) {
            deltaRange[0] = values[0];
          }
          if (i == 0 || values[1] > deltaRange[1]) {
            deltaRange[1] = values[1];
          }
          break;

        case "delta":
          // calculate delta range
          values = stableSort([model.delta * 0.5, model.delta * 1.5], d3.ascending);
          if (i == 0 || values[0] < deltaRange[0]) {
            deltaRange[0] = values[0];
          }
          if (i == 0 || values[1] > deltaRange[1]) {
            deltaRange[1] = values[1];
          }
          break;
      }

      // calculate parameter space range
      values = stableSort([1.5 * model.sigma, -1.5 * model.sigma], d3.ascending);
      if (i == 0 || values[0] < pSpaceRange[0]) {
        pSpaceRange[0] = values[0];
      }
      if (i == 0 || values[1] > pSpaceRange[1]) {
        pSpaceRange[1] = values[1];
      }

      values = [model.delta - (model.ci / 2), model.delta + (model.ci / 2)];
      if (values[0] < pSpaceRange[0]) {
        pSpaceRange[0] = values[0] - Math.abs(values[0] * 0.5);
      }
      if (values[1] > pSpaceRange[1]) {
        pSpaceRange[1] = values[1] + Math.abs(values[1] * 0.5);
      }
    }

    if (nRange.length > 0) {
      this.nRange = new Range(nRange[0], nRange[1]);
      this.nRange.description = "Sample Size";
    } else {
      this.nRange = undefined;
    }

    if (powerRange.length > 0) {
      this.powerRange = new Range(powerRange[0], powerRange[1]);
      this.powerRange.description = "Power";
    } else {
      this.powerRange = undefined;
    }

    if (deltaRange.length > 0) {
      this.deltaRange = new Range(deltaRange[0], deltaRange[1]);
      this.deltaRange.description = "Detectable Alternative";
    } else {
      this.deltaRange = undefined;
    }

    if (pSpaceRange.length > 0) {
      this.pSpaceRange = new Range(pSpaceRange[0], pSpaceRange[1]);
      this.pSpaceRange.description = "Parameter Space";
    } else {
      this.pSpaceRange = undefined;
    }
  }

  getLinePlotHandler(): LinePlotHandler {
    return new TTestLinePlotHandler(this);
  }

  getCIPlotHandler(): CIPlotHandler {
    return new TTestCIPlotHandler(this);
  }

  getSelectedIndex(): number {
    return this.selectedIndex;
  }

  getChangeHistory(): any[] {
    return this.changeHistory;
  }

  getModelCount(): number {
    return this.models.length;
  }

  getModelInterpretation(): string {
    return this.models[this.selectedIndex].interpretation();
  }

  getModelOutput(): string {
    return this.models[this.selectedIndex].output;
  }

  // per-project plot options
  getTopYRange(): Range {
    let output = this.getOutput();
    switch (output) {
      case "n":
      case "nByCI":
        return this.nRange;
      case "power":
        return this.powerRange;
      case "delta":
        return this.deltaRange;
    }
  }
  setTopYRange(range: Range): void {
    let output = this.getOutput();
    switch (output) {
      case "n":
      case "nByCI":
        this.nRange = range;
        break;
      case "power":
        this.powerRange = range;
        break;
      case "delta":
        this.deltaRange = range;
        break;
    }
  }
  getTopLeftXRange(): Range {
    let output = this.getOutput();
    switch (output) {
      case "n":
      case "nByCI":
        return this.powerRange;
      case "power":
        return this.nRange;
      case "delta":
        return this.nRange;
    }
  }
  setTopLeftXRange(range: Range): void {
    let output = this.getOutput();
    switch (output) {
      case "n":
      case "nByCI":
        this.powerRange = range;
        break;
      case "power":
        this.nRange = range;
        break;
      case "delta":
        this.nRange = range;
        break;
    }
  }
  getTopRightXRange(): Range {
    let output = this.getOutput();
    switch (output) {
      case "n":
      case "nByCI":
        return this.deltaRange;
      case "power":
        return this.deltaRange;
      case "delta":
        return this.powerRange;
    }
  }
  setTopRightXRange(range: Range): void {
    let output = this.getOutput();
    switch (output) {
      case "n":
      case "nByCI":
        this.deltaRange = range;
        break;
      case "power":
        this.deltaRange = range;
        break;
      case "delta":
        this.powerRange = range;
        break;
    }
  }
  getBottomXRange(): Range {
    return this.pSpaceRange;
  }
  setBottomXRange(range: Range): void {
    this.pSpaceRange = range;
  }

  isCITargetDraggable(): boolean {
    return this.getModelOutput() === 'detAlt';
  }
  isCIBoundsDraggable(): boolean {
    return this.getModelOutput() !== 'power';
  }

  describeChanges(changes: any, html = true): string {
    let result;
    if (changes.type == 'add') {
      result = `Added model #${changes.index + 1}: <span class="code">${this.paramsToString(changes.params)}</span>`;

    } else if (changes.type == 'remove') {
      result = `Removed model #${changes.index + 1}`;

    } else if (changes.type == 'change') {
      if (html) {
        result = `Changed <span class="code">${changes.key}</span> in model #${changes.index + 1}: <span class="code">${this.paramsToString(changes.params)}</span>`;
      } else {
        result = `Changed ${changes.key} in model #${changes.index + 1}: ${this.paramsToString(changes.params)}`;
      }
    }
    return result;
  }

  private paramsToString(params: any): string {
    let result = [];
    for (var key in params) {
      if (key == 'ciMode' || key == 'deltaMode') {
        continue;
      }

      let value = params[key];
      if (typeof(value) === 'string') {
        result.push(`"${key}": "${params[key]}"`);
      } else {
        result.push(`"${key}": ${params[key]}`);
      }
    }
    return `{ ${result.join(', ')} }`;
  }

  private getModelName(index: number): string {
    switch (index) {
      case 0:
        return "Primary";
      case 1:
        return "Secondary";
      case 2:
        return "Tertiary";
      case 3:
        return "Quaternary";
      case 4:
        return "Quinary";
      case 5:
        return "Senary";
      case 6:
        return "Septenary";
      case 7:
        return "Octonary";
      case 8:
        return "Nonary";
      case 9:
        return "Denary";
    }
    return `Line ${index + 1}`;
  }

  private makeXRange(data: Point[], yRange: Range): Range {
    let minIndex = 0, maxIndex = data.length - 1;
    for (let i = 0; i < data.length; i++) {
      if (typeof(data[i].x) === "number" && data[i].y >= yRange.min) {
        minIndex = i;
        break;
      }
    }
    for (let i = data.length - 1; i >= 0; i--) {
      if (typeof(data[i].x) === "number" && data[i].y <= yRange.max) {
        maxIndex = i;
        break;
      }
    }

    let values = stableSort([data[minIndex].x, data[maxIndex].x], d3.ascending);
    return new Range(values[0], values[1]);
  }
}
