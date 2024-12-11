import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
// import * as $ from 'jquery';
declare var $: any; // Use same as jquery
import * as bootstrap from 'bootstrap';
import { delay } from 'rxjs';
import { AuthenticationService } from 'src/services/authentication.service';

const NameRegex = /^[a-zA-Z ]*$/;
const EmailRegex = /^\S+@\S+\.\S+$/;
const MobileRegex = /^\d{10}$/;
const PANRegex = /^[A-Z0-9]{12}$/;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  IsAdmin: boolean = false;
  Role: string = '';
  PasswordType: String = 'password';

  constructor(
    private router: Router,
    private _authenticationService: AuthenticationService
  ) {}

  onSubmit(formData: NgForm) {
    console.log('FormData Value : ', formData.value.role);
    this.Validation(formData);

    if (
      formData.value.role === 'ADMIN' &&
      formData.value.masterPassword !== 'India@123'
    ) {
      $('.toast-title').text('Error');
      $('.toast-body').text('Invalid Master Password');
      $('#ToastOperation').addClass('bg-danger').toast('show');
      return;
    }

    if (formData.valid) {
      const _data = {
        name: formData.value.name,
        emailID: formData.value.email,
        address: formData.value.address,
        state: formData.value.state,
        country: formData.value.country,
        panNumber: formData.value.pan,
        contactNumber: formData.value.contactNumber.toString(),
        dateOfBirth: formData.value.dateOfBirth,
        password: formData.value.password,
      };

      this._authenticationService.SignUp(_data).subscribe(
        (result: any) => {
          console.log('SignUp Data : ', result);
          $('.toast-body').text(result?.message);
          if (result.isSuccess) {
            $('.toast-title').text('Success');
            $('#ToastOperation').addClass('bg-success').toast('show');
            delay(2000);
            window.location.href = '/';
          } else {
            $('.toast-title').text('Error');
            $('#ToastOperation').addClass('bg-danger').toast('show');
          }
        },
        (error: any) => {
          $('.toast-title').text('Error');
          $('.toast-body').text('Something went wrong');
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
    $('#nameText').hide();
    $('#name').removeClass('ng-invalid ng-touched');
    $('#emailText').hide();
    $('#email').removeClass('ng-invalid ng-touched');
    $('#addressText').hide();
    $('#stateText').hide();
    $('#countryText').hide();
    $('#panText').hide();
    $('#pan').removeClass('ng-invalid ng-touched');
    $('#contactNumberText').hide();
    $('#contactNumber').removeClass('ng-invalid ng-touched');
    $('#dateOfBirthText').hide();
    $('#dateOfBirth').removeClass('ng-invalid ng-touched');
    $('#passwordText').hide();
    $('#confirmPasswordText').hide();
    $('#roleText').hide();
    if (formData.value.name === '') {
      $('#name').addClass('ng-invalid ng-touched');
      $('#nameText').text('Name Is Required').css('color', 'red').show();
    } else {
      debugger;
      if (!NameRegex.test(formData.value.name)) {
        $('#name').addClass('ng-invalid ng-touched');
        $('#nameText')
          .text('Name must be in alphabet')
          .css('color', 'red')
          .show();
      }
    }
    if (formData.value.email === '') {
      $('#email').addClass('ng-invalid ng-touched');
      $('#emailText').text('Email Is Required').css('color', 'red').show();
    } else {
      if (!EmailRegex.test(formData.value.email)) {
        $('#email').addClass('ng-invalid ng-touched');
        $('#emailText')
          .text('Please Enter Valid email ID')
          .css('color', 'red')
          .show();
      }
    }

    if (formData.value.address === '') {
      $('#address').addClass('ng-invalid ng-touched');
      $('#addressText').css('color', 'red').show();
    }
    if (formData.value.state === '') {
      $('#state').addClass('ng-invalid ng-touched');
      $('#stateText').css('color', 'red').show();
    }
    if (formData.value.country === '') {
      $('#country').addClass('ng-invalid ng-touched');
      $('#countryText').css('color', 'red').show();
    }
    if (formData.value.pan === '') {
      $('#pan').addClass('ng-invalid ng-touched');
      $('#panText').text('PAN Number Is Required').css('color', 'red').show();
    } else {
      if (!PANRegex.test(formData.value.pan)) {
        $('#pan').addClass('ng-invalid ng-touched');
        $('#panText')
          .text('Please Enter Valid PAN No.')
          .css('color', 'red')
          .show();
      }
    }
    if (formData.value.contactNumber === '') {
      $('#contactNumber').addClass('ng-invalid ng-touched');
      $('#contactNumberText')
        .text('Contact Number Is Required')
        .css('color', 'red')
        .show();
    } else {
      if (!MobileRegex.test(formData.value.contactNumber)) {
        $('#contactNumber').addClass('ng-invalid ng-touched');
        $('#contactNumberText')
          .text('Please Enter Valid Mobile No.')
          .css('color', 'red')
          .show();
      }
    }
    if (formData.value.dateOfBirth === '') {
      $('#dateOfBirth').addClass('ng-invalid ng-touched');
      $('#dateOfBirthText').css('color', 'red').show();
    } else {
      debugger;
      var varDate = new Date(formData.value.dateOfBirth); //dd-mm-YYYY
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (varDate >= today) {
        $('#dateOfBirth').addClass('ng-invalid ng-touched');
        $('#dateOfBirthText')
          .text('Please Enter Valid DOB')
          .css('color', 'red')
          .show();
      }
    }
    if (formData.value.password === '') {
      $('#password').addClass('ng-invalid ng-touched');
      $('#passwordText').css('color', 'red').show();
    }
    if (formData.value.confirmPassword === '') {
      $('#confirmPassword').addClass('ng-invalid ng-touched');
      $('#confirmPasswordText').css('color', 'red').show();
    }
  }

  handleShowPassword() {
    let _check = (<HTMLInputElement>(
      document.getElementById('showPasswordCheck')
    )).checked;
    // console.log(_check);
    this.PasswordType = _check ? 'text' : 'password';
  }

  handleSignInRedirect() {
    window.location.href = '/'; // Not Working
    // this.router.navigate(['/']);
  }
}
