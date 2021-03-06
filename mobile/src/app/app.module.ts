import { ShowsPage } from './../pages/shows/shows';
import { ProVersionPage } from './../pages/pro-version/pro-version';
import { FriendsPage } from './../pages/friends/friends';
import { QrCodePage } from './../pages/qr-code/qr-code';
import { TicketsPage, UpcomingTicketsPipe } from './../pages/tickets/tickets';
import { AuthenticationPage } from './../pages/authentication/authentication';
import { AdBannerComponent } from './../components/ad-banner/ad-banner'
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp, ActiveLinksPipe } from './app.component';
import { Maximizable } from './../components/maximizable/maximizable';
import { Separator } from './../components/separator/separator';
import { AuthController } from './../providers/auth-controller';
import { TicketController } from './../providers/ticket-controller';
import { FriendController } from './../providers/friend-controller';
import { ProVersionController } from './../providers/pro-version-controller';
import { SharedService } from './../providers/shared-service';
import { AppSettings } from './../providers/app-settings';
import { ShowController } from './../providers/show-controller';
import { StorageService } from './../providers/storage-service';
import { InternetService } from './../providers/internet-service';
import { HttpHelper } from './../providers/http-helper';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    MyApp,
    AuthenticationPage,
    TicketsPage,
    QrCodePage,
    FriendsPage,
    ShowsPage,
    ProVersionPage,
    AdBannerComponent,
    Maximizable,
    Separator,
    UpcomingTicketsPipe,
    ActiveLinksPipe
  ],
  imports: [
    QRCodeModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AuthenticationPage,
    TicketsPage,
    QrCodePage,
    FriendsPage,
    ShowsPage,
    ProVersionPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthController,
    TicketController,
    AppSettings,
    ProVersionController,
    SharedService,
    FriendController,
    ShowController,
    InternetService,
    StorageService,
    HttpHelper
  ]
})
export class AppModule {}
