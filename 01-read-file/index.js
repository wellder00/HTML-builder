const fs = require('fs')
const path = require('path')

const txtPath = path.resolve(__dirname, 'text.txt')

fs.access(txtPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.log('Этого файла нет!')
    return
  }

  const stream = fs.createReadStream(txtPath, { encoding: 'utf-8' })

  stream.on('data', (data) => {
    console.log(data)
  })

  stream.on('end', () => {   
  })

  stream.on('error', (err) => {
    console.error(`Произошла ошибка при чтении файла: ${err}`)
  })
})
