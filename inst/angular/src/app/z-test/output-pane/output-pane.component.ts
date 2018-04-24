import { Component, ViewChild, TemplateRef, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { NgbModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';

import { Project } from '../project';
import { ZTest } from '../z-test';
import { PlotComponent } from '../plot/plot.component';
import { BottomPlotComponent } from '../bottom-plot/bottom-plot.component';
import { ExportPlotsComponent } from '../export-plots/export-plots.component';
import { PlotOptionsService } from '../../plot-options.service';
import { PaletteService } from '../../palette.service';

@Component({
  selector: 'z-test-output-pane',
  templateUrl: './output-pane.component.html',
  styleUrls: ['./output-pane.component.css'],
  host: {
    '(document:copy)': 'onCopy($event)'
  }
})
export class OutputPaneComponent implements OnChanges {
  @Input('project') project: Project;
  @Input('hover-disabled') hoverDisabled = false;
  @Output() modelChanged = new EventEmitter();
  model: ZTest;
  showFooter = true;
  private copyMode: string;

  @ViewChild('topLeft') topLeftPlot: PlotComponent;
  @ViewChild('topRight') topRightPlot: PlotComponent;
  @ViewChild('bottom') bottomPlot: BottomPlotComponent;
  @ViewChild('saveDialog') saveDialog: TemplateRef<any>;
  @ViewChild('footerTabset') footerTabset: NgbTabset;

  constructor(
    private modalService: NgbModal,
    private plotOptions: PlotOptionsService,
    private palette: PaletteService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!('project' in changes)) return;

    if (this.project) {
      this.model = this.project.getModel(this.project.selectedIndex);
    } else {
      this.model = undefined;
    }
  }

  toggleFooter(value: boolean): void {
    this.showFooter = value;
    setTimeout(this.resize.bind(this), 1);
  }

  openSaveDialog(): void {
    const modalRef = this.modalService.open(ExportPlotsComponent, { windowClass: 'export-plots' });
    let component = modalRef.componentInstance;
    component.project = this.project;
    component.topLeftLegendXOffset = this.topLeftPlot.legendXOffset;
    component.topLeftLegendYOffset = this.topLeftPlot.legendYOffset;
    component.topRightLegendXOffset = this.topRightPlot.legendXOffset;
    component.topRightLegendYOffset = this.topRightPlot.legendYOffset;
  }

  round(n: number): number {
    return Math.round(n * 100) / 100;
  }

  ceil(n: number): number {
    return Math.ceil(n);
  }

  resize(): void {
    this.redrawPlots();
  }

  updateProject(): void {
    if (this.project) {
      this.model = this.project.getModel(this.project.selectedIndex);
    }
  }

  redrawPlots(): void {
    // Set a timeout here to let the UI resize if needed
    setTimeout(() => {
      this.topLeftPlot.redraw();
      this.topRightPlot.redraw();
      this.bottomPlot.redraw();
    }, 1);
  }

  getIndicatorColor(): string {
    return this.palette.getColor(this.project.selectedIndex, this.plotOptions.paletteTheme);
  }

  describeChanges(changes: any): string {
    let result = [];
    for (var key in changes) {
      result.push(`<span class="code">${key}</span> was changed to <span class="code">${changes[key]}</span>`);
    }
    return result.join("; ");
  }

  copyFooter(): void {
    document.execCommand('copy');
  }

  onCopy(event: any): void {
    switch (this.footerTabset.activeId) {
      case 'z-test-output-pane-interpretation':
        event.clipboardData.setData('text/plain', this.model.interpretation());
        event.preventDefault();
        break;
      case 'z-test-output-pane-log':
        let text = this.project.changeHistory.
          map(changes => this.project.describeChanges(changes, false)).
          join("\r\n");
        event.clipboardData.setData('text/plain', text);
        event.preventDefault();
        break;
    }
  }

  onModelChanged(): void {
    this.modelChanged.emit();
  }
}
