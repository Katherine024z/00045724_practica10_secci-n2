//Ejercicio 5: buscar clientes por código

import { useState } from 'react';

function CustomerSearch() {
  const [searchCode, setSearchCode] = useState(''); //guardar el código a buscar
  const [results, setResults] = useState([]); //guardar los resultados de la búsqueda
  const [searched, setSearched] = useState(false); //indica si se ha realizado una búsqueda
  const [loading, setLoading] = useState(false); //busqueda en proceso

  const handleSearch = async (e) => {
    e.preventDefault(); //evita que la pagina se recargue
    setLoading(true);

    try {
      //peticion de la api para buscar clientes por código
      const response = await fetch(
        `http://localhost:3010/api/customers/search?code=${encodeURIComponent(searchCode)}`
      );
      const data = await response.json();

      //manejo de errores
      if (!response.ok) throw new Error(data.error || 'Error en la búsqueda');

      setResults(data);
      setSearched(true);

    } catch (error) {
      console.error('Error:', error);
      alert('Error al buscar clientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-search">
      <h2>Ejercicio 5: Buscar Cliente por Código</h2>
      {/* Formulario mostrado en FE*/}
      <form onSubmit={handleSearch}>
        <div>
          <label>Código del Cliente:</label>
          <input
            type="text"
            placeholder="Ingrese código del cliente (Ej: CUST001)"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>
      {/* Muestra los resultados */}
      {searched && (
        <div className="results">
          <h3>Resultados: {results.length} cliente(s) encontrado(s)</h3>
          {results.length > 0 ? (
            <table>
              {/* Encabezados tabla */}
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
                {/* Cuerpo de la tabla */}
                {results.map(customer => (
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
          ) : (
            <p>No se encontraron clientes con ese código.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerSearch;