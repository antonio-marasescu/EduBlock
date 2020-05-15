import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActionBarInputModel} from '../../../core/models/actions/action-bar-input.model';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent {
  @Input() actions: ActionBarInputModel[];
  @Output() actionEvent: EventEmitter<string> = new EventEmitter<string>();
  actionTypesColorMap: { [key: string]: ThemePalette } = {
    standard: undefined,
    warn: 'warn',
    accent: 'accent',
    success: 'primary'
  };
}
