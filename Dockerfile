FROM node:14

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port for the application
EXPOSE 3000

# Command to run the application
CMD [ "node", "server.js" ] 