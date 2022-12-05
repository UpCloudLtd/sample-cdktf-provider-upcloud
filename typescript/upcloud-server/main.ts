import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput } from "cdktf";

import { UpcloudProvider } from "@cdktf/provider-upcloud/lib/provider";
import { Server } from "@cdktf/provider-upcloud/lib/server";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new UpcloudProvider(this, "upcloud");

    const server = new Server(this, "server", {
      hostname: "cdktf-example-ts-server",
      login: {
        user: "example",
        createPassword: true,
        passwordDelivery: "email",
      },
      networkInterface: [
        {
          type: "public",
          ipAddressFamily: "IPv4",
        },
        {
          type: "public",
          ipAddressFamily: "IPv4",
        },
      ],
      plan: "1xCPU-1GB",
      template: {
        size: 25,
        storage: "Ubuntu Server 20.04 LTS (Focal Fossa)",
      },
      zone: "pl-waw1",
    });

    new TerraformOutput(this, "server_ip", {
      value: server.networkInterface.get(0).ipAddress,
    });
  }
}

const app = new App();
new MyStack(app, "typescript-getting-started");
app.synth();
