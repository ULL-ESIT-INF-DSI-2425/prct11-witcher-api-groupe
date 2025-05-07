import express from 'express'; 
import { MerchantModel } from '../models/merchant.js';

const router = express.Router(); 

/**
 * @param reqBody - Objeto con los datos del bien a crear.
 * @returns El bien creado o un error en caso de fallo.
 */
router.post('/', async (req, res) => {
  const merchant = new MerchantModel(req.body);

  try {
    await merchant.save();
    res.status(201).send(merchant);
  } catch (error) {
    res.status(500).send(error)
  }
});

/**
 * @param reqBody - Objeto con los datos del bien a crear.
 * @returns El bien creado o un error en caso de fallo.
 */
router.get('/', async (req, res) => {
  const filter = req.query.name ? { name: req.query.name.toString() } : {};

  try {
    const merchant = await MerchantModel.find(filter);
    if (merchant.length !== 0) {
      res.status(200).send(merchant);
    } else {
      res.status(404).send('No Merchants found');
    }
  } catch (error) { 
    res.status(500).send(error);
  }
}); 

/**
 * @param reqBody - Objeto con los datos del bien a crear.
 * @returns El bien creado o un error en caso de fallo.
 */
router.get('/:id', async (req, res) => {
  try {
    const merchant = await MerchantModel.findById(req.params.id)
    if (!merchant) {
      res.status(404).send('Merchant not found');
    } else {
      res.status(200).send(merchant);
    }
  } catch(error) {
    res.status(500).send(error)
  }
});

/**
 * @param reqBody - Objeto con los datos del bien a crear.
 * @returns El bien creado o un error en caso de fallo.
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
    const allowedUpdates = ['name', 'type', 'location'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      try {
        const merchant = await MerchantModel.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
            new: true,
            runValidators: true,
          })
        
        if (!merchant) {
          res.status(404).send('Merchant not found');
        } else {
          res.status(200).send(merchant)
        }
      } catch(error) {
        res.status(500).send(error);
      }
    }
  }
});

/**
 * @param reqBody - Objeto con los datos del bien a crear.
 * @returns El bien creado o un error en caso de fallo.
 */
router.patch('/:id', async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['name', 'type', 'location'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      try {
        const merchant = await MerchantModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
          })
        
        if (!merchant) {
          res.status(404).send('Merchant not found');
        } else {
          res.status(200).send(merchant)
        }
      } catch(error) {
        res.status(500).send(error);
      }
    }
  }
});

/**
 * @param reqBody - Objeto con los datos del bien a crear.
 * @returns El bien creado o un error en caso de fallo.
 */
router.delete('/', async (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A title must be provided',
    });
  } else {
    try {
      const merchant = await MerchantModel.findOneAndDelete({name: req.query.name.toString()})
      if (!merchant) {
        res.status(404).send('Merchant not found');
      } else {
        res.status(200).send(merchant);
      }
    } catch(error) {
      res.status(500).send(error);
    }
  }
});

/**
 * @param reqBody - Objeto con los datos del bien a crear.
 * @returns El bien creado o un error en caso de fallo.
 */
router.delete('/:id', async (req, res) => {
  try {
    const merchant = await MerchantModel.findByIdAndDelete(req.params.id);
    if (!merchant) {
      res.status(404).send('Merchant not found');
    } else {
      res.status(200).send(merchant);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;