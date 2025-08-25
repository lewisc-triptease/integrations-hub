# Integrations Hub 🔗

Web application for viewing and managing integration config and metadata.

## 🛠️ Setup

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- Google Cloud access 


### Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Run tests
bun test
```

### Environment Variables

```bash
GOOGLE_CLOUD_PROJECT=triptease-onboard
SHEET_NAME=GET_FROM_LIST_OF_CONNECTIONS
SHEET_GID=GET_FROM_LIST_OF_CONNECTIONS
PORT=9898
```

## Project Structure

```
integrations-hub/
├── src/                    # Source code
├── public/                 # Static assets  
├── infrastructure/         # Terraform
├── test/                   # Tests
└── .github/workflows/      # GitHub Actions
```
