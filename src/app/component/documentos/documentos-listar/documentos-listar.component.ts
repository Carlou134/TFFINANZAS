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
import { Cartera } from '../../../models/Cartera';
import { CarteraService } from '../../../service/cartera.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  cartera: Cartera = new Cartera();

  constructor(private tS: DocumentosService, private route: ActivatedRoute, private carteraService: CarteraService) {}

  actualizarDatos() {
    // Actualizar datos de la cartera
    this.carteraService.listId(this.cartera_id).subscribe((carteraData) => {
      this.cartera = carteraData;
    });

    // Actualizar lista de documentos
    this.tS.listByCartera(this.cartera_id).subscribe((documentosData) => {
      this.dataSource = new MatTableDataSource(documentosData);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.cartera_id = +params['id'];
      this.actualizarDatos();
    });

    // Suscribirse a cambios en la lista
    this.tS.getList().subscribe(() => {
      this.actualizarDatos();
    });
  }

  eliminar(id: number) {
    this.tS.delete(id).subscribe(() => {
      this.actualizarDatos();
    });
  }

  generarPDF() {
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight(); // Definido al inicio
    let pageNumber = 1;

    // Título principal
    doc.setFontSize(18);
    doc.text('Reporte de Cartera', pageWidth/2, 15, { align: 'center' });

    // Información de la cartera
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Información General de la Cartera', 14, 25);
    doc.setFont('helvetica', 'normal');

    // Primera columna de información de cartera
    let y = 35;
    doc.text(`Usuario: ${this.cartera.usuarios.razon_social}`, 14, y);
    doc.text(`Banco: ${this.cartera.bancos.nombre}`, 14, y + 7);
    doc.text(`Fecha de Descuento: ${new Date(this.cartera.fecha_descuento).toLocaleDateString()}`, 14, y + 14);
    doc.text(`Moneda: ${this.cartera.moneda}`, 14, y + 21);

    // Segunda columna de información de cartera
    doc.text(`Valor Nominal Total: ${Number(this.cartera.total_valor_nominal).toLocaleString('es-PE', {minimumFractionDigits: 2})}`, pageWidth/2, y);
    doc.text(`Valor Neto Total: ${Number(this.cartera.total_valor_neto).toLocaleString('es-PE', {minimumFractionDigits: 2})}`, pageWidth/2, y + 7);
    doc.text(`TCEA: ${Number(this.cartera.tcea).toFixed(2)}%`, pageWidth/2, y + 14);
    doc.text(`Estado: ${this.cartera.estado}`, pageWidth/2, y + 21);

    // Información del documento en formato lista
    y = 70;
    doc.setFont('helvetica', 'bold');
    doc.text('Información de los Documentos', 14, y);
    doc.setFont('helvetica', 'normal');

    y += 10;
    this.dataSource.data.forEach((documento, index) => {
        // Agregar espacio entre documentos pero menos que antes
        if(index > 0) y += 5; // Reducido de 10 a 5

        doc.text(`Documento ${index + 1}:`, 14, y);

        // Columna izquierda - más compacta
        doc.text(`Código: ${documento.id}`, 14, y + 5);
        doc.text(`Deudor: ${documento.deudor.razon_social}`, 14, y + 10);
        doc.text(`Tipo Documento: ${documento.tipo}`, 14, y + 15);
        doc.text(`Número Documento: ${documento.numero_documento}`, 14, y + 20);

        // Columna derecha - alineada con la izquierda
        doc.text(`Fecha de Emisión: ${new Date(documento.fecha_emision).toLocaleDateString()}`, pageWidth/2, y + 5);
        doc.text(`Fecha de Vencimiento: ${new Date(documento.fecha_vencimiento).toLocaleDateString()}`, pageWidth/2, y + 10);
        doc.text(`Tipo de Moneda: ${documento.moneda}`, pageWidth/2, y + 15);

        y += 25; // Reducido de 35 a 25 para que esté más compacto

        // Verificar si necesitamos una nueva página
        if (y > pageHeight - 60) {
            doc.addPage();
            y = 20;
            pageNumber++;
            // Agregar el encabezado en la nueva página
            doc.setFont('helvetica', 'bold');
            doc.text('Información de los Documentos (Continuación)', 14, y - 10);
            doc.setFont('helvetica', 'normal');
        }
    });
    // Tabla con la información financiera
    doc.setFont('helvetica', 'bold');
    doc.text('Información Financiera', 14, y + 5);
    doc.setFont('helvetica', 'normal');

    const rows = this.dataSource.data.map(doc => [
      doc.id,                    // Código
      doc.numero_documento,      // Código-factura
      Number(doc.valor_nominal).toLocaleString('es-PE', {minimumFractionDigits: 2}),
      Number(doc.tasa_descuento).toFixed(4),
      doc.tipo_tasa,
      doc.dias_descuento,
      doc.periodo_capitalizacion || '-',
      Number(doc.tasa_efectiva_calculada).toFixed(4),
      Number(doc.portes + doc.comision_estudios + doc.comision_desembolso + doc.comision_cobranza + doc.igv).toLocaleString('es-PE', {minimumFractionDigits: 2}),
      Number(doc.valor_neto).toLocaleString('es-PE', {minimumFractionDigits: 2}),
      doc.estado
  ]);

  autoTable(doc, {
    startY: y + 15,
    head: [[
        'Código', 'Nro. Documento', 'Valor Nominal', 'Tasa Desc.',
        'Tipo Tasa', 'Días Desc.', 'Per. Cap.', 'Tasa Efec.',
        'Comisiones', 'Valor Neto', 'Estado'
    ]],
    body: rows,
    theme: 'striped',
    styles: {
        fontSize: 8,
        cellWidth: 'auto',
        cellPadding: 2
    },
    columnStyles: {
        0: { halign: 'center', cellWidth: 15 },  // Código
        1: { halign: 'center', cellWidth: 25 },  // Nro. Documento
        2: { halign: 'right', cellWidth: 25 },   // Valor Nominal
        3: { halign: 'right', cellWidth: 20 },   // Tasa Descuento
        4: { halign: 'center', cellWidth: 20 },  // Tipo Tasa
        5: { halign: 'right', cellWidth: 20 },   // Días Descuento
        6: { halign: 'center', cellWidth: 20 },  // Per. Cap.
        7: { halign: 'right', cellWidth: 20 },   // Tasa Efectiva
        8: { halign: 'right', cellWidth: 25 },   // Comisiones
        9: { halign: 'right', cellWidth: 25 },   // Valor Neto
        10: { halign: 'center', cellWidth: 25 }  // Estado
    },
    headStyles: {
        fillColor: [66, 66, 66],
        halign: 'center',
        fontSize: 8
    },
    // Asegurar que la tabla se ajuste al ancho de la página
    tableWidth: 'auto',
    margin: { left: 14 } // Alinear con el resto del contenido
  });

  // Guardar el PDF
  doc.save(`Cartera_${this.cartera_id}_${new Date().toISOString().split('T')[0]}.pdf`);
}
}
