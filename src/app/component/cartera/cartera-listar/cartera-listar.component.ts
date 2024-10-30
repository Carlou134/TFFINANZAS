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
import { Cartera } from '../../../models/Cartera';
import { CarteraService } from '../../../service/cartera.service';

@Component({
  selector: 'app-cartera-listar',
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
  templateUrl: './cartera-listar.component.html',
  styleUrl: './cartera-listar.component.css'
})
export class CarteraListarComponent implements OnInit {
  dataSource: MatTableDataSource<Cartera> = new MatTableDataSource();
  displayedColumns: string[] =
  ['codigo', 'nombre', 'fecha_descuento', 'accion01', 'accion02'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private tS: CarteraService) {}

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
