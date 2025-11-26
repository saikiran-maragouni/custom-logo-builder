#!/bin/bash
# Build frontend
cd frontend
npm install
npm run build

# Copy build to backend static resources
mkdir -p ../backend/src/main/resources/static
cp -r build/* ../backend/src/main/resources/static/

# Build backend
cd ../backend
mvn clean package -DskipTests

echo "Build complete!"