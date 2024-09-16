import pool from '../config.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const ultimoTiempo = {};
const UsuarioController = {

  //COMIENZO DE DEVOLUCIÓN DE USUARIOS
  getAllclientes: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE idTipoUsuario = 3 and activo = 1');
      res.json(rows);
    }catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  },

  getAllempleados: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE idTipoUsuario = 2 and activo = 1');
      res.json(rows);
    }catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  },
  
  getAllAdministradores: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE idTipoUsuario = 1 and activo = 1');
      res.json(rows);
    }catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  },
  //FIN DE DEVOLUCIÓN DE USUARIOS

  //
  crearCliente: async (req, res) => {
    const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo } = req.body;
    try {
      const [usuarios] = await pool.query("SELECT * FROM usuarios WHERE correoElectronico=? AND nombre=? AND apellido=?", [correoElectronico, nombre, apellido]);
      if (usuarios.length > 0) {
        return res.status(400).json({ error: 'Los datos ya están cargados.' });
      }
      const [rows] = await pool.query("INSERT INTO usuarios SET ?", { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo });
      res.json({ id: rows.insertId, nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo });
    } catch (error) {
      console.log(error);
    }
  },

  actualizarCliente: async (req, res) => {
    try {
      const { idUsuario } = req.params;
      const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen} = req.body; 
      let [[user]] = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ? and activo = 1', [idUsuario]);
      console.log(user)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado o está inactivo' });
      }
      if (user.idTipoUsuario != 3) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }
      await pool.query("UPDATE usuarios SET nombre=?, apellido=?, correoElectronico=?, contrasenia=?, idTipoUsuario=?, imagen=? WHERE idUsuario=? AND idTipoUsuario = 3", [nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, idUsuario]);
      res.json({
        id: idUsuario,
        nombre,
        apellido,
        correoElectronico,
        contrasenia,
        idTipoUsuario,
        imagen
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error al actualizar el cliente" });
    }
  },
  
  login: async (req, res) => {
    const { correoElectronico, contrasenia } = req.body;
    console.log('Datos recibidos:', correoElectronico, contrasenia);
    try {
      const tiempoActual = Date.now();
      const segundos = 60;
      if (ultimoTiempo[correoElectronico] && (tiempoActual - ultimoTiempo[correoElectronico]) < (segundos * 1000)) {
        return res.status(429).json({ 
          success: false, 
          message: 'Ya has iniciado sesión recientemente. Inténtalo de nuevo más tarde.' 
        });
      }

    
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE correoElectronico = ? AND contrasenia = ?', [correoElectronico, contrasenia]);

      if (rows.length > 0) {
        const usuario = rows[0];
        const payload = {
          nombre: usuario.nombre,
          idTipoUsuario: usuario.idTipoUsuario
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: segundos });

        ultimoTiempo[correoElectronico] = tiempoActual;

        res.json({
          success: true,
          message: 'Inicio de sesión exitoso.',
          token,
          usuario: {
            nombre: usuario.nombre,
            idTipoUsuario: usuario.idTipoUsuario,
            correoElectronico: usuario.correoElectronico
          }
        });
      } else {
        res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
      }
    }catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  },

  actualizarClienteAdmin: async (req, res) => {
    try {
      const { idUsuarioModificado, idUsuarioModificador } = req.params;
      const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo } = req.body;

      let [[usuarioModificador]] = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuarioModificador]);
      let [[usuarioModificado]] = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuarioModificado]);
      if(!usuarioModificado){
        return res.status(404).json({ error: 'Usuario a modificar no encontrado' });
      }
      if(!usuarioModificador){
        return res.status(404).json({ error: 'Usuario modificador no encontrado' });
      }
      if (usuarioModificador.idTipoUsuario != 1) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }

   
      await pool.query("UPDATE usuarios SET nombre=?, apellido=?, correoElectronico=?, contrasenia=?, idTipoUsuario=?, imagen=?, activo=? WHERE idUsuario=?", [nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo, idUsuarioModificado]);
      res.json({
        id: idUsuarioModificado,
        nombre,
        apellido,
        correoElectronico,
        contrasenia,
        idTipoUsuario,
        imagen,
        activo
      });
    }catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error al actualizar el usuario" });
    }
  },

  borrarUsuario: async (req, res) => {
    try{
      const {idUsuario} = req.params;
      let [[usuario]] = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuario])
      if(!usuario){
        return res.status(404).json({ error: 'Usuario a borrar no encontrado' });
      }

      await pool.query("UPDATE usuarios SET activo=0 WHERE idUsuario=?", [idUsuario]);

      res.json({ mensaje: 'Usuario desactivado correctamente' });
    }
    catch (error){
      console.error('Error al borrar el usuario:', error);
      res.status(500).json({ error: 'Error al borrar el usuario' });
    }
  },

 //EMPLEADO ATIENDE RECLAMOS Y CAMBIA EL ESTADO
  ActualizarEstadoReclamo: async (req, res) =>{
    const estadoReclamo = {
      1: "Creado",
      2: "En proceso",
      3: "Cancelado",
      4: "Finalizado"
    };

    const { idCliente, nuevoEstado } = req.params;
    const estadoNumerico = parseInt(nuevoEstado, 10);

      if (!estadoReclamo[estadoNumerico]) {
        return res.status(400).json({ error: "El estado proporcionado no es válido. Debe ser un número entre 1 y 4." });
      }
      console.log(estadoReclamo[estadoNumerico]);

    try{
      const [resultado] = await pool.query('UPDATE reclamos SET idReclamoEstado = ? WHERE idUsuarioCreador = ?', [nuevoEstado, idCliente]);
      if (resultado.affectedRows === 0) {
        return res.status(400).json({ error: "No se encontró el reclamo para este usuario" });
      }
      res.json({ mensaje: 'Reclamo estado modificado éxitosamente' });

      //const [[usuario]] = await pool.query('SELECT email FROM usuarios WHERE idUsuario = ?', [idCliente]);

      //if (!usuario) {
        //return res.status(400).json({ error: "No se encontró el usuario" });
      //}

      //const estadoDescripcion = estadoReclamo[nuevoEstado] || "Estado desconocido";

      //await enviarNotificacionReclamo(usuario.email, estadoDescripcion);
    }
    catch(error){
      res.status(500).json({ error: 'Error al modificar estado' });
    }
  }

  
};

export default UsuarioController;