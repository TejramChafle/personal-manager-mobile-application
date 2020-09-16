import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Application } from './app.component';

// Pages
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { LauncherPageModule } from '../pages/launcher/launcher.module';

// Plugins
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from '@ionic-native/push';
import { Device } from '@ionic-native/device';

// Service Providers
import { AppProvider } from './app.provider';
import { AuthProvider } from '../pages/auth/auth.provider';
import { EventsProvider } from '../pages/events/events.provider';

// Modal Pages
import { ServiceTermsPage } from '../pages/auth/service-terms/service-terms';
import { ScheduleEventPage } from '../pages/events/schedule-event/schedule-event';

// Interceptor
import { AuthInterceptor } from '../interceptors/auth.interceptor';

@NgModule({
  declarations: [
    Application,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    ServiceTermsPage,
    ScheduleEventPage
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
    ServiceTermsPage,
    ScheduleEventPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    Device,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AppProvider,
    AuthProvider,
    EventsProvider
  ]
})
export class ApplicationModule { }
