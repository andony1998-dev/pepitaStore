import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { HelpButtonComponent } from '../../shared/components/help-button/help-button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HelpButtonComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  readonly user = this.authService.user;
}
