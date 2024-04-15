const HandleFontsize = ({
  text,
  maxWidth
}: {
  text: string
  maxWidth: number
}) => {
  const calculateFontSize = (textString: string) => {
    const minLength = 12

    let fontSize = Math.floor(maxWidth / textString.length)

    fontSize = Math.max(fontSize, minLength)

    return fontSize + 'px'
  }

  const fontSize = calculateFontSize(text)

  return (
    <div
      style={{
        width: '190px',
        border: '1px solid #ccc',
        overflow: 'hidden',
        whiteSpace: fontSize === '12px' ? 'normal' : 'nowrap'
      }}
    >
      <span style={{ fontSize }}>{text}</span>
    </div>
  )
}

export default HandleFontsize
