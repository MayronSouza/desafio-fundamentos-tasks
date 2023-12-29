import http from 'node:http'
import { json } from './middleware/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const currentRoute = routes.find(route => route.method === method && route.path.test(url))

  if (!currentRoute) {
    return res
      .writeHead(404)
      .end()
  }

  const routeParams = req.url.match(currentRoute.path)
  const { query, ...params } = routeParams.groups

  req.params = params
  req.query = query ? extractQueryParams(query) : {}

  return currentRoute.handler(req, res)
})

server.listen(3335)