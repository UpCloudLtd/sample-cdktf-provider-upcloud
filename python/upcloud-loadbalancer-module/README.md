# Python: loadbalancer with module

A CDK for Terraform application in Python to create a loadbalancer and servers with prebuilt UpCloud CDK for Terraform provider and [basic-loadbalancer](https://registry.terraform.io/modules/UpCloudLtd/basic-loadbalancer/upcloud/latest) module.

To get started with this example, you need to:

- [Install `pipenv` and project dependencies](#install-pipenv-and-project-dependencies)
- [Install the modules](#install-the-modules)
- [Configure your UpCloud credentials](#configure-your-upcloud-credentials)
- [Deploy the example stack](#deploy-the-example-stack)

## Install `pipenv` and project dependencies

First, if you do not `pipenv` installed on your system, install it with `pip install --user pipenv`. See [pipenv website](https://pipenv.pypa.io/en/latest/) for alternative installation methods.

```sh
pip install --user pipenv
```

Then, to install the project dependencies, run `pipenv install`.

```sh
pipenv install
```

## Install the modules

To install the [basic-loadbalancer](https://registry.terraform.io/modules/UpCloudLtd/basic-loadbalancer/upcloud/latest) module, ensure it is present in `terraformModules` array in [cdktf.json](./cdktf.json) file and run `cdktf get` to generate module bindings to `./imports` directory.

```sh
cdktf get
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

## Deploy the stack

To deploy our stack defined in [main.py](./main.py), run `cdktf deploy`.

```sh
cdktf deploy
```

The hostname of the load-balancer will be provided as a Terraform Output. You can use that to test the deployed setup. Note that it might take a while for the DNS name to propagate.

```sh
curl ${replace_this_with_lb_url_output}
```

If you want to cleanup the created resources, run `cdktf destroy` to destroy the stack.

```sh
cdktf destroy
```
