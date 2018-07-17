const $ = window.$

export function parseRecipeXml(recipe)  {
  let xmlDoc = $.parseXML(recipe.receta)
  if (xmlDoc !== null) {
    let xml = $(xmlDoc)
    let establecimiento_salud = xml.find('ESTABLECIMIENTO_SALUD')
    let direccion = establecimiento_salud.find('DIRECCION')
    let profesional_prescriptor = xml.find('PROFESIONAL_PRESCRIPTOR')
    let paciente = xml.find('PACIENTE')

    let prescripciones = xml.find('PRESCRIPCIONES')

    let drugs = []
    prescripciones.find('PRESCRIPCION').each(function() {
      drugs.push({
        codigo: $(this).find('CODIGO_MEDICAMENTO').text(),
        dose: $(this).find('DOSIS').text(),
        frequency: $(this).find('FRECUENCIA').text(),
        length: $(this).find('DURACION_DE_LA_INDICACION').text()
      })
    })

    return Promise.resolve({
      establecimiento: {
        name: establecimiento_salud.find('NOMBRE').text(),
        deis: establecimiento_salud.find('CODIGO_DEIS').text(),
        phone: establecimiento_salud.find('TELEFONO').text(),
        email: establecimiento_salud.find('EMAIL').text(),
        street: direccion.find('CALLE').text(),
        street_number: direccion.find('NUMERO').text(),
        depto: direccion.find('DEPARTAMENTO').text(),
        comuna: direccion.find('COMUNA').text(),
      },
      profesional:  {
        name: profesional_prescriptor.find('NOMBRE').text(),
        document_type: profesional_prescriptor.find('DOCUMENTO_IDENTIFICACION').text(),
        document: profesional_prescriptor.find('NUMERO_DOCUMENTO').text(),
        profession: profesional_prescriptor.find('PROFESION').text(),
        super_salud: profesional_prescriptor.find('NUMERO_REGISTRO_PRESTADORES_INDIVIDUALES_SI_SALUD').text(),
        colegio: profesional_prescriptor.find('NUMERO_REGISTRO_COLEGIO_PROFESIONAL').text()
      },
      paciente: {
        name: paciente.find('NOMBRE').text(),
        document_type: paciente.find('DOCUMENTO_IDENTIFICACION').text(),
        document: paciente.find('NUMERO_DOCUMENTO').text(),
        birthday: paciente.find('FECHA_NACIMIENTO').text(),
        weight: paciente.find('PESO').text(),
        size: paciente.find('TALLA').text(),
        address: paciente.find('DIRECCION').text(),
        city: paciente.find('CIUDAD').text(),
        phone: paciente.find('TELEFONO').text()
      },
      prescriptions: drugs,
      diagnosis: xml.find('DIAGNOSTICO').text(),
      fecha: xml.find('FECHA_PRESCRIPCION').text(),
      pacient_detail: xml.find('INDICACIONES_AL_PACIENTE').text(),
      farma_detail: xml.find('INDICACIONES_AL_FARMACEUTICO').text(),
      contract: xml.find('CONTRATO_DISPENSACION').text()
    })
  }
  return Promise.reject('Xml invalido.')
}
