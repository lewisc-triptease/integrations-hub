terraform {
  backend "gcs" {
    bucket = "triptease-onboard-terraform-state"
    prefix = "integrations-hub"
  }
}
