import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';

@Component({
  selector: 'page-schedule-event',
  templateUrl: 'schedule-event.html',
})

export class ScheduleEventPage {
  
  event = { 
    title: null, 
    description: null, 
    startDate: null,
    startTime: null, 
    endDate: null,
    endTime: null, 
    allDay: false, 
    monthLoop: false 
  };

  minDate: string;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    // let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    // this.event.startTime = preselectedDate;
    // this.event.endTime = preselectedDate;

    if(this.navParams.get('event')) {
      const today = new Date(this.navParams.get('event').startTime).toISOString();
      this.minDate = today.split('T')[0];
      this.event = { 
        title: this.navParams.get('event').title, 
        description: this.navParams.get('event').description, 
        startDate: this.minDate,
        startTime: this.navParams.get('event').startTime.getHours()+':'+this.navParams.get('event').startTime.getMinutes(), 
        endDate: this.navParams.get('event').endDate,
        endTime: this.navParams.get('event').endTime, 
        allDay: this.navParams.get('event').allDay, 
        monthLoop: this.navParams.get('event').monthLoop 
      };

      console.log(today.split(':')[0]+':'+today.split(':')[1]);

    } else {
      const today = new Date().toISOString();
      this.minDate = today.split('T')[0];
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleEventPage');
  }

  onDismiss() {
    this.viewCtrl.dismiss();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }
 
  save() {
    this.viewCtrl.dismiss(this.event);
  }

}
