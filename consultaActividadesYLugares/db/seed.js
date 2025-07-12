const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const db = new sqlite3.Database('./db/actividades.db');

db.serialize(() => {
    db.run(`PRAGMA foreign_keys = ON`);

    // Insertar Lugares turísticos
    const lugares = [
        {
            id: uuidv4(),
            nombre: 'Parque Nacional Cajas',
            latitud: '-2.7833',
            longitud: '-79.2333',
            informacion: 'Área protegida famosa por su biodiversidad y lagunas andinas.'
        },
        {
            id: uuidv4(),
            nombre: 'Centro Histórico de Cuenca',
            latitud: '-2.9006',
            longitud: '-79.0045',
            informacion: 'Patrimonio de la Humanidad con arquitectura colonial y museos.'
        },
        {
            id: uuidv4(),
            nombre: 'Mirador de Turi',
            latitud: '-2.9220',
            longitud: '-79.0070',
            informacion: 'Mirador panorámico con vista completa de la ciudad de Cuenca.'
        }
    ];

    const insertLugar = db.prepare(`
        INSERT INTO Lugar (idLugar, nombre, latitud, longitud, informacion)
        VALUES (?, ?, ?, ?, ?)
    `);

    lugares.forEach(l => {
        insertLugar.run(l.id, l.nombre, l.latitud, l.longitud, l.informacion);
    });

    insertLugar.finalize();

    // Insertar Actividades
    const actividades = [
        {
            id: uuidv4(),
            nombre: 'Senderismo en el Parque Nacional Cajas',
            descripcion: 'Caminata guiada por los senderos y lagunas del Cajas.',
            fechaInicio: '2025-07-12T08:00:00Z',
            fechaFin: '2025-07-12T14:00:00Z',
            idLugar: lugares[0].id,
            cupoDisponible: 20,
            precio: 25.0
        },
        {
            id: uuidv4(),
            nombre: 'Tour histórico por Cuenca',
            descripcion: 'Recorrido por el centro histórico y museos de la ciudad.',
            fechaInicio: '2025-07-13T09:00:00Z',
            fechaFin: '2025-07-13T12:00:00Z',
            idLugar: lugares[1].id,
            cupoDisponible: 30,
            precio: 15.0
        },
        {
            id: uuidv4(),
            nombre: 'Fotografía en el Mirador de Turi',
            descripcion: 'Sesión fotográfica al atardecer con guía local.',
            fechaInicio: '2025-07-14T17:00:00Z',
            fechaFin: '2025-07-14T19:00:00Z',
            idLugar: lugares[2].id,
            cupoDisponible: 10,
            precio: 10.0
        }
    ];

    const insertActividad = db.prepare(`
        INSERT INTO Actividad (idActividad, nombre, descripcion, fechaInicio, fechaFin, idLugar, cupoDisponible, precio)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    actividades.forEach(a => {
        insertActividad.run(
            a.id,
            a.nombre,
            a.descripcion,
            a.fechaInicio,
            a.fechaFin,
            a.idLugar,
            a.cupoDisponible,
            a.precio
        );
    });

    insertActividad.finalize();

    // Insertar una Reserva
    const reservaId = uuidv4();
    const actividadSeleccionada = actividades[0];
    db.run(`
        INSERT INTO Reserva (
            idReserva, idActividad, estadoReserva,
            nombreTurista, correoTurista, cantidadPersonas, fechaReserva
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
        reservaId,
        actividadSeleccionada.id,
        'CONFIRMADA',
        'Luis Pérez',
        'luis.perez@example.com',
        2,
        '2025-07-10T10:00:00Z'
    ]);

    // Insertar Pago relacionado
    db.run(`
        INSERT INTO Pago (
            idPago, idReserva, medioPago, monto, estadoPago, fechaPago
        ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
        uuidv4(),
        reservaId,
        'Tarjeta',
        25,
        'Confirmado',
        '2025-07-10T10:05:00Z'
    ]);

    console.log('Datos insertados correctamente.');
});

db.close();
