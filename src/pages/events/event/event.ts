import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController } from 'ionic-angular';
import { ScheduleEventPage } from '../schedule-event/schedule-event';
import { AppProvider } from '../../../app/app.provider';
import { EventsProvider } from '../events.provider';

/**
 * Generated class for the EventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})

export class EventPage {
  event: any;
  constructor(
    public navParams: NavParams, 
    private modalCtrl: ModalController, 
    private appProvider: AppProvider,
    private eventsProvider: EventsProvider) {
    this.event = this.navParams.data.event;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage', this.navParams);
  }

  editEvent() {
    console.log(this.event);
    let modal = this.modalCtrl.create(
      ScheduleEventPage,
      { event: this.event },
      { showBackdrop: true, cssClass: 'schedule-modal' }
    );
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {

        console.log(data);

        let startDate = new Date(data.startDate);
        startDate.setHours(parseInt(data.startTime.split(':')[0]));
        startDate.setMinutes(parseInt(data.startTime.split(':')[1]));
        let endDate = new Date(data.endDate);
        endDate.setHours(parseInt(data.endTime.split(':')[0]));
        endDate.setMinutes(parseInt(data.endTime.split(':')[1]));

        let eventData = {
          name: data.title,
          description: data.description,
          all_day: data.allDay,
          month_loop: data.monthLoop,
          start_time: new Date(startDate),
          end_time: new Date(endDate)
        };

        console.log(eventData);

        // Show loading while event is being saved on server
        this.appProvider.presentLoading('Saving, Please wait..');

        this.eventsProvider.composeEvent(eventData).subscribe((response) => {
          // Dismiss loading after saving
          this.appProvider.dismissLoading();

          console.log('composeEvent response', response);

          // Refresh calender after adding new event. Get the latest event from server
          this.ionViewDidLoad();
        }, (error) => {
          console.log('composeEvent error', error);
          // Dismiss loading even if error encountered
          this.appProvider.dismissLoading();
        });

      }
    });
  }

}
