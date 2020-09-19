import { AppProvider } from './app.provider';
import { Component, ViewChild, OnInit } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
// import { LauncherPage } from '../pages/launcher/launcher';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AuthProvider } from '../pages/auth/auth.provider';
import { Device } from '@ionic-native/device';

@Component({
  templateUrl: 'app.component.html'
})

export class Application implements OnInit {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = localStorage.getItem('auth') ? 'HomePage' : 'LauncherPage';
  pages: Array<{ icon: string, title: string, component: any }>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private push: Push,
    public appProvider: AppProvider,
    public authProvider: AuthProvider,
    public device: Device
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { icon: 'analytics', title: 'Hello Ionic', component: HelloIonicPage },
      { icon: 'list', title: 'My First List', component: ListPage },
      { icon: 'home', title: 'Home', component: 'HomePage' },
      { icon: 'calendar', title: 'Calendar', component: 'CalendarPage' },
      { icon: 'log-out', title: 'Logout', component: 'SigninPage' }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Check the device information, firebase token on server
      setTimeout(() => {
        this.authProvider.performCheckAndSaveDeviceOnServer({
          device: this.device,
          firebase_token: this.appProvider.registrationId
        });
      }, 1500)

    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    if (page.title == 'Logout') {
      this.authProvider.logout();
    }
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
      alert('Received a notification ' + JSON.stringify(notification));
    });

    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration);
      // alert('Device registered ' + JSON.stringify(registration));
      this.appProvider.registrationId = registration.registrationId;
    });

    pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error);
      alert('Error with Push plugin ' + JSON.stringify(error));
    });

    // this.appProvider.registrationId = '1072996084283';

    // Assign device
    this.appProvider.device = this.device;

  }


  onSaveDevice() {
    const device = { ...this.device, firebase_token: this.appProvider.registrationId, user: this.authProvider.user.user.id };
    alert(JSON.stringify(device));

    if (this.appProvider.device && this.appProvider.registrationId) {
      this.authProvider.saveDeviceInformation(device).subscribe((response) => {
        console.log('response : ', response);
        alert(response.message);
      }, (error) => {
        console.log('error: ', error);
      });
    } else {
      alert('Device information and firebase token missing. Can\'t save on server.');
    }

  }

  onSendNotification() {
    this.authProvider.sendNotification().subscribe((response) => {
      console.log('sendNotification response : ', response);
      alert(response.message);
    }, (error) => {
      console.log('error: ', error);
    });
  }
}
