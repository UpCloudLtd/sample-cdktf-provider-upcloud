package main

import (
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
	"github.com/cdktf/cdktf-provider-upcloud-go/upcloud/v4/provider"
	"github.com/cdktf/cdktf-provider-upcloud-go/upcloud/v4/server"
	"github.com/hashicorp/terraform-cdk-go/cdktf"
)

func NewMyStack(scope constructs.Construct, id string) cdktf.TerraformStack {
	stack := cdktf.NewTerraformStack(scope, &id)

	provider.NewUpcloudProvider(stack, jsii.String("upcloud"), &provider.UpcloudProviderConfig{})

	server := server.NewServer(stack, jsii.String("server"), &server.ServerConfig{
		Hostname: jsii.String("cdktf-example-go-server"),
		Login: &server.ServerLogin{
			User:             jsii.String("example"),
			CreatePassword:   true,
			PasswordDelivery: jsii.String("email"),
		},
		NetworkInterface: []server.ServerNetworkInterface{
			{
				Type: jsii.String("public"),
			},
			{
				Type: jsii.String("utility"),
			},
		},
		Plan: jsii.String("1xCPU-1GB"),
		Template: &server.ServerTemplate{
			Size:    jsii.Number(25),
			Storage: jsii.String("Ubuntu Server 20.04 LTS (Focal Fossa)"),
		},
		Zone: jsii.String("pl-waw1"),
	})

	cdktf.NewTerraformOutput(stack, jsii.String("server_ip"), &cdktf.TerraformOutputConfig{
		Value: server.NetworkInterface().Get(jsii.Number(0)).IpAddress(),
	})

	return stack
}

func main() {
	app := cdktf.NewApp(nil)

	NewMyStack(app, "go-getting-started")

	app.Synth()
}
