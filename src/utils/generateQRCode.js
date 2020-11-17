import QRCode from 'qrcode'

const defaultOptions = {
  margin: 1,
  width: 280
}
export default function (text, options = defaultOptions) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(text, options)
      .then(url => { resolve(url) })
      .catch(error => { reject(error) })
  })
}
