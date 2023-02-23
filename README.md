# tx-simulation-snap

An experimental transaction simulation snap that leverages Ganache to simulate transactions and tries to interpret the simulation result for user benefit.

Feel free to fork this and use it for whatever you like.

# How to Use

First of all, make sure you:

- [ ] Have the right versions of Node and Yarn installed
- [ ] Have MetaMask Flask installed

Once you have that installed you can run the snap as follows: `yarn install && yarn start`.

This will spin up a website at `localhost:8000`, navigate to that website and hit "connect". This will walk you through the installation process. Once the snap is installed you can try it out by going to any dapp and initiating a transaction. You should see the transaction simulation snap as a tab in the transaction confirmation view.
