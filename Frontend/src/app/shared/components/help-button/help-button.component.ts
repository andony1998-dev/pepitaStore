import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-button.component.html',
})
export class HelpButtonComponent {
  @Input() title: string = '';
  @Input() description: string = '';

  isOpen = signal(false);

  toggle(): void {
    this.isOpen.set(!this.isOpen());
  }
}
