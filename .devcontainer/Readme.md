### 1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
#### 1.1 Install [Meslo Nerd Fonts](https://github.com/romkatv/powerlevel10k#manual-font-installation) in your host machine.
Download these four ttf files:
   - [MesloLGS NF Regular.ttf](
       https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf)
   - [MesloLGS NF Bold.ttf](
       https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf)
   - [MesloLGS NF Italic.ttf](
       https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf)
   - [MesloLGS NF Bold Italic.ttf](
       https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf)

### 2. Install `Remote - Containers` extension in vscode
```
Id: ms-vscode-remote.remote-containers
Description: Open any folder or repository inside a Docker container and take advantage of Visual Studio Code's full feature set.
Version: 0.231.6
Publisher: Microsoft
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers
```
<img width="600" alt="image" src="https://user-images.githubusercontent.com/17343278/163740844-53121165-2b97-41f3-b44c-1f2560740280.png">

### 3. Run the app from the devcontainer
#### 3.1. Click on the bottom-left Remote Connections icon `><` on vscode
#### 3.2. Click on Reopen in Container
<img width="600" alt="image" src="https://user-images.githubusercontent.com/17343278/163741106-8203fe6b-f302-40f9-86b4-9917a5a4c640.png">

### 4. The app should start on its own in the devcontainer with all the necessary `extensions being already installed`.
The first boot may take some time to set everything up.

<img width="600" alt="image" src="https://user-images.githubusercontent.com/17343278/163741422-a3fdb7c2-ee78-46c6-a06e-dffdf7351fc0.png">

<img width="600" alt="image" src="https://user-images.githubusercontent.com/17343278/163741467-d11016fe-060b-4cfe-9cdc-79110fcaae09.png">

### 5. Enjoy your new zsh cli with the power of zsh-autosuggestions and zsh-syntax-highlighting
<img width="600" alt="image" src="https://user-images.githubusercontent.com/17343278/163744244-a404fe22-e904-41f7-b613-6d0ebd76b41d.png">


### 6. (Optiontal) Setup ZSH command prompt to your liking by running `p10k configure` on the terminal inside devcontainer
<img width="600" alt="image" src="https://user-images.githubusercontent.com/17343278/163744277-65fc098e-50ef-4581-8c7d-a5f69ef99884.png">
