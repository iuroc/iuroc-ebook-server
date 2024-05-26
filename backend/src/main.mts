import express from 'express'
import gede from 'gede-book-server'

const app = express()

app.use('/api', gede)

const PORT = process.argv[2] || 8090

app.listen(PORT, () => console.log(`http://localhost:${PORT}/`))