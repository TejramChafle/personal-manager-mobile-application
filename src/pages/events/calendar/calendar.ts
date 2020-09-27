import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { ScheduleEventPage } from '../schedule-event/schedule-event';
import { EventsProvider } from '../events.provider';
import { AppProvider } from '../../../app/app.provider';

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})

export class CalendarPage {

  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  calenderMode = 'month';
  calendar: any = {};

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private eventsProvider: EventsProvider,
    private appProvider: AppProvider) {
      this.calendar = {
        mode: 'month',
        currentDate: new Date()
      };
  }

  ionViewDidLoad() {
    // Show loading while event is being saved on server
    this.appProvider.presentLoading('Loading..');
    this.eventsProvider.getEvents({}).subscribe((response) => {
      console.log('getEvents response', response);
      let events = [];
      if (Array.isArray(response)) {
        response.forEach(element => {
          events.push({
            title: element.name,
            description: element.description,
            allDay: element.all_day,
            monthLoop: element.month_loop,
            startTime: new Date(element.start_time),
            endTime: new Date(element.end_time)
          })
        });
      }

      // console.log(this.eventSource);

      this.eventSource = [];
      setTimeout(() => {
        this.eventSource = events;
        console.log(this.eventSource);

        // Dismiss the loading once events polulated in calender
        this.appProvider.dismissLoading();
      });

    }, (error) => {
      console.log('getEvents error', error);
      // Dismiss loading even if error encountered
      this.appProvider.dismissLoading();
    });
  }

  addEvent() {
    let modal = this.modalCtrl.create(
      ScheduleEventPage,
      { selectedDay: this.selectedDay },
      { showBackdrop: true, cssClass: 'schedule-modal' }
    );
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {

        /* let eventData = data;
        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);

        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
          console.log(this.eventSource);
        }); */

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

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    })
    alert.present();
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

  // Change the calender view on change of mode
  onModeChange() {
    this.calendar.mode = this.calenderMode;
  }

}
