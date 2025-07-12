const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/actividades.db');

db.serialize(() => {
    // Habilitar claves foráneas
    db.run(`PRAGMA foreign_keys = ON`);

    // Crear tabla Lugar
    db.run(`
        CREATE TABLE IF NOT EXISTS Lugar (
            idLugar TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            latitud TEXT NOT NULL,
            longitud TEXT NOT NULL,
            informacion TEXT
        )
    `);

    // Crear tabla Actividad
    db.run(`
        CREATE TABLE IF NOT EXISTS Actividad (
            idActividad TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            fechaInicio TEXT NOT NULL,
            fechaFin TEXT NOT NULL,
            idLugar TEXT NOT NULL,
            cupoDisponible INTEGER NOT NULL,
            precio REAL NOT NULL,
            FOREIGN KEY (idLugar) REFERENCES Lugar(idLugar) ON DELETE CASCADE
        )
    `);

    // Crear tabla Reserva
    db.run(`
        CREATE TABLE IF NOT EXISTS Reserva (
            idReserva TEXT PRIMARY KEY,
            idActividad TEXT NOT NULL,
            estadoReserva TEXT NOT NULL,
            nombreTurista TEXT NOT NULL,
            correoTurista TEXT NOT NULL,
            cantidadPersonas INTEGER NOT NULL,
            fechaReserva TEXT NOT NULL,
            FOREIGN KEY (idActividad) REFERENCES Actividad(idActividad) ON DELETE CASCADE
        )
    `);

    // Crear tabla Pago
    db.run(`
        CREATE TABLE IF NOT EXISTS Pago (
            idPago TEXT PRIMARY KEY,
            idReserva TEXT NOT NULL,
            medioPago TEXT NOT NULL,
            monto REAL NOT NULL,
            estadoPago TEXT NOT NULL,
            fechaPago TEXT NOT NULL,
            FOREIGN KEY (idReserva) REFERENCES Reserva(idReserva) ON DELETE CASCADE
        )
    `);

    console.log("Todas las tablas fueron creadas correctamente.");
});

db.close();
