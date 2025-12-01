import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthData } from '../../services';
@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPage {
  private _formBuilder = inject(FormBuilder);

  private authData = inject(AuthData);

  loginForm: FormGroup = this._formBuilder.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false],
  });

  hidePassword = true;

  ngOnInit(): void {
    this.loadForm();
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    const { login, password, remember } = this.loginForm.value;
    // this.authData.login(login, password, remember).subscribe(() => {
    //   console.log('Logim completed on login page');
    // });

    // Crear un formulario real del navegador
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `http://localhost:8000/auth/authorize`;

    form.innerHTML = `
    <input type="hidden" name="login" value="${login}">
  <input type="hidden" name="password" value="${password}">
  <input type="hidden" name="clientId" value="intranet">
  <input type="hidden" name="redirectUri" value="http://localhost:3000/auth/callback">
  <input type="hidden" name="state" value="test">
  `;

    document.body.appendChild(form);
    form.submit();
  }

  private loadForm(): void {
    const loginSaved = localStorage.getItem('login');
    if (loginSaved) {
      this.loginForm.patchValue({ login: loginSaved, remember: true });
    }
  }
}
