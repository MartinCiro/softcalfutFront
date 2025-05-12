import React, { useState, useEffect } from 'react';
import { Modal, Form, Alert, Spinner } from 'react-bootstrap';
import SiesaDropdown from '@components/common/SiesaDropdown.jsx';
import {
  MDBBtn,
  MDBSpinner,
  MDBInput,
  MDBInputGroup,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBIcon
} from 'mdb-react-ui-kit';
import { FaMoneyBillWave, FaSave, FaTimes, FaLock, FaUnlock, FaPlus, FaTrash } from 'react-icons/fa';
import FacturaService from '@services/FacturaService';
import CausacionService from '@services/CausacionService';
import axios from 'axios';
import './Facturas.css';

// Constantes para la API de SIESA
const SIESA_API_URL = '/api/siesa';
const CONNI_KEY = 'Connikey-laestrellasa-TDRONEQX';
const CONNI_TOKEN = 'TDRONEQXWDHLM0MWSDJSNLG4RDFBMFA1UTVVN1A1TDNZOFE1RJFQNQ';

// Estilos personalizados para los inputs
const customStyles = {
  input: {
    height: '32px',
    padding: '0.375rem 0.75rem'
  },
  select: {
    height: '38px',
    padding: '0.375rem 0.75rem'
  }
};

