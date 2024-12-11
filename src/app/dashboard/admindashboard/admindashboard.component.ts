import { Component } from '@angular/core';
declare var $: any; // Use same as jquery
import * as bootstrap from 'bootstrap';
import { NgForm } from '@angular/forms';
import {
  ClaimInterface,
  PeriodicElement,
  UserDetailsInterface,
} from 'src/app/Interface/Interface';
import { ClaimService } from 'src/services/claim.service';

const NameRegex = /^[a-zA-Z ]*$/;
const EmailRegex = /^\S+@\S+\.\S+$/;
const MobileRegex = /^\d{10}$/;
const PANRegex = /^[A-Z0-9]{12}$/;

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.scss'],
})
export class AdmindashboardComponent {
  displayedColumns: string[] = [
    'id',
    'createdDate',
    'claimID',
    'dateOfAdmission',
    'dateOfDischarge',
    'setting',
  ];

  List: ClaimInterface[] = [];
  UserDetails = <UserDetailsInterface>{};

  _userID = localStorage.getItem('admin-user-id') || '{}';

  id: String = '';
  userID: String = '';
  claimID: Number = 0;

  dependentName1: String = '';
  dateOfBirth1: String = '';
  dependent1Claim: String = '';
  dependentName2: String = '';
  dateOfBirth2: String = '';
  dependent2Claim: String = '';
  dateOfAdmission: String = '';
  dateOfDischarge: String = '';
  providerName: String = '';
  totalBillAmount: String = '';

  _dateOfAdmission: Date = new Date();
  _dateOfDischarge: Date = new Date();

  dependentName1Flag: Boolean = false;
  dateOfBirth1Flag: Boolean = false;
  dependent1ClaimFlag: Boolean = false;
  dependentName2Flag: Boolean = false;
  dateOfBirth2Flag: Boolean = false;
  dependent2ClaimFlag: Boolean = false;
  dateOfAdmissionFlag: Boolean = false;
  dateOfDischargeFlag: Boolean = false;
  providerNameFlag: Boolean = false;
  totalBillAmountFlag: Boolean = false;

  IsHome: Boolean = true;
  IsEdit: Boolean = false;

  //Profile Variable
  user_Name: String = '';
  email_ID: String = '';
  address: String = '';
  state: String = '';
  country: String = '';
  pan_Number: String = '';
  contact_Number: Number = 0;
  date_Of_Birth: Date = new Date();

  user_Name_Flag: Boolean = false;
  email_ID_Flag: Boolean = false;
  address_Flag: Boolean = false;
  state_Flag: Boolean = false;
  country_Flag: Boolean = false;
  pan_Number_Flag: Boolean = false;
  contact_Number_Flag: Boolean = false;
  date_Of_Birth_Flag: Boolean = false;

  constructor(private _claimService: ClaimService) {}

  //
  async ngOnInit() {
    debugger;
    console.log(localStorage.getItem('admin-jwt-token'));
    if (localStorage.getItem('admin-jwt-token') === null) {
      window.location.href = '/';
    }
    if (localStorage.getItem('admin-home') === 'true') {
      await this.handleHome();
    }
    await this.GetUserDetailsByID();
  }

  //
  GetUserDetailsByID() {
    this._claimService.GetUserDetailsByID(this._userID).subscribe(
      (result: any) => {
        console.log('GetUserDetailsByID Data : ', result);
        if (result.isSuccess) {
          this.UserDetails = result.data as UserDetailsInterface;
        }
      },
      (error: any) => {
        $('.toast-title').text('Error');
        $('.toast-body').text('Something went wrong');
        $('#ToastOperation').addClass('bg-danger').toast('show');
      }
    );
  }

  //
  async handleHome() {
    this.IsHome = true;
    $('#home-menu').addClass('active');
    await this.GetClaimList();

    //set local storage flag
    localStorage.setItem('admin-home', 'true');
  }

  //
  handleUpdateProfile() {
    $('#exampleEditProfileModal').modal('show');
  }

  //
  handleAddClaim() {
    this.IsEdit = false;
    $('#exampleModal').modal('show');
  }

