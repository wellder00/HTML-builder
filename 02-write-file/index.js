const fs = require('fs')
const path = require('path')
const {stdin, stdout} = process
let writeContent = fs.createWriteStream(path.join(__dirname, "text.txt"), {flags: 'a'})
stdout.write('Напишите что либо в терминал\n')

stdin.on('data', data => {  
  const text = data.toString().trim()
  if ( text === 'exit') {
    console.log(`Пока!\n`)
    process.exit()
  } else {
    writeContent.write(`${text}\n`)
  }
})

process.on('SIGINT', () =>{ 
  stdout.write(`Пока!\n`)
  process.exit()
})



