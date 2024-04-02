import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit, HostListener } from '@angular/core';
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
    innerWidth: any;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    dashboardData: any;
    sidsByStatus: pieData[] = [
        {
            name: "On Route",
            value: 0
        },
        {
            name: "Port",
            value: 1
        },
        {
            name: "Berth",
            value: 0
        },
    ];
    timeBreakDown: pieData[] = [
        {
            name: "Operation Time",
            value: 1
        },
        {
            name: "Berth Time",
            value: 1
        },
        {
            name: "Waiting Time",
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
    //   public readonly xAxis = true;
    //   public readonly yAxis = true;
    //   public readonly showYAxisLabel = true;
    //   public readonly showXAxisLabel = true;
    //   public readonly xAxisLabel = 'Hour';
    //   public readonly yAxisLabel = 'Vehicles today';
    public readonly timeline = true;

    readonly colorScheme: string | Color | any = {
        domain: ['#FF922E', '#3386FE', '#1C3F47']
    };

    //   readonly lineChartDataColorScheme: Color = {
    //     name: 'Line Chart Color Scheme',
    //     selectable: true,
    //     group: ScaleType.Linear,
    //     domain: ['#ffa500', '#BFEAF8', '#7AA3E5', '#A27EA8']
    //   }

    readonly showLegend$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public readonly legendPosition: LegendPosition = LegendPosition.Right;

    //   public readonly lineChartData: { name: string, series: { name: string, value: number }[] }[] = [];
    public readonly pieChardData: { name: string, value: number }[] = [];
    public view: [number, number];

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.innerWidth = window.innerWidth;
        if (this.innerWidth <= 768) {
            this.view = [this.innerWidth - 100 , 320]
        }
        else if (this.innerWidth > 768 && this.innerWidth <= 1024) {
            this.view = [this.innerWidth - 150 , 320]
        }
        else{
            this.view = [(this.innerWidth/2)-150 , 320]
        }
    }

    constructor(private readonly bpo: BreakpointObserver,
        private readonly statService: StatsService
    ) {
    }

    ngOnInit(): void {
        this.innerWidth = window.innerWidth;
        if (this.innerWidth <= 768) {
            this.view = [this.innerWidth - 100 , 320]
        }
        else if (this.innerWidth > 768 && this.innerWidth <= 1024) {
            this.view = [this.innerWidth - 150 , 320]
        }
        else{
            this.view = [(this.innerWidth/2)-150 , 320]
        }
        this.getDashboardData()
    }

    getDashboardData() {
        this.statService.getDashboardStats().subscribe(response => {
            this.dashboardData = response?.data?.attributes;
            // this.sidsByStatus[0].value = this.dashboardData.sidsByStatus.onRouteCount
            this.sidsByStatus[1].value = this.dashboardData.ridsByStatus.onPortQueueCount
            // this.sidsByStatus[2].value = this.dashboardData.sidsByStatus.onBerthCount
            this.timeBreakDown[0].value = this.dashboardData.timeBreakDown.operationTime
            this.timeBreakDown[1].value = this.dashboardData.timeBreakDown.berthTime
            this.timeBreakDown[2].value = this.dashboardData.timeBreakDown.waitingTime
            this.isLoading$.next(false)
        })
    }
}
