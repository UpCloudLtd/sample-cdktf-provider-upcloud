#!/usr/bin/env python

import os

from constructs import Construct
from cdktf import App, TerraformOutput, TerraformStack

from cdktf_cdktf_provider_upcloud.provider import UpcloudProvider
from cdktf_cdktf_provider_upcloud.network import Network, NetworkIpNetwork
from cdktf_cdktf_provider_upcloud.server import Server, ServerLogin, ServerNetworkInterface, ServerTemplate

from imports.basic_loadbalancer import BasicLoadbalancer

BASE_NAME = 'cdktf-example-python-lb-module'


class ExampleStack(TerraformStack):
    def __init__(self, scope: Construct, ns: str):
        super().__init__(scope, ns)

        prefix = f"{BASE_NAME}-"
        zone = "pl-waw1"

        UpcloudProvider(self, "upcloud")

        net = Network(
            self,
            "network",
            name=f"{prefix}net",
            ip_network=NetworkIpNetwork(
                family="IPv4",
                address="10.0.100.0/24",
                dhcp=True,
            ),
            zone=zone,
        )

        with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "user-data-script.sh")) as f:
            user_data = f.read()

        server_count = 3
        servers = [Server(
            self,
            f"server-{i}",
            hostname=f"{prefix}vm-{i}",
            login=ServerLogin(keys=[]),
            network_interface=[
                ServerNetworkInterface(
                    type="public",
                ),
                ServerNetworkInterface(
                    type="utility",
                ),
                ServerNetworkInterface(
                    type="private",
                    network=net.id,
                ),
            ],
            plan="1xCPU-1GB",
            template=ServerTemplate(
                size=10,
                storage="Ubuntu Server 20.04 LTS (Focal Fossa)"
            ),
            zone=zone,
            metadata=True,
            user_data=user_data
        ) for i in range(server_count)]

        lb = BasicLoadbalancer(
            self,
            "lb",
            name=f"{prefix}lb",
            network=net.id,
            backend_servers=[
                server.network_interface.get(2).ip_address for server in servers],
            backend_server_port=80,
            frontend_port=80,
            zone=zone,
        )

        TerraformOutput(
            self,
            "lb_url",
            value=lb.dns_name_output
        )


app = App()
ExampleStack(app, "python-loadbalancer-module")

app.synth()
