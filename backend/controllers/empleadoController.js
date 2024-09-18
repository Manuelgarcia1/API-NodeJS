import pool from '../config.js';
import dotenv from 'dotenv';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { login } from './authController.js';
import fs from 'fs';
import path  from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const EmpleadoController = {
  login: (req, res) => {
    login(req, res);
  },

  getAllEmpleados: async (req, res) => {
    try {
      console.log('hola')
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE idTipoUsuario = 2 and activo = 1');
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  },

  listarReclamosOficina: async (req, res) => {
    const { idEmpleado } = req.params;
    console.log(idEmpleado); 
    try {
      const [[oficina]] = await pool.query('SELECT idOficina FROM usuariosOficinas WHERE idUsuario=?', [idEmpleado]);
      if(!oficina){
        return res.status(400).json({ error: `El empleado con ID ${idEmpleado} no tiene asignada oficina`});
      }
      console.log(oficina);
      const [[reclamoTipo]] = await pool.query('SELECT idReclamoTipo FROM oficinas WHERE idOficina=?', [oficina.idOficina]);
      console.log(reclamoTipo);
      const[reclamos] = await pool.query('SELECT * FROM reclamos WHERE idReclamoTipo=?',[reclamoTipo.idReclamoTipo]);
      if(reclamos.length === 0) {
        return res.status(400).json({ error: `La oficina ${[oficina.idOficina]} no tiene reclamos de tipo ${[reclamoTipo.idReclamoTipo]} asignados` });
      }
      console.log(reclamos);
    
      res.json({
        reclamos: reclamos,
      }); 

    }
    catch (error) {
      res.status(500).json({ error: 'Error al listar reclamos oficina' });
    }
  },


  //Agregar validacion de que no modifique varios reclamos de un mismo usuario, pasar tambien idReclamo a modificar
  //Y Avisar que numero de reclamo es el que cambio
  ActualizarEstadoReclamo: async (req, res) => {
    const estadoReclamo = {
      1: "Creado",
      2: "En proceso",
      3: "Cancelado",
      4: "Finalizado"
    };

    const { idCliente, nuevoEstado, idReclamo } = req.params;
    const estadoNumerico = parseInt(nuevoEstado, 10);

    if (!estadoReclamo[estadoNumerico]) {
      return res.status(400).json({ error: "El estado proporcionado no es válido. Debe ser un número entre 1 y 4." });
    }
    console.log(estadoReclamo[estadoNumerico]);

    try {
      const [resultado] = await pool.query('UPDATE reclamos SET idReclamoEstado = ? WHERE idUsuarioCreador=?', [nuevoEstado, idCliente]);
      if (resultado.affectedRows === 0) {
        return res.status(400).json({ error: "No se encontró el reclamo para este usuario" });
      }

      const[[emailDestino]] = await pool.query('SELECT correoElectronico, nombre FROM usuarios WHERE idUsuario=?',[idCliente])
      console.log(emailDestino.correoElectronico);
      console.log(emailDestino.nombre);

      // Obtengo el archivo actual
      const filename = fileURLToPath(import.meta.url);

      // Obtengo el directorio actual (controller)
      const dir = path.dirname(`${filename}`);

      // Subo un nivel mas, es decir, me muevo de 'controller' a 'backend'
      const backendDir = path.resolve(dir, '..');

      // obtengo una plantilla handlebars que quiero enviar al cliente
      const plantilla = fs.readFileSync(path.join(backendDir + '/utiles/handlebars/plantilla.hbs'), 'utf-8');

      // compilo la plantilla, otengo una funcion 'template'
      const templete = handlebars.compile(plantilla);
      console.log(templete);

      const datos = {
        cliente: String(emailDestino.nombre), 
        estadoReclamo: String(estadoReclamo[estadoNumerico]) 
      }

      console.log(datos);

      // a mi plantilla le paso la información que quiero mandar
      // handlebars va a reemplazar los ''{{}}'' con la información de 'datos'
      const correoHtml = templete(datos);
    
      const transporter = nodemailer.createTransport({ 
        service: 'gmail',
        auth:{
            user: process.env.CORREO, // no olvidar definir en el .env
            pass: process.env.CLAVE
        }
      });

      // opciones de envio 
      const mailOptions = {
        to: emailDestino.correoElectronico,
        subject: "NOTIFICACION RECLAMO",
        html: correoHtml,
        text: "Este es un mensaje de notificación",  // Añade esto
        headers: {
            'X-Priority': '3', // Normal priority
            'X-MSMail-Priority': 'Normal',
            'Importance': 'Normal'
          }
      };

      // envio el correo electrónico
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error enviado el correo: ", error);
        }else {
            // console.log("Correo enviado: ", info.response);
            res.json({'estado': true, 'mensaje': 'Notificación enviada'});
        }
      });

    }
    catch (error) {
      console.error("Error detallado:", error);
      res.status(500).json({ error: 'Error al modificar estado', detalle: error.message });
    }
  }

}

export default EmpleadoController;