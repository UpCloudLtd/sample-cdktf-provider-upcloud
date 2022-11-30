import { Construct } from "constructs";
import { App, Fn, TerraformStack, TerraformOutput } from "cdktf";

import { UpcloudProvider } from "@cdktf/provider-upcloud/lib/provider";
import { Network } from "@cdktf/provider-upcloud/lib/network";
import { KubernetesCluster } from "@cdktf/provider-upcloud/lib/kubernetes-cluster";
import { DataUpcloudKubernetesCluster } from "@cdktf/provider-upcloud/lib/data-upcloud-kubernetes-cluster";
import { KubernetesProvider } from "@cdktf/provider-kubernetes/lib/provider";
import { Deployment } from "@cdktf/provider-kubernetes/lib/deployment";
import { Service } from "@cdktf/provider-kubernetes/lib/service";

class ClusterStack extends TerraformStack {
  public cluster: KubernetesCluster;
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new UpcloudProvider(this, "upcloud");

    const net = new Network(this, "cluster_net", {
      name: "cdktf-example-ts-uks-net",
      zone: "de-fra1",
      ipNetwork: {
        address: "172.28.0.0/24",
        dhcp: true,
        family: "IPv4",
      },
    });

    this.cluster = new KubernetesCluster(this, "cluster", {
      name: "cdktf-example-ts-uks-cluster",
      zone: "de-fra1",
      network: net.id,
      nodeGroup: [
        {
          name: "default",
          count: 2,
          plan: "2xCPU-4GB",
        },
      ],
    });
  }
}

interface DeploymentStackConfig {
  clusterId: string;
}
class DeploymentStack extends TerraformStack {
  constructor(scope: Construct, name: string, config: DeploymentStackConfig) {
    super(scope, name);

    new UpcloudProvider(this, "upcloud");
    const cluster = new DataUpcloudKubernetesCluster(this, "cluster", {
      id: config.clusterId,
    });

    new KubernetesProvider(this, "kubernetes", {
      host: cluster.host,
      clientCertificate: Fn.base64decode(cluster.clientCertificate),
      clientKey: Fn.base64decode(cluster.clientKey),
      clusterCaCertificate: Fn.base64decode(cluster.clusterCaCertificate),
    });

    new Deployment(this, "hello_deployment", {
      metadata: {
        labels: { app: "hello-uks" },
        name: "hello-uks",
      },
      spec: {
        replicas: "8",
        template: {
          metadata: { labels: { app: "hello-uks" } },
          spec: {
            container: [
              {
                image: "ghcr.io/upcloudltd/hello",
                imagePullPolicy: "Always",
                name: "hello",
              },
            ],
          },
        },
        selector: { matchLabels: { app: "hello-uks" } },
      },
    });

    const service = new Service(this, "hello_service", {
      metadata: {
        labels: { app: "hello-uks" },
        name: "hello-uks",
      },
      spec: {
        type: "LoadBalancer",
        port: [
          {
            port: 80,
            protocol: "TCP",
            targetPort: "80",
          },
        ],
        selector: { app: "hello-uks" },
      },
    });

    new TerraformOutput(this, "app_url", {
      value: service.status.get(0).loadBalancer.get(0).ingress.get(0).hostname,
    });
  }
}

const app = new App();
const { cluster } = new ClusterStack(app, "typescript_uks_cluster");
new DeploymentStack(app, "typescript_uks_deployment", {
  clusterId: cluster.id,
});
app.synth();
