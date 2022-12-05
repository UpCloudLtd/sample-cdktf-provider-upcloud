# python-upcloud-server

A CDK for Terraform application in Python to create a server with prebuilt UpCloud CDK for Terraform provider.

To get started with this example, you need to:

- [Install `pipenv` and project dependencies](#install-pipenv-and-project-dependencies)
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

To deploy our stack defined in [main.py](./main.py), run `cdktf deploy`. This will use current users SSH key from `~/.ssh/*.pub` as login method to the server to be created, if available.

```sh
cdktf deploy
```

This will deploy an server, to which you can login with `example` user and either your SSH key or one-time password sent to your email. The server IP is provided as a Terraform output.


If you want to cleanup the created resources, run `cdktf destroy` to destroy the stack.

```sh
cdktf destroy
```
