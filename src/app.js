import express from 'express'
import handlebars from 'express-handlebars'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// configuracion de Handlebars
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')

// configuracion del directorio de vistas
app.set('views', path.join(__dirname,'views'))

const productos = []

//Ruta Principal
app.get('/', (req, res) => {
    res.render('home', { productos})
})

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {productos})
})

// Servidor webSocket
io.on('connection', (socket) => {
    console.log('Cliente conectado')

    io.emit('productos', productos)

    socket.on('nuevoProducto', (producto) => {
        productos.push(productos)
        io.emit('productos', productos)
        io.of('/realtimeproducts'.emit('productos', productos))
    })

    socket.on('disconnect', () => {
        console.log('Cliente desconectado')
    })

})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('io', io)


const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})


