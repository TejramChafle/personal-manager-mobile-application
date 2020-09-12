import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthProvider } from '../auth.provider';
import { AppProvider } from '../../../app/app.provider';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})

export class SigninPage {
  loginForm: NgForm;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private _authProvider: AuthProvider, 
    private _appProvider: AppProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }

  onLogin(form: NgForm) {
    this._appProvider.presentLoading('Authenticating..');
    this._authProvider.login(form).subscribe((response) => {
      console.log(response);
      localStorage.setItem('auth', response);
      this.navCtrl.setRoot('HomePage');
      this._appProvider.dismissLoading();
    }, (error) => {
      this._appProvider.dismissLoading();
    })
  }

  onSignup() {
    this.navCtrl.setRoot('SignupPage');
  }
}
