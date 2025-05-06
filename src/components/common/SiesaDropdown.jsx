import React, { useState, useEffect, useRef } from 'react';
import { Form, Spinner, ListGroup } from 'react-bootstrap';
import axios from 'axios';

// Usamos el proxy configurado en vite.config.js para evitar problemas de CORS
const SIESA_API_URL = '/api/siesa';
const CONNI_KEY = 'Connikey-laestrellasa-TDRONEQX';
const CONNI_TOKEN = 'TDRONEQXWDHLM0MWSDJSNLG4RDFBMFA1UTVVN1A1TDNZOFE1RJFQNQ';

/**
 * Componente de menú desplegable que carga datos desde SIESA Cloud
 */
const SiesaDropdown = ({ 
  tipoConsulta, 
  valorInicial = '', // Valor inicial por defecto vacío
  onChange, 
  disabled = false,
  label = '',
  required = false,
  name = ''
}) => {
  const [opciones, setOpciones] = useState([]);
  const [opcionesFiltradas, setOpcionesFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [valor, setValor] = useState(valorInicial || '');
  const [textoInput, setTextoInput] = useState('');
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const cargarOpciones = async () => {
      try {
        setCargando(true);
        setError(null);
        
        let resultado = [];
        
        // Determinar qué consulta ejecutar según el tipo
        if (tipoConsulta === 'MAESTRO_CO' || tipoConsulta === 'MAESTRO_UN' || tipoConsulta === 'SERVICIOS_FACTURAS_DIRECTAS') {
          try {
            const response = await axios.get(
              `${SIESA_API_URL}/ejecutarconsulta`, 
              {
                params: {
                  idCompania: 6413,
                  descripcion: tipoConsulta
                },
                headers: {
                  'conniKey': CONNI_KEY,
                  'conniToken': CONNI_TOKEN
                }
              }
            );
            
            // Verificar si la respuesta es una cadena JSON y convertirla a objeto
            let responseData = response.data;
            if (typeof responseData === 'string') {
              try {
                responseData = JSON.parse(responseData);
                console.log('Respuesta convertida de cadena JSON a objeto en SiesaDropdown:', responseData);
              } catch (parseError) {
                console.error('Error al analizar la respuesta JSON en SiesaDropdown:', parseError);
                // Si hay error al parsear, mantener la respuesta original
              }
            }
            
            // Verificar el formato de la respuesta
            if (responseData && responseData.codigo === 0 && responseData.detalle) {
              // La respuesta tiene el formato {codigo, mensaje, detalle}
              // Extraer los datos del campo detalle
              const datos = response.data.detalle;
              
              if (Array.isArray(datos)) {
                // Transformar el resultado para el formato del menú desplegable
                resultado = datos.map(item => {
                  if (tipoConsulta === 'MAESTRO_UN') {
                    return {
                      valor: item.Id_UN || '',
                      etiqueta: `${item.Id_UN || ''} - ${item.Nombre_UN || ''}`,
                      datos: item // Guardamos todos los datos por si se necesitan después
                    };
                  } else if (tipoConsulta === 'SERVICIOS_FACTURAS_DIRECTAS') {
                    // Extracción mejorada de datos para servicios
                    const idServicio = item.Id_Servicio || item.ID_SERVICIO || item.id_servicio || item.F320_ID_SERVICIO || item.ID || item.CODIGO || '';
                    const nombreServicio = item.Nombre_Servicio || item.NOMBRE_SERVICIO || item.nombre_servicio || item.F320_DESCRIPCION || item.DESCRIPCION || item.NOMBRE || '';
                    
                    // Imprimir todos los campos del objeto para depuración
                    console.log('Objeto servicio completo (detalle array):', JSON.stringify(item));
                    console.log('Procesando servicio (detalle array):', idServicio, nombreServicio);
                    
                    return {
                      valor: idServicio,
                      etiqueta: `${idServicio} - ${nombreServicio}`,
                      datos: item // Guardamos todos los datos por si se necesitan después
                    };
                  } else {
                    return {
                      valor: item.ID || item.CODIGO || '',
                      etiqueta: `${item.ID || item.CODIGO || ''} - ${item.DESCRIPCION || item.NOMBRE || ''}`,
                      datos: item // Guardamos todos los datos por si se necesitan después
                    };
                  }
                });
              } else if (datos && datos.Table && Array.isArray(datos.Table)) {
                // Si el detalle contiene un objeto con una propiedad Table que es un array
                resultado = datos.Table.map(item => {
                  if (tipoConsulta === 'MAESTRO_UN') {
                    return {
                      valor: item.Id_UN || '',
                      etiqueta: `${item.Id_UN || ''} - ${item.Nombre_UN || ''}`,
                      datos: item // Guardamos todos los datos por si se necesitan después
                    };
                  } else if (tipoConsulta === 'SERVICIOS_FACTURAS_DIRECTAS') {
                    // Extracción mejorada de datos para servicios
                    const idServicio = item.Id_Servicio || item.ID_SERVICIO || item.id_servicio || item.F320_ID_SERVICIO || item.ID || item.CODIGO || '';
                    const nombreServicio = item.Nombre_Servicio || item.NOMBRE_SERVICIO || item.nombre_servicio || item.F320_DESCRIPCION || item.DESCRIPCION || item.NOMBRE || '';
                    
                    // Imprimir todos los campos del objeto para depuración
                    console.log('Objeto servicio completo (Table):', JSON.stringify(item));
                    console.log('Procesando servicio (Table):', idServicio, nombreServicio);
                    
                    return {
                      valor: idServicio,
                      etiqueta: `${idServicio} - ${nombreServicio}`,
                      datos: item // Guardamos todos los datos por si se necesitan después
                    };
                  } else {
                    return {
                      valor: item.Id_CO || item.ID_CO || item.id_co || item.ID || item.CODIGO || '',
                      etiqueta: `${item.Id_CO || item.ID_CO || item.id_co || item.ID || item.CODIGO || ''} - ${item.Nombre_CO || item.NOMBRE_CO || item.nombre_co || item.DESCRIPCION || item.NOMBRE || ''}`,
                      datos: item // Guardamos todos los datos por si se necesitan después
                    };
                  }
                });
              } else {
                console.error('El detalle de la respuesta no es un array:', datos);
                setError('El formato de los datos en la respuesta no es válido');
                if (tipoConsulta === 'MAESTRO_UN') {
                  resultado = [{ valor: '', etiqueta: 'Seleccione una unidad de negocio' }];
                } else {
                  resultado = [{ valor: '099', etiqueta: '099 - Centro Operativo por defecto' }];
                }
              }
            } else if (responseData && responseData.Table && Array.isArray(responseData.Table)) {
              // La respuesta tiene directamente la propiedad Table que es un array
              resultado = responseData.Table.map(item => {
                if (tipoConsulta === 'MAESTRO_UN') {
                  return {
                    valor: item.Id_UN || '',
                    etiqueta: `${item.Id_UN || ''} - ${item.Nombre_UN || ''}`,
                    datos: item // Guardamos todos los datos por si se necesitan después
                  };
                } else if (tipoConsulta === 'SERVICIOS_FACTURAS_DIRECTAS') {
                  // Extracción mejorada de datos para servicios
                  const idServicio = item.Id_Servicio || item.ID_SERVICIO || item.id_servicio || item.F320_ID_SERVICIO || item.ID || item.CODIGO || '';
                  const nombreServicio = item.Nombre_Servicio || item.NOMBRE_SERVICIO || item.nombre_servicio || item.F320_DESCRIPCION || item.DESCRIPCION || item.NOMBRE || '';
                  
                  // Imprimir todos los campos del objeto para depuración
                  console.log('Objeto servicio completo (Table directo):', JSON.stringify(item));
                  console.log('Procesando servicio (Table directo):', idServicio, nombreServicio);
                  
                  return {
                    valor: idServicio,
                    etiqueta: `${idServicio} - ${nombreServicio}`,
                    datos: item // Guardamos todos los datos por si se necesitan después
                  };
                } else {
                  return {
                    valor: item.Id_CO || item.ID_CO || item.id_co || item.ID || item.CODIGO || '',
                    etiqueta: `${item.Id_CO || item.ID_CO || item.id_co || item.ID || item.CODIGO || ''} - ${item.Nombre_CO || item.NOMBRE_CO || item.nombre_co || item.DESCRIPCION || item.NOMBRE || ''}`,
                    datos: item // Guardamos todos los datos por si se necesitan después
                  };
                }
              });
            } else if (Array.isArray(responseData)) {
              // Formato antiguo: la respuesta es directamente un array
              resultado = responseData.map(item => {
                if (tipoConsulta === 'MAESTRO_UN') {
                  return {
                    valor: item.Id_UN || '',
                    etiqueta: `${item.Id_UN || ''} - ${item.Nombre_UN || ''}`,
                    datos: item // Guardamos todos los datos por si se necesitan después
                  };
                } else if (tipoConsulta === 'SERVICIOS_FACTURAS_DIRECTAS') {
                  // Extracción mejorada de datos para servicios
                  // Buscar específicamente los campos Id_Servicio y Nombre_Servicio con todas las variaciones posibles
                  const idServicio = item.Id_Servicio || item.ID_SERVICIO || item.id_servicio || item.F320_ID_SERVICIO || item.ID || item.CODIGO || '';
                  const nombreServicio = item.Nombre_Servicio || item.NOMBRE_SERVICIO || item.nombre_servicio || item.F320_DESCRIPCION || item.DESCRIPCION || item.NOMBRE || '';
                  
                  // Imprimir todos los campos del objeto para depuración
                  console.log('Objeto servicio completo:', JSON.stringify(item));
                  console.log('Procesando servicio:', idServicio, nombreServicio);
                  
                  return {
                    valor: idServicio,
                    etiqueta: `${idServicio} - ${nombreServicio}`,
                    datos: item // Guardamos todos los datos por si se necesitan después
                  };
                } else {
                  return {
                    valor: item.ID || item.CODIGO || '',
                    etiqueta: `${item.ID || item.CODIGO || ''} - ${item.DESCRIPCION || item.NOMBRE || ''}`,
                    datos: item // Guardamos todos los datos por si se necesitan después
                  };
                }
              });
            } else {
              console.error('La respuesta no tiene un formato válido:', responseData);
              setError('El formato de respuesta del servidor no es válido');
              if (tipoConsulta === 'MAESTRO_UN') {
                resultado = [{ valor: '', etiqueta: 'Seleccione una unidad de negocio' }];
              } else {
                resultado = [{ valor: '099', etiqueta: '099 - Centro Operativo por defecto' }];
              }
            }
          } catch (err) {
            console.error(`Error al obtener ${tipoConsulta}:`, err);
            
            if (tipoConsulta === 'MAESTRO_UN') {
              setError(`Error al cargar unidades de negocio: ${err.message}`);
              // En caso de error, usar valor por defecto para unidades de negocio
              resultado = [{ valor: '', etiqueta: 'Seleccione una unidad de negocio' }];
            } else {
              setError(`Error al cargar centros operativos: ${err.message}`);
              // En caso de error, usar valor por defecto para centros operativos
              resultado = [{ valor: '099', etiqueta: '099 - Centro Operativo por defecto' }];
            }
          }
        } else {
          setError(`Tipo de consulta no soportado: ${tipoConsulta}`);
          resultado = [{ valor: '', etiqueta: 'No hay opciones disponibles' }];
        }
        
        setOpciones(resultado);
      } catch (err) {
        setError(`Error al cargar opciones: ${err.message}`);
        console.error('Error en SiesaDropdown:', err);
      } finally {
        setCargando(false);
      }
    };
    
    cargarOpciones();
  }, [tipoConsulta]);
  
  // Actualizar el valor cuando cambia el valor inicial
  useEffect(() => {
    // Usar '099' como valor por defecto para MAESTRO_CO si no se proporciona valorInicial
    if (tipoConsulta === 'MAESTRO_CO' && !valorInicial) {
      setValor('099');
    } else if (tipoConsulta === 'SERVICIOS_FACTURAS_DIRECTAS') {
      // Para servicios, no establecer valor por defecto si no hay valorInicial
      setValor(valorInicial || '');
    } else {
      setValor(valorInicial || '');
    }
  }, [valorInicial, tipoConsulta]);
  
  // Actualizar el texto del input cuando cambian las opciones o el valor
  useEffect(() => {
    if (opciones.length > 0) {
      const opcionSeleccionada = opciones.find(opcion => opcion.valor === valor);
      if (opcionSeleccionada) {
        setTextoInput(opcionSeleccionada.etiqueta);
      } else if (valor && !textoInput) {
        // Si tenemos un valor pero no hay texto, intentamos mostrar al menos el valor
        setTextoInput(valor);
      }
    }
  }, [opciones, valor]);
  
  // Efecto para cerrar las sugerencias cuando se hace clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarSugerencias(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Filtrar opciones basado en el texto de entrada
  const filtrarOpciones = (texto) => {
    if (!texto.trim()) {
      setOpcionesFiltradas([]);
      return;
    }
    
    const textoLower = texto.toLowerCase();
    const filtradas = opciones.filter(opcion => 
      opcion.etiqueta.toLowerCase().includes(textoLower) || 
      opcion.valor.toLowerCase().includes(textoLower)
    );
    
    setOpcionesFiltradas(filtradas);
  };
  
  const handleInputChange = (e) => {
    const texto = e.target.value;
    setTextoInput(texto);
    filtrarOpciones(texto);
    setMostrarSugerencias(true);
  };
  
  const handleSeleccionarOpcion = (opcion) => {
    setValor(opcion.valor);
    setTextoInput(opcion.etiqueta);
    setMostrarSugerencias(false);
    
    if (onChange) {
      onChange(opcion.valor, opcion);
    }
  };
  
  const handleFocus = () => {
    if (textoInput) {
      filtrarOpciones(textoInput);
      setMostrarSugerencias(true);
    }
  };
  
  const handleKeyDown = (e) => {
    // Si presiona Escape, cerrar las sugerencias
    if (e.key === 'Escape') {
      setMostrarSugerencias(false);
    }
    
    // Si presiona Enter y hay opciones filtradas, seleccionar la primera
    if (e.key === 'Enter' && opcionesFiltradas.length > 0) {
      e.preventDefault();
      handleSeleccionarOpcion(opcionesFiltradas[0]);
    }
  };
  
  const limpiarCampo = () => {
    setTextoInput('');
    setValor('');
    setOpcionesFiltradas([]);
    
    if (onChange) {
      onChange('', null);
    }
  };
  
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}{required && <span className="text-danger">*</span>}</Form.Label>}
      
      <div className="position-relative" ref={dropdownRef}>
        <div className="d-flex">
          <Form.Control
            type="text"
            value={textoInput}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            disabled={disabled || cargando}
            name={name}
            required={required}
            placeholder="Escriba para buscar..."
            autoComplete="off"
          />
          {textoInput && !cargando && (
            <button 
              type="button" 
              className="btn btn-link position-absolute" 
              style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 5 }}
              onClick={limpiarCampo}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          )}
          <input type="hidden" value={valor} name={`${name}_valor`} />
        </div>
        
        {mostrarSugerencias && (
          <ListGroup 
            className="position-absolute w-100 shadow-sm" 
            style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
          >
            {opcionesFiltradas.length > 0 ? (
              opcionesFiltradas.map((opcion, index) => (
                <ListGroup.Item 
                  key={index} 
                  action 
                  onClick={() => handleSeleccionarOpcion(opcion)}
                  className="py-2"
                >
                  {opcion.etiqueta}
                </ListGroup.Item>
              ))
            ) : (
              textoInput.trim() !== '' && (
                <ListGroup.Item className="py-2 text-muted">
                  No se encontraron coincidencias
                </ListGroup.Item>
              )
            )}
          </ListGroup>
        )}
        
        {cargando && (
          <div className="position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
            <Spinner animation="border" size="sm" />
          </div>
        )}
      </div>
      
      {error && <Form.Text className="text-danger">{error}</Form.Text>}
    </Form.Group>
  );
};

export default SiesaDropdown;