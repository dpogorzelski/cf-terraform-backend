# Intro
A word of caution: KV store is eventually consistent so multiple/frequent writes could result in unpredictable outcome but it should be possible to swap KV out with other type of backends for a stronger consistency model.

# Worker Setup

```bash
wrangler secret put TFPWD
wrangler secret put TFUSER
wrangler secret put REALM
wrangler kv:namespace create TERRAFORM
wrangler publish
```
# Terraform Setup

```hcl
terraform {
  backend "http" {
    address        = "WORKER_URL"
    lock_address   = "WORKER_URL"
    unlock_address = "WORKER_URL"
    username       = "USERNAME"
    password       = "PASSWORD"
  }
}
```
