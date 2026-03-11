# Contributing

## Scope

This repository is a sanitized reference implementation and documentation package.

Contributions should improve one of these areas:

- clarity of product and architecture documentation
- reusability of the reference scaffold
- privacy and sanitization safeguards
- test coverage for public behavior

## Contribution Rules

- do not add real credentials, endpoints, or private operational details
- do not add user-identifying data, private prompts, or private conversation samples
- keep the scaffold generic and reusable
- prefer explicit contracts and small, testable abstractions
- document any new public endpoint or subsystem in `README.md` or `docs/reference-implementation.md`

## Pull Request Expectations

- explain what architectural layer is being improved
- explain whether the change affects public behavior or only internal structure
- include or update tests when behavior changes
- keep changes aligned with the repository's privacy-first and sanitization-first goals