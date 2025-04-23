# GAP Forever | Units (spooky-db)

[![Deploy Status](https://github.com/gapforever2/spooky-db/workflows/deploy/badge.svg)](https://github.com/gapforever2/spooky-db/actions/workflows/deploy.yaml)

GAF Unit Database fork of FAF Unit Database. Uses Angular.js + some hack scripts to extract the data from unit blueprint files.

You can see the app [here](https://gapforever2.github.io/spooky-db/#/).

## License

- http://www.wtfpl.net/

## Contributing

All contributions are welcome, though We can't guarantee to pull all of them in. If you do want to contribute, please create a separate branch and a pull request for that. It'll be a bit easier for me to keep the repo tidy that way. Thanks in advance.

## Assets

### Images

- cb260 - http://cb260.deviantart.com/

### Fonts

- Zeroes Three - http://www.larabiefonts.com/
- Muli - http://www.newtypography.co.uk/

## Dev Notes

Where to find the game assets:

- Unit Icons: `C:\ProgramData\GAPForever\gamedata\textures.nx2\textures\ui\common\icons\units`
- Strategic Icons: `C:\ProgramData\GAPForever\gamedata\textures.nx2\textures\ui\icons_strategic`

## Running the Application

Prepare:

```shell
git clone "https://github.com/gapforever2/spooky-db.git"
cd spooky-db
```

### Running the Application on Windows

Make sure you have Node.js and npm installed. You can download the latest version from [nodejs.org](https://nodejs.org/).

Prepare:

```shell
npm install
```

Starting the server:

```shell
npm start
```

### Running the Application on MAC OS X

Necessary packages that need to be installed beforehand:

```shell
brew install pkgconfig
brew install pixman
brew install libjpeg
brew install giflib
brew install cairo
brew install graphicsmagick
npm install
bower install # will need npm V4 - otherwise issue `Cannot find module 'internal/fs'`
grunt serve
```

View the program in dist directory.

### Running with Docker (on Linux)

Prepare:

```shell
docker build -t spooky-db-server .
```

Starting the server:

```shell
docker run --network=host -v $(pwd):/spooky-db -it spooky-db-server
```

To open the app navigate to http://localhost:9000

## Debug workflows locally

### Prerequisites

1. [Github CLI](https://github.com/cli/cli) – Verify that Github CLI is installed and available via `gh --version`. You need to authorize yourself via `gh login`. Once authorised, verify that `gh auth token` returns a value. You'll need that token to authorize yourself through `act`.
2. [Act](https://github.com/nektos/act) – Verify that act is installed and available via `act --version`. There are [various ways](https://nektosact.com/installation/index.html) to install it via a tool, downloading the artifact that matches your OS and adding it to the path is sufficient however.
3. [Docker](https://www.docker.com/products/docker-desktop/) – Verify that docker is installed and available via `docker --version`. Act uses docker containers to containerize your workflows. You'll need to start the `Docker Desktop` application to guarantee that the docker engine is running.

### Debug a workflow

The tool `act` only works on workflows that have the `push` event. Add the `push` event to the workflow that you want to test if it is missing.

```bash
#    # Non-standard image that has `pwsh` installed            # Workflow to debug               # Token to authorize
act -P 'ubuntu-latest=ghcr.io/catthehacker/ubuntu:pwsh-22.04' -W '.github/workflows/build.yaml' -s GITHUB_TOKEN="$(gh auth token)"

# for repeated tests                                                                             # do not pull (-p) the docker image each time
act -P 'ubuntu-latest=ghcr.io/catthehacker/ubuntu:pwsh-22.04' -W '.github/workflows/build.yaml' -s GITHUB_TOKEN="$(gh auth token)" -p=false
```

#### Useful references

- [Documentation about act](https://nektosact.com/introduction.html)
- [List of all official docker images](https://github.com/catthehacker/docker_images)
