import { useState } from 'react'
import { Data } from './Components/Data'
import * as XLSX from 'xlsx'

function App() {

  // on change states
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileError, setExcelFileError] = useState(null);

  // submit
  const [excelData, setExcelData] = useState(null);
  // it will contain array of objects

  // handle File
  const fileType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const fileType2 = ['application/vnd.ms-excel'];

  const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      // console.log(selectedFile.type);
      if (selectedFile && fileType.includes(selectedFile.type) || selectedFile && fileType2.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFileError(null);
          setExcelFile(e.target.result);
        }
      }
      else {
        setExcelFileError('Por favor seleccione archivos de tipo excel');
        setExcelFile(null);
      }
    }
    else {
      console.log('Por favor seleccione su archivo');
    }
  }

  // submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const Datos = data.map(excel => {
        let getDate = new Date((excel.Date - (25567 + 1)) * 86400 * 1000)
        return {
          ...excel,
          Date: `${getDate.getDate()}/${getDate.getMonth() + 1}/${getDate.getFullYear()}`
        };
      })
      setExcelData(Datos);
    }
    else {
      setExcelData(null);
    }
  }

  return (
    <div className="container">
      {/* upload file section */}
      <div className='form'>
        <form className='form-group' autoComplete="off"
          onSubmit={handleSubmit}>
          <label><h5>Cargar archivo Excel (.xsl o .xslx)</h5></label>
          <br></br>
          <input type='file' className='form-control'
            onChange={handleFile} required accept='xls, xslx'></input>
          {excelFileError && <div className='text-danger'
            style={{ marginTop: 5 + 'px' }}>{excelFileError}</div>}
          <button type='submit' className='btn btn-success'
            style={{ marginTop: 5 + 'px' }}>Mostrar</button>
        </form>
      </div>
      <br></br>
      <hr></hr>
      {/* view file section */}
      <h5>Archivo cargado</h5>
      <div className='viewer'>
        {excelData === null && <>No se ha seleccionado ningun archivo</>}
        {excelData !== null && (
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr>
                  <th scope='col'>ID</th>
                  <th scope='col'>Nombre</th>
                  <th scope='col'>Apellido</th>
                  <th scope='col'>Genero</th>
                  <th scope='col'>Pais</th>
                  <th scope='col'>Edad</th>
                  <th scope='col'>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <Data excelData={excelData} />
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
