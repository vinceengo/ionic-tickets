import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { AppSettings } from './app-settings';
import { SharedService } from './shared-service';
import { AuthController } from './auth-controller';
import { HttpHelper } from './http-helper';

/*
  Generated class for the ProVersionController provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProVersionController {

  private paymentApiUrl: string = this.appSettings.getPaymentApiUrl();

  constructor(public http: Http, public appSettings: AppSettings, public authCtrl: AuthController, public sharedService: SharedService, public helper: HttpHelper) {
  }

  public buyProVersion() {
    this.authCtrl.updateProVersion();
  }

  public postBuy(cardInfo: any, token: string) {
    let headers = new Headers();
    headers.append('x-access-token', token);
    return this.http.post(
      this.paymentApiUrl + '/pro_version/buy',
      cardInfo,
      new RequestOptions({ 'headers': headers })
    )
      .map(res => res.json())
      .toPromise()
      .then(res => {
        // notify all subscribers
        this.sharedService.notifyProSubscribers();
        return Promise.resolve();
      })
      .catch(err => this.helper.convertToJSON(err));
  }

}