  //
  GetClaimList() {
    this._claimService.GetClaim(this._userID).subscribe(
      (result: any) => {
        debugger;
        console.log('GetClaimList Data : ', result);
        this.List = [];
        if (result.isSuccess) {
          this.List = result.data;
        }
      },
      (error: any) => {
        $('.toast-title').text('Error');
        $('.toast-body').text('Something went wrong');
        $('#ToastOperation').addClass('bg-danger').toast('show');
      }
    );
  }

  handleSubmit(formData: NgForm) {
    console.log('formData : ', formData);
    this.Validation(formData);
    let _dateOfAdmission = new Date(formData.value.dateOfAdmission); //dd-mm-YYYY
    let _dateOfDischarge = new Date(formData.value.dateOfDischarge);
    if (formData.valid) {
      if (_dateOfDischarge < _dateOfAdmission) {
        $('#dateOfAdmission').addClass('ng-invalid ng-touched');
        $('#dateOfDischarge').addClass('ng-invalid ng-touched');
        $('.toast-title').text('Error');
        $('.toast-body').text('Admission Date Not Greater Than Discharge');
        $('#ToastOperation').addClass('bg-danger').toast('show');
        return;
      }

      let _data = {
        userID: localStorage.getItem('admin-user-id'),
        dependentName1: formData.value.dependentName1,
        dependent1Claim: formData.value.dependent1Claim,
        dateOfBirth1: formData.value.dob1,
        dependentName2: formData.value.dependentName2,
        dependent2Claim: formData.value.dependent2Claim,
        dateOfBirth2: formData.value.dob2,
        dateOfAdmission: formData.value.dateOfAdmission,
        dateOfDischarge: formData.value.dateOfDischarge,
        providerName: formData.value.providerName,
        totalBillAmount: Number(formData.value.totalBillAmount),
      };
      this._claimService.AddClaim(_data).subscribe(
        (result: any) => {
          console.log('InsertMedicine Data : ', result);
          $('.toast-body').text(result.message);
          $('.toast-title').text(result.isSuccess ? 'Success' : 'Error');
          $('#ToastOperation')
            .addClass(result.isSuccess ? 'bg-success' : 'bg-danger')
            .toast('show');
          if (result.isSuccess) {
            $('#exampleModal').modal('hide');
            this.handleClearData();
            this.GetClaimList();
            this.handleHome();
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

  handleEditSubmit() {
    debugger;
    if (this.EditValidation()) {
      console.log('Validation Accept');

      if (this._dateOfDischarge < this._dateOfAdmission) {
        $('#dateOfAdmission').addClass('ng-invalid ng-touched');
        $('#dateOfDischarge').addClass('ng-invalid ng-touched');
        $('.toast-title').text('Error');
        $('.toast-body').text('Admission Date Not Greater Than Discharge');
        $('#ToastOperation').addClass('bg-danger').toast('show');
        return;
      }

      let _data = {
        id: this.id,
        userID: this.userID,
        claimID: this.claimID,
        dependentName1: this.dependentName1,
        dateOfBirth1: this.dateOfBirth1,
        dependentName2: this.dependentName2,
        dateOfBirth2: this.dateOfBirth2,
        dependent1Claim: this.dependent1Claim,
        dependent2Claim: this.dependent2Claim,
        dateOfAdmission: this.dateOfAdmission,
        dateOfDischarge: this.dateOfDischarge,
        providerName: this.providerName,
        totalBillAmount: this.totalBillAmount,
      };
      this._claimService.UpdateClaim(_data).subscribe(
        (data: any) => {
          console.log('Update Medicine Data : ', data);
          $('.toast-title').text(data.isSuccess ? 'Success' : 'Error');
          $('.toast-body').text(data.message);
          $('#ToastOperation')
            .addClass(data.isSuccess ? 'bg-success' : 'bg-danger')
            .toast('show');
          $('#exampleEditModal').modal('hide');
          this.handleClearData();
          this.GetClaimList();
          this.IsEdit = false;
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

  EditValidation() {
    this.dependentName1Flag = false;
    this.dateOfBirth1Flag = false;
    this.dependent1ClaimFlag = false;
    this.dependentName2Flag = false;
    this.dateOfBirth2Flag = false;
    this.dependent2ClaimFlag = false;
    this.dateOfAdmissionFlag = false;
    this.dateOfDischargeFlag = false;
    this.providerNameFlag = false;
    this.totalBillAmountFlag = false;
    let Value = true;
    debugger;
    if (this.dependentName1 === '') {
      this.dependentName1Flag = true;
      Value = false;
    }
    if (this.dateOfBirth1 === '') {
      this.dateOfBirth1Flag = true;
      Value = false;
    }
    if (this.dependent1Claim === '') {
      this.dependent1ClaimFlag = true;
      Value = false;
    }

    if (this.dependentName2 === '') {
      this.dependentName2Flag = true;
      Value = false;
    }
    if (this.dateOfBirth2 === '') {
      this.dateOfBirth2Flag = true;
      Value = false;
    }
    if (this.dependent2Claim === '') {
      this.dependent2ClaimFlag = true;
      Value = false;
    }
    if (this.dateOfAdmission === '') {
      this.dateOfAdmissionFlag = true;
      Value = false;
    }
    if (this.dateOfDischarge === '') {
      this.dateOfDischargeFlag = true;
      Value = false;
    }
    if (this.providerName === '') {
      this.providerNameFlag = true;
      Value = false;
    }
    if (this.totalBillAmount === '') {
      this.totalBillAmountFlag = true;
      Value = false;
    }

    return Value;
  }

  handleDelete(id: String) {
    this._claimService.DeleteClaim(id).subscribe((result: any) => {
      console.log('handle Delete Data : ', result);
      $('.toast-title').text(result?.isSuccess ? 'Success' : 'Error');
      $('.toast-body').text(result?.message);
      $('#ToastOperation')
        .addClass(result?.isSuccess ? 'bg-success' : 'bg-danger')
        .toast('show');
      this.GetClaimList();
    });
  }

  handleEdit(data: any) {
    debugger;
    console.log(' Editing Data : ', data);

    this.id = data.id;
    this.userID = data.userID;
    this.claimID = data.claimID;
    this.dependentName1 = data.dependentName1;
    this.dateOfBirth1 = data.dateOfBirth1;
    this.dependentName2 = data.dependentName2;
    this.dateOfBirth2 = data.dateOfBirth2;

    this.dependent1Claim = data.dependent1Claim;
    this.dependent2Claim = data.dependent2Claim;
    this.dateOfAdmission = data.dateOfAdmission;
    this.dateOfDischarge = data.dateOfDischarge;
    this.providerName = data.providerName;
    this.totalBillAmount = data.totalBillAmount;

    this._dateOfAdmission = new Date(data.dateOfAdmission);
    this._dateOfDischarge = new Date(data.dateOfDischarge);

    this.IsEdit = true;

    $('#exampleEditModal').modal('show');
  }

  handleChange(event: any) {
    const { id, value } = event.target;

    if (id === 'dependentName1') {
      this.dependentName1 = value;
    }
    if (id === 'dateOfBirth1') {
      this.dateOfBirth1 = value;
    }
    if (id === 'dependent1Claim') {
      this.dependent1Claim = value;
    }
    if (id === 'dependentName2') {
      this.dependentName2 = value;
    }
    if (id === 'dateOfBirth2') {
      this.dateOfBirth2 = value;
    }
    if (id === 'dependent2Claim') {
      this.dependent2Claim = value;
    }
    if (id === 'dateOfAdmission') {
      this.dateOfAdmission = value;
      this._dateOfAdmission = new Date(value);
    }
    if (id === 'dateOfDischarge') {
      this.dateOfDischarge = value;
      this._dateOfDischarge = new Date(value);
    }
    if (id === 'providerName') {
      this.providerName = value;
    }
    if (id === 'totalBillAmount') {
      this.totalBillAmount = value;
    }
  }

  handleProfileChange(event: any) {
    const { id, value } = event.target;
    if (id === 'user_Name') {
      this.UserDetails.name = value;
    }
    if (id === 'email_ID') {
      this.UserDetails.emailID = value;
    }
    if (id === 'address') {
      this.UserDetails.address = value;
    }
    if (id === 'state') {
      this.UserDetails.state = value;
    }
    if (id === 'country') {
      this.UserDetails.country = value;
    }
    if (id === 'pan_Number') {
      this.UserDetails.panNumber = value;
    }
    if (id === 'contact_Number') {
      this.UserDetails.contactNumber = value;
    }
    if (id === 'date_Of_Birth') {
      this.UserDetails.dateOfBirth = value;
    }
  }

  handleClearData() {
    this.id = '';
    this.userID = '';
    this.claimID = 0;
    this.dependentName1 = '';
    this.dateOfBirth1 = '';
    this.dependent1Claim = '';
    this.dependentName2 = '';
    this.dateOfBirth2 = '';
    this.dependent2Claim = '';
    this.dateOfAdmission = '';
    this.dateOfDischarge = '';
    this.providerName = '';
    this.totalBillAmount = '';

    this.dependentName1Flag = false;
    this.dateOfBirth1Flag = false;
    this.dependent1ClaimFlag = false;
    this.dependentName2Flag = false;
    this.dateOfBirth2Flag = false;
    this.dependent2ClaimFlag = false;
    this.dateOfAdmissionFlag = false;
    this.dateOfDischargeFlag = false;
    this.providerNameFlag = false;
    this.totalBillAmountFlag = false;

    $('#claimName').val('');
    $('#dependentName1').val('');
    $('#dateOfBirth1').val('');
    $('#dependentName2').val('');
    $('#dateOfBirth2').val('');
  }

  Validation(formData: NgForm) {
    $('#dependentName1Text').hide();
    $('#dob1Text').hide();
    $('#dependent1ClaimText').hide();
    $('#dependentName2Text').hide();
    $('#dob2Text').hide();
    $('#dependent2ClaimText').hide();
    $('#dateOfAdmissionText').hide();
    $('#dateOfDischargeText').hide();
    $('#providerNameText').hide();
    $('#totalBillAmountText').hide();

    if (formData.value.dependentName1 === '') {
      $('#dependentName1Text').show();
      $('#dependentName1').addClass('ng-invalid ng-touched');
    }
    if (formData.value.dob1 === '') {
      $('#dob1Text').show();
      $('#dob1').addClass('ng-invalid ng-touched');
    }
    if (formData.value.dependent1Claim === '') {
      $('#dependent1ClaimText').show();
      $('#dependent1Claim').addClass('ng-invalid ng-touched');
    }
    if (formData.value.dependentName2 === '') {
      $('#dependentName2Text').show();
      $('#dependentName2').addClass('ng-invalid ng-touched');
    }
    if (formData.value.dob2 === '') {
      $('#dob2Text').show();
      $('#dob2').addClass('ng-invalid ng-touched');
    }
    if (formData.value.dependent2Claim === '') {
      $('#dependent2ClaimText').show();
      $('#dependent2Claim').addClass('ng-invalid ng-touched');
    }
    if (formData.value.dateOfAdmission === '') {
      $('#dateOfAdmissionText').show();
      $('#dateOfAdmission').addClass('ng-invalid ng-touched');
    }
    if (formData.value.dateOfDischarge === '') {
      $('#dateOfDischargeText').show();
      $('#dateOfDischarge').addClass('ng-invalid ng-touched');
    }
    if (formData.value.providerName === '') {
      $('#providerNameText').show();
      $('#providerName').addClass('ng-invalid ng-touched');
    }
    if (formData.value.totalBillAmount === '') {
      $('#totalBillAmountText').show();
      $('#totalBillAmount').addClass('ng-invalid ng-touched');
    }
  }

  handleProfileEditSubmit() {
    if (this.ProfileValidation()) {
      let data = {
        id: this.UserDetails.id,
        name: this.UserDetails.name,
        emailID: this.UserDetails.emailID,
        address: this.UserDetails.address,
        state: this.UserDetails.state,
        country: this.UserDetails.country,
        panNumber: this.UserDetails.panNumber,
        contactNumber: this.UserDetails.contactNumber,
        dateOfBirth: this.UserDetails.dateOfBirth,
      };
      this._claimService.UpdateUserDetails(data).subscribe(
        (result: any) => {
          console.log('UpdateUserDetails Data : ', result);
          if (result.isSuccess) {
            $('#exampleEditProfileModal').modal('hide');
          }

          $('.toast-title').text(result.isSuccess ? 'Success' : 'Error');
          $('.toast-body').text(result.message);
          $('#ToastOperation')
            .addClass(result.isSuccess ? 'bg-success' : 'bg-danger')
            .toast('show');
        },
        (error: any) => {
          console.log('UpdateUserDetails Error : ', error);
          $('.toast-title').text('Error');
          $('.toast-body').text('Something Went Wrong');
          $('#ToastOperation').addClass('bg-danger').toast('show');
        }
      );
    }
  }

  ProfileValidation() {
    this.commonClearErrorjQuery('user_Name');
    this.commonClearErrorjQuery('email_ID');
    this.commonClearErrorjQuery('address');
    this.commonClearErrorjQuery('state');
    this.commonClearErrorjQuery('country');
    this.commonClearErrorjQuery('pan_Number');
    this.commonClearErrorjQuery('contact_Number');
    this.commonClearErrorjQuery('date_Of_Birth');
    let Value = true;

    if (this.UserDetails.name === '') {
      this.commonErrorjQuery('user_Name', 'Field Is Required');
      Value = false;
    } else {
      debugger;
      if (!NameRegex.test(this.UserDetails.name)) {
        this.commonErrorjQuery('user_Name', 'Name Must Be In Alphabet');
        Value = false;
      }
    }
    if (this.UserDetails.emailID === '') {
      this.commonErrorjQuery('email_ID', 'Field Is Required');
      Value = false;
    } else {
      if (!EmailRegex.test(this.UserDetails.emailID)) {
        this.commonErrorjQuery('email_ID', 'Please Enter Valid Email Address');
        Value = false;
      }
    }
    if (this.UserDetails.address === '') {
      this.commonErrorjQuery('address', 'Field Is Required');
      Value = false;
    }
    if (this.UserDetails.state === '') {
      this.commonErrorjQuery('state', 'Field Is Required');
      Value = false;
    }
    if (this.UserDetails.country === '') {
      this.commonErrorjQuery('country', 'Field Is Required');
      Value = false;
    }
    if (this.UserDetails.panNumber === '') {
      this.commonErrorjQuery('pan_Number', 'Field Is Required');
      Value = false;
    } else {
      if (!PANRegex.test(this.UserDetails.panNumber)) {
        this.commonErrorjQuery('pan_Number', 'Please Enter Valid PAN No.');
        Value = false;
      }
    }
    if (this.UserDetails.contactNumber === '') {
      this.commonErrorjQuery('contact_Number', 'Field Is Required');
      Value = false;
    } else {
      if (!MobileRegex.test(this.UserDetails.contactNumber)) {
        this.commonErrorjQuery(
          'contact_Number',
          'Please Enter Valid Mobile No.'
        );
        Value = false;
      }
    }
    if (this.UserDetails.dateOfBirth === '') {
      this.commonErrorjQuery('date_Of_Birth', 'Field Is Required');
      Value = false;
    } else {
      debugger;
      var varDate = new Date(this.UserDetails.dateOfBirth); //dd-mm-YYYY
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (varDate >= today) {
        this.commonErrorjQuery('date_Of_Birth', 'Please Enter Valid DOB');
        Value = false;
      }
    }

    return Value;
  }

  commonClearErrorjQuery(_id: string) {
    $('#' + _id).removeClass('ng-invalid ng-touched');
    $('#' + _id + 'Text').hide();
  }

  commonErrorjQuery(_id: string, _message: string) {
    $('#' + _id).addClass('ng-invalid ng-touched');
    $('#' + _id + 'Text')
      .text(_message)
      .css('color', 'red')
      .show();
  }

  handleSignOut() {
    localStorage.removeItem('admin-user-id');
    localStorage.removeItem('admin-email');
    localStorage.removeItem('admin-jwt-token');
    localStorage.removeItem('admin-home');
    localStorage.removeItem('admin-order');
    if (localStorage.getItem('user-jwt-token') === null) {
      localStorage.removeItem('common-jwt-token');
    }
    window.location.href = '/';
  }
}
