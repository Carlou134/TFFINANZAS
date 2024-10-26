import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Tasas } from '../../../models/Tasas';
import { MatPaginator } from '@angular/material/paginator';
import { TasasService } from '../../../service/tasas.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasas-listar',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule
  ],
  templateUrl: './tasas-listar.component.html',
  styleUrl: './tasas-listar.component.css'
})
export class TasasListarComponent implements OnInit {
  dataSource: MatTableDataSource<Tasas> = new MatTableDataSource();
  displayedColumns: string[] =
  ['codigo', 'tipo', 'valor', 'periodo'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private tS: TasasService) {}

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
}
