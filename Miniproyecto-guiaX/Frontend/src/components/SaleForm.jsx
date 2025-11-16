//Ejercicio 3: formulario para registrar ventas en la tabla Sales

import { useState } from 'react';

function SaleForm() {
  //Estado para los datos del formulario
  const [formData, setFormData] = useState({
    amount: '',
    customer_code: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  //Funcion que envia respuesta al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3010/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          customer_code: formData.customer_code.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFormData({ amount: '', customer_code: '' }); // Limpiar formulario
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error al registrar venta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sale-form">
      <h2>Ejercicio 3: Registrar Nueva Venta</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Código del Cliente:</label>
          {/* Campo para ingresar el codigo */}
          <input
            type="text"
            placeholder="Ej: CUST001"
            value={formData.customer_code}
            onChange={(e) => setFormData({ ...formData, customer_code: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Monto ($):</label>
          {/* Campo para ingresar el monto */}
          <input
            type="number"
            step="0.01" /*Acepta decimales*/
            min="0.01" /*Evita montos de 0*/
            placeholder="Ej: 150.50"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar Venta'}
        </button>
      </form>
      {message && (
        <div className={message.includes('OK') ? 'message' : 'error-message'}>
          {message}
        </div>
      )}
    </div>
  );
}

export default SaleForm;