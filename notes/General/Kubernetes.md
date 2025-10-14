---
layout: page
title: Kubernetes
permalink: /notes/general/Kubernetes
notes_section: Security
notes_category: General
notes_label: Kubernetes
notes_order: 1
---


A Kubernetes setup is made up of multiple layers, from the overall cluster down to the containers actually running your application. This diagram shows the relationships between **clusters**, **namespaces**, **deployments**, **services**, **pods**, and **containers**, and explains how manifest files (`deployment.yaml` and `service.yaml`) control what’s deployed.

```
+===============================================================+
|                           CLUSTER                             |
+===============================================================+
| A complete Kubernetes environment, containing:               |
| - Control Plane (API Server, Scheduler, Controller Manager)   |
| - Worker Nodes (run workloads in Pods)                        |
| Manages the state of workloads and networking across all nodes |
+===============================================================+
                               |
                               v
                  (Many logical partitions per cluster)
        +-------------------+           +-------------------+
        |   NAMESPACE: A    |           |   NAMESPACE: B    |   ...
        +-------------------+           +-------------------+
| Logical partition inside a cluster to organize & isolate      |
| resources. Useful for separating apps, teams, or environments |
+----------------------------------------------------------------+
                 |
                 |  Deploy resources into a namespace:
                 |    kubectl apply -f deployment.yaml  [-n A]
                 |    kubectl apply -f service.yaml     [-n A]
                 v
     +----------------------+        +----------------------+
     |   deployment.yaml    |        |     service.yaml     |
     |  Kind: Deployment    |        |  Kind: Service       |
     |  apiVersion: apps/v1 |        |  apiVersion: v1      |
     |  Defines desired     |        |  Exposes Pods to     |
     |  Pods & replicas     |        |  internal/external   |
     +----------+-----------+        +----------+-----------+
                | creates                         | selects Pods by label
                v                                  (e.g., app=web)
        +--------------------+                    |
        |     Deployment     |--------------------+
        +--------------------+                    |
| Ensures desired number of Pod replicas run      |
| Updates Pods in a controlled, rolling manner    |
+-------------------------------------------------+
                | creates
                v
        +--------------------+
        |     ReplicaSet     |
        +--------------------+
| Tracks a set of Pods created from the same spec |
| Created/managed automatically by a Deployment  |
+-------------------------------------------------+
                | spawns N replicas
                v
        +--------------------+
        |        Pod         |
        |  +--------------+  |
        |  |  Container   |  |
        |  +--------------+  |
        |  |  Container   |  |
        |  +--------------+  |
        +--------------------+
| Smallest deployable unit in Kubernetes.          |
| Holds one or more containers that share storage, |
| network, and specs.                              |
+--------------------------------------------------+
                      ^
                      | labels (e.g., app=web, tier=fe)
                      +----------------------------------+
                                   |
                             +-------------+
                             |   Service   |
                             +-------------+
| Stable networking endpoint that routes to Pods via label selector |
| Types: ClusterIP, NodePort, LoadBalancer, etc.                    |
+-------------------------------------------------------------------+

```

---
## **Key Concepts**

- **Cluster**  
    The top-level Kubernetes environment containing all nodes and system components. Responsible for orchestrating workloads and networking.
- **Namespace**  
    A logical boundary within a cluster for isolating resources. Lets multiple teams or projects share a cluster without interfering with each other.
- **Deployment (`deployment.yaml`)**  
    A higher-level controller that defines how many Pod replicas should be running and handles updates. The YAML specifies things like:
    - `apiVersion: apps/v1`
    - `kind: Deployment`
    - Pod template (containers, images, labels)
- **ReplicaSet**  
    Maintains a stable set of replica Pods. Created and managed automatically by Deployments.
- **Pod**  
    The smallest deployable unit. A Pod wraps one or more containers, along with shared storage and network.
- **Container**  
    A lightweight, isolated runtime environment for your application. Usually runs a single process (like your web server).
- **Service (`service.yaml`)**  
    A stable networking abstraction. Matches Pods using labels and exposes them internally or externally.

---
##### How're `service.yaml` and `deployment.yaml` related ?

**They're Linked via Labels/Selectors**
- In `deployment.yaml` → Pod template metadata has labels (e.g., `app: web`).
- In `service.yaml` → `spec.selector` must match those labels (e.g., `app: web`).
- This relationship is **the only way** a Service knows which Pods belong to it.

---
#### Useful commands to remember

- View Kubernetes deployments - `kubectl get deployments`
- View pods - `kubectl get pods`
- View cluster events - `kubectl get events`
- View `kubectl` configuration - `kubectl config view`
- View application logs for a container in a pod - `kubectl logs <pod name>`
- To expose the pod to internet/local network - `kubectl expose deployment <deployment name> --type=LoadBalancer --port=<port number>`
- View services in the cluster - `kubectl get services`
- To list available add-ons - `minikube addons list`
- To enable an add-on - `minikube addons enable <add-on name>`
- To remove the deployment and service created - 
```
kubectl delete service <service name>
kubectl delete deployment <deployment name>
```
- To scale a deployment in kubernetes - `kubectl scale -n <namespace> deployment <deployment name> --replicas=<no.of replicas (i.e., 10,20.....)>`
- To launch dashboard - `minikube dashboard`