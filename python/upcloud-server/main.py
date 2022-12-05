#!/usr/bin/env python

from glob import glob
import os

from constructs import Construct
from cdktf import App, TerraformOutput, TerraformStack

from cdktf_cdktf_provider_upcloud.provider import UpcloudProvider
from cdktf_cdktf_provider_upcloud.server import Server, ServerLogin, ServerNetworkInterface, ServerTemplate


def get_server_login(user=None):
    """Get ServerLogin with current users first public key

    As a fallback, create password if current user does not have any public
    keys under ~/.ssh directory.
    """
    user_ssh_key_paths = glob(os.path.expanduser("~/.ssh/*.pub"))

    if user_ssh_key_paths:
        with open(user_ssh_key_paths[0]) as f:
            ssh_key = f.read()
        return ServerLogin(user=user, keys=[ssh_key])
    else:
        return ServerLogin(
            user=user,
            create_password=True,
            password_delivery="email")


class ExampleStack(TerraformStack):
    def __init__(self, scope: Construct, ns: str):
        super().__init__(scope, ns)

        UpcloudProvider(self, "upcloud")

        login = get_server_login("example")
        template_name = "Ubuntu Server 22.04 LTS (Jammy Jellyfish)" if login.keys else "Ubuntu Server 20.04 LTS (Focal Fossa)"
        server = Server(
            self,
            "server",
            hostname="cdktf-example-python-server",
            login=login,
            network_interface=[
                ServerNetworkInterface(
                    type="public",
                    ip_address_family="IPv4",
                ),
                ServerNetworkInterface(
                    type="utility",
                    ip_address_family="IPv4",
                ),
            ],
            plan="1xCPU-1GB",
            metadata=True,
            template=ServerTemplate(
                size=25,
                storage=template_name
            ),
            zone="pl-waw1",
        )

        TerraformOutput(
            self,
            "server_ip",
            value=server.network_interface.get(0).ip_address
        )


app = App()
ExampleStack(app, "python-upcloud-server")

app.synth()
