sudo docker rm manifest-ui -f
mvn clean package
mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)
sudo docker build -t secretorganization/shipping-manifest-manager-web-ui .
sudo docker run -p 8080:8080 -d --name manifest-ui -t secretorganization/shipping-manifest-manager-web-ui
