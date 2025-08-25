resource "google_artifact_registry_repository" "integrations_hub" {
  project       = var.project_id
  location      = "us"
  repository_id = "integrations-hub"
  format        = "DOCKER"
  
  lifecycle {
    # Don't destroy if it exists, and ignore changes to prevent recreation
    prevent_destroy = true
    ignore_changes = [labels]
  }
}