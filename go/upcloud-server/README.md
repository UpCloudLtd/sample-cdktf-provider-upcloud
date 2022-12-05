# UpCloud Server (Go)

A CDK for Terraform application in Go to create a server with prebuilt UpCloud CDK for Terraform provider.

To get started with this example, you need to:

- [Configure your UpCloud credentials](#configure-your-upcloud-credentials)
- [Deploy the example stack](#deploy-the-example-stack)

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

To deploy our stack defined in [main.go](./main.go), run `cdktf deploy`.

```sh
cdktf deploy
```

This will deploy an server, to which you can login with `example` user and one-time password sent to your email. The server IP is provided as a Terraform output.

If you want to cleanup the created resources, run `cdktf destroy` to destroy the stack.

```sh
cdktf destroy
```
