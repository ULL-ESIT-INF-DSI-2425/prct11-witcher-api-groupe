import express from 'express';
import './db/mongoose.js';
import hunterRoutes from './routes/hunterRoutes.js'
import merchantRoutes from './routes/merchantRoutes.js'
import goodRoutes from './routes/goodsRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/hunter', hunterRoutes);

app.use('/merchant', merchantRoutes);

app.use('/good', goodRoutes);

app.use('/transaction', transactionRoutes)

// Default route
app.all('/{*splat}', (_, res) => {
  res.status(501).send(); 
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 