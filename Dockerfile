FROM node:10
MAINTAINER Dan Goje <gojedan98@gmail.com>

# Copy code.
ADD . /opt/server
WORKDIR /opt/server

# Install dependencies and build app.
RUN npm install
RUN npm run build

# Expose port.
EXPOSE 3000

# Start application.
CMD [ "npm", "start" ]