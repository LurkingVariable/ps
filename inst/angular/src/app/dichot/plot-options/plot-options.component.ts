import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Observable, Subject, Subscription, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Project } from '../project';
import { Dichot } from '../dichot';
import { PlotOptionsService } from '../../plot-options.service';

interface ProjectChange {
  name: string;
  subname?: string;
  value: any;
}

@Component({
  selector: 'dichot-plot-options',
  templateUrl: './plot-options.component.html',
  styleUrls: ['./plot-options.component.css']
})
export class PlotOptionsComponent implements OnInit, OnChanges {
  @Input('project') project: Project;
  @Output() optionChanged = new EventEmitter();
  @Output() projectChanged = new EventEmitter();
  @Output() reset = new EventEmitter();
  model: Dichot;

  private projectChangedDelay: Subject<ProjectChange> = new Subject();
  private projectChangedImmediate: Subject<ProjectChange> = new Subject();
  private rangeSub: Subscription;

  constructor(public plotOptions: PlotOptionsService) {}

  ngOnInit(): void {
    this.rangeSub = merge(
      this.projectChangedDelay.pipe(debounceTime(400)),
      this.projectChangedImmediate
    ).subscribe(change => {
      if (change.subname) {
        this.project[change.name][change.subname] = change.value;
      } else {
        this.project[change.name] = change.value;
      }
      if (change.name == 'customRanges' && !change.value) {
        this.project.resetRanges();
      }
      if (change.name == 'fixedPSpace') {
        this.project.calculateRanges();
      }

      this.project.updatePlotData().subscribe(() => {
        this.projectChanged.emit()
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.project) {
      this.model = this.project.getModel(0);
    }
  }

  doReset(): void {
    this.plotOptions.reset();
    this.project.resetRanges();
    this.project.updatePlotData().subscribe(() => {
      this.reset.emit();
    });
  }

  changeAttribute(name: string, value: any): void {
    if (this.plotOptions[name] !== value) {
      this.plotOptions[name] = value;
      this.optionChanged.emit();
    }
  }

  changeNumberAttribute(name: string, value: string): void {
    let n = parseFloat(value);
    if (!isNaN(n)) {
      this.changeAttribute(name, n);
    }
  }

  setProjectAttribute(name: string, value: any): void {
    let change = { name: name, value: value } as ProjectChange;
    this.projectChangedImmediate.next(change);
  }

  setProjectNumberAttribute(name: string, value: any): void {
    let n = parseFloat(value);
    if (isNaN(n)) return;
    this.setProjectAttribute(name, n);
  }

  setProjectRange(name: string, which: string, value: string, delay = false): void {
    let n = parseFloat(value);
    if (isNaN(n)) return;

    let change = { name: `${name}Range`, subname: which, value: n } as ProjectChange;
    if (delay) {
      this.projectChangedDelay.next(change);
    } else {
      this.projectChangedImmediate.next(change);
    }
  }
}