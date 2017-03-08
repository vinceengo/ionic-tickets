import { ProVersionPage } from './../pages/pro-version/pro-version';
import { FriendsPage } from './../pages/friends/friends';
import { TicketsPage } from './../pages/tickets/tickets';
import { AuthenticationPage } from './../pages/authentication/authentication';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AuthController } from './../providers/auth-controller';
import { SharedService } from './../providers/shared-service';
import { HttpHelper } from './../providers/http-helper';
import { InternetService } from './../providers/internet-service';
import { Subscription } from 'rxjs/Subscription';

export class MenuItem {
  title: string
  component: any
  icon: string
  separator: boolean
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnDestroy {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<MenuItem>;
  private fullname: string;
  private photo: string;

  private hasSubscription: boolean = false;

  private AuthSubscription: Subscription;
  private ProSubscription: Subscription;

  private connectSubscription: Subscription;
  private disconnectSubscription: Subscription;
  // for some reasons, onDisconnect is fired twice every time
  // so we need to make use of a boolean
  private isLocal: boolean = false;

  // keep the original list so that we can restore it when the user is back from offline
  // must be constant
  private menuLinks: Array<MenuItem> = [
    { title: 'Billets', component: TicketsPage, icon: 'paper', separator: false },
    { title: 'Amis', component: FriendsPage, icon: 'person', separator: false },
    { title: 'Version Pro', component: ProVersionPage, icon: 'cash', separator: true }
  ];

  constructor(public platform: Platform, public authCtrl: AuthController, public sharedService: SharedService, public interService: InternetService, public helper: HttpHelper) {
    this.initializeApp();

    // initialize the menu
    this.pages = this.menuLinks;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      if (this.authCtrl.isLocal()) { // there's no internet access
        // show tickets from local storage
        this.rootPage = TicketsPage;
        this.isLocal = true;
      } else {
        // update profile in both case, but in a different way
        // and other configurations
        if (this.authCtrl.hasBeenAuthenticated()) {
          this.rootPage = TicketsPage;
          this.updateProfile(this.authCtrl.getCurrentUser());
          if (this.authCtrl.getCurrentUser().proVersion) {
            // remove pro version menu link since it's already a pro version
            this.pages.pop();
          }
        } else {
          this.rootPage = AuthenticationPage;
          this.AuthSubscription = this.sharedService.getAuthSubject()
            .subscribe(() => this.updateProfile(this.authCtrl.getCurrentUser()));
          this.ProSubscription = this.sharedService.getProSubject()
            .subscribe(() => {
              // update menu links
              this.pages.pop();
            });
          this.hasSubscription = true;
        }
      }
    });
  }

  // Respond after Angular initializes the component's views and child views
  // need to be done outside of ready(), preventing from crashing
  public ngAfterViewInit() {
    // watch network for a disconnect
    this.disconnectSubscription = this.interService.GetOnDisconnect().subscribe(() => {
      if (!this.isLocal) {
        this.helper.showToast('Vous êtes déconnectés');
        this.nav.setRoot(TicketsPage);
        this.isLocal = true;
        if (this.hasSubscription) {
          this.AuthSubscription.unsubscribe();
          this.ProSubscription.unsubscribe();
          this.hasSubscription = false;
        }
      }
    });

    // watch network for a connection
    this.connectSubscription = this.interService.GetOnConnect().subscribe(() => {
      // We just got a connection but we need to wait briefly
      // before we determine the connection type.  Might need to wait
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.interService.hasInternetAccess()) {
          if (this.isLocal) {
            this.helper.showToast('Vous êtes reconnectés');
            // restore menu links
            this.pages = this.menuLinks;
            this.isLocal = false;
            if (this.authCtrl.hasBeenAuthenticated()) {
              // reload the user saved in local storage
              this.authCtrl.refreshUser();
              this.updateProfile(this.authCtrl.getCurrentUser());
              if (this.authCtrl.getCurrentUser().proVersion) {
                // remove pro version menu link since it's already a pro version
                this.pages.pop();
              }
              // need to be the last line so that all code could be executed
              this.nav.setRoot(TicketsPage);
            } else {
              this.AuthSubscription = this.sharedService.getAuthSubject()
                .subscribe(() => this.updateProfile(this.authCtrl.getCurrentUser()));
              this.ProSubscription = this.sharedService.getProSubject()
                .subscribe(() => {
                  // update menu links
                  this.pages.pop();
                });
              this.hasSubscription = true;
              this.nav.setRoot(AuthenticationPage);
            }
          }
        }
      }, 3000);
    });
  }

  public openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  private updateProfile(currentUser) {
    this.fullname = currentUser.fullname;
    this.photo = currentUser.photo;
  }

  public ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    if (this.hasSubscription) {
      this.AuthSubscription.unsubscribe();
      this.ProSubscription.unsubscribe();
    }
    this.disconnectSubscription.unsubscribe();
    this.connectSubscription.unsubscribe();
  }
}
