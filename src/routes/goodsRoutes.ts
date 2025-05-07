import express from 'express'; 
import { GoodModel } from '../models/good.js';

const router = express.Router(); 

/**
 * @param reqBody - Objeto con los datos del bien a crear.
 * @returns El bien creado o un error en caso de fallo.
 */
router.post('/', async (req, res) => {
  const merchant = new GoodModel(req.body);

  try {
    await merchant.save();
    res.status(201).send(merchant);
  } catch (error) {
    res.status(500).send(error)
  }
});

/**
 * @param reqQuery - Filtros para buscar bienes.
 * @returns Lista de bienes que coinciden con el filtro o un mensaje de error.
 */
router.get('/', async (req, res) => {
  try {
    const good = await GoodModel.find(req.query);
    if (good.length !== 0) {
      res.status(200).send(good);
    } else {
      res.status(404).send('No Goods found');
    }
  } catch (error) { 
    res.status(500).send(error);
  }
}); 

/**
 * @param reqParamsId - ID del bien a buscar.
 * @returns El bien encontrado o un mensaje de error si no existe.
 */
router.get('/:id', async (req, res) => {
  try {
    const good = await GoodModel.findById(req.params.id)
    if (!good) {
      res.status(404).send('Good not found');
    } else {
      res.status(200).send(good);
    }
  } catch(error) {
    res.status(500).send(error)
  }
});

/**
 * @param reqQueryName - Nombre del bien a modificar.
 * @param reqBody - Campos a modificar.
 * @returns El bien modificado o un mensaje de error si no existe.
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
    const allowedUpdates = ['name', 'description', 'material', 'weight', 'crownValue', 'stock'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      try {
        const good = await GoodModel.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
            new: true,
            runValidators: true,
          })
        
        if (!good) {
          res.status(404).send('Good not found');
        } else {
          res.status(200).send(good)
        }
      } catch(error) {
        res.status(500).send(error);
      }
    }
  }
});

/**
 * @param reqParamsId - ID del bien a modificar.
 * @param reqBody - Campos a modificar.
 * @returns El bien modificado o un mensaje de error si no existe.
 */
router.patch('/:id', async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['name', 'description', 'material', 'weight', 'crownValue'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      try {
        const good = await GoodModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
          })
        
        if (!GeolocationCoordinates) {
          res.status(404).send('Good not found');
        } else {
          res.status(200).send(good)
        }
      } catch(error) {
        res.status(500).send(error);
      }
    }
  }
});

/**
 * @param reqQueryName - Nombre del bien a eliminar.
 * @returns El bien eliminado o un mensaje de error si no existe.
 */
router.delete('/', async (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A title must be provided',
    });
  } else {
    try {
      const good = await GoodModel.findOneAndDelete({name: req.query.name.toString()})
      if (!good) {
        res.status(404).send('Good not found');
      } else {
        res.status(200).send(good);
      }
    } catch(error) {
      res.status(500).send(error);
    }
  }
});

/**
 * @param reqParamsId - ID del bien a eliminar.
 * @returns El bien eliminado o un mensaje de error si no existe.
 */
router.delete('/:id', async (req, res) => {
  try {
    const good = await GoodModel.findByIdAndDelete(req.params.id);
    if (!good) {
      res.status(404).send('Good not found');
    }
  } catch(error) {
    res.status(500).send(error);
  }
});

export default router;