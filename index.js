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
      const state = await TERRAFORM.get('state')
      return new Response(state, { status: 200 })
    case 'POST':
      const req = JSON.stringify(await request.json())
      await TERRAFORM.put('state', req)
      return new Response(null, { status: 200 })
    case 'LOCK':
      const lock = await TERRAFORM.get('lock')
      if (lock === null) {
        const req = JSON.stringify(await request.json())
        await TERRAFORM.put('lock', req)
        return new Response(null, { status: 200 })
      }
      return new Response(lock, { status: 423 })
    case 'UNLOCK':
      await TERRAFORM.delete('lock')
      return new Response(null, { status: 200 })
    default:
      return new Response(null, { status: 400 })
  }
}
