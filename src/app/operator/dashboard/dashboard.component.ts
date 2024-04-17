import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit, HostListener} from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { BehaviorSubject} from 'rxjs';
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
            value: 0
        },
        {
            name: "Berth",
            value: 0
        },
    ];
    timeBreakDown: pieData[] = [
        {
            name: "Operation Time",
            value: 0
        },
        {
            name: "Berth Time",
            value: 0
        },
        {
            name: "Waiting Time",
            value: 0
        },
    ];
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
            this.view = [this.innerWidth - 100, 320]
        }
        else if (this.innerWidth > 768 && this.innerWidth <= 1024) {
            this.view = [this.innerWidth - 150, 320]
        }
        else {
            this.view = [(this.innerWidth / 2) - 150, 320]
        }
    }

    constructor(private readonly bpo: BreakpointObserver,
        private readonly statService: StatsService,
    ) {
    }

    ngOnInit(): void {
        this.innerWidth = window.innerWidth;
        if (this.innerWidth <= 768) {
            this.view = [this.innerWidth - 100, 320]
        }
        else if (this.innerWidth > 768 && this.innerWidth <= 1024) {
            this.view = [this.innerWidth - 150, 320]
        }
        else {
            this.view = [(this.innerWidth / 2) - 150, 320]
        }
        this.getDashboardData()
    }

    getDashboardData() {
        this.statService.getDashboardStats().subscribe({
            next : response => {
                this.dashboardData = response?.data?.attributes;
                this.sidsByStatus[0].value = this.dashboardData?.sidsByStatus?.onRouteCount || 0
                this.sidsByStatus[1].value = this.dashboardData?.ridsByStatus?.onPortQueueCount || 0
                this.sidsByStatus[2].value = this.dashboardData?.sidsByStatus?.onBerthCount || 0
                this.timeBreakDown[0].value = this.dashboardData?.timeBreakDown?.operationTime || 0
                this.timeBreakDown[1].value = this.dashboardData?.timeBreakDown?.berthTime || 0
                this.timeBreakDown[2].value = this.dashboardData?.timeBreakDown?.waitingTime || 0
                this.isLoading$.next(false)
            },
            error : ()=>{
                this.sidsByStatus[0].value = 0
                this.sidsByStatus[1].value = 0
                this.sidsByStatus[2].value = 0
                this.timeBreakDown[0].value = 0
                this.timeBreakDown[1].value = 0
                this.timeBreakDown[2].value = 0
                this.isLoading$.next(false)
            }
        })
    }
}
