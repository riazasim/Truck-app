import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-add-fleet',
    templateUrl: './add-fleet.component.html',
    styleUrls: ['./add-fleet.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class AddFleetComponent {
  constructor(
              private readonly router: Router,
              private readonly route: ActivatedRoute
  ) {}

   ngOnInit(): void {
  }

  }