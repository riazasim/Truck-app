import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { StatusListModel } from 'src/app/core/models/status-list.model';
import { StatusListService } from 'src/app/core/services/status-list.service';

@Component({
  selector: 'app-list-management-list',
  templateUrl: './list-management-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListManagementListComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  displayedColumns = ['name', 'type', 'description', 'actions'];

  dataSource: any[] = [];

  constructor(private readonly router: Router,
              private readonly route: ActivatedRoute,
              private readonly statusListService: StatusListService) {}

  ngOnInit(): void {
    this.retrieveList();
  }

  retrieveList(): void {
    // this.statusListService.getLists().subscribe((response) => {
    //   this.dataSource = response.filter((n: StatusListModel) => !n.name.toLowerCase().includes('dock'))
    //                             .concat([{ name: 'Timeslot Status', type: 'System defined', description: 'Shows the timeslot status' }])
    //   this.isLoading$.next(false);
    // });
  }

  redirectAddList(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
