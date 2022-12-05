# Samples for UpCloud Terraform CDK provider usage

This repository contains examples for getting started with [Terraform CDK UpCloud Provider](https://github.com/cdktf/cdktf-provider-upcloud) and its [go version](https://github.com/cdktf/cdktf-provider-upcloud-go).

## Getting started

Install CDKTF with npm, or alternatively with Homebrew if you are using MacOS. See also Hashicorps [Install CDK for Terraform and Run a Quick Start Demo](https://learn.hashicorp.com/tutorials/terraform/cdktf-install?in=terraform/cdktf) tutorial. 

```sh
# With npm
npm install --global cdktf-cli@latest

# With Homebrew
brew install cdktf
```

Verify that installation succeeded by running cdktf help.

```sh
cdktf help
```

## Examples

### Go

- [Getting started (server)](./go/upcloud-server/README.md)

### Python

- [Getting started (server)](./python/upcloud-server/README.md)

### TypeScript

- [Cluster in UpCloud Kubernetes Service with a deployment exposed via a load-balancer](./typescript/upcloud-kubernetes-service/README.md)
