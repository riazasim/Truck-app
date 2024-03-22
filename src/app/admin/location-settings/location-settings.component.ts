import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LocationSettingsModel } from 'src/app/core/models/location-settings.model';

@Component({
  selector: 'app-location-settings',
  templateUrl: './location-settings.component.html',
  styleUrls: ['./location-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSettingsComponent {
  search: string;
  general: LocationSettingsModel[] = [{
    name: 'Users',
    link: '../users'
  },{
    name: 'Fleet',
    link: '../fleet'
  }, {
    name: 'Operations',
    link: '../operations'
  }, {
    name: 'Locations',
    link: '../locations'
  },
  //  {
  //   name: 'Partners',
  //   link: '../partners'
  // },
  //  {
  //   name: 'Partners\' contacts',
  //   link: '../partners-contacts'
  // },
  {
    name: 'Notifications⚠️',
    link: '../notifications'
  }
  ]
  operations: LocationSettingsModel[] = [{
    name: 'Custom fields',
    link: '../custom-fields'
  }, {
    name: 'Message templates',
    link: '../message-templates'
  }, {
    name: 'SMS automation',
    link: '../message-automations'
  }, {
    name: 'Report builder ⚠️',
    link: null
  }, {
    name: 'Alerts⚠️',
    link: null
  }
]
  reports: LocationSettingsModel[] = [{
    name: 'API documentation⚠️',
    link: null
  }, {
    name: 'Lares Access Integration⚠️',
    link: null
  }, {
    name: 'SMS integration⚠️',
    link: null
  }, {
    name: 'Custom integration⚠️',
    link: null
  },{
    name: 'Watchlist⚠️',
    link: null
  }]

  developers: LocationSettingsModel[] = [
    {
      name: 'API documentation⚠️',
      link: null
    }, {
      name: 'SMS Integration⚠️',
      link: null
    }, {
      name: 'Yard Access Integration⚠️',
      link: null
    }, {
      name: 'Access Managenent Integration⚠️',
      link: null
    }, {
      name: 'Custom Integration⚠️',
      link: null
    },{
      name: 'Webhooks⚠️',
      link: null
    }
  ]
}
