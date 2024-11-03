import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RoleListarComponent } from './role-listar/role-listar.component';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RoleListarComponent
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {}
}
