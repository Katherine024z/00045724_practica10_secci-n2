import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CustomerList from './components/CustomerList';
import SaleForm from './components/SaleForm';
import SalesList from './components/SalesList';
import CustomerSearch from './components/CustomerSearch';
import SalesReport from './components/SalesReport';

function App() {
  return (
    <div className="App">
      <h1>Sistema de Ventas</h1>
      
      {/* Modulos presentes */}
      <div className="content">
        {/* Ejercicio 2: Lista de Clientes */}
        <CustomerList />
        
        <hr />
        
        {/* Ejercicio 3: Formulario de Nueva Venta */}
        <SaleForm />
        
        <hr />
        
        {/* Ejercicio 4: Lista de Ventas */}
        <SalesList />
        
        <hr />
        
        {/* Ejercicio 5: Buscar Cliente */}
        <CustomerSearch />
        
        <hr />
        
        {/* Ejercicio 6: Reporte de Ventas */}
        <SalesReport />
      </div>
    </div>
  );
}

export default App
