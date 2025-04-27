import express from 'express';
import './db/mongoose.js';
import { HunterModel } from './models/hunter.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Hunter routes 
// Basic petition to post a hunter
app.post('/hunter', (req, res) => {
  const hunter = new HunterModel(req.body);

  hunter.save().then(() => {
    res.status(201).send(hunter)
  }).catch((error) => {
    res.status(400).send(error)
  });
}); 

// Merchant routes
// Basic petition to post a merchant
app.post('/merchant', (req, res) => {
  const merchant = new HunterModel(req.body);

  merchant.save().then(() => {
    res.status(201).send(merchant)
  }).catch((error) => {
    res.status(400).send(error)
  });
}); 

// Good routes
// Basic petition to post a good
app.post('/good', (req, res) => {
  const goods = new HunterModel(req.body);

  goods.save().then(() => {
    res.status(201).send(goods)
  }).catch((error) => {
    res.status(400).send(error)
  });
}); 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 