# Microservices Demo

This project aims to demonstrate the development of a full-stack system using Python, and Node.js. It includes a Python microservice that generates and encodes random images, sending them as JSON messages via an MQTT broker. Additionally, it involves developing a Node.js application to receive these messages and relay them to a webpage client in real-time using a WebSocket server. To containerize the Python and Node.js applications, along with the MQTT broker, and orchestrate their interaction, we are currently using Docker Compose. However, we have the flexibility to switch to Kubernetes for orchestration in the future.

## Prerequisites

You need to have Docker and Docker Compose installed on your machine to build and run this project.

## Configuration

Before you start, you need to configure the application. Copy the `.env.sample` file to a new file named `.env` and update the values as needed:

```shellscript
MQTT_BROKER_SERVICE_NAME=mqtt-service
WEB_SOCKET_PORT=8080
IMAGE_TOPIC=topic/image
IMAGE_GENERATION_INTERVAL=1
```

## Building and Running the Project

To build the Docker images for this project, run the following command in your terminal:

```sh {"id":"01HKBX3R07GX5MCAD7AZYD71NE"}
docker-compose build
```

After the build completes, you can start the application by running:

```sh {"id":"01HKBX3R07SM0KFRRVW65DZPXX"}
docker-compose up
```

This will start all the services defined in your `docker-compose.yml` file.

