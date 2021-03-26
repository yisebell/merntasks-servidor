const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// crear una tarea nueva
exports.crearTarea = async (req, res) => {

    // Revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }

    // extraer el proyecto y comprobar que existe
    try {

        const { proyecto } = req.body;
        
        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado!'});
        }

        // crear la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

// Obtener las tareas por proyecto
exports.obtenerTareas = async (req,res) => {
    
    try {
        // extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;
        
        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado!'});
        }

        // Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
        res.json({tareas});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

// actualizar una tarea
exports.actualizarTarea = async (req,res) => {
    // Revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }

    try {
        // extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;

        // Revisar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({msg: 'Tarea no encontrada'});
        }

        // extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado!'});
        }

        // crear un objeto con la nueva informacion
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        // Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id}, nuevaTarea, {new: true});

        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};

// Eliminar una tarea
exports.eliminarTarea = async (req,res) => {
    try {
        // extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        // Revisar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({msg: 'Tarea no encontrada'});
        }

        // extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado!'});
        }

        // Eliminar 
        await Tarea.findOneAndRemove({ _id: req.params.id});
        res.json({msg: 'tarea eliminada'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};