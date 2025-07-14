import { Component, OnInit } from '@angular/core';
import { SqliteService } from './services/sqlite.service';
import { Storage } from '@ionic/storage-angular';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private _storage: Storage | null = null;

  constructor(private storage: Storage, private sqliteService: SqliteService) {}

  async ngOnInit() {
    await this.storage.create();

    const noti = await this.storage.get('notificacionesActivas');
    if (noti === null) {
      await this.storage.set('notificacionesActivas', true);
    }
    await this.sqliteService.initDB();
    await LocalNotifications.requestPermissions();
  }
}
