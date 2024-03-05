import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { BehaviorSubject, Observable } from 'rxjs';
import { StatsService } from 'src/app/core/services/stats.service';


interface pieData {
  name: string
  value: number
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DashboardComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  dashboardData: any;
  sidsByStatus: pieData[] = [
    {
      name: "onRouteCount",
      value: 1
    },
    {
      name: "onPortCount",
      value: 1
    },
    {
      name: "onBerthCount",
      value: 1
    },
  ];
  timeBreakDown: pieData[] = [
    {
      name: "operationTime",
      value: 1
    },
    {
      name: "berthTime",
      value: 1
    },
    {
      name: "waitingTime",
      value: 1
    },
  ];
  // readonly totalVehiclesToday$: Observable<number> = this.statService.getVehiclesToday()
  // readonly totalVehiclesInside$: Observable<number> = this.statService.getVehiclesInside()
  // readonly totalVehiclesPlanned$: Observable<number> = this.statService.getVehiclesPlanned()
  // readonly lineChartData$: Observable<any> = this.statService.getHourlyVehiclesToday();
  // readonly currentVehicles$: Observable<any> = this.statService.getVehiclesInsideByOperation();
  // readonly futureVehicles$: Observable<any> = this.statService.getVehiclesPlannedByOperation();

  // Charts

  public readonly showLabels = true;
  public readonly animations = true;
  public readonly xAxis = true;
  public readonly yAxis = true;
  public readonly showYAxisLabel = true;
  public readonly showXAxisLabel = true;
  public readonly xAxisLabel = 'Hour';
  public readonly yAxisLabel = 'Vehicles today';
  public readonly timeline = true;

  readonly colorScheme: string | Color | any = {
    domain: ['#A10A28', '#BFEAF8', '#7AA3E5', '#A27EA8']
  };

  readonly lineChartDataColorScheme: Color = {
    name: 'Line Chart Color Scheme',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#ffa500', '#BFEAF8', '#7AA3E5', '#A27EA8']
  }

  readonly showLegend$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public readonly legendPosition: LegendPosition = LegendPosition.Right;

  public readonly lineChartData: { name: string, series: { name: string, value: number }[] }[] = [];
  public readonly pieChardData: { value: number }[] = [];
  public readonly view: [number, number] = [600, 280];
  public readonly gradient = true;
  constructor(private readonly bpo: BreakpointObserver,
    private readonly statService: StatsService
  ) {
  }

  ngOnInit(): void {
      this.getDashboardData()
      this.bpo.observe('(min-width:768px)')
      .subscribe({
        next: (bpState) => this.showLegend$.next(bpState.matches)
      });
  }

  getDashboardData() {
    this.statService.getDashboardStats().subscribe(response => {
      this.dashboardData = response?.data?.attributes;
      this.sidsByStatus[0].value = this.dashboardData.sidsByStatus.onRouteCount
      this.sidsByStatus[1].value = this.dashboardData.sidsByStatus.onPortCount
      this.sidsByStatus[2].value = this.dashboardData.sidsByStatus.onBerthCount
      this.timeBreakDown[0].value = this.dashboardData.timeBreakDown.operationTime
      this.timeBreakDown[1].value = this.dashboardData.timeBreakDown.berthTime
      this.timeBreakDown[2].value = this.dashboardData.timeBreakDown.waitingTime
      this.isLoading$.next(false)
    })
  }


}
