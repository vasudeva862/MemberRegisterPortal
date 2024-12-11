import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ClaimService {
  constructor(private _httpClient: HttpClient) {}
  AddClaim(data: any) {
    return this._httpClient.post(
      environment.BEServer.DevEnviroment + 'Claim/AddClaim',
      data
    );
  }

  UpdateClaim(data: any) {
    return this._httpClient.put(
      environment.BEServer.DevEnviroment + 'Claim/UpdateClaim',
      data
    );
  }

  GetClaim(data: String) {
    return this._httpClient.get(
      environment.BEServer.DevEnviroment + 'Claim/GetClaim?UserID=' + data
    );
  }

  DeleteClaim(data: String) {
    return this._httpClient.delete(
      environment.BEServer.DevEnviroment + 'Claim/DeleteClaim?Id=' + data
    );
  }

  GetUserDetailsByID(data: String) {
    const option = {};
    return this._httpClient.get(
      environment.BEServer.DevEnviroment +
        'Authentication/GetUserDetailsByID?ID=' +
        data,
      option
    );
  }

  UpdateUserDetails(data: any) {
    const option = {};
    return this._httpClient.put(
      environment.BEServer.DevEnviroment + 'Authentication/UpdateUserDetails',
      data,
      option
    );
  }
}
