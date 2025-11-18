# CI/CD Workflows

This directory contains GitHub Actions workflows for automated testing and deployment.

## Workflows

### 1. Backend Tests (`backend-tests.yml`)
**Trigger:** Push/PR to main/develop branches
**Purpose:** Run backend unit and integration tests

**Jobs:**
- **test** - Run pytest with coverage on Python 3.11 & 3.12
  - Install dependencies
  - Run tests with coverage
  - Upload coverage to Codecov
  - Upload test results as artifacts

- **lint** - Check code quality
  - flake8 for syntax errors
  - black for code formatting
  - isort for import sorting

**Status Badge:**
```markdown
![Backend Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Backend%20Tests/badge.svg)
```

### 2. Frontend E2E Tests (`frontend-e2e.yml`)
**Trigger:** Push/PR to main/develop branches
**Purpose:** Run end-to-end tests with Playwright

**Jobs:**
- **e2e** - Run Playwright tests
  - Install Node.js and Python
  - Start backend server
  - Run E2E tests
  - Upload test reports and screenshots

- **lint** - Check frontend code quality
  - Run ESLint
  - Verify build succeeds

**Status Badge:**
```markdown
![Frontend E2E](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Frontend%20E2E%20Tests/badge.svg)
```

### 3. Complete CI Pipeline (`ci.yml`)
**Trigger:** Push/PR to main/develop branches
**Purpose:** Full integration testing

**Jobs:**
1. **backend-tests** - Run all backend tests
2. **frontend-e2e** - Run E2E tests (after backend passes)
3. **security-scan** - Trivy security scanning
4. **build** - Verify frontend builds successfully
5. **notify** - Report pipeline status

**Status Badge:**
```markdown
![CI Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI%20Pipeline/badge.svg)
```

## Setup

### 1. Enable GitHub Actions
GitHub Actions are enabled by default for public repositories. For private repos:
1. Go to repository Settings → Actions → General
2. Enable "Allow all actions and reusable workflows"

### 2. Configure Secrets (Optional)
For Codecov integration:
1. Sign up at [codecov.io](https://codecov.io)
2. Get your upload token
3. Add to repository secrets: `Settings → Secrets → Actions`
4. Create secret: `CODECOV_TOKEN`

### 3. Branch Protection Rules (Recommended)
1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable "Require status checks to pass before merging"
4. Select required checks:
   - Backend Tests
   - Frontend E2E Tests
   - CI Pipeline / build

## Workflow Features

### Caching
- **pip dependencies** - Cached based on `requirements.txt`
- **npm dependencies** - Cached based on `package-lock.json`
- Significantly speeds up workflow runs

### Matrix Testing
Backend tests run on multiple Python versions:
- Python 3.11
- Python 3.12

### Artifacts
Generated artifacts available for 30 days:
- Test results
- Coverage reports
- Playwright screenshots (on failure)
- Build artifacts

### Failure Handling
- Screenshots captured on E2E test failures
- Test reports uploaded even on failure
- Linting errors don't fail the build (continue-on-error)

## Local Testing

Test workflows locally with [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run workflow locally
act push

# Run specific job
act -j backend-tests

# Run with secrets
act --secret-file .secrets
```

## Monitoring

### View Workflow Runs
1. Go to repository → Actions tab
2. Select workflow from left sidebar
3. View run history and logs

### Download Artifacts
1. Open workflow run
2. Scroll to "Artifacts" section
3. Download test results, coverage, or screenshots

### Check Coverage
After workflow completes:
1. Visit [codecov.io/gh/YOUR_USERNAME/YOUR_REPO](https://codecov.io)
2. View coverage trends and reports
3. See coverage changes in PRs

## Troubleshooting

### Tests Failing Locally But Pass in CI
- Check Python/Node versions match
- Verify all dependencies installed
- Check environment variables

### Tests Pass Locally But Fail in CI
- Check for test interdependencies
- Verify database migrations
- Check for timezone/locale issues
- Review CI logs for specific errors

### Workflow Taking Too Long
- Enable caching (should already be set up)
- Run fewer browsers in E2E tests
- Use matrix parallelization
- Skip slow tests: `pytest -m "not slow"`

### Artifacts Not Uploading
- Check artifact path exists
- Verify permissions
- Check artifact size (<500MB)
- Review upload step logs

## Best Practices

### 1. Fast Feedback
- Run fastest tests first
- Use matrix builds for parallel execution
- Cache dependencies aggressively

### 2. Clear Status
- Use descriptive job names
- Add status badges to README
- Notify team on failures

### 3. Security
- Never commit secrets
- Use repository secrets for tokens
- Run security scans regularly
- Keep dependencies updated

### 4. Maintenance
- Review and update workflows regularly
- Monitor workflow execution time
- Clean up old artifacts
- Update action versions

## Integration with Pull Requests

When PR is created:
1. All workflows run automatically
2. Status checks appear on PR
3. Coverage diff shown (if Codecov enabled)
4. Merge blocked if tests fail
5. Review required before merge

## Custom Workflows

Add new workflows for:
- Deployment to staging/production
- Database migrations
- Performance benchmarks
- Load testing
- Documentation builds
- Release automation

Example deployment workflow:
```yaml
name: Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: ./deploy.sh
```

## Status Badges

Add to README.md:
```markdown
# Project Name

![Backend Tests](https://github.com/USER/REPO/workflows/Backend%20Tests/badge.svg)
![Frontend E2E](https://github.com/USER/REPO/workflows/Frontend%20E2E%20Tests/badge.svg)
![CI Pipeline](https://github.com/USER/REPO/workflows/CI%20Pipeline/badge.svg)
[![codecov](https://codecov.io/gh/USER/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/USER/REPO)
```

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Example Workflows](https://github.com/actions/starter-workflows)
- [Codecov Documentation](https://docs.codecov.io/)