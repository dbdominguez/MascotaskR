import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  sqlite: SQLiteConnection;
  db: SQLiteDBConnection | null = null;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite as any);
  }

  async initDB() {
    if (!this.db) {
      this.db = await this.sqlite.createConnection('mascotaDB', false, 'no-encryption', 1, false);
      await this.db.open();
    }

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS habitos (
        id INTEGER PRIMARY KEY,
        nombre TEXT,
        categoria TEXT,
        hora TEXT,
        dias TEXT,
        completado INTEGER
      );

      CREATE TABLE IF NOT EXISTS progreso_diario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT UNIQUE,
      total INTEGER,
      cumplidos INTEGER
      );

      CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      genero TEXT NOT NULL,
      fecha_nacimiento TEXT NOT NULL,
      correo TEXT NOT NULL UNIQUE,
      clave TEXT NOT NULL,
      apodo TEXT 
      );
    `);
  }

    public async getDB(): Promise<SQLiteDBConnection> {
    if (!this.db) {
      await this.initDB();
    }
    return this.db!;
  }


  async existeUsuario(correo: string): Promise<boolean> {
    const db = await this.getDB();
    const result = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (result.values && result.values.length > 0) {
      return true;
    }
    return false;
  }

  async registrarUsuario(nombre: string, genero: string, fechaNacimiento: string, correo: string, clave: string): Promise<void> {
    const db = await this.getDB();
    await db.run(
      `INSERT INTO usuarios (nombre, genero, fecha_nacimiento, correo, clave)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, genero, fechaNacimiento, correo, clave]
    );
  }

  async agregarHabito(habito: any) {
    const query = `
      INSERT INTO habitos (nombre, categoria, hora, dias, completado)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      habito.nombre,
      habito.categoria,
      habito.hora,
      habito.dias.join(','),
      0
    ];
    await this.db?.run(query, values);
    console.log('[SQLite] Hábito guardado correctamente en la base de datos:', habito);
  }

  async obtenerHabitosHoy(): Promise<any[]> {
    const result = await this.db?.query('SELECT * FROM habitos');
    return result?.values || [];
  }

  async actualizarCompletado(id: number, valor: boolean) {
    await this.db?.run(
      'UPDATE habitos SET completado = ? WHERE id = ?',
      [valor ? 1 : 0, id]
    );
  }

  async eliminarHabito(id: number) {
    await this.db?.run('DELETE FROM habitos WHERE id = ?', [id]);
  }

  async editarHabito(habito: any) {
    const query = `
      UPDATE habitos
      SET nombre = ?, categoria = ?, hora = ?, dias = ?
      WHERE id = ?
    `;
    const values = [
      habito.nombre,
      habito.categoria,
      habito.hora,
      habito.dias.join(','),
      habito.id
    ];

    await this.db?.run(query, values);
  }

//Progreso  
  async guardarProgresoDiario(fecha: string, total: number, cumplidos: number) {
    await this.db?.run(
      `INSERT INTO progreso_diario (fecha, total, cumplidos) VALUES (?, ?, ?)`,
      [fecha, total, cumplidos]
    ); 
  }

  async progresoYaRegistrado(fecha: string): Promise<boolean> {
    const result = await this.db?.query(
      `SELECT COUNT(*) as cantidad FROM progreso_diario WHERE fecha = ?`,
      [fecha]
    );
    return result?.values?.[0]?.cantidad > 0;  
  }

  async obtenerHistorialProgreso(): Promise<any[]> {
    const result = await this.db?.query(`SELECT * FROM progreso_diario ORDER BY fecha DESC`);
    return result?.values || [];
  }
  
//Extra
  async borrarProgresoDiario() {
    await this.db?.execute(`DELETE FROM progreso_diario`);
  }
  
}