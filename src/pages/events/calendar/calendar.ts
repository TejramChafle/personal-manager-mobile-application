import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { ScheduleEventPage } from '../schedule-event/schedule-event';
import { EventsProvider } from '../events.provider';

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})

export class CalendarPage {

  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private eventsProvider: EventsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');
    this.eventsProvider.getEvents({}).subscribe((response)=> {
      console.log('getEvents response', response);
      let events = [];
      if (Array.isArray(response)) {
        response.forEach(element => {
          events.push( {
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
      });
      
    }, (error)=> {
      console.log('getEvents error', error);
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

        let eventData = {
          name: data.title,
          description: data.description,
          all_day: data.allDay,
          month_loop: data.monthLoop,
          start_time: new Date(data.startTime),
          end_time: new Date(data.endTime)
        };

        this.eventsProvider.composeEvent(eventData).subscribe((response)=> {
          console.log('composeEvent response', response);
          this.ionViewDidLoad();
        }, (error)=> {
          console.log('composeEvent error', error);
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

}
