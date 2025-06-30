import { Component } from '@angular/core';
import { SqliteService } from './services/sqlite.service';
import { Storage } from '@ionic/storage-angular';

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
  }
}
