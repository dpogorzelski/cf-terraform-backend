addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const auth = request.headers.get('Authorization')
  if (!auth) {
    return new Response(null, {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="${REALM}"' },
    })
  }

  const split = auth.split(' ')
  const plain = atob(split[1])
  const creds = plain.split(':')

  if (creds[0] !== TFUSER || creds[1] !== TFPWD) {
    return new Response(null, {
      status: 401,
    })
  }

  switch (request.method) {
    case 'GET':
      let state = await TERRAFORM.get('state')
      return new Response(state, { status: 200 })
    case 'POST':
      req = JSON.stringify(await request.json())
      await TERRAFORM.put('state', req)
      return new Response(null, { status: 200 })
    case 'LOCK':
      let lock = await TERRAFORM.get('lock')
      if (lock !== null) {
        return new Response(lock, { status: 423 })
      }
      let req = JSON.stringify(await request.json())
      await TERRAFORM.put('lock', req)
      return new Response(null, { status: 200 })
    case 'UNLOCK':
      await TERRAFORM.put('lock', null)
      return new Response(null, { status: 200 })
    default:
      return new Response(null, { status: 400 })
  }
}
