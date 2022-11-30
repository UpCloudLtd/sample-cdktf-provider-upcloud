# UpCloud Kubernetes Service (UKS)

A CDK for Terraform application in Python to create a Kubernetes cluster and deployment with prebuilt UpCloud and Kubernetes CDK for Terraform providers.

To get started with this example, you need to:

- [Install project dependencies](#install-pipenv-and-project-dependencies)
- [Configure your UpCloud credentials](#configure-your-upcloud-credentials)
- [Deploy the example stack](#deploy-the-example-stack)

## Install project dependencies

Then, to install the project dependencies, run `npm ci`.

```sh
npm ci
```

## Configure your UpCloud credentials

This example project looks for UpCloud credentials in `UPCLOUD_USERNAME` and `UPCLOUD_PASSWORD` environment variables, similarly than UpCloud Terraform provider. Configure these environment variables, for example, by sourcing a file that contains suitable `export` commands.

```sh
. upcloud-credentials.sh
```

Example credential file content:

```sh
# upcloud-credentials.sh
export UPCLOUD_USERNAME="your-username"
export UPCLOUD_PASSWORD="your-password"
```

## Deploy the example stack

To deploy our stack defined in [main.ts](./main.ts), run `cdktf deploy`.

```sh
cdktf deploy typescript_uks_cluster typescript_uks_deployment
```

This will deploy an [hello-container](https://github.com/UpCloudLtd/hello-container.git) and expose it to the internet through a load-balancer. Note that it might take a while for the load balancer to get into running state, its DNS records to propagate, and certificates to be verified. After everything is up and running, you should be able to see an hello page with hostname and IP of the pod the request was directed to by curling the page or opening it in your browser.

```sh
curl https://${typescript_uks_deployment_cdktf_output}
```

If you want to cleanup the created resources, run `cdktf destroy` to destroy the stack.

```sh
cdktf destroy typescript_uks_cluster typescript_uks_deployment
```
