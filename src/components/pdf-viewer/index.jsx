import {PDFDocument} from 'pdf-lib'
import {useEffect, useState} from 'react'

const PDFViewer = ({pdfFile, signatureDataUrl}) => {
  const [modifiedPdfUrl, setModifiedPdfUrl] = useState('')

  useEffect(() => {
    if (pdfFile && signatureDataUrl) {
      // Initially, load the PDF without any signature to display it
      const objectUrl = URL.createObjectURL(pdfFile)
      setModifiedPdfUrl(objectUrl)
    }
  }, [pdfFile, signatureDataUrl])

  const handlePdfClick = async e => {
    if (!pdfFile || !signatureDataUrl) return

    // Placeholder for clicked coordinates
    const x = e.nativeEvent.offsetX
    const y = e.nativeEvent.offsetY

    const pdfBytes = await pdfFile.arrayBuffer()
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const page = pdfDoc.getPage(0) // Example for adding to the first page

    const signatureImage = await pdfDoc.embedPng(
      signatureDataUrl,
    )
    page.drawImage(signatureImage, {
      x,
      y,
      width: 50,
      height: 50,
    })

    const pdfBytesOut = await pdfDoc.save()
    const blob = new Blob([pdfBytesOut], {
      type: 'application/pdf',
    })
    const newPdfUrl = URL.createObjectURL(blob)
    setModifiedPdfUrl(newPdfUrl)
  }

  return (
    <div onClick={handlePdfClick}>
      {modifiedPdfUrl && (
        <iframe
          src={modifiedPdfUrl}
          style={{width: '100%', height: '500px'}}
        />
      )}
    </div>
  )
}

export default PDFViewer
