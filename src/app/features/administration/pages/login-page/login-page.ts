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
import { AuthData } from '../../datasources/auth-data';
import { Router } from '@angular/router';
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
  private router = inject(Router);

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
    this.authData.login(login, password, remember).subscribe(() => {
      this.router.navigateByUrl('/admin');
    });
  }

  private loadForm(): void {
    const loginSaved = localStorage.getItem('login');
    if (loginSaved) {
      this.loginForm.patchValue({ login: loginSaved, remember: true });
    }
  }
}
