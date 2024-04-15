export const convertBase64ToImageFile = (
  base64String: string | undefined
): File | null => {
  // Check if base64String is defined
  if (!base64String) {
    console.error('Base64 string is undefined or null')
    return null // or handle the error as needed
  }

  // Extract data from the Base64 string
  const [, data] = base64String.match(/^data:image\/.*;base64,(.*)$/) || []

  // Check if the regex matched
  if (!data) {
    console.error('Invalid Base64 string format')
    return null // or handle the error as needed
  }

  // Convert Base64 to ArrayBuffer
  const binaryData = atob(data)
  const arrayBuffer = new ArrayBuffer(binaryData.length)
  const view = new Uint8Array(arrayBuffer)
  for (let i = 0; i < binaryData.length; i++) {
    view[i] = binaryData.charCodeAt(i)
  }

  // Create Blob and File objects
  const blob = new Blob([arrayBuffer], { type: 'image/jpeg' }) // Assuming JPEG format
  const file = new File([blob], 'file.jpg', { type: 'image/jpeg' }) // Assuming JPEG format

  return file
}

export const isBase64 = (fileString: string | any[]): boolean => {
  return (
    !Array.isArray(fileString) &&
    (fileString?.startsWith('data:image/') || fileString?.includes(';base64,'))
  )
}
