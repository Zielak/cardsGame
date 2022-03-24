resource "cloudflare_record" "cardgames_world" {
  zone_id = var.cloudflare_zone_id
  name    = var.dns_record_name
  type    = "CNAME"
  value   = "${var.domain}.s3-website.${local.region}.amazonaws.com"
  proxied = true
}
