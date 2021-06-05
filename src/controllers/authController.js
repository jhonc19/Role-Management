const { response } = require('express');
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - correo',
      });
    }

    // SI el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - estado: false',
      });
    }

    // Verificar la contraseña
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password',
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador',
    });
  }
};

const register = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  console.log(req.body);

  try {
    // Verificar si el email existe
    const usuarioFind = await Usuario.findOne({ correo });
    if (usuarioFind) {
      return res.status(400).json({
        msg: 'Usuario ya existe',
      });
    }

    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // Generar la data a guardar
    const data = {
      nombre,
      correo,
      password: hashPassword,
      rol,
    };

    const usuario = new Usuario(data);

    // Guardar DB
    await usuario.save();

    res.status(201).json(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador',
    });
  }
};

module.exports = {
  login,
  register,
};
