import app from './app.js'

const PORT = process.env.VITE_SERVER_PORT || 3000

app.set('port', PORT)

app.get('/', (req, res) => {
  	res.send('Server Is Ready')
})

app.listen(PORT, () => {
	console.log('Server listening on port ' + PORT + '\n')
})

app.get('/status', async (req, res, next) => {
  return res.status(200).send('Server is On\n')
})