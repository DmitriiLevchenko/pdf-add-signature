import React, {useState, useRef} from 'react'
import {useDropzone} from 'react-dropzone'
import SignaturePad from 'react-signature-canvas'
import {PDFDocument} from 'pdf-lib'
import './App.css'

function App() {
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState('')
  const [signatureDataUrl, setSignatureDataUrl] =
    useState('')
  const sigPadRef = useRef({})
  const [downloadUrl, setDownloadUrl] = useState('')
  const [signatureX, setSignatureX] = useState(0) // X coordinate for the signature
  const [signatureY, setSignatureY] = useState(0) // Y coordinate for the signature

  const onDrop = async acceptedFiles => {
    const file = acceptedFiles[0]
    setPdfFile(file)
    setPdfPreviewUrl(URL.createObjectURL(file))
  }

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
  })

  const clearSignature = () => sigPadRef.current.clear()

  const saveSignature = () => {
    setSignatureDataUrl(
      sigPadRef.current
        .getTrimmedCanvas()
        .toDataURL('image/png'),
    )
  }

  const addSignatureToPdf = async () => {
    if (!pdfFile || !signatureDataUrl) return

    const pdfBytes = await pdfFile.arrayBuffer()
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const page = pdfDoc.getPage(0)

    const signatureImage = await pdfDoc.embedPng(
      signatureDataUrl,
    )

    // Use the X and Y state variables to position the signature
    page.drawImage(signatureImage, {
      x: signatureX,
      y: signatureY,
      width: 50,
      height: 50,
    })

    const pdfBytesOut = await pdfDoc.save()
    const newPdfUrl = URL.createObjectURL(
      new Blob([pdfBytesOut], {type: 'application/pdf'}),
    )

    setDownloadUrl(newPdfUrl)
    setPdfPreviewUrl(newPdfUrl) // Update to ensure the iframe reloads with the new PDF
  }

  return (
    <div className='App'>
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
      {pdfPreviewUrl && (
        <div
          style={{position: 'relative', height: '500px'}}
        >
          {pdfPreviewUrl && (
            <iframe
              key={pdfPreviewUrl}
              src={pdfPreviewUrl}
              width='100%'
              height='500px'
              style={{
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      )}
      {pdfFile && (
        <>
          <div className='signature-container'>
            <SignaturePad
              ref={sigPadRef}
              canvasProps={{
                className: 'signatureCanvas',
                width: 250,
                height: 150,
              }}
            />
            <button onClick={clearSignature}>Clear</button>
            <button onClick={saveSignature}>
              Save Signature
            </button>
          </div>
          <div className='coordinates-inputs'>
            <input
              type='number'
              value={signatureX}
              onChange={e =>
                setSignatureX(Number(e.target.value))
              }
              placeholder='Signature X Coordinate'
            />
            <input
              type='number'
              value={signatureY}
              onChange={e =>
                setSignatureY(Number(e.target.value))
              }
              placeholder='Signature Y Coordinate'
            />
            <button onClick={() => addSignatureToPdf()}>
              Add Signature to PDF
            </button>
          </div>
        </>
      )}
      {downloadUrl && (
        <a
          href={downloadUrl}
          download='signed-document.pdf'
        >
          Download Signed PDF
        </a>
      )}
    </div>
  )
}

export default App
