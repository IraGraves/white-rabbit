# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in White Rabbit, please report it responsibly:

### How to Report

1. **DO NOT** open a public GitHub issue for security vulnerabilities
2. Instead, use one of these methods:
   - **Preferred:** Use GitHub's [Private Security Advisories](https://github.com/IraGraves/white-rabbit/security/advisories/new)
   - **Alternative:** Email the maintainer directly (check GitHub profile for contact)

### What to Include

Please include the following information in your report:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if you have one)
- Your contact information for follow-up

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Depends on severity
  - Critical: Within 24-48 hours
  - High: Within 1 week
  - Medium: Within 2 weeks
  - Low: Next release cycle

### Disclosure Policy

- We follow responsible disclosure practices
- Security issues will be disclosed publicly only after a fix is available
- Credit will be given to reporters (unless anonymity is requested)

## Security Best Practices for Users

When using White Rabbit:

1. **Keep Dependencies Updated**
   - Regularly run `npm audit` to check for vulnerabilities
   - Update dependencies when security patches are available
   - Monitor Dependabot alerts if you fork this repository

2. **Verify Package Integrity**
   - Always install from the official repository
   - Check `package-lock.json` for unexpected changes
   - Review dependency changes in pull requests

3. **Deployment Security**
   - Use HTTPS when deploying (GitHub Pages does this automatically)
   - Don't commit sensitive data or API keys
   - Review the build output before deployment

## Automated Security

This repository uses:
- ✅ **Dependabot** for automated dependency updates
- ✅ **npm audit** for vulnerability scanning
- ✅ **GitHub Security Advisories** for vulnerability tracking

## Contact

For security concerns, please use GitHub's security advisory feature or contact the repository maintainer.

---

*Last updated: 2025-11-28*
