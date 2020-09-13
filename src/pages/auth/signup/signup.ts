import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthProvider } from '../auth.provider';
import { AppProvider } from '../../../app/app.provider';
import { ServiceTermsPage } from '../service-terms/service-terms';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {

  signupForm: NgForm;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private _authProvider: AuthProvider, 
    private _appProvider: AppProvider,
    public _modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  onSignup(form: NgForm) {
    this._appProvider.presentLoading('Saving..');
    console.log(form);
    this._authProvider.signup(form).subscribe((response) => {
      console.log(response);
      localStorage.setItem('auth', response);
      this.navCtrl.setRoot('HomePage');
      this._appProvider.dismissLoading();
    }, (error) => {
      console.log(error);
      this._appProvider.dismissLoading();
    })
  }

  onSignin() {
    this.navCtrl.setRoot('SigninPage');
  }

  onTermsClick() {
    console.log('onTermsClick');
    let serviceModal = this._modalCtrl.create(ServiceTermsPage);
    serviceModal.present();
  }

}
