import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  /**for providedIn*/
  providedIn: 'root'
})
export class ApiService {
  /**for percent Done */
  percentDone: any = "";
  pipe = new DatePipe('en-US');

  Headers = {
    'id': 'GITIGNORE',
    'password': 'Y4vYeF>lg955_yvd1N',
    'secret': 'rvEDFrqRzbMLnB7em37krR35b16M5z1x0z/O9EoAmOw='
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    // private loader: LoaderService,
    // private encryptService: LoginService,

  ) {
    let loginUser: any;
    if (typeof localStorage !== 'undefined') {
      loginUser = localStorage.getItem('loginUser');
    }
    // this.currentUserSubject = new BehaviorSubject<LoginUser>(this.DecryptObject(loginUser));
    // this.currentUser = this.currentUserSubject.asObservable();
  }

  /**Get User Session data */
  get UserSession() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const LoginData = localStorage.getItem('lgusr');
      if (LoginData) {
        let userdata: any = JSON.parse(LoginData);

        if (userdata == 0) {
          localStorage.removeItem('loginUser');
          window.location.href = '/';
        } else {
          return userdata;
        }
      } else {
        localStorage.removeItem('loginUser');
        window.location.href = '/';
      }
    }
    localStorage.removeItem('loginUser');
    window.location.href = '/';
  }

  /**
   * CallService
   * @param ServiceName ServiceName
   * @param ReqBody ReqBody
   * @param isForm isForm
   * @returns response
   */
  CallService(ServiceName: string, ReqBody: any = {}): any {
    try {
      const allServiceName = ['/Login'];

      if (!allServiceName.includes(ServiceName)) {
        ReqBody.Token = this.UserSession.Token;
        ReqBody.UserId = this.UserSession.UserId;
        ReqBody.Role = this.UserSession.Role;
      } else {
        const Token = 'rvEDFrqRzbMLnB7em37krR35b16M5z1x0z/O9EoAmOw=';
        ReqBody.Token = Token;
      }
      console.log(ReqBody);
      console.log(this.UserSession);


      return this.http.post<any>(environment.apiUrl + ServiceName, ReqBody)
        .pipe(map(
          data => {
            const ApiResponce = data;
            if (ApiResponce?.status == "2") {
              // this.alert.sweetAlert(ApiResponce['message'], "error");
              // setTimeout(() => {
              //   localStorage.removeItem('loginUser');
              //   window.location.href = '/';
              // }, 1000);
            }
            return ApiResponce;
          }));
    }
    catch (error) {
      return error;
    }
  }


  /**
   * CallService
   * @param ServiceName ServiceName
   * @param ReqBody ReqBody
   * @param isForm isForm
   * @returns response
   */
  FileUpload(ServiceName: string, ReqBody: any = {}, FormReqBody: any = {}): any {
    try {
      // Add necessary headers, including the secret token from user session
      const Header = {
        ...this.Headers,
        secret: this.UserSession.Token
      }
      const headers = new HttpHeaders(Header);

      // Add common properties to the request body
      ReqBody.Token = this.UserSession.Token;
      ReqBody.UserId = this.UserSession.UserId;

      // If FormReqBody is not empty, append encrypted ReqBody to it
      FormReqBody.append('Request', ReqBody);
      // Make the POST request using HttpClient
      return this.http.post<any>(
        environment.apiUrl + ServiceName,
        FormReqBody,
        { headers: headers }
      ).pipe(
        map(data => {
          // Decrypt the response data
          const ApiResponse = data;

          // Check if the status is not "1" and handle accordingly
          if (ApiResponse?.status !== "1") {
            // Handle error (e.g., show alerts, redirect, etc.)
          }

          return ApiResponse;
        })
      );
    } catch (error) {
      return error;
    }
  }



  Login(ReqBody: any = {}): any {
    try {
      const Email = ReqBody.Email;
      const Password = ReqBody.Password;
      const Token = 'rvEDFrqRzbMLnB7em37krR35b16M5z1x0z/O9EoAmOw=';
      const body = {
        Email: Email,
        Password: Password,
        Token: Token
      };

      // console.log('Making login request with body:', body); // Add this log
      return this.http.post<any>(environment.apiUrl + '/Login', body, {})
        .pipe(map(data => {
          // console.log('Login response:', data); // Add this log
          const LoginResponce = data;
          if (LoginResponce?.status == "1") {
            const LoginData = LoginResponce?.data;
            const Token = LoginResponce?.Token;
            const localStore = {
              ...LoginData,
              "Token": Token
            }

            localStorage.setItem('lgusr', JSON.stringify(localStore));
          }
          return LoginResponce;
        }));
    } catch (error) {
      console.error('Error in login request:', error); // Add this log
      return error;
    }
  }


}
