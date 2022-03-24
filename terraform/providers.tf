provider "aws" {
  region = local.region
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
