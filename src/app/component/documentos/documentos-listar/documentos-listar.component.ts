import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Documentos } from '../../../models/Documentos';
import { DocumentosService } from '../../../service/documentos.service';

@Component({
  selector: 'app-documentos-listar',
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
  templateUrl: './documentos-listar.component.html',
  styleUrl: './documentos-listar.component.css'
})
export class DocumentosListarComponent implements OnInit {
  dataSource: MatTableDataSource<Documentos> = new MatTableDataSource();
  displayedColumns: string[] =
  ['codigo', 'deudor', 'tipo', 'documento', 'valor_nominal',
    'fecha_emision', 'fecha_vencimiento', 'moneda', 'tasa_descuento',
    'tipo_tasa', 'dias_descuento', 'periodo_capitalizacion', 'tasa_efectiva',
    'comisiones','intereses', 'valor_neto', 'estado',
    'accion01', 'accion02'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  cartera_id: number = 0; // Variable agregada para almacenar el ID

  constructor(private tS: DocumentosService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {  // Cambiado de queryParams a params
      this.cartera_id = +params['id'];  // Cambiado de 'idCartera' a 'id'
      console.log(this.cartera_id);
      this.tS.listByCartera(this.cartera_id).subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      });
    });

    this.tS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  eliminar(id: number) {
    this.tS.delete(id).subscribe(() => {
      // Usamos el cartera_id almacenado
      this.tS.listByCartera(this.cartera_id).subscribe((data) => {
        this.tS.setList(data);
      });
    });
  }
}
