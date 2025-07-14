import { Component } from '@angular/core';
import { SqliteService } from './services/sqlite.service';
import { Storage } from '@ionic/storage-angular';
import { LocalNotifications } from '@capacitor/local-notifications';

//EXTRA
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  private _storage: Storage | null = null;

  constructor(private storage: Storage, private sqliteService: SqliteService) {}

  async ngOnInit() {
    await this.storage.create();
    await this.sqliteService.initDB();
    await LocalNotifications.requestPermissions();
  }
}
