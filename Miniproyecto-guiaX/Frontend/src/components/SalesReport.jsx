//Ejercicio 6: Reporte de ventas por cliente

import { useState, useEffect } from 'react';

function SalesReport() {
  const [report, setReport] = useState([]); // Estado para almacenar el reporte de ventas
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    fetchReport();
  }, []);

  //Peticion al backend para obtener el reporte de ventas por cliente
  const fetchReport = async () => {
    try {
      const response = await fetch('http://localhost:3010/api/sales/report');
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al cargar');

      setReport(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Generando reporte...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  //Calculo del total general de ventas
  const totalGeneral = report.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);

  return (
    <div className="sales-report">
      <h2>Ejercicio 6: Reporte de Ventas por Cliente</h2>
      {report.length === 0 ? (
        <p>No hay datos para el reporte</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Código</th>
                <th>Cantidad de Ventas</th>
                <th>Total Ventas</th>
              </tr>
            </thead>
            <tbody>
              {report.map(item => (
                <tr key={item.id}>
                  <td>{item.customer_name}</td>
                  <td>{item.customer_code}</td>
                  <td>{item.total_sales}</td>
                  <td>${parseFloat(item.total_amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ fontWeight: 'bold', backgroundColor: '#a5d7f3ff' }}>
                <td colSpan="3" style={{ textAlign: 'right' }}>TOTAL GENERAL:</td>
                <td>${totalGeneral.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </div>
  );
}

export default SalesReport;