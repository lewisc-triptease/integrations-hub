resource "google_artifact_registry_repository" "integrations_hub" {
  project       = var.project_id
  location      = "us"
  repository_id = "integrations-hub"
  format        = "DOCKER"
  
  lifecycle {
    prevent_destroy = true
    ignore_changes = [labels]
  }
}