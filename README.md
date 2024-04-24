<p align="center">
  <a href="https://sourcefuse.github.io/arc-docs/arc-api-docs" target="blank"><img src="https://github.com/sourcefuse/loopback4-microservice-catalog/blob/master/docs/assets/logo-dark-bg.png?raw=true" width="180" alt="ARC Logo" /></a>
</p>

<p align="center">
  ARC-SAAS by SourceFuse is an open-source framework for developing cloud-native multi-tenant enterprise applications, utilizing prebuilt microservices and standardized architectures for deployment on private and public clouds.
</p>



# ARC SAAS

ARC SaaS architecture consists of two major layers at a high level 

- Control Plane - The control plane is foundational to any multi-tenant SaaS model. ARC SaaS control plane will include those services that give consumers the ability to manage and operate their tenants through a single, unified experience. Within the control plane, we have 3-tier architecture supporting UI (or some CLI), API and data separately. The core services here represent the collection of services that are used to orchestrate multi-tenant experience. We’ve included some of the common examples of services that are typically part of the core. However, these core services could vary for each SaaS solution depending on the requirements. In the architecture diagram above, we have also shown a separate administration application UI. This represents the application (a web application, a command line interface, or an API) that might be used by a SaaS provider to manage their multi-tenant environment. Please note that the control plane and its services are not actually multi-tenant. These services are global to all tenants and are basically used to operate and manage tenants.

- Application Plane - At the bottom of the diagram, we have represented the application plane of a SaaS environment. This is where the multi-tenant functionality of the actual application will reside. 


## Pre-built Micro-services

There are currently 2 Microservices provided and actively maintained:

1. [Tenant Management Service](services/tenant-management-service)
2. [Subscription Service](services/subscription-service) 

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
