import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'scheduling-transfer',
  templateUrl: './scheduling-transfer.component.html',
  styleUrl: './scheduling-transfer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideOut', [
        transition(':leave', [
            animate('200ms ease-in', style({ transform: 'translateX(-100%)' }))
        ])
    ]),
    trigger('slideIn', [
        transition(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('200ms ease-in', style({ transform: 'translateX(0%)' }))
        ])
    ])
]
})
export class SchedulingTransferComponent {
  step$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  displayedColumns: string[] = ['select', 'name'];
  value: string;
  
  
  transferData = [
    {id:1, name:'Captain 1'},
    {id:2, name:'Captain 2'},
    {id:3, name:'Captain 3'},
    {id:4, name:'Captain 4'},
    // {id:5, name:'Captain 5'},
  ]
  dataSource = new MatTableDataSource<any>(this.transferData);
  selection = this.transferData;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<SchedulingTransferComponent>) {}



  onCancel(): void {
    this.dialogRef.close(true);
  }

}

