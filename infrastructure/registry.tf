data "google_artifact_registry_repository" "integrations_hub" {
  project       = var.project_id
  location      = "us"
  repository_id = "integrations-hub"
}