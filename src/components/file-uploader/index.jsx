import React from 'react'
import {useDropzone} from 'react-dropzone'

const PDFUpload = ({onFileAccepted}) => {
  const {getRootProps, getInputProps} = useDropzone({
    onDrop: acceptedFiles =>
      onFileAccepted(acceptedFiles[0]),
  })

  return (
    <div
      {...getRootProps()}
      className='dropzone'
    >
      <input {...getInputProps()} />
      <p>
        Drag 'n' drop a PDF file here, or click to select
        files
      </p>
    </div>
  )
}

export default PDFUpload
