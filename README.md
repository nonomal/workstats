# polygonHR

## Description

polygonHR is a dashboard tool to visualize the production and activity of your team and members. Specifically, you can get the following numbers from the tool.

- Number of commit from GitHub
- Number of review from GitHub
- Number of task completed from Asana
- Number of task opened from Asana
- Number of message mentioned from Slack
- Number of message sent from Slack etc...

## Landing Page

Landing page for this site is here. If you don't mind, please let me know your contact so that I could inform you when this site is ready. This page is written by English and Japanese as well.

<https://www.suchica.com>

## Directory structure

A brief description of how to use each directory is given below. The following will give you some idea of what kind of code is placed in each directory.

### components/

It is the UI layer in layered architecture and the View in MVC. All page-shared components and page-specific components are separated to some extent appropriately. If the number of files increases, we will organize them accordingly, but in that case, the reference path will be complementarily changed by VSCode, so there is no problem in that respect.

### pages/

It is responsible for the connection between the UI layer and the Application layer in layered architecture, and the Controller in MVC. This is a directory specific to Next.js.

### services/

It is the Application layer in a layered architecture.

A set of codes is placed to process the data (join, aggregate, etc.) according to the user's action. It can be said to be the layer that performs CRUD and ELT for requests from the UI layer. It is implemented in such a way that it does not need to know the technology of the UI layer from its dependencies.

### models/

It is the Domain layer in layered architecture, and the Model in MVC.

The domain layer is an optional layer that sits between the UI layer and the data layer. Representation of the business model, such as use cases and user stories. Direct operations such as rewriting domain information.

The domain layer is responsible for encapsulating complex business logic, or simple business logic that is reused by multiple ViewModels. This layer is optional because not all apps will have these requirements. We should only use it when needed-for example, to handle complexity or favor reusability.

### libs/

The code specific to the library we are using and not related to data acquisition, such as initialization and configuration code, is placed here. There is a possibility that each library will be completely switched.

### utils/

We plan to place useful functions that can be used globally (ex. string processing, etc.).
