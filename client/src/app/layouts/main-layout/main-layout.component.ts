import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { NotificationService, ToastMessage } from '../../services/notification.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  isSidenavOpen = true;
  isMobile = false;
  toasts: ToastMessage[] = [];

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Records', icon: 'fact_check', route: '/records' },
    { label: 'Admin Panel', icon: 'admin_panel_settings', route: '/admin', adminOnly: true },
  ];

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());

    this.notificationService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  get filteredNavItems(): NavItem[] {
    return this.navItems.filter(
      (item) => !item.adminOnly || this.authService.isAdmin
    );
  }

  get userInitials(): string {
    const name = this.authService.currentUser?.name || '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  dismissToast(id: number): void {
    this.notificationService.dismiss(id);
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isSidenavOpen = false;
    }
  }
}
