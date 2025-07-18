# Installing dependencies:

FROM node:16.20.1-alpine AS install-dependencies

# Set memory limit to avoid heap out of memory issues
ENV NODE_OPTIONS="--max-old-space-size=4096"
WORKDIR /user/src/app

COPY package.json ./

# Install npm@6 and clear npm cache
RUN npm install -g npm@6 && npm cache clean --force

# Install dependencies
RUN npm install

COPY . .


# Creating a build:

FROM node:16.20.1-alpine AS create-build
# Set memory limit to avoid heap out of memory issues
ENV NODE_OPTIONS="--max-old-space-size=4096"
WORKDIR /user/src/app

COPY --from=install-dependencies /user/src/app ./

RUN npm run build

USER node


# Running the application:

FROM node:16.20.1-alpine AS run

WORKDIR /user/src/app

COPY --from=install-dependencies /user/src/app/node_modules ./node_modules
COPY --from=create-build /user/src/app/dist ./dist
COPY package.json ./

CMD ["npm", "run", "start:prod"]