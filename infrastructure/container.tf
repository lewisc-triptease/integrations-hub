variable "project_id" { default = "triptease-onboard" }
variable "image_tag" { default = "latest" }

locals {
  image_name = "us-docker.pkg.dev/${var.project_id}/integrations-hub/integrations_hub:${var.image_tag}"
}

resource "google_service_account" "run_sa" {
  account_id   = "integrations-hub"
  display_name = "Cloud Run runtime"
}

resource "google_artifact_registry_repository_iam_member" "puller" {
  project    = var.project_id
  location   = google_artifact_registry_repository.integrations_hub.location
  repository = google_artifact_registry_repository.integrations_hub.repository_id
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.run_sa.email}"
}

resource "google_cloud_run_v2_service" "default" {
  name     = "integrations-hub"
  location = "us-central1"
  deletion_protection = false
  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = local.image_name
      liveness_probe {
        http_get {
          path = "/health"
          port = 8080
        }
        initial_delay_seconds = 5
        period_seconds        = 10
        timeout_seconds       = 5
        failure_threshold     = 3
      }
    }
    scaling {
      max_instance_count = 1
    }

    service_account = google_service_account.run_sa.email
  }
}

resource "google_cloud_run_v2_service_iam_binding" "org_only" {
  project  = "triptease-onboard"
  location = google_cloud_run_v2_service.default.location
  name     = google_cloud_run_v2_service.default.name

  role    = "roles/run.invoker"
  members = ["domain:triptease.com"]
}

output "service_url" {
  value = google_cloud_run_v2_service.default.uri
}

output "service_name" {
  value = google_cloud_run_v2_service.default.name
}