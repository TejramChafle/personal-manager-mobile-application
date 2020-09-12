import { AppProvider } from './app.provider';
import { Component, ViewChild, OnInit } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
// import { LauncherPage } from '../pages/launcher/launcher';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.component.html'
})

export class Application implements OnInit {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = localStorage.getItem('auth') ? 'HomePage' : 'LauncherPage';
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private push: Push,
    public appProvider: AppProvider
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Hello Ionic', component: HelloIonicPage },
      { title: 'My First List', component: ListPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }


  // On application load, check the push notification requirements and generate token
  ngOnInit() {

    // to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {
        alert(JSON.stringify(res));
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
          // alert('We have permission to send push notifications.');
        } else {
          console.log('We do not have permission to send push notifications');
          alert('We do not have permission to send push notifications');
        }
      });

    // to initialize push notifications

    const options: PushOptions = {
      android: {
        senderID: '1072996084283'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    };

    const pushObject: PushObject = this.push.init(options);


    pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a notification', notification);
      alert('Received a notification '+ JSON.stringify(notification));
    });

    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration);
      // alert('Device registered ' + JSON.stringify(registration));
      this.appProvider.registrationId = registration.registrationId;
    });

    pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error);
      alert('Error with Push plugin '+JSON.stringify(error));
    });

    // this.appProvider.registrationId = '1072996084283';
  }
}