const FacturaCausacionModal = ({ show, onHide, facturaId, onSuccess }) => {
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [camposCausacion, setCamposCausacion] = useState([]);
  const [formData, setFormData] = useState({});
  const [retenciones, setRetenciones] = useState([]);
  const [llavesRetencion, setLlavesRetencion] = useState([]);
  const [loadingLlaves, setLoadingLlaves] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(false);

  useEffect(() => {
    if (show && facturaId) {
      cargarDatos();
      cargarLlavesRetencion();
      cargarServicios();
    }
  }, [show, facturaId]);
  
  // Función para calcular la fecha de vencimiento basada en la condición de pago
  const calcularFechaVencimiento = (fechaBase, condicionPago) => {
    if (!fechaBase) return '';
    
    // Convertir la fecha base de formato AAAAMMDD a un objeto Date
    const año = parseInt(fechaBase.substring(0, 4));
    const mes = parseInt(fechaBase.substring(4, 6)) - 1; // Meses en JS son 0-11
    const dia = parseInt(fechaBase.substring(6, 8));
    
    const fecha = new Date(año, mes, dia);
    
    // Extraer el número de días de la condición de pago (asumiendo formato como '30D')
    let diasPlazo = 0;
    if (condicionPago && condicionPago.match(/^\d+D$/)) {
      diasPlazo = parseInt(condicionPago.replace('D', ''));
    }
    
    // Sumar los días al plazo
    fecha.setDate(fecha.getDate() + diasPlazo);
    
    // Formatear la fecha resultante como AAAAMMDD
    const añoVcto = fecha.getFullYear();
    const mesVcto = String(fecha.getMonth() + 1).padStart(2, '0');
    const diaVcto = String(fecha.getDate()).padStart(2, '0');
    
    return `${añoVcto}${mesVcto}${diaVcto}`;
  };
  
  // Función para cargar los servicios desde el backend
  const cargarServicios = async () => {
    setLoadingServicios(true);
    try {
      // No necesitamos cargar los servicios manualmente aquí, ya que el componente SiesaDropdown
      // se encargará de hacer la consulta a la API de SIESA directamente
      console.log('Configurando SiesaDropdown para cargar servicios directamente');
      
      // Limpiamos el estado de servicios para evitar datos duplicados
      setServicios([]);
      
      // Inicializar el campo F320_ID_SERVICIO en el formData si no existe
      // Aseguramos que el campo tenga el formato correcto para la sección Movtocompraservicios
      const fieldKey = 'Movtocompraservicios_F320_ID_SERVICIO';
      
      // Verificar si el campo ya existe en formData
      if (formData[fieldKey] === undefined) {
        console.log('Inicializando campo de servicio en formData:', fieldKey);
        setFormData(prevFormData => ({
          ...prevFormData,
          [fieldKey]: ''
        }));
      } else {
        console.log('Campo de servicio ya existe en formData:', fieldKey, formData[fieldKey]);
      }
    } catch (err) {
      console.error('Error al configurar carga de servicios:', err);
    } finally {
      setLoadingServicios(false);
    }
  };
  
  // Función para renderizar el campo de selección de servicio
  const renderServicioDropdown = () => {
    return (
      <div className="mb-3">
        <Form.Label>Servicio <span className="text-danger">*</span></Form.Label>
        <SiesaDropdown
          tipoConsulta="SERVICIOS_FACTURAS_DIRECTAS"
          valorInicial={formData['Movtocompraservicios_F320_ID_SERVICIO'] || ''}
          onChange={handleServicioChange}
          name="Movtocompraservicios_F320_ID_SERVICIO"
          required={true}
        />
      </div>
    );
  };



  // Función para manejar la selección de un servicio usando SiesaDropdown
  const handleServicioChange = (valor, opcionSeleccionada, event) => {
    // Obtener el nombre del campo desde el evento o usar el valor por defecto
    const fieldName = event?.target?.name || 'Movtocompraservicios_F320_ID_SERVICIO';
    
    console.log('Servicio seleccionado:', valor, opcionSeleccionada);
    console.log('Nombre del campo:', fieldName);
    
    // Actualizar el estado formData con el nuevo valor seleccionado
    setFormData(prevFormData => {
      const newFormData = {
        ...prevFormData,
        [fieldName]: valor
      };
      console.log('FormData actualizado:', newFormData);
      return newFormData;
    });
    
    // Si tenemos datos adicionales del servicio, podemos guardarlos también
    if (opcionSeleccionada && opcionSeleccionada.datos) {
      console.log('Datos completos del servicio:', opcionSeleccionada.datos);
    }
  };

  // Función para cargar las llaves de retención desde el backend
  const cargarLlavesRetencion = async () => {
    setLoadingLlaves(true);
    try {
      // Obtener las llaves de retención desde el servicio
      const llavesData = await CausacionService.getLlavesRetencion();
      
      // Transformar los datos al formato requerido por el componente
      const llaves = Array.isArray(llavesData) ? llavesData.map(llave => ({
        valor: llave.id_llave || llave.codigo || '',
        etiqueta: `${llave.id_llave || llave.codigo || ''} - ${llave.descripcion || llave.nombre || ''}`,
        tasa: llave.tasa || '0.00'
      })) : [];
      
      // Si no hay datos, usar algunos valores por defecto para pruebas
      if (llaves.length === 0) {
        console.log('No se encontraron llaves de retención, usando valores por defecto');
        setLlavesRetencion([
          { valor: 'RTE01', etiqueta: 'RTE01 - Retención en la fuente 4%', tasa: '4.00' },
          { valor: 'RTE02', etiqueta: 'RTE02 - Retención en la fuente 6%', tasa: '6.00' },
          { valor: 'RTE03', etiqueta: 'RTE03 - Retención en la fuente 11%', tasa: '11.00' },
          { valor: 'RTEICA', etiqueta: 'RTEICA - Retención ICA 0.69%', tasa: '0.69' },
          { valor: 'RTEIVA', etiqueta: 'RTEIVA - Retención IVA 15%', tasa: '15.00' }
        ]);
      } else {
        setLlavesRetencion(llaves);
      }
    } catch (err) {
      console.error('Error al cargar llaves de retención:', err);
      // En caso de error, usar valores por defecto
      setLlavesRetencion([
        { valor: 'RTE01', etiqueta: 'RTE01 - Retención en la fuente 4%', tasa: '4.00' },
        { valor: 'RTE02', etiqueta: 'RTE02 - Retención en la fuente 6%', tasa: '6.00' },
        { valor: 'RTE03', etiqueta: 'RTE03 - Retención en la fuente 11%', tasa: '11.00' },
        { valor: 'RTEICA', etiqueta: 'RTEICA - Retención ICA 0.69%', tasa: '0.69' },
        { valor: 'RTEIVA', etiqueta: 'RTEIVA - Retención IVA 15%', tasa: '15.00' }
      ]);
    } finally {
      setLoadingLlaves(false);
    }
  };
  
  // Función para agregar una nueva retención
  const agregarRetencion = () => {
    // Obtener el valor total de la factura para usarlo como base de retención
    let valorTotal = 0;
    if (factura) {
      valorTotal = factura.monto || factura.total || factura.valor_total || 0;
    }
    
    const nuevaRetencion = {
      id: Date.now(), // ID único para identificar esta retención
      F314_ID_LLAVE_RETENCION: '',
      F314_TASA_RETENCION: '',
      F314_BASE_RETENCION: valorTotal.toString(),
      F314_VALOR_RETENCION: '',
      F353_FECHA_VCTO: ''
    };
    
    // Calcular la fecha de vencimiento
    const fechaFactura = formData['F350_FECHA'] || obtenerFechaActual();
    const condicionPago = formData['F311_ID_COND_PAGO'] || '30D';
    nuevaRetencion.F353_FECHA_VCTO = calcularFechaVencimiento(fechaFactura, condicionPago);
    
    setRetenciones([...retenciones, nuevaRetencion]);
  };
  
  // Función para eliminar una retención
  const eliminarRetencion = (id) => {
    setRetenciones(retenciones.filter(retencion => retencion.id !== id));
  };
  
  // Función para actualizar los datos de una retención
  const actualizarRetencion = (id, campo, valor) => {
    const retencionesActualizadas = retenciones.map(retencion => {
      if (retencion.id === id) {
        const retencionActualizada = { ...retencion, [campo]: valor };
        
        // Si se actualiza la llave de retención, podemos autocompletar otros campos
        if (campo === 'F314_ID_LLAVE_RETENCION') {
          // Buscar la llave seleccionada en el array de llaves disponibles
          const llaveSeleccionada = llavesRetencion.find(llave => llave.valor === valor);
          
          if (llaveSeleccionada) {
            // Usar la tasa de la llave seleccionada
            retencionActualizada.F314_TASA_RETENCION = llaveSeleccionada.tasa || '0.00';
            
            // Si no hay base de retención establecida, usar el valor total de la factura
            if (!retencionActualizada.F314_BASE_RETENCION) {
              let valorTotal = 0;
              if (factura) {
                valorTotal = factura.monto || factura.total || factura.valor_total || 0;
              }
              retencionActualizada.F314_BASE_RETENCION = valorTotal.toString();
            }
            
            // Calcular el valor de retención
            const base = parseFloat(retencionActualizada.F314_BASE_RETENCION) || 0;
            const tasa = parseFloat(retencionActualizada.F314_TASA_RETENCION) || 0;
            retencionActualizada.F314_VALOR_RETENCION = ((base * tasa) / 100).toFixed(2);
          }
        }
        
        // Si se actualiza la base o la tasa, calculamos el valor de retención
        if (campo === 'F314_BASE_RETENCION' || campo === 'F314_TASA_RETENCION') {
          const base = parseFloat(retencionActualizada.F314_BASE_RETENCION) || 0;
          const tasa = parseFloat(retencionActualizada.F314_TASA_RETENCION) || 0;
          retencionActualizada.F314_VALOR_RETENCION = ((base * tasa) / 100).toFixed(2);
        }
        
        // Calcular la fecha de vencimiento basada en la fecha de la factura y la condición de pago
        const fechaFactura = formData['F350_FECHA'] || obtenerFechaActual();
        const condicionPago = formData['F311_ID_COND_PAGO'] || '30D';
        retencionActualizada.F353_FECHA_VCTO = calcularFechaVencimiento(fechaFactura, condicionPago);
        
        return retencionActualizada;
      }
      return retencion;
    });
    
    setRetenciones(retencionesActualizadas);
  };
  
  // Función para obtener la fecha actual en formato AAAAMMDD
  const obtenerFechaActual = () => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}${mes}${dia}`;
  };
  
  // Función para separar prefijo (letras) y número de una factura
  const separarPrefijoNumero = (numeroFactura) => {
    if (!numeroFactura) return { prefijo: '', numero: '' };
    
    // Extraer letras al inicio (prefijo) y números
    // Buscar cualquier secuencia de letras al inicio, seguida de números
    // Patrón mejorado para detectar correctamente prefijos alfanuméricos
    const match = numeroFactura.match(/^([A-Za-z]+)([0-9].*)$/);
    
    if (match && match.length >= 3) {
      return {
        prefijo: match[1] || '',
        numero: match[2] || ''
      };
    }
    
    // Si no hay coincidencia con el patrón, verificar si es solo números
    if (/^[0-9]+$/.test(numeroFactura)) {
      return { prefijo: '', numero: numeroFactura };
    }
    
    // Si no se pudo separar correctamente, devolver el valor completo como número
    return { prefijo: '', numero: numeroFactura };
  };

  // Función para obtener el NIT real cuando solo tenemos el UUID
  const obtenerNitPorUuid = async (uuid) => {
    try {
      // Intentar obtener el NIT real desde el backend
      const response = await FacturaService.getNitById(uuid);
      if (response && response.nit) {
        return {
          nit: response.nit.toString(),
          razon_social: response.razon_social && typeof response.razon_social === 'object' ? 
            response.razon_social.razon_social : 
            (response.razon_social || 'No disponible')
        };
      }
      return { nit: uuid, razon_social: 'No disponible' };
    } catch (err) {
      console.error('Error al obtener NIT por UUID:', err);
      return { nit: uuid, razon_social: 'No disponible' }; // Si hay error, devolver el UUID como fallback
    }
  };

  // Función para obtener el producto real cuando solo tenemos el UUID
  const obtenerProductoPorUuid = async (uuid) => {
    try {
      // Intentar obtener el producto real desde el backend
      const response = await FacturaService.getProductoById(uuid);
      if (response && response.descripcion) {
        return {
          uuid: uuid,
          descripcion: response.descripcion || 'Sin descripción',
          cantidad: response.cantidad || 0,
          precio: response.precio || 0
        };
      }
      return { uuid: uuid, descripcion: 'Producto no encontrado', cantidad: 0, precio: 0 };
    } catch (err) {
      console.error('Error al obtener Producto por UUID:', err);
      // Verificar si es un error 404 (producto no encontrado)
      if (err.response && err.response.status === 404) {
        console.log(`Producto con UUID ${uuid} no encontrado en el servidor`);
        return { uuid: uuid, descripcion: 'Producto no encontrado', cantidad: 0, precio: 0 };
      }
      // Para otros errores
      return { uuid: uuid, descripcion: 'Error al cargar el producto', cantidad: 0, precio: 0 };
    }
  };

  const cargarDatos = async () => {
    setLoading(true);
    setError('');
    try {
      // Cargar la factura
      const facturaData = await FacturaService.getFacturaById(facturaId);
      
      // Procesar NITs y Producto si vienen como UUID
      if (facturaData) {
        let processingPromises = [];
        
        // Procesar NIT del vendedor si es un UUID
        if (facturaData.nit_v) {
          if (typeof facturaData.nit_v === 'string' && 
              facturaData.nit_v.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            const nitVendedorPromise = obtenerNitPorUuid(facturaData.nit_v)
              .then(nitInfo => {
                facturaData.nit_v = { 
                  uuid: facturaData.nit_v, 
                  nit: nitInfo.nit,
                  razon_social: nitInfo.razon_social
                };
              })
              .catch(e => {
                console.error('Error al procesar NIT vendedor:', e);
              });
            processingPromises.push(nitVendedorPromise);
          }
        }
        
        // Procesar Producto si es un UUID o referencia incompleta
        if (facturaData.producto) {
          if (typeof facturaData.producto === 'string' && 
              facturaData.producto.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            const productoPromise = obtenerProductoPorUuid(facturaData.producto)
              .then(productoInfo => {
                facturaData.producto = productoInfo;
              })
              .catch(e => {
                console.error('Error al procesar Producto:', e);
                // Asegurar que haya un objeto producto incluso si falla la petición
                facturaData.producto = {
                  uuid: facturaData.producto,
                  descripcion: e.response && e.response.status === 404 ? 'Producto no encontrado' : 'Error al cargar el producto',
                  cantidad: 0,
                  precio: 0
                };
              });
            processingPromises.push(productoPromise);
          }
        }
        
        // Esperar a que todas las promesas de procesamiento se completen
        await Promise.all(processingPromises);
      }
      
      setFactura(facturaData);
      
      // Cargar la configuración de causación
      const configCausacion = await CausacionService.getCausacionConfig();
      
      // Filtrar solo los campos que se deben mostrar
      const camposMostrar = configCausacion.campos ? 
        configCausacion.campos.filter(campo => campo.mostrar) : [];
      
      setCamposCausacion(camposMostrar);
      
      // Inicializar el formulario con los valores predeterminados
      const initialFormData = {};
      
      // Obtener prefijo y número directamente del encabezado de la factura
      // Esto es más confiable que intentar extraerlo con regex
      let prefijo = '';
      let numero = '';
      
      // Si tenemos el número de factura en el encabezado, lo usamos directamente
      if (facturaData.numero) {
        console.log('Número de factura original:', facturaData.numero);
        const resultado = separarPrefijoNumero(facturaData.numero);
        prefijo = resultado.prefijo;
        numero = resultado.numero;
        console.log('Prefijo extraído:', prefijo);
        console.log('Número extraído:', numero);
      } else if (facturaData.FEV) {
        // Si no hay número pero sí hay FEV, intentar extraer de ahí
        console.log('Usando FEV como número de factura:', facturaData.FEV);
        const resultado = separarPrefijoNumero(facturaData.FEV);
        prefijo = resultado.prefijo;
        numero = resultado.numero;
        console.log('Prefijo extraído de FEV:', prefijo);
        console.log('Número extraído de FEV:', numero);
      }
      
      camposMostrar.forEach(campo => {
        // Establecer valores predeterminados para campos específicos
        if (campo.campo === 'F_CIA') {
          // Estandarizar el campo F_CIA con valor '001' para todos los componentes
          initialFormData[`${campo.seccion}_${campo.campo}`] = '001';
        } else if (campo.campo === 'F350_ID_TIPO_DOCTO') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = 'GP';
        } else if (campo.campo === 'F350_CONSEC_DOCTO') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = '00000000';
        } else if (campo.campo === 'F350_FECHA') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = obtenerFechaActual();
        } else if (campo.campo === 'F350_ID_TERCERO') {
          // Extraer NIT del vendedor
          let nitVendedor = '';
          if (facturaData.nit_v) {
            if (typeof facturaData.nit_v === 'object') {
              // Priorizar mostrar el NIT real, no el UUID
              if (facturaData.nit_v.nit) {
                nitVendedor = facturaData.nit_v.nit.toString();
              } else if (facturaData.nit_v.numero_documento) {
                nitVendedor = facturaData.nit_v.numero_documento;
              }
            } else if (typeof facturaData.nit_v === 'string') {
              // Si no es un UUID, usar directamente
              if (!facturaData.nit_v.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
                nitVendedor = facturaData.nit_v;
              }
            }
          }
          // Si no se encontró en nit_v, intentar con otros campos
          if (!nitVendedor) {
            nitVendedor = facturaData.nit || facturaData.nitVendedor || facturaData.documento || '';
          }
          initialFormData[`${campo.seccion}_${campo.campo}`] = nitVendedor;
        } else if (campo.campo === 'F350_ID_CLASE_DOCTO') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = '021';
        } else if (campo.campo === 'F350_IND_ESTADO') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = '1';
        } else if (campo.campo === 'F350_IND_IMPRESION') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = '0';
        } else if (campo.campo === 'F311_ID_SUCURSAL_PROV') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = '001';
        } else if (campo.campo === 'F311_ID_TIPO_PROV') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = '0012';
        } else if (campo.campo === 'F311_FECHA_DOCTO_PROV') {
          // Extraer fecha de la factura
          let fechaFactura = '';
          
          // Intentar obtener la fecha de diferentes campos posibles
          if (facturaData.fecha_emision) {
            // Si es un objeto con campo fecha
            if (typeof facturaData.fecha_emision === 'object' && facturaData.fecha_emision.fecha) {
              fechaFactura = facturaData.fecha_emision.fecha;
            } else if (typeof facturaData.fecha_emision === 'string') {
              fechaFactura = facturaData.fecha_emision;
            }
          } else if (facturaData.fecha) {
            fechaFactura = facturaData.fecha;
          }
          
          // Eliminar guiones si existen
          fechaFactura = fechaFactura ? fechaFactura.replace(/-/g, '') : '';
          initialFormData[`${campo.seccion}_${campo.campo}`] = fechaFactura;
        } else if (campo.campo === 'F311_PREFIJO_DOCTO_PROV') {
          // Asignar el prefijo extraído del encabezado
          initialFormData[`${campo.seccion}_${campo.campo}`] = prefijo;
          console.log('Prefijo asignado al campo F311_PREFIJO_DOCTO_PROV:', prefijo);
        } else if (campo.campo === 'F311_NUMERO_DOCTO_PROV') {
          // Asignar el número extraído del encabezado
          // Si no se pudo extraer correctamente, usar el número completo como respaldo
          initialFormData[`${campo.seccion}_${campo.campo}`] = numero || facturaData.numero || facturaData.FEV || '';
          console.log('Número de factura asignado a F311_NUMERO_DOCTO_PROV:', initialFormData[`${campo.seccion}_${campo.campo}`]);
          
          // Si el número está vacío pero tenemos un número completo, intentar extraer solo la parte numérica
          if (!initialFormData[`${campo.seccion}_${campo.campo}`] && (facturaData.numero || facturaData.FEV)) {
            const numeroCompleto = facturaData.numero || facturaData.FEV;
            // Extraer solo los dígitos
            const soloNumeros = numeroCompleto.replace(/\D/g, '');
            if (soloNumeros) {
              initialFormData[`${campo.seccion}_${campo.campo}`] = soloNumeros;
              console.log('Extrayendo solo números para F311_NUMERO_DOCTO_PROV:', soloNumeros);
            }
          }
        } else if (campo.campo === 'F311_ID_COND_PAGO') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = '30D';
        } else if (campo.campo === 'F311_REFERENCIA') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = '';
        } else if (campo.campo === 'F311_ID_MONEDA_DOCTO') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = 'COP';
        } else if (campo.campo === 'F311_ID_MONEDA_CONV') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = 'COP';
        } else if (campo.campo === 'F311_TASA_CONV') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = '00000001.0000';
        } else if (campo.campo === 'F311_ID_MONEDA_LOCAL') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = 'COP';
        } else if (campo.campo === 'F311_TASA_LOCAL') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = '00000001.0000';
        } else if (campo.campo === 'F311_VLR_DIFER') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = '000000000000000.0000';
        } else if (campo.campo === 'F311_VLR_DIFER_ALT') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = '000000000000000.0000';
        } else if (campo.campo === 'F311_IND_CONTABILIZA_X_CO') {
          initialFormData[`${campo.seccion}_${campo.campo}`] = '1';
        } else {
          initialFormData[`${campo.seccion}_${campo.campo}`] = campo.valor || '';
        }
      });
      
      setFormData(initialFormData);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar datos para causación:', err);
      setError(err.message || 'Error al cargar datos para causación');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Preparar los datos para enviar al backend
      const datosCausacion = {
        facturaId: facturaId,
        datos: {},
        retenciones: retenciones
      };
      
      // Organizar los datos por sección
      camposCausacion.forEach(campo => {
        const key = `${campo.seccion}_${campo.campo}`;
        if (!datosCausacion.datos[campo.seccion]) {
          datosCausacion.datos[campo.seccion] = {};
        }
        datosCausacion.datos[campo.seccion][campo.campo] = formData[key] || '';
      });
      
      // Llamar al servicio para procesar la causación
      await CausacionService.procesarCausacion(facturaId, datosCausacion);
      
      setSuccess('Causación procesada exitosamente');
      setSaving(false);
      
      // Notificar al componente padre que la causación fue exitosa
      if (onSuccess) {
        setTimeout(() => {
          onHide();
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      console.error('Error al procesar causación:', err);
      setError(err.message || 'Error al procesar causación');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title><FaMoneyBillWave className="me-2" />Causación de Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <MDBSpinner role="status">
            <span className="visually-hidden">Cargando...</span>
          </MDBSpinner>
          <p className="mt-3">Cargando datos para causación...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title><FaMoneyBillWave className="me-2" />Causación de Factura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        {factura && (
          <div className="mb-4">
            <h5 className="mb-3">Información de la Factura</h5>
            <div className="row">
              <div className="col-md-6 mb-2">
                <strong>Número:</strong> {factura.numero || factura.FEV}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Fecha:</strong> {factura.fecha || (factura.fecha_emision ? (typeof factura.fecha_emision === 'string' ? factura.fecha_emision : factura.fecha_emision.fecha) : 'Sin fecha')}
              </div>
              <div className="col-md-6 mb-2">
                <strong>NIT:</strong> {(() => {
                  if (!factura.nit_v) return factura.nit || factura.nitVendedor || factura.documento || 'Sin información';
                  if (typeof factura.nit_v === 'object') {
                    // Priorizar mostrar el NIT real, no el UUID
                    if (factura.nit_v.nit) {
                      return factura.nit_v.nit.toString();
                    }
                    // Intentar obtener el NIT desde otras propiedades
                    if (factura.nit_v.numero_documento) {
                      return factura.nit_v.numero_documento;
                    } else if (factura.nit_v.tipo_tributacion) {
                      return factura.nit_v.tipo_tributacion;
                    } else if (factura.nit_v.tipo_documento) {
                      return factura.nit_v.tipo_documento;
                    }
                    // Si tiene uuid, mostrar un mensaje de carga
                    if (factura.nit_v.uuid) {
                      return 'Cargando NIT...';
                    }
                    // Mostrar el valor disponible en lugar de 'Sin información'
                    return factura.nit_v.toString();
                  } else if (typeof factura.nit_v === 'string') {
                    // Si es un UUID, mostrar un mensaje de carga
                    if (factura.nit_v.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
                      return 'Cargando NIT...';
                    }
                    return factura.nit_v;
                  }
                  return 'Sin información';
                })()}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Proveedor:</strong> {(() => {
                  if (!factura.nit_v) return factura.razonSocial || factura.proveedor || factura.nombre_proveedor || factura.vendedor || 'Sin información';
                  if (typeof factura.nit_v === 'object') {
                    // Verificar si razon_social es un objeto o un string
                    if (factura.nit_v.razon_social) {
                      if (typeof factura.nit_v.razon_social === 'object') {
                        return factura.nit_v.razon_social.razon_social || 'No disponible';
                      } else {
                        return factura.nit_v.razon_social;
                      }
                    }
                    // Intentar obtener el nombre desde otras propiedades
                    if (factura.nit_v.nombre) return factura.nit_v.nombre;
                    if (factura.nit_v.nombre_proveedor) return factura.nit_v.nombre_proveedor;
                    
                    return 'No disponible';
                  }
                  return factura.razonSocial || factura.proveedor || factura.nombre_proveedor || factura.vendedor || 'Sin información';
                })()}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Producto:</strong> {(() => {
                  if (!factura.producto) return 'Sin descripción';
                  if (typeof factura.producto === 'object') {
                    // Si es un objeto, intentar obtener la descripción
                    if (factura.producto.descripcion) {
                      return factura.producto.descripcion;
                    }
                    // Si tiene uuid pero no descripción, mostrar un mensaje más informativo
                    if (factura.producto.uuid) {
                      return 'Información del producto no disponible';
                    }
                    return 'Sin descripción';
                  } else if (typeof factura.producto === 'string') {
                    // Si es un UUID, mostrar un mensaje de carga
                    if (factura.producto.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
                      return 'Cargando información del producto...';
                    }
                    return factura.producto;
                  }
                  return 'Sin descripción';
                })()}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Valor Total:</strong> ${(factura.monto || factura.total || factura.valor_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        )}
        
        <Form onSubmit={handleSubmit}>
          {camposCausacion.length > 0 ? (
            <>
              {/* Agrupar campos por sección en el orden especificado */}
              {/* Primero mostramos las secciones en el orden deseado */}
              {/* Primero mostramos las secciones en el orden deseado */}
              {['Doctocompraservicios', 'Movtocompraservicios', 'Impuestos', 'Retenciones', 'CuotasCxP']
                .filter(seccionOrdenada => Array.from(new Set(camposCausacion.map(campo => campo.seccion))).includes(seccionOrdenada))
                .map(seccion => (
                <div key={seccion} className="mb-4">
                  <h5 className="mb-3">{seccion}</h5>
                  <MDBTable bordered hover responsive>
                    <MDBTableHead light>
                      <tr>
                        <th>Campo</th>
                        <th>Valor</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {camposCausacion
                        .filter(campo => campo.seccion === seccion)
                        .filter(campo => campo.campo !== 'F350_NOTAS') // Excluimos F350_NOTAS para mostrarlo al final
                        .map((campo, index) => {
                          const fieldKey = `${campo.seccion}_${campo.campo}`;
                          return (
                            <tr key={index}>
                              <td>{campo.campo}</td>
                              <td>
                                {campo.campo === 'F_LIQUIDA_IMPUESTO' || campo.campo === 'F_LIQUIDA_RETENCION' || campo.campo === 'F_CONSEC_AUTO_REG' ? (
                                  <Form.Control
                                    as="select"
                                    name={fieldKey}
                                    value={formData[fieldKey] || (campo.campo === 'F_LIQUIDA_IMPUESTO' ? '0' : '')}
                                    onChange={handleInputChange}
                                    disabled={campo.bloqueado}
                                    style={customStyles.select}
                                  >
                                    {campo.campo === 'F_LIQUIDA_IMPUESTO' || campo.campo === 'F_LIQUIDA_RETENCION' ? (
                                      <>
                                        <option value="">Seleccione...</option>
                                        <option value="0">No</option>
                                        <option value="1">Sí</option>
                                      </>
                                    ) : campo.campo === 'F_CONSEC_AUTO_REG' ? (
                                      <>
                                        <option value="">Seleccione...</option>
                                        <option value="0">Manual</option>
                                        <option value="1">Automático</option>
                                      </>
                                    ) : null}
                                  </Form.Control>
                                ) : campo.campo === 'F350_IND_ESTADO' ? (
                                  <Form.Control
                                    as="select"
                                    name={fieldKey}
                                    value={formData[fieldKey] || ''}
                                    onChange={handleInputChange}
                                    disabled={campo.bloqueado}
                                    style={customStyles.select}
                                  >
                                    <option value="">Seleccione...</option>
                                    <option value="0">Elaboración</option>
                                    <option value="1">Aprobado</option>
                                    <option value="2">Anulado</option>
                                  </Form.Control>
                                ) : campo.campo === 'F350_IND_IMPRESION' ? (
                                  <Form.Control
                                    as="select"
                                    name={fieldKey}
                                    value={formData[fieldKey] || ''}
                                    onChange={handleInputChange}
                                    disabled={campo.bloqueado}
                                    style={customStyles.select}
                                  >
                                    <option value="">Seleccione...</option>
                                    <option value="0">No</option>
                                    <option value="1">Sí</option>
                                  </Form.Control>
                                ) : campo.campo === 'F320_ID_SERVICIO' ? (
                                  <div>
                                    {console.log('Renderizando SiesaDropdown para servicios:', fieldKey, formData[fieldKey])}
                                    <SiesaDropdown
                                      tipoConsulta="SERVICIOS_FACTURAS_DIRECTAS"
                                      valorInicial={formData[fieldKey] || ''}
                                      onChange={(valor, opcionSeleccionada) => {
                                        console.log('Servicio seleccionado en dropdown:', valor, opcionSeleccionada);
                                        handleServicioChange(valor, opcionSeleccionada, { target: { name: fieldKey } });
                                      }}
                                      disabled={campo.bloqueado}
                                      required={campo.requerido}
                                      name={fieldKey}
                                    />
                                    {loadingServicios && (
                                      <div className="text-center mt-2">
                                        <Spinner animation="border" size="sm" />
                                        <span className="ms-2">Cargando servicios...</span>
                                      </div>
                                    )}
                                  </div>
                                ) : campo.campo === 'F350_ID_CO' || campo.campo === 'F311_ID_UN' ? (
                                  <SiesaDropdown
                                    tipoConsulta={campo.campo === 'F311_ID_UN' ? "MAESTRO_UN" : "MAESTRO_CO"}
                                    valorInicial={formData[fieldKey] || ''}
                                    onChange={(valor, opcionSeleccionada) => {
                                      console.log(`${campo.campo} seleccionado:`, valor, opcionSeleccionada);
                                      setFormData(prevFormData => {
                                        const newFormData = {
                                          ...prevFormData,
                                          [fieldKey]: valor
                                        };
                                        console.log('FormData actualizado:', newFormData);
                                        return newFormData;
                                      });
                                    }}
                                    disabled={campo.bloqueado}
                                    label={campo.campo === 'F311_ID_UN' ? "Unidad de Negocio" : "Centro Operativo"}
                                    required={campo.requerido}
                                    name={fieldKey}
                                  />
                                ) : campo.campo === 'F350_FECHA' ? (
                                  <MDBInput
                                    type="text"
                                    name={fieldKey}
                                    value={formData[fieldKey] || ''}
                                    onChange={handleInputChange}
                                    placeholder="AAAAMMDD"
                                    disabled={campo.bloqueado}
                                    style={customStyles.input}
                                  />
                                ) : (
                                  <MDBInput
                                    type="text"
                                    name={fieldKey}
                                    value={formData[fieldKey] || ''}
                                    onChange={handleInputChange}
                                    disabled={campo.bloqueado}
                                    style={customStyles.input}
                                  />
                                )}
                              </td>

                            </tr>
                          );
                        })}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              ))}
              
              {/* Luego mostramos las secciones que no están en el orden predefinido */}
              {Array.from(new Set(camposCausacion.map(campo => campo.seccion)))
                .filter(seccion => !['Doctocompraservicios', 'Movtocompraservicios', 'Impuestos', 'Retenciones', 'CuotasCxP'].includes(seccion))
                .map(seccion => (
                <div key={seccion} className="mb-4">
                  <h5 className="mb-3">{seccion}</h5>
                  <MDBTable bordered hover responsive>
                    <MDBTableHead light>
                      <tr>
                        <th>Campo</th>
                        <th>Valor</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {camposCausacion
                        .filter(campo => campo.seccion === seccion)
                        .filter(campo => campo.campo !== 'F350_NOTAS') // Excluimos F350_NOTAS para mostrarlo al final
                        .map((campo, index) => {
                          const fieldKey = `${campo.seccion}_${campo.campo}`;
                          return (
                            <tr key={index}>
                              <td>{campo.campo}</td>
                              <td>
                                {campo.campo === 'F_LIQUIDA_IMPUESTO' || campo.campo === 'F_LIQUIDA_RETENCION' || campo.campo === 'F_CONSEC_AUTO_REG' ? (
                                  <Form.Control
                                    as="select"
                                    name={fieldKey}
                                    value={formData[fieldKey] || (campo.campo === 'F_LIQUIDA_IMPUESTO' ? '0' : '')}
                                    onChange={handleInputChange}
                                    disabled={campo.bloqueado}
                                    style={customStyles.select}
                                  >
                                    {campo.campo === 'F_LIQUIDA_IMPUESTO' || campo.campo === 'F_LIQUIDA_RETENCION' ? (
                                      <>
                                        <option value="">Seleccione...</option>
                                        <option value="0">No</option>
                                        <option value="1">Sí</option>
                                      </>
                                    ) : campo.campo === 'F_CONSEC_AUTO_REG' ? (
                                      <>
                                        <option value="">Seleccione...</option>
                                        <option value="0">Manual</option>
                                        <option value="1">Automático</option>
                                      </>
                                    ) : null}
                                  </Form.Control>
                                ) : campo.campo === 'F350_IND_ESTADO' ? (
                                  <Form.Control
                                    as="select"
                                    name={fieldKey}
                                    value={formData[fieldKey] || ''}
                                    onChange={handleInputChange}
                                    disabled={campo.bloqueado}
                                    style={customStyles.select}
                                  >
                                    <option value="">Seleccione...</option>
                                    <option value="0">Elaboración</option>
                                    <option value="1">Aprobado</option>
                                    <option value="2">Anulado</option>
                                  </Form.Control>
                                ) : campo.campo === 'F350_IND_IMPRESION' ? (
                                  <Form.Control
                                    as="select"
                                    name={fieldKey}
                                    value={formData[fieldKey] || ''}
                                    onChange={handleInputChange}
                                    disabled={campo.bloqueado}
                                    style={customStyles.select}
                                  >
                                    <option value="">Seleccione...</option>
                                    <option value="0">No</option>
                                    <option value="1">Sí</option>
                                  </Form.Control>
                                ) : campo.campo === 'F320_ID_SERVICIO' ? (
                                  <div>
                                    {console.log('Renderizando SiesaDropdown para servicios:', fieldKey, formData[fieldKey])}
                                    <SiesaDropdown
                                      tipoConsulta="SERVICIOS_FACTURAS_DIRECTAS"
                                      valorInicial={formData[fieldKey] || ''}
                                      onChange={(valor, opcionSeleccionada) => {
                                        console.log('Servicio seleccionado en dropdown:', valor, opcionSeleccionada);
                                        handleServicioChange(valor, opcionSeleccionada, { target: { name: fieldKey } });
                                      }}
                                      disabled={campo.bloqueado}
                                      required={campo.requerido}
                                      name={fieldKey}
                                    />
                                    {loadingServicios && (
                                      <div className="text-center mt-2">
                                        <Spinner animation="border" size="sm" />
                                        <span className="ms-2">Cargando servicios...</span>
                                      </div>
                                    )}
                                  </div>
                                ) : campo.campo === 'F350_ID_CO' || campo.campo === 'F311_ID_UN' ? (
                                  <SiesaDropdown
                                    tipoConsulta={campo.campo === 'F311_ID_UN' ? "MAESTRO_UN" : "MAESTRO_CO"}
                                    valorInicial={formData[fieldKey] || ''}
                                    onChange={(valor, opcionSeleccionada) => {
                                      console.log(`${campo.campo} seleccionado:`, valor, opcionSeleccionada);
                                      setFormData(prevFormData => {
                                        const newFormData = {
                                          ...prevFormData,
                                          [fieldKey]: valor
                                        };
                                        console.log('FormData actualizado:', newFormData);
                                        return newFormData;
                                      });
                                    }}
                                    disabled={campo.bloqueado}
                                    label={campo.campo === 'F311_ID_UN' ? "Unidad de Negocio" : "Centro Operativo"}
                                    required={campo.requerido}
                                    name={fieldKey}
                                  />
                                ) : campo.campo === 'F350_FECHA' ? (
                                  <MDBInput
                                    type="text"
                                    name={fieldKey}
                                    value={formData[fieldKey] || ''}
                                    onChange={handleInputChange}
                                    placeholder="AAAAMMDD"
                                    disabled={campo.bloqueado}
                                    style={customStyles.input}
                                  />
                                ) : (
                                  <MDBInput
                                    type="text"
                                    name={fieldKey}
                                    value={formData[fieldKey] || ''}
                                    onChange={handleInputChange}
                                    disabled={campo.bloqueado}
                                    style={customStyles.input}
                                  />
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              ))}
              
              {/* Finalmente mostramos el campo F350_NOTAS al final */}
              {camposCausacion.some(campo => campo.campo === 'F350_NOTAS') && (
                <div className="mb-4">
                  <h5 className="mb-3">Notas</h5>
                  <MDBTable bordered hover responsive>
                    <MDBTableHead light>
                      <tr>
                        <th>Campo</th>
                        <th>Valor</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {camposCausacion
                        .filter(campo => campo.campo === 'F350_NOTAS')
                        .map((campo, index) => {
                          const fieldKey = `${campo.seccion}_${campo.campo}`;
                          return (
                            <tr key={index}>
                              <td>{campo.campo}</td>
                              <td>
                                <MDBInput
                                  type="textarea"
                                  rows="3"
                                  name={fieldKey}
                                  value={formData[fieldKey] || ''}
                                  onChange={handleInputChange}
                                  disabled={campo.bloqueado}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              )}
            </>
          ) : (
            <Alert variant="info">
              No hay campos configurados para causación. Por favor, configure los campos en la sección de Administración &gt; Configuración &gt; Causación.
            </Alert>
          )}
          
          {/* Sección de Retenciones */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Retenciones</h5>
              <MDBBtn color="primary" size="sm" onClick={(e) => {
                e.preventDefault();
                agregarRetencion();
              }} type="button">
                <FaPlus className="me-2" />Agregar Retención
              </MDBBtn>
            </div>
            
            {retenciones.length > 0 ? (
              <MDBTable bordered hover responsive>
                <MDBTableHead light>
                  <tr>
                    <th>Llave de Retención</th>
                    <th>Tasa (%)</th>
                    <th>Base</th>
                    <th>Valor</th>
                    <th>Fecha Vencimiento</th>
                    <th>Acciones</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {retenciones.map((retencion) => (
                    <tr key={retencion.id}>
                      <td>
                        <Form.Control
                          as="select"
                          value={retencion.F314_ID_LLAVE_RETENCION}
                          onChange={(e) => actualizarRetencion(retencion.id, 'F314_ID_LLAVE_RETENCION', e.target.value)}
                          style={customStyles.select}
                        >
                          <option value="">Seleccione...</option>
                          {llavesRetencion.map((llave) => (
                            <option key={llave.valor} value={llave.valor}>
                              {llave.etiqueta}
                            </option>
                          ))}
                        </Form.Control>
                      </td>
                      <td>
                        <MDBInput
                          type="text"
                          value={retencion.F314_TASA_RETENCION}
                          onChange={(e) => actualizarRetencion(retencion.id, 'F314_TASA_RETENCION', e.target.value)}
                          style={customStyles.input}
                        />
                      </td>
                      <td>
                        <MDBInput
                          type="text"
                          value={retencion.F314_BASE_RETENCION}
                          onChange={(e) => actualizarRetencion(retencion.id, 'F314_BASE_RETENCION', e.target.value)}
                          style={customStyles.input}
                        />
                      </td>
                      <td>
                        <MDBInput
                          type="text"
                          value={retencion.F314_VALOR_RETENCION}
                          readOnly
                          style={customStyles.input}
                        />
                      </td>
                      <td>
                        <MDBInput
                          type="text"
                          value={retencion.F353_FECHA_VCTO}
                          placeholder="AAAAMMDD"
                          readOnly
                          style={customStyles.input}
                        />
                      </td>
                      <td>
                        <MDBBtn 
                          color="danger" 
                          size="sm" 
                          onClick={() => eliminarRetencion(retencion.id)}
                        >
                          <FaTrash />
                        </MDBBtn>
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            ) : (
              <Alert variant="info">
                No hay retenciones configuradas. Haga clic en "Agregar Retención" para añadir una.
              </Alert>
            )}
          </div>
          
          <div className="d-flex justify-content-end mt-4">
            <MDBBtn color="secondary" className="me-2" onClick={onHide} disabled={saving}>
              <FaTimes className="me-2" />Cancelar
            </MDBBtn>
            <MDBBtn type="submit" color="success" disabled={saving || camposCausacion.length === 0}>
              {saving ? (
                <>
                  <MDBSpinner size='sm' role='status' tag='span' className='me-2' />
                  Procesando...
                </>
              ) : (
                <>
                  <FaSave className="me-2" />Procesar Causación
                </>
              )}
            </MDBBtn>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FacturaCausacionModal;
