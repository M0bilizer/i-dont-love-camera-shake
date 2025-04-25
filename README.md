## File Structure

```
.
├── diagram                 # Draw.io diagrams that illustrate System Architecture
├── lambda                  # Lambda function
| └── replicate-layer       # Lambda layer
├── old                     # Deprecated files. Ignore this
├── www                     # React Frontend
├── .gitignore
└── README.md
```

# Installation and Run Guide

## Installation For Bun:

### macOS/Linux:
```bash
curl -fsSL https://bun.sh/install | bash
```

### Windows (via WSL):
```bash
curl -fsSL https://bun.sh/install | bash
```

### Windows (via Powershell):
```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

## Run Locally:

1. Navigate to the project directory:
```bash
cd www
```

2. Install dependencies:
```bash
bun install
```

3. Start the application:
```bash
bun run dev
```

## Troubleshooting

If you encounter any issues during installation, please check the [Bun documentation](https://bun.sh/docs) or open an issue in this repository.