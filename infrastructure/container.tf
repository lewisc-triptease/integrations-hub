variable "project_id" { default = "triptease-onboard" }

resource "google_service_account" "run_sa" {
  account_id   = "integrations-hub"
  display_name = "Cloud Run runtime"
}

resource "google_artifact_registry_repository" "integrations_hub" {
  project       = var.project_id
  location      = "us-east1"
  repository_id = "integrations-hub"
  format        = "DOCKER"
}

resource "google_artifact_registry_repository_iam_member" "puller" {
  project    = var.project_id
  location   = google_artifact_registry_repository.integrations_hub.location
  repository = google_artifact_registry_repository.integrations_hub.repository_id
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.run_sa.email}"
}

resource "google_cloud_run_v2_service" "default" {
  name     = "cloudrun-service"
  location = "us-central1"
  deletion_protection = false
  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "us-east1-docker.pkg.dev/${var.project_id}/integrations-hub/integrations_hub:latest"
      liveness_probe {
        http_get {
          path = "/health"
          port = 3000
        }
        initial_delay_seconds = 5
        period_seconds        = 10
        timeout_seconds       = 5
        failure_threshold     = 3
        success_threshold     = 1
      }
    }
    scaling {
      max_instance_count = 1
    }

    service_account = google_service_account.run_sa.email
  }
}