import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-soporte-tecnico',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './soporte-tecnico.component.html',
  styleUrl: './soporte-tecnico.component.css'
})
export class SoporteTecnicoComponent implements OnInit {
  supportForm: FormGroup;
  mensajeEnviado = false;

  teamMembers = [
    { nombre: 'Carlos Vásquez', cargo: 'Desarrollador Fullstack', email: 'u202016517@upc.edu.pe' },
    { nombre: 'Jean Pierre Sanabria', cargo: 'Desarrollador Backend', email: 'u20211c500@upc.edu.pe' },
    { nombre: 'Janiria Avendaño', cargo: 'QA Tester', email: 'u202120648@upc.edu.pe' },
    { nombre: 'Paola Torrejon', cargo: 'QA Tester', email: 'u20211e084@upc.edu.pe' },
    { nombre: 'Alvaro Valenzuela', cargo: 'QA Tester', email: 'u202019281@upc.edu.pe' }
  ];

  constructor(private fb: FormBuilder) {
    this.supportForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      destinatario: ['', Validators.required],
      problema: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.supportForm.valid) {
      this.mensajeEnviado = true;
      setTimeout(() => {
        this.mensajeEnviado = false;
        this.supportForm.reset();
      }, 3000);
    }
  }
}
