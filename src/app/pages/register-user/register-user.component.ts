import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';

interface Ubicacion {
  codUbica: number;
  nomUbica: string;
  codTipoUbica: number;
  ubicaSup: number | null;
}

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  registerForm!: FormGroup;
  correoValidado = false;
  codigoEnviado = false;
  userExiste = false;

  ubicaciones: { [nivel: number]: Ubicacion[] } = {};
  todasUbicaciones: Ubicacion[] = [];
  seleccionados: { [nivel: number]: number } = {};

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,25}$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,25}$/)]],
      user: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{3,6}$/)]],
      fechaRegistro: ['', [Validators.required, this.fechaRealistaValidator]],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern(/^\d{7,16}$/)]],
      codUbica: ['', Validators.required],
      codigo: ['']
    });

    this.cargarUbicaciones();
  }

  cargarUbicaciones(): void {
    this.userService.getUbicaciones().subscribe(data => {
    this.todasUbicaciones = data.map((row: any) => ({
      codUbica: +row.CODUBICA,
      ubicaSup: row.UBI_CODUBICA !== null ? +row.UBI_CODUBICA : null,
      codTipoUbica: +row.CODTIPOUBICA,
      nomUbica: row.NOMUBICA
    }));
      this.ubicaciones[1] = this.todasUbicaciones.filter(u => u.codTipoUbica === 1);
    });
  }

  onSelectNivel(nivel: number, event: Event): void {
    const valor = Number((event.target as HTMLSelectElement).value);
    this.seleccionados[nivel] = valor;

    for (let n = nivel + 1; n <= 5; n++) {
      this.ubicaciones[n] = [];
      delete this.seleccionados[n];
    }

    const siguiente = nivel + 1;
    const hijos = this.todasUbicaciones.filter(
      u => u.codTipoUbica === siguiente && u.ubicaSup === valor
    );
    if (hijos.length > 0) {
      this.ubicaciones[siguiente] = hijos;
    }

    if (valor) {
      this.registerForm.get('codUbica')?.setValue(valor);
    }
  }

  validarCorreo(): void {
    const email = this.registerForm.get('email')?.value;
    const user = this.registerForm.get('user')?.value;

    if (!email || !user) {
      alert('Completa el usuario y el correo antes de validar.');
      return;
    }

    this.userService.existsUser(user).subscribe({
      next: (res) => {
        if (res.exists) {
          alert('Este usuario ya está registrado.');
          this.userExiste = true;
        } else {
          this.userExiste = false;
          this.userService.sendValidationCode(email).subscribe({
            next: () => {
              this.codigoEnviado = true;
              alert('Código enviado al correo.');
            },
            error: () => {
              alert('Error al enviar el código.');
            }
          });
        }
      },
      error: () => {
        alert('Error al verificar existencia del usuario.');
      }
    });
  }

  verificarCodigo(): void {
    const email = this.registerForm.get('email')?.value;
    const codigo = this.registerForm.get('codigo')?.value;

    if (!codigo) {
      alert('Ingresa el código recibido.');
      return;
    }

    this.userService.verifyCode(email, codigo).subscribe({
      next: res => {
        if (res.validado) {
          this.correoValidado = true;
          this.cdRef.detectChanges();
          alert('Correo validado correctamente.');
        } else {
          alert('Código incorrecto.');
        }
      },
      error: () => {
        alert('Error al verificar código.');
      }
    });
  }

  onSubmit(): void {
    if (!this.registerForm.valid || !this.correoValidado || this.userExiste) {
      this.registerForm.markAllAsTouched();
      alert('Completa correctamente el formulario, valida tu correo y asegúrate que el usuario no exista.');
      return;
    }

    const data = { ...this.registerForm.value };
    delete data.codigo;

    this.userService.registerUser(data).subscribe({
      next: () => {
        alert('Usuario registrado con éxito.');
        this.registerForm.reset();
        this.correoValidado = false;
        this.codigoEnviado = false;
        this.ubicaciones = { 1: this.ubicaciones[1] };
        this.seleccionados = {};
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  // Validación personalizada para la fecha
  fechaRealistaValidator(control: AbstractControl): ValidationErrors | null {
    const fecha = new Date(control.value);
    const hoy = new Date();
    const fechaMinima = new Date('2000-01-01');

    if (!control.value) return null;

    if (isNaN(fecha.getTime()) || fecha < fechaMinima || fecha > hoy) {
      return { fechaInvalida: true };
    }

    return null;
  }
}
