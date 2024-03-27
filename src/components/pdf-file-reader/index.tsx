import {PDFDocument} from 'pdf-lib'
import {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

const FileDrop = () => {
  const [pdfUrl, setPdfUrl] = useState('')

  const onDrop = useCallback(async (acceptedFiles: any) => {
    const file = acceptedFiles[0]

    try {
      const arrayBuffer = await file.arrayBuffer()

      const pdfDoc = await PDFDocument.load(arrayBuffer)

      const pdfBytes = await pdfDoc.save()

      const blob = new Blob([pdfBytes], {
        type: 'application/pdf',
      })

      const url = URL.createObjectURL(blob)

      setPdfUrl(url)
    } catch (error) {
      console.error('Error reading PDF: ', error)
    }
  }, [])

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
  })

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #007bff',
          padding: '20px',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <p>
          Drag 'n' drop some files here, or click to select
          files
        </p>
      </div>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          style={{width: '100%', height: '500px'}}
          title='PDF Preview'
        ></iframe>
      )}
    </div>
  )
}

export default FileDrop
