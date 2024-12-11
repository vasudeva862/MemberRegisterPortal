import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
declare var $: any; // Use same as jquery
import * as CryptoJS from 'crypto-js';
import * as bootstrap from 'bootstrap';
import { delay } from 'rxjs';
import { AuthenticationService } from 'src/services/authentication.service';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  PasswordType: String = 'password';

  constructor(private _authenticationService: AuthenticationService) {}

  ngOnInit(): void {}

  handleSubmit(formData: NgForm) {
    this.Validation(formData);
    console.log('Form Data : ', formData);
    if (formData.valid) {
      let _data = {
        EmailId: formData.value.email,
        Password: formData.value.password,
      };
      this._authenticationService.SignIn(_data).subscribe(
        (result: any) => {
          console.log('SignUp data : ', result);
          if (
            result.isSuccess &&
            this.Validations(result.token.split('#')[1])
          ) {
            $('.toast-title').text('Success');
            $('.toast-body').text(result.message);
            $('#ToastOperation').addClass('bg-success');
            delay(2000);
            // Role Is ADMIN
            localStorage.setItem('admin-user-id', result.data.id);
            localStorage.setItem('admin-email', result.data.emailID);
            localStorage.setItem('admin-jwt-token', result.token.split('#')[0]);
            localStorage.setItem(
              'common-jwt-token',
              result.token.split('#')[0]
            );
            localStorage.setItem('admin-home', 'true');
            window.location.href = '/admindashboard';
          } else {
            $('.toast-body').text('Something went wrong');
            $('.toast-title').text('Error');
            $('#ToastOperation').addClass('bg-danger');
          }
          $('#ToastOperation').toast('show');
        },
        (error: any) => {
          console.log('Error Message : ', error);

          $('.toast-title').text('Sonething Went Wrong');
          $('.toast-body').text('something went wrong');
          $('#ToastOperation').addClass('bg-danger').toast('show');
        }
      );
    } else {
      $('.toast-title').text('Error');
      $('.toast-body').text('Please Enter Required Field');
      $('#ToastOperation').addClass('bg-danger').toast('show');
    }
  }

  Validation(formData: NgForm) {
    $('#emailText').hide();
    $('#passwordText').hide();
    if (formData.value.email === '') {
      $('#email').addClass('ng-touched ng-invalid');
      $('#emailText').css('color', 'red').show();
    }
    if (formData.value.password === '') {
      $('#password').addClass('ng-touched ng-invalid');
      $('#passwordText').css('color', 'red').show();
    }
  }

  Validations(user: String) {
    return (
      this.userData(user) === this.userData(environment.BEServer.UserServer)
    );
  }

  handleShowPassword() {
    let _check = (<HTMLInputElement>(
      document.getElementById('showPasswordCheck')
    )).checked;
    // console.log(_check);
    this.PasswordType = _check ? 'text' : 'password';
  }

  handleLogInRedirect() {
    window.location.href = 'signup';
  }

  userData(userData: String) {
    var key = CryptoJS.enc.Utf8.parse(environment.BEServer.Server);
    var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);
    var decrypted = CryptoJS.AES.decrypt(userData.toString(), key, { iv: iv });
    var finalName = decrypted.toString(CryptoJS.enc.Utf8);
    return finalName;
  }
}
