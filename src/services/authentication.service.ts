import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private _httpClient: HttpClient) {}

  SignIn(data: any) {
    return this._httpClient.get(
      environment.BEServer.DevEnviroment +
        `Authentication/SignIn?EmailId=${data.EmailId}&Password=${data.Password}`
    );
  }

  SignUp(data: any) {
    const option = {};
    return this._httpClient.post(
      environment.BEServer.DevEnviroment + 'Authentication/SignUp',
      data,
      option
    );
  }

}
