import express from 'express'; 
import { HunterModel } from '../models/hunter.js';

const router = express.Router(); 

/**
 * @param reqBody - Objeto con los datos del cazador a crear.
 * @returns El cazador creado o un error en caso de fallo.
 */
router.post('/', async (req, res) => {
  const hunter = new HunterModel(req.body);

  try {
    await hunter.save();
    res.status(201).send(hunter);
  } catch (error) {
    res.status(500).send(error);
  }
}); 

/**
 * @param reqQuery - Filtros para buscar cazadores.
 * @returns Lista de cazadores que coinciden con el filtro o un mensaje de error.
 */
router.get('/', async (req, res) => {
  const filter = req.query.name ? { name: req.query.name.toString() } : {};

  try {
    const hunter = await HunterModel.find(filter);
    if (hunter.length !== 0) {
      res.status(200).send(hunter);
    } else {
      res.status(404).send('No hunters found');
    }
  } catch (error) { 
    res.status(500).send(error);
  }
}); 

/**
 * @param reqParams - ID del cazador a buscar.
 * @returns El cazador encontrado o un mensaje de error si no existe.
 */
router.get('/:id', async (req, res) => {
  try {
    const hunter = await HunterModel.findById(req.params.id);
    if (!hunter) {
      res.status(404).send('Hunter not found');
    } else {
      res.status(200).send(hunter);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * @param reqQuery - Nombre del cazador a modificar.
 * @param reqBody - Campos a modificar.
 * @returns El cazador modificado o un mensaje de error si no existe.
 */
router.patch('/', async (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A title must be provided in the query string',
    });
  } else if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['name', 'race', 'location'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      try {
        const hunter = await HunterModel.findOneAndUpdate({ name: req.query.name.toString() }, req.body, {
          new: true,
          runValidators: true,
        });
        
        if (!hunter) {
          res.status(404).send('Hunter not found');
        } else {
          res.status(200).send(hunter);
        }
      } catch (error) {
        res.status(500).send(error);
      }
    }
  }
});

/**
 * @param reqParams - ID del cazador a modificar.
 * @param reqBody - Campos a modificar.
 * @returns El cazador modificado o un mensaje de error si no existe.
 */
router.patch('/:id', async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['name', 'race', 'location'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      try {
        const hunter = await HunterModel.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!hunter) {
          res.status(404).send('Hunter not found');
        } else {
          res.status(200).send(hunter);
        }
      } catch (error) {
        res.status(500).send(error);
      }
    }
  }
});

/**
 * @param reqQuery - Nombre del cazador a eliminar.
 * @returns El cazador eliminado o un mensaje de error si no existe.
 */
router.delete('/', async (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A title must be provided',
    });
  } else {
    try {
      const hunter = await HunterModel.findOneAndDelete({ name: req.query.name.toString() });
      if (!hunter) {
        res.status(404).send('Hunter not found');
      } else {
        res.status(200).send(hunter);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

/**
 * @param reqParams - ID del cazador a eliminar.
 * @returns El cazador eliminado o un mensaje de error si no existe.
 */
router.delete('/:id', async (req, res) => {
  try {
    const hunter = await HunterModel.findByIdAndDelete(req.params.id);
    if (!hunter) {
      res.status(404).send('Hunter not found');
    } else {
      res.status(200).send(hunter); 
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;