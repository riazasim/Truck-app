import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { BehaviorSubject, Observable } from 'rxjs';
import { StatsService } from 'src/app/core/services/stats.service';

interface pieData {
  name: string
  value: number
}
@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent  {
  innerWidth: any;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    dashboardData: any;
    sidsByStatus = [];
    timeBreakDown: pieData[] = [
        {
            name: "operation Time",
            value: 1
        },
        {
            name: "berth Time",
            value: 1
        },
        {
            name: "waiting Time",
            value: 1
        },
    ];

    // Charts

    public readonly showLabels = true;
    public readonly animations = true;
    public readonly timeline = true;

    readonly colorScheme: string | Color | any = {
        domain: ['#FF922E', '#3386FE', '#1C3F47']
    };

    readonly showLegend$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public readonly legendPosition: LegendPosition = LegendPosition.Right;
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
            if (this.dashboardData) {
                // Map ridsByStatus from API response to sidsByStatus in your component
                this.sidsByStatus = this.dashboardData.ridsByStatus.map((item: { shipmentStatus: string, count: number }) => ({
                    shipmentStatus: item.shipmentStatus,
                    count: item.count
                }));}
            // this.sidsByStatus[0].value = this.dashboardData.sidsByStatus.onRouteCount
            // this.sidsByStatus[1].value = this.dashboardData.sidsByStatus.onPortCount
            // this.sidsByStatus[2].value = this.dashboardData.sidsByStatus.onBerthCount
            this.timeBreakDown[0].value = this.dashboardData.timeBreakDown.operationTime
            this.timeBreakDown[1].value = this.dashboardData.timeBreakDown.berthTime
            this.timeBreakDown[2].value = this.dashboardData.timeBreakDown.waitingTime
            this.isLoading$.next(false)
        })
    }
}
