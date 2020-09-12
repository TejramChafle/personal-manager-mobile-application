import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthProvider } from '../auth.provider';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})

export class SigninPage {
  loginForm: NgForm;
  loading: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }

  onLogin(form: NgForm) {
    this.loading = true;
    this._authProvider.login(form).subscribe((response) => {
      this.loading = false;
      this.navCtrl.setRoot('HomePage');
    }, (error) => {
      this.loading = false;
    })
  }

  onSignup() {
    this.navCtrl.setRoot('SignupPage');
  }
}
