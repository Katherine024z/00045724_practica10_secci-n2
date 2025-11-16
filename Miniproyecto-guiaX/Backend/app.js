import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./data/connection.js"; 

// inyectar las keys o valores de los secretos
import { PORT } from "./keys/keys.js";
// módulo enrutador
import userRoutes from "./router/router.js";

// configuración básica del servidor
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/api', userRoutes);

//Endpoints para cada ejercicio
//Ejercicio 5: Buscar clientes por código 
app.get('/api/customers/search', async (req, res) => {
  const { code } = req.query;
  
  try {
    if (!code) {
      return res.status(400).json({ error: 'Debe proporcionar un código de búsqueda' });
    }
    
    const result = await db.query(
      'SELECT * FROM customers WHERE code ILIKE $1',
      [`%${code}%`]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al buscar clientes:', error);
    res.status(500).json({ error: 'Error al buscar clientes' });
  }
});

//Ejercicio 2: Listado de clientes
app.get('/api/customers', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM customers ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

//Ejercicio 6: Reporte de ventas por cliente
app.get('/api/sales/report', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        c.id,
        c.name as customer_name,
        c.code as customer_code,
        COUNT(s.id) as total_sales,
        COALESCE(SUM(s.amount), 0) as total_amount
      FROM customers c
      LEFT JOIN sales s ON c.id = s.id_customer
      GROUP BY c.id, c.name, c.code
      ORDER BY total_amount DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
});

//Ejercicio 4: Listar ventas con datos del cliente 
app.get('/api/sales', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        s.id,
        s.amount,
        s.created_at,
        c.name as customer_name,
        c.code as customer_code
      FROM sales s
      INNER JOIN customers c ON s.id_customer = c.id
      ORDER BY s.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
});

//Ejercicio 3: Registrar nueva venta 
app.post('/api/sales', async (req, res) => {
  const { amount, customer_code } = req.body;
  
  try {
    // Buscar el cliente por código
    const customerResult = await db.query(
      'SELECT id FROM customers WHERE code = $1',
      [customer_code]
    );
    
    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado con ese código' });
    }
    
    const id_customer = customerResult.rows[0].id;
    
    // Insertar la venta
    const result = await db.query(
      'INSERT INTO sales (amount, created_at, id_customer) VALUES ($1, NOW(), $2) RETURNING *',
      [amount, id_customer]
    );
    
    res.status(201).json({
      message: 'Venta registrada exitosamente',
      sale: result.rows[0]
    });
  } catch (error) {
    console.error('Error al registrar venta:', error);
    res.status(500).json({ error: 'Error al registrar venta' });
  }
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);