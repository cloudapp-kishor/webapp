packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.8"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  default = "us-east-2"
}

variable "source_ami" {
  description = "Ubuntu 24.04 LTS AMI ID"
  default     = "ami-0ea3c35c5c3284d82"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "vpc_id" {
  description = "VPC ID where the instance should be launched"
  default     = "vpc-076364b954e7bed4d"
}

variable "subnet_id" {
  description = "Subnet ID in the specified VPC"
  default     = "subnet-00550c025d06b5058"
}

variable "ami_name" {
  default = "webappAMI"
}

variable "MYSQL_USER" {
  type    = string
  default = "kishor"
}

variable "MYSQL_PASSWORD" {
  type    = string
  default = "kishor"
}

variable "MYSQL_DATABASE" {
  type    = string
  default = "cloudApp"
}

locals {
  ami_description = "Image for webapp"
  timestamp       = regex_replace(timestamp(), "[- TZ:]", "")
}

source "amazon-ebs" "ubuntu" {
  region          = var.aws_region
  source_ami      = var.source_ami
  instance_type   = var.instance_type
  ssh_username    = "ubuntu"
  ami_name        = "${var.ami_name}-${local.timestamp}"
  ami_description = local.ami_description
  vpc_id          = var.vpc_id
  subnet_id       = var.subnet_id

  tags = {
    Name        = "webapp-image"
    Environment = "Dev"
  }
}

build {
  sources = ["source.amazon-ebs.ubuntu"]

  provisioner "file" {
    source      = "../../../webapp"
    destination = "/home/ubuntu/mywebapp"
  }

  provisioner "shell" {
    inline = [
      "sudo apt update",
      "sudo apt -y install mysql-server",
      "sudo systemctl enable mysql",
      "sudo systemctl start mysql",
      "sudo mysql -e \"CREATE USER IF NOT EXISTS '${var.MYSQL_USER}' IDENTIFIED BY '${var.MYSQL_PASSWORD}';\"",
      "sudo mysql -e \"CREATE DATABASE IF NOT EXISTS ${var.MYSQL_DATABASE};\"",
      "sudo mysql -e \"GRANT ALL PRIVILEGES ON ${var.MYSQL_DATABASE}.* TO '${var.MYSQL_USER}';\"",
      "sudo apt install -y nodejs npm"
    ]
  }

}