import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit, HostListener} from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { BehaviorSubject} from 'rxjs';
import { StatsService } from 'src/app/core/services/stats.service';


interface pieData {
    name: string
    value: number
    color: string
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
            name: "",
            value: 0,
            color:""
        }
    ];
    timeBreakDown: pieData[] = [
        {
            name: "",
            value: 0,
            color: ""
        }
    ];
    public readonly showLabels = true;
    public readonly animations = true;
    public readonly timeline = true;

    readonly colorScheme: string | Color | any = {
        domain: ['#3f87fd', '#bdf4a9', '#6ECE63', '#FF922E', '#00CBB2', '#BA28FF', '#203f44', '#3386fe' ]
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
                this.dashboardData = response;
                this.sidsByStatus = [];
                
                this.dashboardData?.sidsByStatus?.forEach((status: any, index: number) => {
                    if (index < this.sidsByStatus.length) {
                        this.sidsByStatus[index].name = status.statusName;
                        this.sidsByStatus[index].color = status.statusColor;
                        this.sidsByStatus[index].value = status.count || 0;
                    } else {
                        this.sidsByStatus.push({
                            name: status.statusName,
                            color: status.statusColor,
                            value: status.count || 0
                        });
                    }
                });
                this.timeBreakDown = [];

                this.dashboardData?.timeBreakDown?.forEach((status: any, index: number) => {
                    if (index < this.timeBreakDown.length) {
                        this.timeBreakDown[index].name = status.name;
                        this.timeBreakDown[index].color = status.color;
                        this.timeBreakDown[index].value = status.count || 0;
                    } else {
                        this.timeBreakDown.push({
                            name: status.name,
                            color: status.color,
                            value: status.time || 0
                        });
                    }
                });
                this.isLoading$.next(false)
            },
            error : ()=>{
                this.sidsByStatus = []
                this.timeBreakDown = []
                this.isLoading$.next(false)
            }
        })
    }
}
