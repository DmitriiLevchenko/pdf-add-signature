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
  const [isSignatureMode, setIsSignatureMode] =
    useState(false)

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

  const addSignatureToPdf = async (x, y) => {
    if (!pdfFile || !signatureDataUrl) return

    const pdfBytes = await pdfFile.arrayBuffer()
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const page = pdfDoc.getPage(0)

    const signatureImage = await pdfDoc.embedPng(
      signatureDataUrl,
    )

    // Adjust for a visible placement if needed, might need to scale `x` and `y`
    const scaledX = x // Example, adjust based on actual scaling
    const scaledY = y // Adjust based on actual scaling
    console.log('Placing signature at:', scaledY, scaledX)

    page.drawImage(signatureImage, {
      x: 350,
      y: 50,
      width: 50,
      height: 50,
    })

    const pdfBytesOut = await pdfDoc.save()
    const newPdfUrl = URL.createObjectURL(
      new Blob([pdfBytesOut], {type: 'application/pdf'}),
    )

    console.log('New PDF URL:', newPdfUrl) // Verify the URL is as expected
    setDownloadUrl(newPdfUrl)
    setPdfPreviewUrl(newPdfUrl) // Update to ensure the iframe reloads with the new PDF
    setIsSignatureMode(false)
  }

  const handlePdfContainerClick = e => {
    if (!isSignatureMode) return

    const container = e.currentTarget
    const {x, y} = container.getBoundingClientRect()
    const clickX = e.clientX - x
    const clickY = e.clientY - y
    addSignatureToPdf(clickX, clickY)
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
        </p>
      </div>
      <button
        onClick={() => setIsSignatureMode(!isSignatureMode)}
      >
        {isSignatureMode
          ? 'Exit Signature Mode'
          : 'Enter Signature Mode'}
      </button>
      <div
        onClick={handlePdfContainerClick}
        style={{position: 'relative', height: '500px'}}
      >
        {pdfPreviewUrl && (
          <iframe
            key={pdfPreviewUrl} // Forces re-rendering when the URL changes
            src={pdfPreviewUrl}
            width='100%'
            height='500px'
            style={{
              pointerEvents: isSignatureMode
                ? 'none'
                : 'auto',
            }}
          />
        )}
      </div>
      {pdfFile && (
        <>
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
