# CloudCart - Multi-Region Highly Available E-Commerce Platform

CloudCart is a cloud-native e-commerce platform designed to demonstrate production-oriented engineering practices around application reliability, containerization, infrastructure automation, high availability, observability, and disaster recovery.

The project is being developed incrementally from a working local application toward a multi-region AWS deployment.

## Architecture

The target architecture uses:

- AWS VPC
- Multi-AZ application infrastructure
- Application Load Balancer
- EC2 Auto Scaling
- Amazon RDS for PostgreSQL
- Route 53 health-check based failover
- Cross-region disaster recovery
- Docker
- Terraform
- GitHub Actions
- CloudWatch
- AWS Secrets Manager

### Current Application Flow

```text
Client
  │
  ▼
Node.js / Express API
  │
  ▼
PostgreSQL
                         Route 53
                            │
                 Health-check based routing
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       Primary Region               DR Region
        us-east-1                   us-west-2
              │                           │
        Application ALB             Standby ALB
              │                           │
        EC2 Auto Scaling           EC2 Auto Scaling
              │                           │
          RDS PostgreSQL          DR PostgreSQL
              │                           │
              └────── Replication ───────┘