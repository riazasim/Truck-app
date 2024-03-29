import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: '[global-layout], [globalLayout]',
  templateUrl: './global-layout.component.html',
  styleUrls: ['./global-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GLobalLayoutComponent {
  @Input()
  public version: 'legacy' | 'latest' = 'latest';
}
