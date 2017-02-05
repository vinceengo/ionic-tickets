import { ShowsPage } from './../shows/shows';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Friends page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  // navigation for prototype (go to ShowsPage of "Ben Smith")
  goToShows() {
    this.navCtrl.push(ShowsPage);
  }

}
