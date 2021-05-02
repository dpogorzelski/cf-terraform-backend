update wrangler.toml with your account_id
wrangler secret put TFPWD
wrangler secret put TFUSER
wrangler secret put REALM
wrangler kv:namespace create TERRAFORM
wrangler publish
