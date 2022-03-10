import config from 'config'
import { WebSocketServer } from 'ws'

console.log(config.get('configName'))

const wss = new WebSocketServer({ port: config.get('wsPort') })

wss.on('connection', (ws, req) => {
    const groupId = +req.url.replace('/?groupId=', '')
    ws.id = groupId
    console.log(`SERVER: client connected (groupid: ${ groupId })`)

	ws.on('message', data => {
		data = JSON.parse(data)

		if (data.type == 'subscribeSearch') {
            wss.clients.forEach(client => {
                if (client.id == data.to)
                    client.send(JSON.stringify(data))
            })
        }
	})

	ws.on('close', () => console.log('SERVER: client close connection'))
})
