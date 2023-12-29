export const json = async (req, res) => {
  const buffers = []

  for await (let chunck of req) {
    buffers.push(chunck)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  return res.setHeader('Content-Type', 'application/json')
}