locals {
  region = "eu-central-1"
  tags = {
    Application = "cardsgame library"
    Environment = var.environment
    ManagedBy   = "terraform"
    GitRepo     = "github.com/zielak/cardsgame"
  }
}
