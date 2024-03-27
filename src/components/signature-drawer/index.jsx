import React, {useRef} from 'react'
import SignaturePad from 'react-signature-canvas'

const SignaturePadComponent = ({onSignatureComplete}) => {
  const sigPadRef = useRef({})

  const saveSignature = () => {
    const signature = sigPadRef.current
      .getTrimmedCanvas()
      .toDataURL('image/png')
    onSignatureComplete(signature)
  }

  return (
    <div>
      <SignaturePad
        ref={sigPadRef}
        canvasProps={{
          className: 'signatureCanvas',
          width: 250,
          height: 150,
        }}
      />
      <button onClick={saveSignature}>
        Save Signature
      </button>
    </div>
  )
}

export default SignaturePadComponent
