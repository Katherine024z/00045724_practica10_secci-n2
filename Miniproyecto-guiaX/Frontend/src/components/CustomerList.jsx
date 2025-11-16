//Ejercicio 2: obtener registro de la tabla Customers

import { useState, useEffect } from 'react';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:3010/api/customers');
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al cargar');

      setCustomers(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando clientes...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="customer-list">
      <h2>Ejercicio 2: Lista de Clientes</h2>
      {customers.length === 0 ? (
        <p>No hay clientes registrados</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {/* Recorre el cuerpo de la tabla usando .map() */}
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.code}</td>
                <td>{customer.name}</td>
                <td>{customer.address}</td>
                <td>{customer.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CustomerList;