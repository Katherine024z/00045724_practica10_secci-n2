//Ejercicio 4: obtener registro de ventas

import { useState, useEffect } from 'react';

function SalesList() {
  const [sales, setSales] = useState([]); //Guarda la lista traida desde el backend
  const [loading, setLoading] = useState(true); //Carga de datos
  const [error, setError] = useState(null); //Manejo de errores

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    //petición al backend con fetch
    try {
      const response = await fetch('http://localhost:3010/api/sales');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Error al cargar');
      
      setSales(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando ventas...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="sales-list">
      <h2>Ejercicio 4: Lista de Ventas con Datos del Cliente</h2>
      {sales.length === 0 ? (
        <p>No hay ventas registradas</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Código Cliente</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>${parseFloat(sale.amount).toFixed(2)}</td> {/*Monto convertido a numero y con dos decimales*/}
                <td>{new Date(sale.created_at).toLocaleString('es-ES')}</td> {/*Fecha en formato local*/}
                <td>{sale.customer_name}</td>
                <td>{sale.customer_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SalesList;