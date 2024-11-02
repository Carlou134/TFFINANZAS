import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Deudores } from '../../../models/Deudores';
import { DeudoresService } from '../../../service/deudores.service';

@Component({
  selector: 'app-deudores-listar',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatIcon,
    RouterModule,
    MatButtonModule
  ],
  templateUrl: './deudores-listar.component.html',
  styleUrl: './deudores-listar.component.css'
})
export class DeudoresListarComponent implements OnInit {
  dataSource: MatTableDataSource<Deudores> = new MatTableDataSource();
  displayedColumns: string[] =
  ['codigo', 'ruc', 'razon_social', 'direccion', 'telefono', 'email', 'accion01', 'accion02'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private tS: DeudoresService) {}

  ngOnInit(): void {
    this.tS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.tS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  eliminar(id: number) {
    this.tS.delete(id).subscribe((data) => {
      this.tS.list().subscribe((data) => {
        this.tS.setList(data);
      });
    });
  }
}
