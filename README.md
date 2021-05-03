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