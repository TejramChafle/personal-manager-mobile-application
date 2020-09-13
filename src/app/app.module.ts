import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { Application } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { LauncherPageModule } from '../pages/launcher/launcher.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from '@ionic-native/push';
import { AppProvider } from './app.provider';
import { AuthProvider } from '../pages/auth/auth.provider';
import { ServiceTermsPage } from '../pages/auth/service-terms/service-terms';

@NgModule({
  declarations: [
    Application,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    ServiceTermsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(Application),
    LauncherPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Application,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    ServiceTermsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AppProvider,
    AuthProvider
  ]
})
export class ApplicationModule { }
