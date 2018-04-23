import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppCommonModule } from '../app-common.module';

import { ZTestService } from './z-test.service';
import { PlotOptionsService } from './plot-options.service';
import { PaletteService } from './palette.service';
import { ProjectFactoryService } from './project-factory.service';

import { ZTestComponent } from './z-test.component';
import { StartComponent } from './start/start.component';
import { RangeSliderComponent, RangeSliderLabel, RangeSliderHelp } from './range-slider/range-slider.component';
import { ProjectComponent } from './project/project.component';
import { OutputPaneComponent } from './output-pane/output-pane.component';
import { HelpComponent } from './help/help.component';
import { PlotOptionsComponent } from './plot-options/plot-options.component';
import { PlotComponent } from './plot/plot.component';
import { BottomPlotComponent } from './bottom-plot/bottom-plot.component';
import { ExportPlotsComponent } from './export-plots/export-plots.component';
import { DraggableDialogComponent } from './draggable-dialog/draggable-dialog.component';

import { ProjectModelComponent } from './project-model/project-model.component';

const routes: Routes = [
  { path: 'z-test', component: ZTestComponent },
];

@NgModule({
  declarations: [
    ZTestComponent,
    StartComponent,
    RangeSliderComponent,
    RangeSliderLabel,
    RangeSliderHelp,
    ProjectComponent,
    OutputPaneComponent,
    HelpComponent,
    PlotOptionsComponent,
    PlotComponent,
    BottomPlotComponent,
    ExportPlotsComponent,
    DraggableDialogComponent,
    ProjectModelComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    NgbModule,
    RouterModule.forChild(routes),
    AppCommonModule
  ],
  providers: [
    ZTestService,
    PlotOptionsService,
    PaletteService,
    ProjectFactoryService
  ],
  entryComponents: [
    ExportPlotsComponent
  ]
})
export class ZTestModule { }