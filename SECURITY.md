# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Security Features

This package includes several security measures:

### 🔒 Path Traversal Protection
- Automatically validates file paths to prevent directory traversal attacks
- Blocks `..` sequences in file paths
- Only allows `.p8` and `.json` file extensions

### 🛡️ Input Validation
- All configuration parameters are validated
- Type checking for all inputs
- Required field validation

### ⏱️ Timeout Protection
- Connection timeouts (5 seconds)
- Request timeouts (10 seconds)
- Overall operation timeout (15 seconds)

### 📁 File Security
- `.npmignore` prevents publishing of sensitive files
- Certificate and key files are excluded from npm package
- Config files with credentials are excluded

## Reporting Security Vulnerabilities

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

1. **DO NOT** create a public GitHub issue
2. Email the security issue to: **onatvaris@gmail.com**
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Security Best Practices

When using this package:

1. **Protect your APNs key files**: Never commit `.p8` files to version control
2. **Use environment variables**: Store sensitive configuration in environment variables
3. **Validate device tokens**: Always validate device tokens before sending notifications
4. **Monitor failed notifications**: Log and monitor failed notification attempts
5. **Keep dependencies updated**: Regularly update the package and its dependencies

## Responsible Disclosure

We follow responsible disclosure practices:
- Security issues will be addressed within 48 hours
- Fixes will be released as soon as possible
- Credit will be given to security researchers (if desired)

## Contact

For security-related inquiries: onatvaris@gmail.com
